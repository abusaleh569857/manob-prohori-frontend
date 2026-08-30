export default function userSidebar() {
  return (
    <aside className="dashboard-sidebar">

      {/* Brand */}
      <div className="sidebar-brand">
        <h1>মানবপ্রহরী</h1>
        <p>জরুরী সেবা পোর্টাল</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <a href="/dashboard" className="nav-item active">
          <span className="material-symbols-outlined">
            dashboard
          </span>
          <span>ড্যাশবোর্ড</span>
        </a>

        <a href="/incidents/create" className="nav-item">
          <span className="material-symbols-outlined">
            add_alert
          </span>
          <span>রিপোর্ট করুন</span>
        </a>

        <a href="#" className="nav-item">
          <span className="material-symbols-outlined">
            group
          </span>
          <span>নিকটবর্তী ভলান্টিয়ার</span>
        </a>

        <a href="#" className="nav-item">
          <span className="material-symbols-outlined">
            emergency
          </span>
          <span>নিকটবর্তী দুর্ঘটনা</span>
        </a>

        <a href="/incidents/my" className="nav-item">
          <span className="material-symbols-outlined">
            history
          </span>
          <span>আমার রিপোর্ট</span>
        </a>

        <a href="/signin" className="nav-item">
          <span className="material-symbols-outlined">
            logout
          </span>
          <span>প্রস্থান</span>
        </a>

      </nav>

    </aside>
  );
}