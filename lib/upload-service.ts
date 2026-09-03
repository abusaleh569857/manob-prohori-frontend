/**
 * Upload Service Utility
 * Prioritizes Cloudinary Direct CDN Upload, with graceful fallback to backend API
 */

export interface UploadedImage {
  id: string;
  file?: File;
  previewUrl: string;
  finalUrl?: string;
  status: "uploading" | "success" | "error";
  progress: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a single file to Cloudinary CDN or Backend
 */
export async function uploadSingleFile(file: File): Promise<string> {
  // 1. Cloudinary Direct Unsigned Upload (Priority #1)
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "manob_prohori_incidents");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.secure_url) {
          console.log("Uploaded successfully to Cloudinary:", data.secure_url);
          return data.secure_url;
        }
      } else {
        const errorData = await response.json();
        console.warn("Cloudinary upload returned non-200:", errorData);
      }
    } catch (err) {
      console.error("Cloudinary upload failed, attempting fallback:", err);
    }
  }

  // 2. Convert file to Base64
  const base64String = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  // 3. Fallback to backend /api/uploads
  try {
    let token = "";
    try {
      const sessionRes = await fetch("/api/auth/session");
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        token = sessionData?.backendAccessToken || "";
      }
    } catch (e) {
      // Ignore
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/uploads`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        images: [base64String],
      }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data?.urls?.[0]) {
        return result.data.urls[0];
      }
    }
  } catch (err) {
    console.warn("Backend upload fallback failed:", err);
  }

  // 4. Ultimate fallback to local data URL
  return base64String;
}

/**
 * Upload multiple files in parallel
 */
export async function uploadMultipleFiles(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadSingleFile(file));
  return Promise.all(uploadPromises);
}
