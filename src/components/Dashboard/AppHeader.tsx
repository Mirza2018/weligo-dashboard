import { Bell } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserAvatar } from "../common/UserAvatar";
import { currentUser } from "../../assets/data/user";

export function AppHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="font-sans text-sm font-medium text-foreground">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <LanguageSwitcher />
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground transition hover:bg-muted"
        >
          <Bell className="h-4 w-4" />
        </button>
        <UserAvatar name={`${currentUser.firstName} ${currentUser.lastName}`} size={36} />
      </div>
    </header>
  );
}
