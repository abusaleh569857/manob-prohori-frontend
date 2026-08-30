import UserSidebar from "@/components/layout/userSidebar";
import UserHeader from "@/components/layout/userHeader";
import SummaryCards from "./components/SummaryCards";
import DashboardMap from "./components/dashboard-map";
import NotificationPanel from "./components/notification-panel";
import NearbyVolunteers from "./components/nearby-volunteers";
import NearbyAccidents from "./components/nearby-accidents";

export default function Dashboard() {
  return (
    <>
      <UserSidebar />
      <main className="main-content">
        <UserHeader />
        <div className="dashboard-content">
          <SummaryCards />
          <section className="map-notification-section">
            <DashboardMap />
            <NotificationPanel />
          </section>
          <section className="lower-section">
            <NearbyVolunteers />
            <NearbyAccidents />
          </section>
        </div>
      </main>
    </>
  );
}