// src/pages/dashboard/admin/PendingProvidersPage.tsx
import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  MapPin,
  Phone,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetPendingProvidersQuery,
  useApproveProviderMutation,
  useRejectProviderMutation,
} from "@/redux/api/websiteApi";
import { getImageUrl } from "@/redux/getBaseUrl";
// import type { PendingProvider } from "@/assets/data/admin";
import type { PendingProvider, Certificate } from "@/assets/data/admin";
import { useI18n } from "@/lib/i18n";

export function PendingProvidersPage() {
  const { t } = useI18n();
  const { data, isLoading, isError } = useGetPendingProvidersQuery({
    page: 1,
    limit: 10,
  });
  const [selectedProvider, setSelectedProvider] =
    useState<PendingProvider | null>(null);

  const providers = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading pending providers…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-destructive">
        Couldn&apos;t load pending providers.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">
          {/* Pending Providers */}
          {t("providers.pendingProviders")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {data?.meta?.total ?? providers.length}
          {t("providers.awaitingReview")}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F8F9FC] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5 font-semibold">
                  {" "}
                  {t("providers.provider")}
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  {" "}
                  {t("providers.category")}
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  {" "}
                  {t("providers.city")}
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  {" "}
                  {t("providers.experience")}
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  {" "}
                  {t("providers.rate")}
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  {" "}
                  {t("providers.registered")}
                </th>
                <th className="px-5 py-3.5 font-semibold text-right">
                  {" "}
                  {t("providers.action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    {t("providers.noProviders")}
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr
                    key={provider._id}
                    className="transition-colors hover:bg-[#FAFBFD]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(provider.profileImage) ?? undefined}
                          alt={provider.fullName}
                          className="h-9 w-9 shrink-0 rounded-full object-cover bg-muted"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#1E1E22]">
                            {provider.fullName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {provider.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {provider.categoryId?.name ? (
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {provider.categoryId.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#2F3037]">
                      {provider.city || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[#2F3037]">
                      {provider.experience} yrs
                    </td>
                    <td className="px-5 py-3.5 text-[#2F3037]">
                      {provider.hourlyRate} CHF
                    </td>
                    <td className="px-5 py-3.5 text-[#2F3037]">
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedProvider(provider)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {t("providers.review")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProvider && (
        <ProviderReviewModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Detail modal                                                           */
/* ---------------------------------------------------------------------- */

function ProviderReviewModal({
  provider,
  onClose,
}: {
  provider: PendingProvider;
  onClose: () => void;
}) {
  const [approveProvider, { isLoading: isApproving }] =
    useApproveProviderMutation();
  const [rejectProvider, { isLoading: isRejecting }] =
    useRejectProviderMutation();

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const profile = provider.providerProfileId;
  const certificates = profile?.certificates ?? [];

  async function handleApprove() {
    const toastId = toast.loading("Approving provider…");
    try {
      const res = await approveProvider(provider._id).unwrap();
      toast.success(res?.message || "Provider approved", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't approve provider.", {
        id: toastId,
      });
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    const toastId = toast.loading("Rejecting provider…");
    try {
      const res = await rejectProvider({
        id: provider._id,
        data: { reason: rejectionReason.trim() },
      }).unwrap();
      toast.success(res?.message || "Provider rejected", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't reject provider.", {
        id: toastId,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-serif text-xl font-semibold">
            Provider Application
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Identity */}
          <div className="flex items-start gap-4">
            <img
              src={getImageUrl(provider.profileImage) ?? undefined}
              alt={provider.fullName}
              className="h-20 w-20 shrink-0 rounded-full object-cover bg-muted"
            />
            <div>
              <h3 className="font-serif text-2xl font-semibold">
                {provider.fullName}
              </h3>
              {/* {profile?.shortBioTitle && (
                <p className="mt-1 text-sm font-semibold text-primary">
                  {profile.shortBioTitle}
                </p>
              )} */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {provider.phone}
                </span>
                <span>{provider.email}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Applied {new Date(provider.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* At a glance */}
          <DetailGrid provider={provider} />

          {/* Bios */}
          {profile?.longBioTitle && (
            <div>
              <SectionLabel>Long bio</SectionLabel>
              <p className="mt-1 text-sm text-[#2F3037]">
                <span className="font-semibold">Title: </span>

                {profile.longBioTitle ?? ""}
              </p>
              <p className="mt-1 text-sm text-[#2F3037]">
                <span className="font-semibold">Description: </span>

                {profile.longBio ?? ""}
              </p>
            </div>
          )}
          {profile?.shortBioTitle && (
            <div>
              <SectionLabel>Short bio</SectionLabel>
              <p className="mt-1 text-sm text-[#2F3037]">
                <span className="font-semibold">Title: </span>

                {profile.shortBioTitle ?? ""}
              </p>
              <p className="mt-1 text-sm text-[#2F3037]">
                <span className="font-semibold">Description: </span>

                {profile.shortBio ?? ""}
              </p>
            </div>
          )}

          {/* Preferences */}
          <div>
            <SectionLabel>Preferences</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile?.preferences.nonSmoker && <TagPill>Non-smoker</TagPill>}
              {profile?.preferences.driverLicense && (
                <TagPill>Driver&apos;s license</TagPill>
              )}
              {profile?.preferences.ownVehicle && (
                <TagPill>Own vehicle</TagPill>
              )}
              {profile?.preferences.comfortableWithPets && (
                <TagPill>Comfortable with pets</TagPill>
              )}
              {profile?.preferences.hasChildren && (
                <TagPill>Has children</TagPill>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div>
            <SectionLabel>Certificates</SectionLabel>
            {certificates.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No certificates submitted.
              </p>
            ) : (
              <CertificateCarousel certificates={certificates} />
            )}
          </div>

          {/* Address */}
          <div>
            <SectionLabel>Address</SectionLabel>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#2F3037]">
              <MapPin className="h-4 w-4 shrink-0" />
              {provider.address}
              {provider.city ? `, ${provider.city}` : ""}
              {provider.postalCode ? ` ${provider.postalCode}` : ""}
            </p>
          </div>

          {provider.referralSource && (
            <div>
              <SectionLabel>Referral source</SectionLabel>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#2F3037]">
                <Globe className="h-4 w-4" />
                {provider.referralSource}
              </p>
            </div>
          )}

          {/* Reject reason form */}
          {showRejectForm && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <label className="text-sm font-semibold text-destructive">
                Reason for rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="Explain why this application is being rejected…"
                className="mt-2 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:border-destructive"
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          {showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(false)}
                className="rounded-full border border-input px-5 py-2.5 text-sm font-semibold text-[#303139]"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="flex items-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                {isRejecting ? "Rejecting…" : "Confirm rejection"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isApproving || isRejecting}
                className="flex items-center gap-2 rounded-full border border-destructive px-5 py-2.5 text-sm font-semibold text-destructive disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isApproving ? "Approving…" : "Approve"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Shared bits                                                            */
/* ---------------------------------------------------------------------- */

function DetailGrid({ provider }: { provider: PendingProvider }) {
  const items: [string, string][] = [
    ["Category", provider.categoryId?.name || "—"],
    ["Hourly rate", `${provider.hourlyRate} CHF`],
    ["Experience", `${provider.experience} years`],
    ["Languages", provider.lenguages?.join(", ") || "—"],
    [
      "Date of birth",
      provider.dateOfBirth
        ? new Date(provider.dateOfBirth).toLocaleDateString()
        : "—",
    ],
  ];

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#F8F9FC] p-4 sm:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label}>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[#202126]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wide text-primary">
      {children}
    </p>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

function CertificateCarousel({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [index, setIndex] = useState(0);
  const total = certificates.length;
  const certificate = certificates[index];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="mt-2 rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-serif text-base font-semibold">
          {certificate?.type}
        </h4>
        {total > 1 && (
          <span className="font-mono text-xs text-muted-foreground">
            {index + 1}/{total}
          </span>
        )}
      </div>

      <div className="relative mt-3">
        {certificate?.imgUrl ? (
          <img
            src={getImageUrl(certificate.imgUrl) ?? undefined}
            alt={certificate.type}
            className="h-[220px] w-full rounded-lg object-cover bg-muted"
          />
        ) : (
          <div className="flex h-[220px] w-full items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
            No image
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous certificate"
              onClick={goPrev}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next certificate"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {certificate?.description}
      </p>

      {total > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {certificates.map((c, i) => (
            <button
              key={c._id}
              type="button"
              aria-label={`Go to certificate ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-primary" : "w-1.5 bg-[#DDE1EE]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingProvidersPage;
