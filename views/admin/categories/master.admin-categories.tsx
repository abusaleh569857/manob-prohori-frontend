"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  HeartPulse,
  Car,
  Droplets,
  Waves,
  Zap,
  ShieldAlert,
  Building2,
  TreePine,
  Wind,
  Radio,
  Activity,
  PhoneCall,
  Siren,
  Sparkles,
  Layers,
  Edit2,
  Trash2,
  Power,
  ArrowUpDown,
  FileText,
  Loader2,
  Check,
  X,
  ChevronRight,
  Info,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetAdminIncidentCategoriesQuery,
  useCreateIncidentCategoryMutation,
  useUpdateIncidentCategoryMutation,
  useToggleIncidentCategoryStatusMutation,
  useDeleteIncidentCategoryMutation,
} from "@/redux/api/incidentApi";
import type { AdminIncidentCategory, CreateCategoryInput } from "@/types/incident.types";

// Supported Lucide Icons for Emergency Incident Categories
const AVAILABLE_ICONS: { name: string; label: string; icon: any; color: string }[] = [
  { name: "AlertTriangle", label: "Warning / General Alert", icon: AlertTriangle, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { name: "Flame", label: "Fire & Explosion", icon: Flame, color: "text-red-600 bg-red-50 border-red-200" },
  { name: "HeartPulse", label: "Medical & Health Emergency", icon: HeartPulse, color: "text-rose-600 bg-rose-50 border-rose-200" },
  { name: "Car", label: "Road Traffic Accident", icon: Car, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { name: "Droplets", label: "Flood & Water Crisis", icon: Droplets, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  { name: "Waves", label: "Cyclone, Tsunami & Storm", icon: Waves, color: "text-teal-600 bg-teal-50 border-teal-200" },
  { name: "Zap", label: "Electrical / Power Hazard", icon: Zap, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { name: "Building2", label: "Building Collapse & Structural", icon: Building2, color: "text-stone-600 bg-stone-50 border-stone-200" },
  { name: "ShieldAlert", label: "Security, Violence & Conflict", icon: ShieldAlert, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { name: "Wind", label: "Gas Leak & Air Pollution", icon: Wind, color: "text-slate-600 bg-slate-50 border-slate-200" },
  { name: "TreePine", label: "Environmental & Deforestation", icon: TreePine, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "Radio", label: "Search & Rescue Operation", icon: Radio, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { name: "Siren", label: "Disaster Emergency Broadcast", icon: Siren, color: "text-red-600 bg-red-50 border-red-200" },
  { name: "Activity", label: "Critical Incident Response", icon: Activity, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "PhoneCall", label: "Emergency Hotline Alert", icon: PhoneCall, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { name: "Sparkles", label: "Special Community Relief", icon: Sparkles, color: "text-amber-600 bg-amber-50 border-amber-200" },
];

function getIconComponent(iconName: string | null | undefined) {
  const matched = AVAILABLE_ICONS.find(
    (item) => item.name.toLowerCase() === (iconName || "").toLowerCase()
  );
  return matched ? matched.icon : AlertTriangle;
}

function getIconColorClass(iconName: string | null | undefined) {
  const matched = AVAILABLE_ICONS.find(
    (item) => item.name.toLowerCase() === (iconName || "").toLowerCase()
  );
  return matched ? matched.color : "text-red-600 bg-red-50 border-red-200";
}

export function MasterAdminCategoriesComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [sortBy, setSortBy] = useState<"ORDER" | "INCIDENTS" | "NAME">("ORDER");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminIncidentCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminIncidentCategory | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: "",
    slug: "",
    description: "",
    iconName: "AlertTriangle",
    sortOrder: 0,
    isActive: true,
  });

  // RTK Query with 5s polling for real-time telemetry
  const {
    data: categoriesRes,
    isLoading,
    refetch,
  } = useGetAdminIncidentCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [createCategoryMutation, { isLoading: isCreating }] = useCreateIncidentCategoryMutation();
  const [updateCategoryMutation, { isLoading: isUpdating }] = useUpdateIncidentCategoryMutation();
  const [toggleStatusMutation, { isLoading: isToggling }] = useToggleIncidentCategoryStatusMutation();
  const [deleteCategoryMutation, { isLoading: isDeleting }] = useDeleteIncidentCategoryMutation();

  const categories = categoriesRes?.data || [];

  // Metrics
  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = totalCategories - activeCount;
  const totalLinkedIncidents = categories.reduce((sum, c) => sum + (c.incidentsCount || 0), 0);

  // Filtered and sorted categories
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // Status Filter
    if (statusFilter === "ACTIVE") {
      result = result.filter((c) => c.isActive);
    } else if (statusFilter === "INACTIVE") {
      result = result.filter((c) => !c.isActive);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "ORDER") {
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      }
      if (sortBy === "INCIDENTS") {
        return (b.incidentsCount || 0) - (a.incidentsCount || 0);
      }
      if (sortBy === "NAME") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [categories, statusFilter, searchQuery, sortBy]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      iconName: "AlertTriangle",
      sortOrder: totalCategories + 1,
      isActive: true,
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cat: AdminIncidentCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      iconName: cat.iconName || "AlertTriangle",
      sortOrder: cat.sortOrder || 0,
      isActive: cat.isActive,
    });
  };

  // Auto-generate slug from name if creating
  const handleNameChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      name: val,
      // Auto-update slug if not editing or if slug matched previous name
      slug: editingCategory ? prev.slug : autoSlug,
    }));
  };

  // Submit Create or Update
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategoryMutation({
          id: editingCategory.id,
          name: formData.name.trim(),
          slug: formData.slug?.trim() || undefined,
          description: formData.description?.trim() || undefined,
          iconName: formData.iconName,
          sortOrder: Number(formData.sortOrder || 0),
          isActive: formData.isActive,
        }).unwrap();
        toast.success(`Category "${formData.name}" updated successfully!`);
        setEditingCategory(null);
      } else {
        await createCategoryMutation({
          name: formData.name.trim(),
          slug: formData.slug?.trim() || undefined,
          description: formData.description?.trim() || undefined,
          iconName: formData.iconName,
          sortOrder: Number(formData.sortOrder || 0),
          isActive: formData.isActive,
        }).unwrap();
        toast.success(`Category "${formData.name}" created successfully!`);
        setIsCreateModalOpen(false);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save incident category");
    }
  };

  // Toggle Category Active Status
  const handleToggleStatus = async (cat: AdminIncidentCategory) => {
    try {
      await toggleStatusMutation(cat.id).unwrap();
      toast.success(
        cat.isActive
          ? `Category "${cat.name}" deactivated. It won't appear in citizen reporting.`
          : `Category "${cat.name}" activated! Ready for citizen incident reports.`
      );
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle status");
    }
  };

  // Delete Category
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategoryMutation(deletingCategory.id).unwrap();
      toast.success(`Category "${deletingCategory.name}" permanently deleted.`);
      setDeletingCategory(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------
          1. HEADER & KPI METRICS SUMMARY
          ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-brand-red-soft text-brand-red border border-red-200 shadow-2xs">
            <Layers className="size-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
                Dynamic Incident Categories
              </h1>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700">
                Live Taxonomy
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-[13px] font-medium text-slate-500">
              Manage national emergency incident categories, custom icons, priority ranking &amp; active status.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          <Link
            href="/admin/incidents"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
          >
            <AlertTriangle className="size-4 text-brand-red" />
            <span>Incident Triage</span>
          </Link>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-2xl bg-brand-red px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-brand-red-dark transition shadow-md shadow-brand-red/25 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Categories</span>
            <div className="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <Tag className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-brand-navy">{totalCategories}</p>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Configured in platform</p>
        </div>

        {/* Active */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Active in Reports</span>
            <div className="grid size-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700">{activeCount}</p>
          <p className="text-[11px] font-medium text-emerald-600 mt-0.5">Visible to public &amp; citizens</p>
        </div>

        {/* Deactivated */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Deactivated / Hidden</span>
            <div className="grid size-8 place-items-center rounded-xl bg-slate-200 text-slate-600">
              <XCircle className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-700">{inactiveCount}</p>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Safely disabled</p>
        </div>

        {/* Incidents Linked */}
        <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-900">Total Incidents Linked</span>
            <div className="grid size-8 place-items-center rounded-xl bg-red-100 text-brand-red">
              <FileText className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-brand-red">{totalLinkedIncidents}</p>
          <p className="text-[11px] font-medium text-red-700 mt-0.5">Historical incident records</p>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. SEARCH, STATUS FILTERS & SORT CONTROLS
          ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search category by name, slug, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition focus:border-brand-red focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter Pills & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs font-bold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "rounded-lg px-3 py-1.5 transition cursor-pointer",
                statusFilter === "ALL"
                  ? "bg-white text-brand-navy shadow-xs"
                  : "text-slate-600 hover:text-brand-navy"
              )}
            >
              All ({totalCategories})
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={cn(
                "rounded-lg px-3 py-1.5 transition cursor-pointer",
                statusFilter === "ACTIVE"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-emerald-700"
              )}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter("INACTIVE")}
              className={cn(
                "rounded-lg px-3 py-1.5 transition cursor-pointer",
                statusFilter === "INACTIVE"
                  ? "bg-slate-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Inactive ({inactiveCount})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
            <ArrowUpDown className="size-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ORDER">Sort by Priority (Order #)</option>
              <option value="INCIDENTS">Sort by Most Incidents</option>
              <option value="NAME">Sort by Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. CATEGORIES LIST & INTERACTIVE CARDS
          ------------------------------------------------------------------ */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16">
          <Loader2 className="size-8 animate-spin text-brand-red" />
          <p className="mt-3 text-xs font-bold text-slate-500">Loading incident categories taxonomy...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-xs">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <Tag className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-brand-navy">No categories found</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? "No incident categories match your search criteria. Try a different search term."
              : "No categories available in this filter."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-brand-navy hover:bg-slate-50"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((cat) => {
            const IconComponent = getIconComponent(cat.iconName);
            const colorClass = getIconColorClass(cat.iconName);

            return (
              <div
                key={cat.id}
                className={cn(
                  "group flex flex-col justify-between rounded-3xl border bg-white p-5 shadow-xs transition hover:shadow-md",
                  cat.isActive
                    ? "border-slate-200/90 hover:border-red-300"
                    : "border-slate-200/70 bg-slate-50/50 opacity-75 hover:opacity-100"
                )}
              >
                <div>
                  {/* Top Bar: Icon, Name & Status Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("grid size-12 place-items-center rounded-2xl border shadow-2xs shrink-0", colorClass)}>
                        <IconComponent className="size-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black text-brand-navy group-hover:text-brand-red transition">
                            {cat.name}
                          </h3>
                        </div>
                        <p className="font-mono text-[11px] font-bold text-slate-400">
                          #{cat.slug}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide border shrink-0",
                        cat.isActive
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-slate-100 border-slate-200 text-slate-500"
                      )}
                    >
                      {cat.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 min-h-8">
                    {cat.description || "No specific incident instructions or guidelines provided."}
                  </p>

                  {/* Badges: Sort Order, Icon Name & Incidents count */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11px] font-bold">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 border border-slate-200/70">
                      Sort: <strong>#{cat.sortOrder}</strong>
                    </span>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 border border-slate-200/70 font-mono">
                      Icon: {cat.iconName || "AlertTriangle"}
                    </span>

                    <span className={cn(
                      "rounded-lg px-2.5 py-1 border font-extrabold",
                      cat.incidentsCount > 0
                        ? "bg-red-50 border-red-200 text-brand-red"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    )}>
                      {cat.incidentsCount} Incident{cat.incidentsCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                {/* Actions: Edit, Toggle, Delete */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Edit2 className="size-3.5 text-brand-navy" />
                      <span>Edit</span>
                    </button>

                    {/* Toggle Status Button */}
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      disabled={isToggling}
                      className={cn(
                        "flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                        cat.isActive
                          ? "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      )}
                      title={cat.isActive ? "Deactivate category" : "Activate category"}
                    >
                      <Power className="size-3.5" />
                      <span>{cat.isActive ? "Deactivate" : "Activate"}</span>
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeletingCategory(cat)}
                    className="grid size-8 place-items-center rounded-xl border border-transparent text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-brand-red transition cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------------
          4. CREATE / EDIT CATEGORY MODAL
          ------------------------------------------------------------------ */}
      {(isCreateModalOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-brand-red-soft text-brand-red border border-red-200">
                  <Layers className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-brand-navy">
                    {editingCategory ? "Edit Incident Category" : "Add New Incident Category"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure name, slug, custom Lucide icon, and sorting order.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingCategory(null);
                }}
                className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="mt-5 space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                  Category Name <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Earthquake & Building Collapse"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-800 focus:border-brand-red focus:outline-none"
                />
              </div>

              {/* Slug & Sort Order in 2 Columns */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                    Category Slug (URL Identifier)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. earthquake-building-collapse"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono font-medium text-slate-700 focus:border-brand-red focus:outline-none"
                  />
                  <span className="text-[10.5px] text-slate-400 mt-1 block">
                    Auto-generated from name if left default.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                    Sort Priority Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-800 focus:border-brand-red focus:outline-none"
                    min={0}
                  />
                  <span className="text-[10.5px] text-slate-400 mt-1 block">
                    Lower numbers appear first in dropdowns.
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                  Description / Incident Guidelines
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Emergency structural failures, seismic tremors, trapped victim rescue protocols..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:border-brand-red focus:outline-none"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                  Select Visual Category Icon
                </label>
                <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-2 rounded-2xl border border-slate-200 bg-slate-50/60">
                  {AVAILABLE_ICONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = formData.iconName === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, iconName: item.name })}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 border text-center transition cursor-pointer",
                          isSelected
                            ? "border-brand-red bg-white text-brand-red shadow-xs ring-2 ring-brand-red/20 font-bold"
                            : "border-slate-200/80 bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-white"
                        )}
                        title={item.label}
                      >
                        <Icon className="size-5" />
                        <span className="text-[10px] font-medium truncate w-full">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div>
                  <p className="text-xs font-extrabold text-brand-navy">Active Status</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    When active, citizens can select this category when reporting incidents.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer shadow-2xs",
                    formData.isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-300 text-slate-700"
                  )}
                >
                  <Power className="size-3.5" />
                  <span>{formData.isActive ? "Active" : "Disabled"}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-xs font-extrabold text-white hover:bg-brand-red-dark transition shadow-md shadow-brand-red/25 cursor-pointer"
                >
                  {(isCreating || isUpdating) ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          5. DELETE CONFIRMATION MODAL WITH DATA SAFETY CHECK
          ------------------------------------------------------------------ */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="grid size-10 place-items-center rounded-xl bg-red-50 text-brand-red border border-red-200">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-brand-navy">Delete Incident Category</h3>
                <p className="text-xs text-slate-500 font-medium">Safe relational deletion check</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                Are you sure you want to delete category <strong>&quot;{deletingCategory.name}&quot;</strong>?
              </p>

              {deletingCategory.incidentsCount > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900 text-xs">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold">Cannot permanently delete:</strong>
                      <p className="mt-1">
                        This category has <strong>{deletingCategory.incidentsCount} historical incident(s)</strong> attached to it in the database. Deleting it would break historical data integrity.
                      </p>
                      <p className="mt-2 font-bold text-amber-800">
                        Recommendation: Deactivate the category instead.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-600 text-xs">
                  <span className="text-emerald-700 font-bold">✓ 0 linked incidents found.</span> This category can be safely removed from the system.
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeletingCategory(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              {deletingCategory.incidentsCount > 0 ? (
                <button
                  onClick={async () => {
                    await handleToggleStatus(deletingCategory);
                    setDeletingCategory(null);
                  }}
                  className="rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-amber-700 shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  Deactivate Category Instead
                </button>
              ) : (
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-red px-5 py-2.5 text-xs font-extrabold text-white hover:bg-red-700 shadow-md shadow-brand-red/20 cursor-pointer"
                >
                  {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  <span>Confirm Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
