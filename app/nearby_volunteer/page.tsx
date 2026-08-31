import NearbyVolunteer from "@/views/nearby_volunteer/master.nearbyVolunteer";

export default function NearbyVolunteerPage() {
  const volunteers = [
    {
      volunteer_id: 1,
      photo_path: null,
      location_text: "ধানমন্ডি, ঢাকা",
      availability_status: "online" as const,
      rating: 4.8,
      name: "রহিম আহমেদ",
      phone: "01712345678",
      distance: 0.8,
    },
    {
      volunteer_id: 2,
      photo_path: null,
      location_text: "মোহাম্মদপুর, ঢাকা",
      availability_status: "online" as const,
      rating: 4.6,
      name: "করিম হাসান",
      phone: "01812345678",
      distance: 1.2,
    },
    {
      volunteer_id: 3,
      photo_path: null,
      location_text: "লালমাটিয়া, ঢাকা",
      availability_status: "offline" as const,
      rating: 4.5,
      name: "সাকিব রহমান",
      phone: "01912345678",
      distance: 1.7,
    },
    {
      volunteer_id: 4,
      photo_path: null,
      location_text: "কলাবাগান, ঢাকা",
      availability_status: "online" as const,
      rating: 4.9,
      name: "নাঈম ইসলাম",
      phone: "01612345678",
      distance: 2.1,
    },
    {
      volunteer_id: 5,
      photo_path: null,
      location_text: "ধানমন্ডি ২৭, ঢাকা",
      availability_status: "online" as const,
      rating: 4.7,
      name: "তানভীর হোসেন",
      phone: "01512345678",
      distance: 2.4,
    },
    {
      volunteer_id: 6,
      photo_path: null,
      location_text: "শংকর, ঢাকা",
      availability_status: "offline" as const,
      rating: 4.3,
      name: "ফাহিম আহমেদ",
      phone: "01312345678",
      distance: 2.8,
    },
  ];

  return (
    <NearbyVolunteer volunteers={volunteers} />
  );
}