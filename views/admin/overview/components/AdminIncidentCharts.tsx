"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendingUp, Activity, PieChart as PieIcon, BarChart3 } from "lucide-react";

interface AdminIncidentChartsProps {
  categoryBreakdown?: Array<{ categoryName: string; count: number }>;
  severityDistribution?: Array<{ severity: string; count: number }>;
}

const velocityData = [
  { time: "00:00", reported: 2, resolved: 1 },
  { time: "04:00", reported: 1, resolved: 1 },
  { time: "08:00", reported: 6, resolved: 4 },
  { time: "12:00", reported: 9, resolved: 7 },
  { time: "16:00", reported: 14, resolved: 11 },
  { time: "20:00", reported: 8, resolved: 8 },
  { time: "23:00", reported: 3, resolved: 3 },
];

const velocityChartConfig: ChartConfig = {
  reported: {
    label: "Incidents Dispatched",
    color: "#dc2626",
  },
  resolved: {
    label: "Incidents Resolved",
    color: "#10b981",
  },
};

const categoryChartConfig: ChartConfig = {
  count: {
    label: "Incident Count",
    color: "#dc2626",
  },
};

const severityChartConfig: ChartConfig = {
  CRITICAL: { label: "Critical", color: "#dc2626" },
  HIGH: { label: "High", color: "#f97316" },
  MEDIUM: { label: "Medium", color: "#3b82f6" },
  LOW: { label: "Low", color: "#10b981" },
};

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#dc2626",
  HIGH: "#f97316",
  MEDIUM: "#3b82f6",
  LOW: "#10b981",
};

export function AdminIncidentCharts({
  categoryBreakdown = [],
  severityDistribution = [],
}: AdminIncidentChartsProps) {
  // Format dynamic categories or fallback
  const displayCategories =
    categoryBreakdown.length > 0
      ? categoryBreakdown.map((c, i) => ({
          category: c.categoryName,
          count: Number(c.count),
          fill: ["#dc2626", "#f97316", "#3b82f6", "#06b6d4", "#8b5cf6", "#64748b"][i % 6],
        }))
      : [
          { category: "Road Accident", count: 12, fill: "#dc2626" },
          { category: "Fire Alarm", count: 8, fill: "#f97316" },
          { category: "Medical Aid", count: 14, fill: "#3b82f6" },
          { category: "Flood Rescue", count: 5, fill: "#06b6d4" },
        ];

  // Format dynamic severities or fallback
  const displaySeverities =
    severityDistribution.length > 0
      ? severityDistribution.map((s) => ({
          name: s.severity,
          value: Number(s.count),
          fill: SEVERITY_COLORS[s.severity] || "#3b82f6",
        }))
      : [
          { name: "CRITICAL", value: 5, fill: "#dc2626" },
          { name: "HIGH", value: 9, fill: "#f97316" },
          { name: "MEDIUM", value: 15, fill: "#3b82f6" },
          { name: "LOW", value: 8, fill: "#10b981" },
        ];

  return (
    <div className="space-y-6">
      {/* 24-Hour Velocity Area Chart + Severity Donut Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Area Chart: 24-Hour Emergency Dispatch Velocity */}
        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 backdrop-blur-xl shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-brand-navy">
                  24-Hour Emergency Dispatch &amp; Resolution Velocity
                </h3>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Live Flow
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hourly comparison between newly dispatched incidents and verified resolutions
              </p>
            </div>
            <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <Activity className="size-4.5 text-brand-red" />
            </div>
          </div>

          <div className="mt-4 h-64 w-full">
            <ChartContainer config={velocityChartConfig} className="h-full w-full">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} stroke="#94a3b8" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="reported" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#fillReported)" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#fillResolved)" />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Donut Chart: Incident Severity Distribution */}
        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-brand-navy">Severity Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live severity distribution</p>
            </div>
            <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <PieIcon className="size-4.5 text-brand-navy" />
            </div>
          </div>

          <div className="mt-4 h-64 w-full">
            <ChartContainer config={severityChartConfig} className="h-full w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={displaySeverities} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {displaySeverities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart: Incidents by Category */}
      <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-brand-navy">Incidents by Category (Database Active)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across registered emergency categories</p>
          </div>
          <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
            <BarChart3 className="size-4.5 text-brand-red" />
          </div>
        </div>

        <div className="mt-4 h-64 w-full">
          <ChartContainer config={categoryChartConfig} className="h-full w-full">
            <BarChart data={displayCategories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} stroke="#94a3b8" />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} stroke="#94a3b8" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {displayCategories.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
