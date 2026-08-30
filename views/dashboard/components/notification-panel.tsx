"use client";

const notifications = [
  {
    id: 1,
    title: "দুর্ঘটনা রিপোর্ট হয়েছে",
    description: "একটি সড়ক দুর্ঘটনার রিপোর্ট পাওয়া গেছে।",
    location: "ধানমন্ডি, ঢাকা",
    time: "৫ মিনিট আগে",
  },
  {
    id: 2,
    title: "জরুরি রিপোর্ট হয়েছে",
    description: "একটি জরুরি সহায়তার অনুরোধ পাওয়া গেছে।",
    location: "মিরপুর, ঢাকা",
    time: "১৫ মিনিট আগে",
  },
  {
    id: 3,
    title: "দুর্ঘটনা রিপোর্ট হয়েছে",
    description: "নিকটবর্তী এলাকায় একটি দুর্ঘটনার রিপোর্ট পাওয়া গেছে।",
    location: "উত্তরা, ঢাকা",
    time: "৩০ মিনিট আগে",
  },
];

export default function NotificationPanel() {
  return (
    <div className="notification-panel">

      {/* Header */}
      <div className="notification-header">

        <h3>সাম্প্রতিক নোটিফিকেশন</h3>

        <span className="material-symbols-outlined">
          notifications_active
        </span>

      </div>


      {/* Notification List */}
      <div className="notification-list">

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className="notification-item"
          >

            <p className="notification-title">
              {notification.title}
            </p>

            <p className="notification-text">
              {notification.description}
            </p>

            <p className="notification-text">
              📍 {notification.location}
            </p>

            <p className="notification-time">
              {notification.time}
            </p>

          </div>

        ))}

      </div>


      {/* View All Button */}
      <button className="view-all-btn">
        সবগুলো দেখুন
      </button>

    </div>
  );
}