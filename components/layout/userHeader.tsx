export default function userHeader() {
  return (
    <header className="dashboard-header">

      {/* Location */}
      <div className="location-section">
        <span className="material-symbols-outlined">
          location_on
        </span>

        <span>
          আপনার অবস্থান লোড হচ্ছে...
        </span>
      </div>


      {/* Right Section */}
      <div className="header-right-section">

        {/* Icons */}
        <div className="header-icon-section">

          {/* Schedule */}
          <button className="header-icon-btn">
            <span className="material-symbols-outlined">
              schedule
            </span>
          </button>


          {/* Notification */}
          <button className="header-icon-btn notification-button">

            <span className="material-symbols-outlined">
              notifications
            </span>

            <span className="notification-dot"></span>

          </button>

        </div>


        {/* Profile */}
        <div className="user-profile">

          <div className="profile-text">
            <h3>জুলকার</h3>
            <p>User</p>
          </div>

        </div>

      </div>

    </header>
  );
}