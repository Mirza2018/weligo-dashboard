// src/lib/signupSession.ts
const KEY = "weligo:signup:email";

export function saveSignupEmail(email: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, email);
  } catch {
    /* ignore */
  }
}

export function getSignupEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearSignupEmail() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
