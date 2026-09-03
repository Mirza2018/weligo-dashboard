// src/routes/auth/SubmitCode.tsx
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useI18n } from "../../lib/i18n";
import {
  useForgotPasswordOTPMutation,
  useUserVerifyOTPResendMutation,
} from "../../redux/api/authApi";
import { setAccessToken, clearAuth } from "../../redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import { clearSignupEmail, getSignupEmail } from "@/redux/lib/signupSession";

const CODE_LENGTH = 4;
const RESEND_SECONDS = 45;

export function ForgetCode() {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Set by sign-up.tsx right after registration - the temporary
  // createUserToken, reused as the normal accessToken slot so prepareHeaders
  // attaches it automatically. If it's missing there's nothing to verify.
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const email = getSignupEmail();

  const [verifyOtp, { isLoading: isVerifying }] =
    useForgotPasswordOTPMutation();
  const [resendOtp, { isLoading: isResending }] =
    useUserVerifyOTPResendMutation();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (index: number, value: string) => {
    const clean = value.replace(/[^0-9]/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    const chars = clean.split("");
    setDigits((prev) => {
      const next = [...prev];
      let i = index;
      for (const char of chars) {
        if (i >= CODE_LENGTH) break;
        next[i] = char;
        i += 1;
      }
      return next;
    });
    const nextIndex = Math.min(index + chars.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    const chars = pasted.slice(0, CODE_LENGTH).split("");
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((char, i) => {
        next[i] = char;
      });
      return next;
    });
    const nextIndex = Math.min(chars.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || !token) return;
    try {
      const res = await resendOtp({ purpose: "email-verification" }).unwrap();
      setSecondsLeft(RESEND_SECONDS);
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      toast.success(res?.message || t("auth.codeResent") || "Code resent");
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't resend the code.");
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== CODE_LENGTH) {
      toast.error(t("auth.enterFullCode") ?? "Please enter the full code.");
      return;
    }
    if (!token) {
      toast.error("Your Recovary session expired. Please sign up again.");
      navigate("/forgot-password");
      return;
    }

    const toastId = toast.loading("Please wait...");
    try {
      const res = await verifyOtp({ otp: code }).unwrap();

      // Overwrite the temporary createUserToken with the real access token
      // for the now-created account - same Redux slot, same header wiring.
      dispatch(setAccessToken(res.data.forgetOtpMatchToken));
      clearSignupEmail();

      toast.success(res?.message || t("auth.codeVerified") || "Code verified", {
        id: toastId,
        duration: 2000,
      });
      navigate("/reset-password");
    } catch (error: any) {
      toast.error(error?.data?.message || "Verification failed", {
        id: toastId,
        duration: 3000,
      });
      // OTP mismatch is recoverable (keep the temp token, let them retry),
      // but if the temp token itself is no longer valid, send them back.
      if (error?.status === 401 || error?.status === 403) {
        dispatch(clearAuth());
        navigate("/forgot-password");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {t("auth.verifyA")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth.verifyB")} {email}
        </p>

        <div className="mt-8 flex justify-center gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`h-14 w-14 rounded-xl border text-center text-xl font-bold outline-none transition-colors ${
                digit
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-white text-muted-foreground focus:border-primary"
              }`}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("auth.didNotCode")}
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0 || isResending}
              className={`font-semibold ${
                secondsLeft > 0 || isResending
                  ? "cursor-not-allowed text-primary/40"
                  : "text-primary hover:underline"
              }`}
            >
              {isResending ? "Sending…" : t("auth.resend")}
            </button>
          </p>

          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {secondsLeft}s
          </span>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-70"
        >
          {isVerifying ? "Verifying…" : t("auth.verifyCode")}
        </button>
      </div>

      <p className="absolute bottom-6 left-6 text-sm text-primary">
        © Weligo 2026
      </p>
    </div>
  );
}
