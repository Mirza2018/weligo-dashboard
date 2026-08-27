import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import { getImageUrl } from "@/redux/getBaseUrl";
import { setUserInfo } from "../../../redux/slices/authSlice";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "../../../redux/api/authApi";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().min(3, "Required"),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "At least 6 characters"),
    newPassword: z.string().min(6, "At least 6 characters"),
  })
  .refine((d) => d.oldPassword !== d.newPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

// ---------- MAIN PAGE (this is what router.tsx imports) ----------
export function AdminProfilePage() {
  const { t } = useI18n();
  const [commission, setCommission] = useState(15);

  return (
    <div className="flex max-w-md flex-col gap-6 pb-24">
      <h2 className="font-serif text-3xl font-medium">Profile Settings</h2>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            {t("admin.profile.tabProfile")}
          </TabsTrigger>
          <TabsTrigger value="password">
            {t("admin.profile.tabPassword")}
          </TabsTrigger>
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

// ---------- PROFILE TAB ----------
function ProfileForm() {
  const dispatch = useDispatch();
  const { data: profileRes, isLoading } = useMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const profile = profileRes?.data;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phone: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (values: ProfileValues) => {
    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      formData.append(
        "data",
        JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          fullName: `${values.firstName} ${values.lastName}`.trim(),
          phone: values.phone,
        }),
      );

      const res = await updateProfile(formData).unwrap();
      dispatch(setUserInfo(res?.data));
      toast.success(res?.message || "Profile updated");
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return <p className="mt-6 text-sm text-muted-foreground">Loading...</p>;
  }

  const avatarSrc =
    previewUrl ||
    (profile?.profileImage ? getImageUrl(profile.profileImage) : undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
      <div className="relative w-fit">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={profile?.fullName}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <UserAvatar name={profile?.fullName || ""} size={80} />
        )}
        <label
          htmlFor="avatarUpload"
          aria-label="Change avatar"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
        >
          <Camera className="h-3.5 w-3.5" />
        </label>
        <input
          id="avatarUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
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
      <Field id="email" label="Email">
        <Input id="email" type="email" value={profile?.email || ""} disabled />
      </Field>
      <Field id="phone" label="Phone Number" error={errors.phone?.message}>
        <Input id="phone" {...register("phone")} />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Edit Information"}
        </Button>
      </div>
    </form>
  );
}

// ---------- PASSWORD TAB ----------
function PasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  const onSubmit = async (values: PasswordValues) => {
    try {
      const res = await updatePassword(values).unwrap();
      toast.success(res?.message || "Password updated");
      reset();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
      <Field
        id="oldPassword"
        label="Current Password"
        error={errors.oldPassword?.message}
      >
        <div className="relative">
          <Input
            id="oldPassword"
            type={showCurrent ? "text" : "password"}
            {...register("oldPassword")}
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}

// ---------- SHARED FIELD WRAPPER ----------
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
