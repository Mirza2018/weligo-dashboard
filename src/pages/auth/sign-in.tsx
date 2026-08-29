// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/authPage/AuthLayout";
import { useI18n } from "../../lib/i18n";
import { useUserLoginMutation } from "../../redux/api/authApi";
import { setAccessToken, setUserInfo } from "../../redux/slices/authSlice";

export function SignIn() {
  const [userLogin] = useUserLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait...");

    if (!email || !password) {
      toast.error("Please fill in all fields.", { id: toastId });
      return;
    }

    const payload = {
      email,
      password,
    };

    try {
      const res = await userLogin(payload).unwrap();


      if (res?.data?.user?.role != "admin") {
        toast.error("You are not an admin", {
          id: toastId,
          duration: 3000,
        });
        return;
      }

      dispatch(setAccessToken(res?.data?.accessToken));
      dispatch(setUserInfo(res?.data?.user));

      toast.success(res?.message, {
        id: toastId,
        duration: 2000,
      });

      navigate("/");
    } catch (error: any) {
      toast.error(error?.data?.message || "Login  failed", {
        id: toastId,
        duration: 3000,
      });
    }
  };
  return (
    <AuthLayout
      title={t("auth.welcomeA")}
      italic={t("auth.welcomeB")}
      description={t("auth.welcomeDesc")}
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
        <Field label={t("auth.password")}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordPh")}
            className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary bg-white!"
          />
        </Field>
        {/* <div className="flex justify-end">
          <Link
            to="/waitlist"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("auth.forgetPassword")}
          </Link>
        </div> */}
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          {t("auth.login")} <ArrowRight className="h-4 w-4" />
        </button>
        {/* <p className="text-center text-sm text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link
            to="/choose-account"
            className="font-medium text-primary hover:underline"
          >
            {t("auth.registerLink")}
          </Link>
        </p> */}
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
