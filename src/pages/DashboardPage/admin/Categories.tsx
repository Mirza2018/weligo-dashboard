import { useState, useRef } from "react";
import { Plus, MoreHorizontal, Pencil, Ban, CheckCircle2, Upload } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
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
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import { ConfirmDialog } from "../../../components/Dashboard/Admin/ConfirmDialog";
import { initialCategories, type Category } from "../../../assets/data/admin";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";

type FormState = { name: string; description: string; icon: string; image: string };
const emptyForm: FormState = { name: "", description: "", icon: "", image: "" };

export function AdminCategoriesPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Category[]>(initialCategories);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirming, setConfirming] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const iconRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, icon: c.icon, image: c.image });
    setOpen(true);
  };

  const submit = () => {
    if (!form.name.trim()) {
      toast.error(t("admin.categories.nameRequired"));
      return;
    }
    if (editing) {
      setItems((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...form } : c)),
      );
      toast.success(t("admin.categories.updated"));
    } else {
      setItems((prev) => [
        ...prev,
        { id: `cat-${Date.now()}`, ...form, active: true },
      ]);
      toast.success(t("admin.categories.added"));
    }
    setOpen(false);
  };

  const toggleActive = (id: string) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const handleFile =
    (key: "icon" | "image") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setForm((f) => ({ ...f, [key]: String(reader.result) }));
      reader.readAsDataURL(file);
    };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl font-medium">{t("admin.categories.title")}</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> {t("admin.categories.addCustom")}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>{t("admin.common.name")}</TableHead>
              <TableHead>{t("admin.common.description")}</TableHead>
              <TableHead>{t("admin.common.icon")}</TableHead>
              <TableHead>{t("admin.common.image")}</TableHead>
              <TableHead>{t("admin.common.status")}</TableHead>
              <TableHead className="text-right">{t("admin.common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c) => (
              <TableRow key={c.id} className="hover:bg-muted-bg">
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="max-w-sm truncate text-sm text-muted-foreground">
                  {c.description}
                </TableCell>
                <TableCell>
                  {c.icon ? (
                    c.icon.startsWith("data:") ? (
                      <img src={c.icon} alt="" className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <span className="text-2xl">{c.icon}</span>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {c.image ? (
                    <img src={c.image} alt="" className="h-10 w-14 rounded object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Pill value={c.active ? "Active" : "Suspended"} />
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
                        <Pencil className="mr-2 h-4 w-4" /> {t("admin.common.update")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setConfirming(c)}>
                        {c.active ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" /> {t("admin.common.disable")}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> {t("admin.common.activate")}
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t("admin.categories.updateCategory") : t("admin.categories.addCustom")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">{t("admin.common.name")}</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">{t("admin.common.description")}</Label>
              <Textarea
                id="cat-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{t("admin.common.icon")}</Label>
                <div className="flex items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-muted-bg">
                    {form.icon ? (
                      form.icon.startsWith("data:") ? (
                        <img src={form.icon} alt="" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <span className="text-2xl">{form.icon}</span>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">{t("admin.common.preview")}</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => iconRef.current?.click()}>
                    <Upload className="mr-1 h-4 w-4" /> {t("admin.common.upload")}
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
                  <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-border bg-muted-bg">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt=""
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">{t("admin.common.preview")}</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => imageRef.current?.click()}>
                    <Upload className="mr-1 h-4 w-4" /> {t("admin.common.upload")}
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
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t("admin.common.cancel")}
            </Button>
            <Button onClick={submit}>{editing ? t("admin.common.update") : t("admin.common.add")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirming}
        onOpenChange={(o) => !o && setConfirming(null)}
        confirmLabel={t("admin.common.yes")}
        cancelLabel={t("admin.common.no")}
        title={
          confirming?.active
            ? t("admin.categories.confirmDisable")
            : t("admin.categories.confirmActivate")
        }
        onConfirm={() => {
          if (confirming) {
            toggleActive(confirming.id);
            toast.success(confirming.active ? t("admin.categories.disabled") : t("admin.categories.activated"));
            setConfirming(null);
          }
        }}
      />
    </div>
  );
}
