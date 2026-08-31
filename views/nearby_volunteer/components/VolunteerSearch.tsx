"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VolunteerSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchName, setSearchName] = useState(
    searchParams.get("search_name") || ""
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (searchName.trim()) {
        params.set("search_name", searchName.trim());
      }

      const query = params.toString();

      router.push(
        query
          ? `/Nearby_volunteer?${query}`
          : "/Nearby_volunteer"
      );
    }, 800);

    return () => clearTimeout(timer);
  }, [searchName, router]);

  return (
    <div className="relative min-w-[300px]">
      {/* Search Icon */}
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5b403e] text-[20px]">
        search
      </span>

      {/* Search Input */}
      <input
        type="text"
        name="search_name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="ভলান্টিয়ারের নাম লিখুন..."
        className="
          w-full
          rounded-xl
          bg-[#f1f4f6]
          py-3
          pl-12
          pr-4
          text-[15px]
          text-[#181c1e]
          outline-none
          transition
          placeholder:text-[#5b403e]
          focus:ring-2
          focus:ring-[#b51822]
        "
      />
    </div>
  );
}