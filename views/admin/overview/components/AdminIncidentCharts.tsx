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

// 1. Hourly Trend Data (Area Chart)
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
    color: "#dc2626", // Brand Red
  },
  resolved: {
    label: "Incidents Resolved",
    color: "#10b981", // Emerald
  },
};

// 2. Incident Category Distribution Data (Bar Chart)
const categoryData = [
  { category: "Road Accident", incidents: 38, fill: "#dc2626" },
  { category: "Fire Alarm", incidents: 22, fill: "#f97316" },
  { category: "Medical Aid", incidents: 29, fill: "#3b82f6" },
  { category: "Flood/Water", incidents: 15, fill: "#06b6d4" },
  { category: "Building Risk", incidents: 8, fill: "#8b5cf6" },
  { category: "Public Safety", incidents: 12, fill: "#64748b" },
];

const categoryChartConfig: ChartConfig = {
  incidents: {
    label: "Total Dispatches",
    color: "#dc2626",
  },
};

// 3. Severity Distribution (Donut / Pie Chart)
const severityData = [
  { name: "Critical", value: 18, fill: "#dc2626" },
  { name: "High", value: 34, fill: "#f97316" },
  { name: "Medium", value: 48, fill: "#3b82f6" },
  { name: "Low", value: 24, fill: "#10b981" },
];

const severityChartConfig: ChartConfig = {
  Critical: { label: "Critical", color: "#dc2626" },
  High: { label: "High", color: "#f97316" },
  Medium: { label: "Medium", color: "#3b82f6" },
  Low: { label: "Low", color: "#10b981" },
};

export function AdminIncidentCharts() {
  return (
    <div className="space-y-6">
      {/* 24-Hour Velocity Area Chart + Severity Donut Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Area Chart: 24-Hour Emergency Dispatch Velocity */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-brand-navy">
                  24-Hour Emergency Dispatch & Resolution Velocity
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

          <div className="mt-4 pt-2">
            <ChartContainer
              config={velocityChartConfig}
              className="h-68 w-full aspect-auto"
            >
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-[11px] font-semibold text-slate-400"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-[11px] font-semibold text-slate-400"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  type="natural"
                  dataKey="reported"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#fillReported)"
                />
                <Area
                  type="natural"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#fillResolved)"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Donut Chart: Incident Severity Breakdown */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-brand-navy">
                  Severity Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proportion by emergency priority level
                </p>
              </div>
              <div className="grid size-8.5 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <PieIcon className="size-4 text-brand-navy" />
              </div>
            </div>

            <div className="mt-2">
              <ChartContainer
                config={severityChartConfig}
                className="h-56 w-full aspect-auto"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[11px]">
            <div className="flex items-center justify-between rounded-lg bg-red-50/70 p-2 text-brand-red font-bold">
              <span>Critical</span>
              <span>18%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-amber-50/70 p-2 text-amber-700 font-bold">
              <span>High</span>
              <span>34%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart: Incident Categories Breakdown */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-brand-navy">
              Emergency Incidents by Category
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution of incidents across managed response categories
            </p>
          </div>
          <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
            <BarChart3 className="size-4.5 text-brand-blue" />
          </div>
        </div>

        <div className="mt-4 pt-2">
          <ChartContainer
            config={categoryChartConfig}
            className="h-60 w-full aspect-auto"
          >
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px] font-semibold text-slate-400"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-[11px] font-semibold text-slate-400"
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="incidents"
                radius={[8, 8, 0, 0]}
                barSize={36}
              >
                {categoryData.map((entry, index) => (
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
