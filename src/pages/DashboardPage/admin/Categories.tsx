import { useEffect, useRef, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Ban,
  CheckCircle2,
  Upload,
  Trash2,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Skeleton } from "../../../components/ui/skeleton";
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import { ConfirmDialog } from "../../../components/Dashboard/Admin/ConfirmDialog";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";
// import { resolveMediaUrl } from "../../../lib/resolveMediaUrl";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/api/websiteApi";
import { getImageUrl } from "@/redux/getBaseUrl";

type CategoryStatus = "active" | "inactive" | "coming_soon";

type ApiCategory = {
  _id?: string;
  order?: number;
  name?: string;
  description?: string;
  icon?: string;
  image?: string;
  status?: CategoryStatus | string;
};

type FormState = {
  name: string;
  description: string;
  order: string;
  status: CategoryStatus;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  order: "",
  status: "active",
};

const statusPillValue = (status?: string) =>
  status === "active"
    ? "Active"
    : status === "coming_soon"
      ? "Coming soon"
      : "Suspended";

export function AdminCategoriesPage() {
  const { t } = useI18n();

  const {
    data: res,
    isLoading,
    isError,
  } = useGetAllCategoriesQuery({ page: 1, limit: 50 });
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = res?.data ?? [];
  const isSaving = isCreating || isUpdating;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ApiCategory | null>(null);
  const [confirming, setConfirming] = useState<ApiCategory | null>(null);
  const [deleting, setDeleting] = useState<ApiCategory | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");

  // Revoke object URLs we created for local file previews when they change/unmount
  useEffect(() => {
    return () => {
      if (iconPreview.startsWith("blob:")) URL.revokeObjectURL(iconPreview);
    };
  }, [iconPreview]);
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const iconRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm(emptyForm);
    setIconFile(null);
    setImageFile(null);
    setIconPreview("");
    setImagePreview("");
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (c: ApiCategory) => {
    setEditing(c);
    setForm({
      name: c?.name ?? "",
      description: c?.description ?? "",
      order: c?.order != null ? String(c.order) : "",
      status: (c?.status as CategoryStatus) ?? "active",
    });
    setIconFile(null);
    setImageFile(null);
    setIconPreview(getImageUrl(c?.icon));
    setImagePreview(getImageUrl(c?.image));
    setOpen(true);
  };

  const handleFile =
    (key: "icon" | "image") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      if (key === "icon") {
        setIconFile(file);
        setIconPreview(objectUrl);
      } else {
        setImageFile(file);
        setImagePreview(objectUrl);
      }
    };

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error(t("admin.categories.nameRequired"));
      return;
    }

    const formData = new FormData();

    if (editing) {
      // Only send fields that actually changed, per the API's "only send updated things" contract
      const changed: Record<string, unknown> = {};
      if (form.name.trim() !== (editing?.name ?? ""))
        changed.name = form.name.trim();
      if (form.description.trim() !== (editing?.description ?? ""))
        changed.description = form.description.trim();
      if (form.status !== (editing?.status ?? "active"))
        changed.status = form.status;
      const orderNum = form.order.trim() ? Number(form.order) : undefined;
      if (orderNum != null && orderNum !== editing?.order)
        changed.order = orderNum;

      formData.append("data", JSON.stringify(changed));
      if (iconFile) formData.append("icon", iconFile);
      if (imageFile) formData.append("image", imageFile);

      try {
        await updateCategory({
          id: editing?._id ?? "",
          data: formData,
        }).unwrap();
        toast.success(t("admin.categories.updated"));
        setOpen(false);
        resetForm();
      } catch {
        toast.error(
          t("admin.common.somethingWentWrong") ??
            "Couldn't update the category. Try again.",
        );
      }
    } else {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        ...(form.order.trim() ? { order: Number(form.order) } : {}),
      };
      formData.append("data", JSON.stringify(payload));
      if (iconFile) formData.append("icon", iconFile);
      if (imageFile) formData.append("image", imageFile);

      try {
        await createCategory(formData).unwrap();
        toast.success(t("admin.categories.added"));
        setOpen(false);
        resetForm();
      } catch {
        toast.error(
          t("admin.common.somethingWentWrong") ??
            "Couldn't create the category. Try again.",
        );
      }
    }
  };

  const toggleActive = async (c: ApiCategory) => {
    const nextStatus: CategoryStatus =
      c?.status === "active" ? "inactive" : "active";
    const formData = new FormData();
    formData.append("data", JSON.stringify({ status: nextStatus }));
    try {
      await updateCategory({ id: c?._id ?? "", data: formData }).unwrap();
      toast.success(
        nextStatus === "active"
          ? t("admin.categories.activated")
          : t("admin.categories.disabled"),
      );
    } catch {
      toast.error(
        t("admin.common.somethingWentWrong") ??
          "Couldn't update the category. Try again.",
      );
    } finally {
      setConfirming(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting?._id) return;
    try {
      await deleteCategory(deleting._id).unwrap();
      toast.success(t("admin.categories.deleted") ?? "Category deleted.");
    } catch {
      toast.error(
        t("admin.common.somethingWentWrong") ??
          "Couldn't delete the category. Try again.",
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl font-medium">
          {t("admin.categories.title")}
        </h2>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> {t("admin.categories.addCustom")}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead>{t("admin.common.name")}</TableHead>
                <TableHead>{t("admin.common.description")}</TableHead>
                <TableHead>{t("admin.common.icon")}</TableHead>
                <TableHead>{t("admin.common.image")}</TableHead>
                <TableHead>{t("admin.common.status")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-destructive"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      {t("admin.common.failedToLoad") ??
                        "Failed to load categories."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      {t("admin.common.noData") ?? "No categories yet."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((c: ApiCategory) => (
                  <TableRow key={c?._id} className="hover:bg-muted-bg">
                    <TableCell className="font-medium">
                      {c?.name ?? "-"}
                    </TableCell>
                    <TableCell className="max-w-sm truncate text-sm text-muted-foreground">
                      {c?.description ?? "-"}
                    </TableCell>
                    <TableCell>
                      {c?.icon ? (
                        <img
                          src={getImageUrl(c.icon)}
                          alt=""
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {console.log(getImageUrl(c.image))}

                      {c?.image ? (
                        <img
                          src={getImageUrl(c.image)}
                          alt=""
                          className="h-10 w-14 rounded object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Pill value={statusPillValue(c?.status)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-md p-1.5 hover:bg-secondary">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(c)}>
                            <Pencil className="mr-2 h-4 w-4" />{" "}
                            {t("admin.common.update")}
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem onClick={() => setConfirming(c)}>
                            {c?.status === "active" ? (
                              <>
                                <Ban className="mr-2 h-4 w-4" />{" "}
                                {t("admin.common.disable")}
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />{" "}
                                {t("admin.common.activate")}
                              </>
                            )}
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleting(c)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />{" "}
                            {t("admin.common.delete") ?? "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? t("admin.categories.updateCategory")
                : t("admin.categories.addCustom")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">{t("admin.common.name")}</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">{t("admin.common.description")}</Label>
              <Textarea
                id="cat-desc"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat-order">
                  {t("admin.common.order") ?? "Order"}
                </Label>
                <Input
                  id="cat-order"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("admin.common.status")}</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as CategoryStatus }))
                  }
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t("admin.pill.Active")}
                    </SelectItem>
                    {/* <SelectItem value="inactive">
                      {t("admin.pill.Suspended")}
                    </SelectItem> */}
                    <SelectItem value="coming_soon">
                      {t("admin.categories.comingSoon") ?? "Coming soon"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{t("admin.common.icon")}</Label>
                <div className="flex items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted-bg">
                    {iconPreview ? (
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t("admin.common.preview")}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => iconRef.current?.click()}
                  >
                    <Upload className="mr-1 h-4 w-4" />{" "}
                    {t("admin.common.upload")}
                  </Button>
                  <input
                    ref={iconRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile("icon")}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t("admin.common.image")}</Label>
                <div className="flex items-center gap-2">
                  <div className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted-bg">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Image preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t("admin.common.preview")}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => imageRef.current?.click()}
                  >
                    <Upload className="mr-1 h-4 w-4" />{" "}
                    {t("admin.common.upload")}
                  </Button>
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile("image")}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              {t("admin.common.cancel")}
            </Button>
            <Button onClick={submit} disabled={isSaving}>
              {isSaving
                ? (t("admin.common.saving") ?? "Saving…")
                : editing
                  ? t("admin.common.update")
                  : t("admin.common.add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirming}
        onOpenChange={(o) => !o && setConfirming(null)}
        confirmLabel={t("admin.common.yes")}
        cancelLabel={t("admin.common.no")}
        title={
          confirming?.status === "active"
            ? t("admin.categories.confirmDisable")
            : t("admin.categories.confirmActivate")
        }
        onConfirm={() => confirming && toggleActive(confirming)}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        confirmLabel={
          isDeleting
            ? (t("admin.common.deleting") ?? "Deleting…")
            : t("admin.common.yes")
        }
        cancelLabel={t("admin.common.no")}
        title={
          t("admin.categories.confirmDelete") ??
          `Delete "${deleting?.name ?? "this category"}"?`
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
