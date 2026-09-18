"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Search,
  Plus,
  ShieldCheck,
  Activity,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  ExternalLink,
  Power,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetHospitalsQuery,
  useGetSpecialtiesQuery,
  useCreateHospitalMutation,
  useUpdateHospitalMutation,
  useToggleHospitalStatusMutation,
  useDeleteHospitalMutation,
} from "@/redux/api/hospitalApi";
import type { Hospital, CreateHospitalInput } from "@/types/hospital.types";

const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

export function MasterAdminHospitalsComponent() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [facilityType, setFacilityType] = useState("General Hospital");
  const [ownership, setOwnership] = useState("Government");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressText, setAddressText] = useState("");
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [upazila, setUpazila] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<number[]>([]);

  // RTK Queries & Mutations
  const { data: hospitalsRes, isLoading, refetch } = useGetHospitalsQuery({
    isAdmin: true,
    search: search.trim() || undefined,
    limit: 100,
  });
  const { data: specialtiesRes } = useGetSpecialtiesQuery();

  const [createHospital, { isLoading: isCreating }] = useCreateHospitalMutation();
  const [updateHospital, { isLoading: isUpdating }] = useUpdateHospitalMutation();
  const [toggleStatus] = useToggleHospitalStatusMutation();
  const [deleteHospital, { isLoading: isDeleting }] = useDeleteHospitalMutation();

  const hospitals = hospitalsRes?.data || [];
  const specialties = specialtiesRes?.data || [];

  const handleOpenCreateModal = () => {
    setEditingHospital(null);
    setName("");
    setNameBn("");
    setFacilityType("General Hospital");
    setOwnership("Government");
    setPhone("");
    setEmail("");
    setAddressText("");
    setDivision("Dhaka");
    setDistrict("Dhaka");
    setUpazila("");
    setLatitude("");
    setLongitude("");
    setEmergencyAvailable(true);
    setSelectedSpecialtyIds([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hosp: Hospital) => {
    setEditingHospital(hosp);
    setName(hosp.name);
    setNameBn(hosp.nameBn || "");
    setFacilityType(hosp.facilityType || "General Hospital");
    setOwnership(hosp.ownership || "Government");
    setPhone(hosp.phone);
    setEmail(hosp.email || "");
    setAddressText(hosp.addressText);
    setDivision(hosp.division || "Dhaka");
    setDistrict(hosp.district || "Dhaka");
    setUpazila(hosp.upazila || "");
    setLatitude(hosp.latitude ? String(hosp.latitude) : "");
    setLongitude(hosp.longitude ? String(hosp.longitude) : "");
    setEmergencyAvailable(hosp.emergencyAvailable);
    setSelectedSpecialtyIds(hosp.specialties?.map((s) => s.id) || []);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !addressText.trim()) {
      toast.error("Please fill in hospital name, emergency phone, and address.");
      return;
    }

    try {
      const payload: CreateHospitalInput = {
        name: name.trim(),
        nameBn: nameBn.trim() || undefined,
        facilityType,
        ownership,
        phone: phone.trim(),
        email: email.trim() || undefined,
        addressText: addressText.trim(),
        division,
        district,
        upazila: upazila.trim() || undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        emergencyAvailable,
        specialtyIds: selectedSpecialtyIds,
      };

      if (editingHospital) {
        await updateHospital({ id: editingHospital.id, ...payload }).unwrap();
        toast.success("Hospital details updated successfully!");
      } else {
        await createHospital(payload).unwrap();
        toast.success("New hospital facility added to national directory!");
      }

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save hospital details.");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Hospital active status updated.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id: number, hospName: string) => {
    if (confirm(`Are you sure you want to permanently delete "${hospName}"?`)) {
      try {
        await deleteHospital(id).unwrap();
        toast.success(`Deleted ${hospName}`);
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete hospital.");
      }
    }
  };

  const toggleSpecialtySelection = (specId: number) => {
    if (selectedSpecialtyIds.includes(specId)) {
      setSelectedSpecialtyIds(selectedSpecialtyIds.filter((id) => id !== specId));
    } else {
      setSelectedSpecialtyIds([...selectedSpecialtyIds, specId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Hospital &amp; Medical Hub Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain national 24/7 emergency hospital directories, specialized care units, and hotlines
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 rounded-2xl bg-brand-red px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-red/20 hover:bg-brand-red-dark transition cursor-pointer self-start sm:self-center"
        >
          <Plus className="size-4" />
          <span>Add Medical Facility</span>
        </button>
      </div>

      {/* 2. Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search hospitals by name, area, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-brand-red focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
          <span>
            Total Facilities: <strong className="text-brand-navy font-bold">{hospitals.length}</strong>
          </span>
          <span>·</span>
          <span>
            24/7 Emergency:{" "}
            <strong className="text-emerald-700 font-bold">
              {hospitals.filter((h) => h.emergencyAvailable).length}
            </strong>
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="grid size-8 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Hospitals Directory List */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <Loader2 className="size-8 animate-spin text-brand-red" />
          <p className="text-xs font-bold text-slate-400 mt-2">Loading hospital directory...</p>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Building2 className="mx-auto size-12 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-brand-navy">No hospital facilities found</h3>
          <p className="mt-1 text-xs text-slate-400">Add a new hospital or adjust your search term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className={cn(
                "rounded-3xl border bg-white p-5 sm:p-6 shadow-xs transition hover:shadow-md",
                hosp.isActive ? "border-slate-200/90" : "border-slate-200 bg-slate-50/60 opacity-70"
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-brand-blue font-black shadow-xs">
                    <Building2 className="size-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-brand-navy">{hosp.name}</h3>
                      {hosp.nameBn && (
                        <span className="text-xs text-slate-500 font-semibold">({hosp.nameBn})</span>
                      )}

                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-black uppercase border",
                          hosp.emergencyAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        )}
                      >
                        {hosp.emergencyAvailable ? "24/7 Emergency Active" : "Standard Hours"}
                      </span>

                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold border",
                          hosp.isActive
                            ? "bg-blue-50 text-brand-blue border-blue-200"
                            : "bg-red-50 text-brand-red border-red-200"
                        )}
                      >
                        {hosp.isActive ? "Publicly Visible" : "Hidden"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-brand-red" />
                        {hosp.addressText || `${hosp.district}, ${hosp.division}`}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono font-bold text-brand-navy">
                        <Phone className="size-3.5 text-slate-400" />
                        {hosp.phone}
                      </span>
                      {hosp.ownership && (
                        <>
                          <span>·</span>
                          <span className="font-semibold text-slate-600">{hosp.ownership}</span>
                        </>
                      )}
                    </div>

                    {hosp.specialties && hosp.specialties.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 mr-1">Specialties:</span>
                        {hosp.specialties.map((spec) => (
                          <span
                            key={spec.id}
                            className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10.5px] font-bold text-slate-700"
                          >
                            {spec.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(hosp.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border",
                      hosp.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    )}
                  >
                    <Power className="size-3" />
                    <span>{hosp.isActive ? "Deactivate" : "Activate"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(hosp)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Edit2 className="size-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(hosp.id, hosp.name)}
                    className="grid size-8 place-items-center rounded-xl border border-red-200 text-brand-red hover:bg-red-50 transition cursor-pointer"
                    title="Delete Hospital"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Add / Edit Hospital Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-brand-navy text-white">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-navy">
                    {editingHospital ? "Edit Medical Facility" : "Add New Medical Facility"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Enter hospital details, 24/7 hotline, and specialties
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka Medical College Hospital"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital Name (Bangla)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ঢাকা মেডিকেল কলেজ হাসপাতাল"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Facility Type
                  </label>
                  <select
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-red"
                  >
                    <option value="General Hospital">General Hospital</option>
                    <option value="Tertiary Medical Hospital">Tertiary Medical Hospital</option>
                    <option value="Specialized Hospital">Specialized Hospital</option>
                    <option value="Clinic / Diagnostic">Clinic / Diagnostic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ownership
                  </label>
                  <select
                    value={ownership}
                    onChange={(e) => setOwnership(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-red"
                  >
                    <option value="Government">Government (সরকারি)</option>
                    <option value="Private">Private (বেসরকারি)</option>
                    <option value="Autonomous / NGO">Autonomous / NGO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 01711000001 or 10616"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Division *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-red"
                  >
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upazila / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramna"
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Address &amp; Landmarks *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Secretariat Road, Ramna, Dhaka-1000"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Latitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 23.7258"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Longitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 90.3976"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="emergencyCheckbox"
                  checked={emergencyAvailable}
                  onChange={(e) => setEmergencyAvailable(e.target.checked)}
                  className="size-4 rounded accent-emerald-600 cursor-pointer"
                />
                <label htmlFor="emergencyCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  24/7 Dedicated Emergency &amp; Trauma Service Available
                </label>
              </div>

              {/* Specialties Selector */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Available Specialties &amp; Units
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                  {specialties.map((s) => {
                    const isSelected = selectedSpecialtyIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSpecialtySelection(s.id)}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer border",
                          isSelected
                            ? "bg-brand-navy text-white border-brand-navy"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        {isSelected ? `✓ ${s.name}` : `+ ${s.name}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-red px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-red/20 hover:bg-brand-red-dark transition cursor-pointer disabled:opacity-50"
                >
                  {(isCreating || isUpdating) && <Loader2 className="size-3.5 animate-spin" />}
                  <span>{editingHospital ? "Save Changes" : "Create Facility"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
