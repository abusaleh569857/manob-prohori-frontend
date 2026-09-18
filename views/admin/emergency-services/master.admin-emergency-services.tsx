"use client";

import { useState } from "react";
import {
  PhoneCall,
  ShieldAlert,
  Ambulance,
  Flame,
  Shield,
  Plus,
  Phone,
  Edit2,
  Trash2,
  X,
  Loader2,
  MapPin,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetEmergencyServicesQuery,
  useCreateServiceContactMutation,
  useUpdateServiceContactMutation,
  useDeleteServiceContactMutation,
} from "@/redux/api/emergencyServiceApi";
import type { EmergencyServiceContact } from "@/types/hospital.types";

export function MasterAdminEmergencyServicesComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyServiceContact | null>(null);

  // Form State
  const [emergencyServiceId, setEmergencyServiceId] = useState<number>(1);
  const [regionName, setRegionName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayLabel, setDisplayLabel] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const { data: servicesRes, isLoading, refetch } = useGetEmergencyServicesQuery();
  const [createContact, { isLoading: isCreating }] = useCreateServiceContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateServiceContactMutation();
  const [deleteContact] = useDeleteServiceContactMutation();

  const services = servicesRes?.data || [];

  const handleOpenAddModal = (defaultServiceId?: number) => {
    setEditingContact(null);
    setEmergencyServiceId(defaultServiceId || (services[0]?.id ?? 1));
    setRegionName("");
    setPhoneNumber("");
    setDisplayLabel("");
    setIsPrimary(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact: EmergencyServiceContact) => {
    setEditingContact(contact);
    setEmergencyServiceId(contact.emergencyServiceId);
    setRegionName(contact.regionName || "");
    setPhoneNumber(contact.phoneNumber);
    setDisplayLabel(contact.displayLabel || "");
    setIsPrimary(contact.isPrimary);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      if (editingContact) {
        await updateContact({
          id: editingContact.id,
          regionName: regionName.trim() || undefined,
          phoneNumber: phoneNumber.trim(),
          displayLabel: displayLabel.trim() || undefined,
          isPrimary,
        }).unwrap();
        toast.success("Emergency contact updated successfully!");
      } else {
        await createContact({
          emergencyServiceId: Number(emergencyServiceId),
          regionName: regionName.trim() || undefined,
          phoneNumber: phoneNumber.trim(),
          displayLabel: displayLabel.trim() || undefined,
          isPrimary,
        }).unwrap();
        toast.success("Emergency hotline contact added!");
      }

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save emergency contact.");
    }
  };

  const handleDelete = async (id: number, label: string) => {
    if (confirm(`Delete emergency contact "${label}"?`)) {
      try {
        await deleteContact(id).unwrap();
        toast.success("Emergency contact removed.");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete contact.");
      }
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "NATIONAL_EMERGENCY":
        return ShieldAlert;
      case "AMBULANCE":
        return Ambulance;
      case "FIRE":
        return Flame;
      case "POLICE":
        return Shield;
      default:
        return Phone;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "NATIONAL_EMERGENCY":
        return "bg-red-50 text-brand-red border-red-200";
      case "AMBULANCE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "FIRE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "POLICE":
        return "bg-blue-50 text-brand-blue border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Emergency Hotlines &amp; Agency Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain national hotline numbers, police control, fire stations, and emergency ambulance contacts
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAddModal()}
          className="flex items-center gap-1.5 rounded-2xl bg-brand-red px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-red/20 hover:bg-brand-red-dark transition cursor-pointer self-start sm:self-center"
        >
          <Plus className="size-4" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {/* 2. Directory Services Grid */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <Loader2 className="size-8 animate-spin text-brand-red" />
          <p className="text-xs font-bold text-slate-400 mt-2">Loading emergency services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <PhoneCall className="mx-auto size-12 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-brand-navy">No emergency services found</h3>
          <p className="mt-1 text-xs text-slate-400">Initialize services or add new emergency contacts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {services.map((service) => {
            const Icon = getServiceIcon(service.serviceType);
            const colorClass = getServiceColor(service.serviceType);

            return (
              <div
                key={service.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className={cn("grid size-12 shrink-0 place-items-center rounded-2xl border shadow-2xs", colorClass)}>
                        <Icon className="size-6" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-brand-navy">{service.name}</h3>
                          <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-black uppercase border", colorClass)}>
                            {service.serviceType.replace("_", " ")}
                          </span>
                        </div>
                        {service.description && (
                          <p className="mt-1 text-xs text-slate-500 font-medium">{service.description}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(service.id)}
                      className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition cursor-pointer shrink-0"
                    >
                      <Plus className="size-3" />
                      <span>Add Number</span>
                    </button>
                  </div>

                  {/* Contacts List */}
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-3.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Configured Hotlines ({service.contacts?.length || 0})
                    </span>

                    {service.contacts && service.contacts.length > 0 ? (
                      service.contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-slate-50 transition text-xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-brand-navy truncate">
                                {contact.displayLabel || service.name}
                              </span>
                              {contact.isPrimary && (
                                <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9.5px] font-black uppercase">
                                  Primary 24/7
                                </span>
                              )}
                            </div>
                            {contact.regionName && (
                              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                <MapPin className="size-3 text-slate-400" />
                                <span>{contact.regionName}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`tel:${contact.phoneNumber}`}
                              className="font-mono font-black text-brand-navy hover:text-brand-red transition bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs"
                            >
                              {contact.phoneNumber}
                            </a>

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(contact)}
                              className="grid size-7 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                              title="Edit Contact"
                            >
                              <Edit2 className="size-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(contact.id, contact.displayLabel || contact.phoneNumber)}
                              className="grid size-7 place-items-center rounded-lg border border-red-200 bg-white text-brand-red hover:bg-red-50 transition cursor-pointer"
                              title="Delete Contact"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No numbers added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-brand-navy">
                {editingContact ? "Edit Emergency Contact" : "Add Emergency Hotline"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {!editingContact && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Service Agency *
                  </label>
                  <select
                    value={emergencyServiceId}
                    onChange={(e) => setEmergencyServiceId(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-red"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.serviceType})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number / Hotline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 999, 16163, or 02-223381188"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Display Label / Station Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. DMP Central Control Room"
                  value={displayLabel}
                  onChange={(e) => setDisplayLabel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Region / Zone Coverage
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nationwide, Dhaka City Zone, or Chittagong"
                  value={regionName}
                  onChange={(e) => setRegionName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryCheckbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="size-4 rounded accent-emerald-600 cursor-pointer"
                />
                <label htmlFor="primaryCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Mark as Primary 24/7 Hotline for this agency
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
                  <span>{editingContact ? "Save Changes" : "Add Hotline"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
