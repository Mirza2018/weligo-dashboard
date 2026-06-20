// import { useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
// import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/label";
// import { Button } from "../../../components/ui/button";
// // import { ProfileSettingsPage } from "../../../pages/ProfileSettingsPage";
// import { toast } from "sonner";
// import { useI18n } from "../../../lib/i18n";
// import { ProfileSettingsPage } from "../Family/ProfileSettingsPage";

// export function AdminProfilePage() {
//   const { t } = useI18n();
//   const [commission, setCommission] = useState(15);

//   return (
//     <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-24">
//       <h2 className="font-serif text-3xl font-medium">{t("admin.profile.title")}</h2>
//       <Tabs defaultValue="profile">
//         <TabsList>
//           <TabsTrigger value="profile">{t("admin.profile.tabProfile")}</TabsTrigger>
//           <TabsTrigger value="password">{t("admin.profile.tabPassword")}</TabsTrigger>
//           <TabsTrigger value="commission">{t("admin.profile.tabCommission")}</TabsTrigger>
//         </TabsList>
//         <TabsContent value="profile">
//           <ProfileSettingsPage />
//         </TabsContent>
//         <TabsContent value="password">
//           <ProfileSettingsPage />
//         </TabsContent>
//         <TabsContent value="commission">
//           <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
//             <div className="space-y-1.5">
//               <Label htmlFor="commission">{t("admin.profile.platformCommission")}</Label>
//               <Input
//                 id="commission"
//                 type="number"
//                 min={0}
//                 max={100}
//                 value={commission}
//                 onChange={(e) => setCommission(Number(e.target.value))}
//               />
//               <p className="text-xs text-muted-foreground">
//                 {t("admin.profile.commissionHint")}
//               </p>
//             </div>
//             <div className="flex justify-end">
//               <Button onClick={() => toast.success(`${t("admin.profile.updatedTo")} ${commission}%`)}>
//                 {t("admin.profile.updateCommission")}
//               </Button>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import { useState } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(3, "Required"),
  city: z.string().min(1, "Required"),
  postalCode: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "At least 6 characters"),
    newPassword: z.string().min(6, "At least 6 characters"),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

export function AdminProfilePage() {
  const { t } = useI18n();
  const [commission, setCommission] = useState(15);
  return (
    <div className=" flex max-w-md flex-col gap-6 pb-24">
      <h2 className="font-serif text-3xl font-medium">Profile Settings</h2>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            {t("admin.profile.tabProfile")}
          </TabsTrigger>
          <TabsTrigger value="password">
            {t("admin.profile.tabPassword")}
          </TabsTrigger>{" "}
          <TabsTrigger value="commission">
            {t("admin.profile.tabCommission")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="password">
          <PasswordForm />
        </TabsContent>
        <TabsContent value="commission">
          <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="space-y-1.5">
              <Label htmlFor="commission">
                {t("admin.profile.platformCommission")}
              </Label>
              <Input
                id="commission"
                type="number"
                min={0}
                max={100}
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                {t("admin.profile.commissionHint")}
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  toast.success(
                    `${t("admin.profile.updatedTo")} ${commission}%`,
                  )
                }
              >
                {t("admin.profile.updateCommission")}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Nina",
      lastName: "Zürcher",
      email: "nina@example.com",
      phone: "+41 79 123 45 67",
      city: "Zürich",
      postalCode: "8008",
      address: "Bahnhofweg 17",
    },
  });

  const onSubmit = async (_v: ProfileValues) => {
    await new Promise((r) => setTimeout(r, 300));
    toast.success("Profile updated");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
      <div className="relative w-fit">
        <UserAvatar name="Nina Zürcher" size={80} />
        <button
          type="button"
          aria-label="Change avatar"
          onClick={() => toast.info("Avatar upload coming soon")}
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
      </div>

      <Field
        id="firstName"
        label="First Name"
        error={errors.firstName?.message}
      >
        <Input id="firstName" {...register("firstName")} />
      </Field>
      <Field id="lastName" label="Last Name" error={errors.lastName?.message}>
        <Input id="lastName" {...register("lastName")} />
      </Field>
      <Field id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" {...register("email")} />
      </Field>
      <Field id="phone" label="Phone Number" error={errors.phone?.message}>
        <Input id="phone" {...register("phone")} />
      </Field>
      <Field id="city" label="City" error={errors.city?.message}>
        <Input id="city" {...register("city")} />
      </Field>
      <Field
        id="postalCode"
        label="Postal Code"
        error={errors.postalCode?.message}
      >
        <Input id="postalCode" {...register("postalCode")} />
      </Field>
      <Field id="address" label="Address" error={errors.address?.message}>
        <Input id="address" {...register("address")} />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Edit Information
        </Button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const onSubmit = async (_v: PasswordValues) => {
    await new Promise((r) => setTimeout(r, 300));
    toast.success("Password updated");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
      <Field
        id="currentPassword"
        label="Current Password"
        error={errors.currentPassword?.message}
      >
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            {...register("currentPassword")}
          />
          <ToggleEye
            shown={showCurrent}
            onClick={() => setShowCurrent((v) => !v)}
          />
        </div>
      </Field>
      <Field
        id="newPassword"
        label="New Password"
        error={errors.newPassword?.message}
      >
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? "text" : "password"}
            {...register("newPassword")}
          />
          <ToggleEye shown={showNew} onClick={() => setShowNew((v) => !v)} />
        </div>
      </Field>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Update Password
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function ToggleEye({
  shown,
  onClick,
}: {
  shown: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={shown ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {shown ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </button>
  );
}

