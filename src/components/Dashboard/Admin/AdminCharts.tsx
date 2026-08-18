import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { AlertCircle, Inbox } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Skeleton } from "../../ui/skeleton";
import { useI18n } from "../../../lib/i18n";
import { SectionCard } from "../../common/SectionCard";
import {
  useGetBookingStatisticsQuery,
  useGetEarningsStatisticsQuery,
} from "@/redux/api/websiteApi";

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];

function YearSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="h-8 w-28 bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ChartState({
  isLoading,
  isError,
  isEmpty,
  errorLabel,
  emptyLabel,
}: {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  errorLabel: string;
  emptyLabel: string;
}) {
  if (isLoading) {
    return <Skeleton className="h-full w-full rounded-xl" />;
  }
  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-5 w-5" />
        {errorLabel}
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <Inbox className="h-5 w-5" />
        {emptyLabel}
      </div>
    );
  }
  return null;
}

export function BookingsChart() {
  const [year, setYear] = useState(currentYear);
  const { t } = useI18n();
  const { data, isLoading, isError } = useGetBookingStatisticsQuery({ year });

  const chartData = useMemo(
    () =>
      data?.data?.monthlyStats?.map((m) => ({
        month: m?.monthName?.slice(0, 3) ?? "",
        bookings: m?.total ?? 0,
      })) ?? [],
    [data],
  );

  const isEmpty =
    !isLoading && !isError && chartData.every((d) => d.bookings === 0);
  const showFallback = isLoading || isError || isEmpty;

  return (
    <SectionCard
      title={t("admin.overview.bookingsOverview")}
      action={<YearSelect value={year} onChange={setYear} />}
    >
      <div className="h-64">
        {showFallback ? (
          <ChartState
            isLoading={isLoading}
            isError={isError}
            isEmpty={isEmpty}
            errorLabel={
              t("admin.common.failedToLoad") ?? "Failed to load bookings data."
            }
            emptyLabel={
              t("admin.common.noData") ?? "No bookings data for this year."
            }
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#6d5df6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
}

export function EarningsChart() {
  const [year, setYear] = useState(currentYear);
  const { t } = useI18n();
  const { data, isLoading, isError } = useGetEarningsStatisticsQuery({ year });

  const chartData = useMemo(
    () =>
      data?.data?.monthlyStats?.map((m) => ({
        month: m?.monthName?.slice(0, 3) ?? "",
        earnings: m?.totalCustomerPayment ?? 0,
      })) ?? [],
    [data],
  );

  const isEmpty =
    !isLoading && !isError && chartData.every((d) => d.earnings === 0);
  const showFallback = isLoading || isError || isEmpty;

  return (
    <SectionCard
      title={t("admin.overview.earningsOverview")}
      action={<YearSelect value={year} onChange={setYear} />}
    >
      <div className="h-64">
        {showFallback ? (
          <ChartState
            isLoading={isLoading}
            isError={isError}
            isEmpty={isEmpty}
            errorLabel={
              t("admin.common.failedToLoad") ?? "Failed to load earnings data."
            }
            emptyLabel={
              t("admin.common.noData") ?? "No earnings data for this year."
            }
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="earnings" fill="#6d5df6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
}
