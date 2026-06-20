import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { clearAuth } from "../../redux/slices/authSlice";
import type { RootState } from "../../redux/store";
import AllImages from "../../assets/AllImages";
import { useI18n } from "../../lib/i18n";
import { LangSwitch } from "./LangSwitch";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isLogin = !!accessToken;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t } = useI18n();

  const links: { to: string; key: string }[] = [
    { to: "/", key: "nav.home" },
    { to: "/services", key: "nav.services" },
    { to: "/for-families", key: "nav.families" },
    { to: "/for-providers", key: "nav.providers" },
    { to: "/how-it-works", key: "nav.how" },
    { to: "/about-us", key: "nav.about" },
  ];

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-430 items-center justify-between px-4 ">
        {/* Logo */}
        <Link
          to="/"
          className="transition-opacity hover:opacity-75"
          onClick={closeMobileMenu}
        >
          <img src={AllImages.logo} alt="Weligo" className="w-36 md:w-40" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 xl:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `font-bold transition-colors hover:text-foreground ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        {/* Right Side - Desktop */}
        <div className="hidden items-center gap-3 xl:flex">
          <LangSwitch />
          {!isLogin ? (
            <>
              <Link
                to="/sign-in"
                className="hidden h-10 items-center justify-center rounded-lg border border-primary/30 px-5 font-medium text-primary bg-[#EDEFFF] hover:bg-primary/5 transition-colors sm:inline-flex"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                {t("nav.signup")}
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="h-10 px-5 font-bold text-primary hover:bg-primary/5 rounded-lg border border-primary/30 transition-colors"
            >
              {t("nav.logout")}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="xl:hidden p-2 rounded-md hover:bg-accent"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6h12v12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t bg-background">
          <div className="flex flex-col px-6 py-6 space-y-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `font-bold text-lg py-2 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}

            <div className="pt-4 border-t flex flex-col gap-3">
              <LangSwitch />
              {!isLogin ? (
                <>
                  <Link
                    to="/sign-in"
                    onClick={closeMobileMenu}
                    className="h-12 flex items-center justify-center rounded-lg border border-primary/30 font-medium text-primary bg-[#EDEFFF]"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={closeMobileMenu}
                    className="h-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-medium"
                  >
                    {t("nav.signup")}
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="h-12 flex items-center justify-center rounded-lg border border-primary/30 font-bold text-primary"
                >
                  {t("nav.logout")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
