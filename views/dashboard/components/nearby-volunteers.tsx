"use client";

const volunteers = [
  {
    id: 1,
    location: "ধানমন্ডি, ঢাকা",
    distance: "০.৮ কিমি দূরে",
    status: "online",
  },
  {
    id: 2,
    location: "কলাবাগান, ঢাকা",
    distance: "১.৪ কিমি দূরে",
    status: "active",
  },
  {
    id: 3,
    location: "মোহাম্মদপুর, ঢাকা",
    distance: "২.১ কিমি দূরে",
    status: "offline",
  },
];

export default function NearbyVolunteers() {
  return (
    <div className="info-box">

      {/* Section Header */}
      <div className="section-header">

        <h3>নিকটবর্তী ভলান্টিয়ার</h3>

        <button>
          সব দেখুন
        </button>

      </div>


      {/* Volunteer List */}
      {volunteers.map((volunteer) => (

        <div
          key={volunteer.id}
          className="volunteer-item"
        >

          {/* Left Side */}
          <div className="volunteer-left">

            <div className="volunteer-avatar">
              <span className="material-symbols-outlined">
                person
              </span>
            </div>

            <div>

              <h4>
                ভলান্টিয়ার #{volunteer.id}
              </h4>

              <p>
                📍 {volunteer.location}
              </p>

              <p>
                {volunteer.distance}
              </p>

            </div>

          </div>


          {/* Right Side */}
          <div className="volunteer-right">

            <div className="status">

              <span
                className={`status-dot ${
                  volunteer.status === "online"
                    ? "available"
                    : volunteer.status === "active"
                    ? "duty"
                    : "offline"
                }`}
              />

              <span
                className={
                  volunteer.status === "online"
                    ? "status-online"
                    : volunteer.status === "active"
                    ? "status-active"
                    : "status-offline"
                }
              >
                {volunteer.status === "online"
                  ? "অনলাইন"
                  : volunteer.status === "active"
                  ? "অ্যাকটিভ"
                  : "অফলাইন"}
              </span>

            </div>

          </div>

        </div>

      ))}

    </div>
  );
}