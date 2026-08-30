"use client";

const accidents = [
  {
    id: 1,
    type: "সড়ক দুর্ঘটনা",
    description: "ধানমন্ডি এলাকায় একটি সড়ক দুর্ঘটনা ঘটেছে।",
    location: "ধানমন্ডি, ঢাকা",
    status: "pending",
    time: "৫ মিনিট আগে",
  },
  {
    id: 2,
    type: "আগুন",
    description: "একটি ভবনে আগুন লাগার খবর পাওয়া গেছে।",
    location: "কলাবাগান, ঢাকা",
    status: "active",
    time: "১২ মিনিট আগে",
  },
  {
    id: 3,
    type: "জরুরি চিকিৎসা",
    description: "একজন ব্যক্তির জরুরি চিকিৎসা সহায়তা প্রয়োজন।",
    location: "মোহাম্মদপুর, ঢাকা",
    status: "resolved",
    time: "২৫ মিনিট আগে",
  },
];

export default function NearbyAccidents() {
  return (
    <div className="info-box">

      {/* Section Header */}
      <div className="section-header">

        <h3>নিকটবর্তী দুর্ঘটনা</h3>

        <button>
          বিস্তারিত দেখুন
        </button>

      </div>


      {/* Accident List */}
      {accidents.map((accident) => {

        let badgeClass = "badge-yellow";
        let statusText = "অপেক্ষমান";

        if (accident.status === "pending") {
          badgeClass = "badge-red";
          statusText = "জরুরী";
        }

        if (accident.status === "active") {
          badgeClass = "badge-yellow";
          statusText = "চলমান";
        }

        if (accident.status === "resolved") {
          badgeClass = "badge-green";
          statusText = "সমাধান হয়েছে";
        }

        return (
          <div
            key={accident.id}
            className="accident-item"
          >

            {/* Accident Information */}
            <div>

              <h4>
                {accident.type}
              </h4>

              <p>
                {accident.description}
              </p>

              <p>
                📍 {accident.location}
              </p>

              <span className={`badge ${badgeClass}`}>
                {statusText}
              </span>

              <p className="time">
                {accident.time}
              </p>

            </div>


            {/* Arrow */}
            <span className="material-symbols-outlined">
              arrow_forward_ios
            </span>

          </div>
        );
      })}

    </div>
  );
}