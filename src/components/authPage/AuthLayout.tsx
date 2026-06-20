import type { ReactNode } from "react";

import authSide from "../../assets/auth.mp4";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

/**
 * Two-column auth layout. The right column is a soft "video-like" looping
 * Ken-Burns visual — same composition for sign-in and sign-up.
 */
export function AuthLayout({
  title,
  italic,
  description,
  children,
}: {
  title: string;
  italic: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-12 lg:px-20 w-full">
        <Link to="/" className="self-start">
          <Logo />
        </Link>
        <div className="flex flex-1 flex-col justify-center py-10 fade-up">
          <h1 className="text-4xl leading-tight tracking-tight sm:text-5xl font-semibold">
            {title}
            <br />
            <span className="font-serif-italic ">{italic}</span>
          </h1>
          <p className="mt-4 max-w-2xl md:text-lg   font-medium">
            {description}
          </p>
          <div className="mt-8 max-w-md">{children}</div>
        </div>
        <p className="text-xs text-muted-foreground">© Weligo 2026</p>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <video
          src={authSide}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
      </div>
    </div>
  );
}
