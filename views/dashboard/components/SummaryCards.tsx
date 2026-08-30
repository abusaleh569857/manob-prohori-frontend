const summaryCards = [
  {
    title: "সক্রিয় দুর্ঘটনা",
    value: "৫",
    icon: "emergency",
    cardClass: "summary-card-blue",
    iconClass: "summary-icon-blue",
  },
  {
    title: "উপলব্ধ ভলান্টিয়ার",
    value: "১২",
    icon: "volunteer_activism",
    cardClass: "summary-card-green",
    iconClass: "summary-icon-green",
  },
  {
    title: "নিকটবর্তী সহায়তা",
    value: "৩",
    icon: "map",
    cardClass: "summary-card-yellow",
    iconClass: "summary-icon-yellow",
  },
  {
    title: "মোট রিপোর্ট",
    value: "২৫",
    icon: "description",
    cardClass: "summary-card-purple",
    iconClass: "summary-icon-purple",
  },
];

export default function SummaryCards() {
  return (
    <section className="summary-grid">

      {summaryCards.map((card) => (
        <div
          key={card.title}
          className={`summary-card ${card.cardClass}`}
        >

          <div className={`summary-icon-box ${card.iconClass}`}>
            <span className="material-symbols-outlined">
              {card.icon}
            </span>
          </div>

          <div className="summary-card-text">
            <p>{card.title}</p>
            <h2>{card.value}</h2>
          </div>

        </div>
      ))}

    </section>
  );
}