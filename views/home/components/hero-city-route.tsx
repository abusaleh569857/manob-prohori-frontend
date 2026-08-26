import { MapPin } from "lucide-react";

// ============================================================================
// Hero City Skyline & Animated Emergency Route Component
// Renders vector skyline silhouettes, ambient gradients, and pulsing map pins.
// ============================================================================
export function HeroCityRoute() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none overflow-hidden">
      
      {/* Ambient Red/Rose Glow directly behind and above the Smart Emergency badge */}
      <div className="absolute -top-6 left-[6%] sm:left-[12%] lg:left-[15%] h-85 w-115 rounded-full bg-linear-to-br from-red-200/40 via-rose-100/35 to-transparent blur-3xl opacity-75" />

      {/* Main warm ambient coral/rose glow in the center-left */}
      <div className="absolute top-[10%] left-[20%] sm:left-[26%] lg:left-[30%] h-145 w-140 rounded-full bg-linear-to-tr from-rose-200/35 via-red-100/25 to-amber-50/15 blur-3xl opacity-60" />

      {/* Modern Flat-top Building Silhouettes extending downward */}
      <div className="absolute top-[16%] left-[18%] sm:left-[24%] lg:left-[29%] w-112.5 sm:w-130 lg:w-150 opacity-35">
        <svg
          viewBox="0 0 600 650"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            {/* Background Layer Soft Coral Gradient */}
            <linearGradient id="coralCityBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.25" />
              <stop offset="25%" stopColor="#fca5a5" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#fee2e2" stopOpacity="0.08" />
              <stop offset="90%" stopColor="#fee2e2" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            {/* Foreground Layer Subtle Coral Gradient */}
            <linearGradient id="coralCityFore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
              <stop offset="30%" stopColor="#f87171" stopOpacity="0.10" />
              <stop offset="70%" stopColor="#fee2e2" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Skyscraper Silhouettes - Background Layer */}
          <rect x="20" y="80" width="38" height="570" rx="3" fill="url(#coralCityBack)" />
          <rect x="64" y="45" width="48" height="605" rx="3" fill="url(#coralCityBack)" />
          <rect x="118" y="70" width="38" height="580" rx="3" fill="url(#coralCityBack)" />
          <rect x="162" y="32" width="52" height="618" rx="4" fill="url(#coralCityBack)" />
          <rect x="220" y="55" width="44" height="595" rx="3" fill="url(#coralCityBack)" />
          <rect x="270" y="22" width="56" height="628" rx="4" fill="url(#coralCityBack)" />
          <rect x="332" y="48" width="46" height="602" rx="3" fill="url(#coralCityBack)" />
          <rect x="384" y="32" width="50" height="618" rx="4" fill="url(#coralCityBack)" />
          <rect x="440" y="62" width="42" height="588" rx="3" fill="url(#coralCityBack)" />
          <rect x="488" y="42" width="48" height="608" rx="3" fill="url(#coralCityBack)" />
          <rect x="542" y="72" width="38" height="578" rx="3" fill="url(#coralCityBack)" />

          {/* Skyscraper Silhouettes - Foreground Layer */}
          <rect x="42" y="108" width="42" height="542" rx="2" fill="url(#coralCityFore)" />
          <rect x="92" y="92" width="38" height="558" rx="2" fill="url(#coralCityFore)" />
          <rect x="140" y="104" width="46" height="546" rx="3" fill="url(#coralCityFore)" />
          <rect x="196" y="82" width="44" height="568" rx="3" fill="url(#coralCityFore)" />
          <rect x="250" y="98" width="40" height="552" rx="2" fill="url(#coralCityFore)" />
          <rect x="300" y="72" width="48" height="578" rx="3" fill="url(#coralCityFore)" />
          <rect x="358" y="92" width="42" height="558" rx="2" fill="url(#coralCityFore)" />
          <rect x="410" y="102" width="46" height="548" rx="3" fill="url(#coralCityFore)" />
          <rect x="466" y="88" width="40" height="562" rx="2" fill="url(#coralCityFore)" />
          <rect x="514" y="108" width="38" height="542" rx="2" fill="url(#coralCityFore)" />
        </svg>
      </div>

      {/* Dashed Emergency Connecting Route Path */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 650"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M 400 450 Q 370 340, 445 285 T 520 215 T 575 165"
          stroke="#f87171"
          strokeWidth="2.5"
          strokeDasharray="5 7"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {/* Emergency Map Pin 1 (Top Right - Near Phone Mockup) */}
      <div className="absolute left-[57.5%] top-[25.5%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute size-8 animate-ping rounded-full bg-red-400 opacity-30" />
          <div className="relative grid size-9 place-items-center rounded-full bg-red-500/15 p-1 backdrop-blur-sm shadow-md">
            <div className="grid size-7 place-items-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/50">
              <MapPin className="size-4 fill-white text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Map Pin 2 (Upper Middle) */}
      <div className="absolute left-[52%] top-[33.5%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute size-6 animate-ping rounded-full bg-rose-400 opacity-25" />
          <div className="relative grid size-7 place-items-center rounded-full bg-rose-500/15 p-0.5 backdrop-blur-sm shadow-sm">
            <div className="grid size-5.5 place-items-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/40">
              <MapPin className="size-3 fill-white text-rose-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Map Pin 3 (Mid-Left Area) */}
      <div className="absolute left-[44.5%] top-[44%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute size-6 animate-ping rounded-full bg-red-400 opacity-25" />
          <div className="relative grid size-8 place-items-center rounded-full bg-red-500/15 p-1 backdrop-blur-sm shadow-sm">
            <div className="grid size-6 place-items-center rounded-full bg-red-500 text-white shadow-md shadow-red-500/40">
              <MapPin className="size-3.5 fill-white text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Map Pin 4 (Lower Left - Route Origin) */}
      <div className="absolute left-[40%] top-[69%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute size-5 animate-ping rounded-full bg-rose-400 opacity-20" />
          <div className="relative grid size-7 place-items-center rounded-full bg-red-500/10 p-0.5 backdrop-blur-sm">
            <div className="grid size-5 place-items-center rounded-full bg-red-400 text-white shadow-sm">
              <MapPin className="size-2.5 fill-white text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
