"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { UploadCloud, X, ImagePlus, Camera, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { UploadedImage } from "@/lib/upload-service";

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxFiles = 5,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const processFiles = (filesList: FileList | File[]) => {
    const validFiles: File[] = [];
    const filesArray = Array.from(filesList);

    if (images.length + filesArray.length > maxFiles) {
      toast.error(`You can upload a maximum of ${maxFiles} incident photos.`);
      return;
    }

    for (const file of filesArray) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image file.`);
        continue;
      }
      // Validate size (max 6MB)
      if (file.size > 6 * 1024 * 1024) {
        toast.error(`"${file.name}" is larger than 6MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newItems: UploadedImage[] = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "success",
      progress: 100,
    }));

    onImagesChange([...images, ...newItems]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    onImagesChange(filtered);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-brand-navy">
          Incident Photos &amp; Damage Evidence{" "}
          <span className="text-slate-400 font-normal">(Optional - Up to {maxFiles})</span>
        </label>
        <span className="text-xs font-mono font-bold text-slate-500">
          {images.length} / {maxFiles}
        </span>
      </div>

      {/* Upload Dropzone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer bg-slate-50/50 hover:bg-white hover:border-brand-navy/50",
          isDragging
            ? "border-brand-red bg-red-50/30 scale-[0.99]"
            : "border-slate-200"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="grid size-12 place-items-center rounded-2xl bg-white border border-slate-200 text-slate-600 shadow-xs mb-3">
          <UploadCloud className="size-6 text-brand-red" />
        </div>

        <p className="text-sm font-bold text-brand-navy">
          Drag &amp; drop photos here, or{" "}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-brand-red underline hover:text-brand-red-dark"
          >
            browse files
          </button>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Supports JPG, PNG, WebP up to 6MB each
        </p>

        {/* Mobile Camera Fast Trigger */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-brand-navy transition"
          >
            <ImagePlus className="size-3.5 text-brand-navy" />
            <span>Select Photos</span>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex sm:hidden items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-brand-red shadow-2xs hover:bg-red-100 transition"
          >
            <Camera className="size-3.5" />
            <span>Take Photo</span>
          </button>
        </div>
      </div>

      {/* Image Preview Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs"
            >
              <img
                src={img.previewUrl}
                alt={`Incident photo ${index + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Remove Overlay Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(img.id)}
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-slate-900/80 text-white hover:bg-brand-red transition shadow-xs cursor-pointer"
              >
                <X className="size-3.5" />
              </button>

              <div className="absolute bottom-1 left-1.5 rounded bg-black/60 px-1.5 py-0.2 text-[9px] font-bold text-white">
                Photo #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
