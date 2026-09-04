"use client";

interface Volunteer {
  volunteer_id: number;
  photo_path?: string | null;
  location_text: string;
  availability_status: "online" | "offline";
  rating?: number | null;
  name: string;
  phone: string;
  distance: number;
}

interface VolunteerCardProps {
  volunteer: Volunteer;
}

export default function VolunteerCard({
  volunteer,
}: VolunteerCardProps) {
  const isOnline =
    volunteer.availability_status === "online";

  const statusText = isOnline ? "অনলাইন" : "অফলাইন";

  const statusColor = isOnline
    ? "#10b981"
    : "#dc2626";

  const avatarUrl =
    volunteer.photo_path ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      volunteer.name
    )}&background=8ef5b5&color=006d40&size=64`;

  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-xl
        border-l-4
        border-l-[#006d40]
        bg-white
        p-5
        shadow-[0px_4px_20px_rgba(26,32,44,0.08)]
      "
    >
      {/* ================= TOP ================= */}
      <div className="flex items-start justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt={volunteer.name}
            className="
              h-16
              w-16
              shrink-0
              rounded-full
              object-cover
            "
            onError={(e) => {
              e.currentTarget.src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  volunteer.name
                )}&background=8ef5b5&color=006d40&size=64`;
            }}
          />

          {/* Name + Status */}
          <div>
            <h3
              className="
                text-xl
                font-bold
                leading-tight
                text-[#181c1e]
              "
            >
              {volunteer.name}
            </h3>

            {/* Status */}
            <div
              className="
                mt-1
                flex
                items-center
                gap-1
                text-sm
                font-semibold
              "
              style={{ color: statusColor }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: statusColor,
                }}
              />

              <span>{statusText}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div
          className="
            flex
            items-center
            gap-1
            whitespace-nowrap
            rounded-lg
            bg-[#8ef5b5]
            px-2
            py-1
            text-sm
            font-bold
            text-[#007243]
          "
        >
          <span className="material-symbols-outlined text-[14px]">
            star
          </span>

          <span>
            {(volunteer.rating ?? 0).toFixed(1)}
          </span>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div
        className="
          flex
          flex-col
          gap-2
          border-y
          border-[#e5e9eb]
          py-3
        "
      >
        {/* Location */}
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-[#5b403e]
          "
        >
          <span className="material-symbols-outlined text-[18px]">
            location_on
          </span>

          <span>
            {volunteer.location_text}
          </span>
        </div>

        {/* Distance */}
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-[#5b403e]
          "
        >
          <span className="material-symbols-outlined text-[18px]">
            near_me
          </span>

          <span>
            {volunteer.distance} কিমি দূরে
          </span>
        </div>

        {/* Phone */}
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-[#5b403e]
          "
        >
          <span className="material-symbols-outlined text-[18px]">
            call
          </span>

          <span>{volunteer.phone}</span>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div
        className="
          mt-2
          grid
          grid-cols-2
          gap-3
        "
      >
        {/* Call */}
        <a
          href={`tel:${volunteer.phone}`}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#b51822]
            px-3
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:opacity-90
            active:scale-[0.98]
          "
        >
          <span className="material-symbols-outlined text-[16px]">
            call
          </span>

          কল করুন
        </a>

        {/* Help */}
        <button
          type="button"
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            border-2
            border-[#b51822]
            bg-transparent
            px-3
            py-3
            text-sm
            font-bold
            text-[#b51822]
            transition
            hover:bg-[#ffdad7]
            active:scale-[0.98]
          "
        >
          <span className="material-symbols-outlined text-[16px]">
            handshake
          </span>

          সহায়তা চান
        </button>
      </div>
    </div>
  );
}