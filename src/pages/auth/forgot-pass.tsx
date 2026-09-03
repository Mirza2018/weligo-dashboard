// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { useI18n } from "../../lib/i18n";
import {
  clearAuth,
  setAccessToken,
  setUserInfo,
} from "../../redux/slices/authSlice";
import { useForgotPasswordMutation } from "../../redux/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/authPage/AuthLayout";

export function ForgotPassword() {
  const [forgetPassword] = useForgotPasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait...");
    dispatch(clearAuth());

    if (!email) {
      toast.error("Please fill in all fields.", { id: toastId });
      return;
    }

    const payload = {
      email,
    };

    try {
      const res = await forgetPassword(payload).unwrap();

      dispatch(setAccessToken(res?.data?.forgetToken));
      // dispatch(setUserInfo(res?.data?.user));

      toast.success(res?.message, {
        id: toastId,
        duration: 2000,
      });

      navigate("/forgot-code");
    } catch (error: any) {
      toast.error(error?.data?.message || "Password recovary failed", {
        id: toastId,
        duration: 3000,
      });
    }
  };
  return (
    <AuthLayout
      title={t("auth.forgotA")}
      italic={t("auth.forgotB")}
      description={t("auth.forgotC")}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label={t("auth.email")}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPh")}
            className="h-12 w-full rounded-lg border border-input bg-white! px-4 text-sm outline-none focus:border-primary "
          />
        </Field>

        <div className="flex justify-end">
          <Link
            to="/sign-in"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("auth.login")}
          </Link>
        </div>
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          {t("auth.continue")} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
