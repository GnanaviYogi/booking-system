"use client";

import { useRouter } from "next/navigation";

export default function DashboardCards() {
  const router = useRouter();

  const cards = [
    {
      icon: "📋",
      title: "Booking Management",
      description:
        "View, search and manage all room reservations.",
      route: "/list",
      gradient:
        "linear-gradient(135deg,#3B82F6,#2563EB)",
    },
    {
      icon: "📅",
      title: "Schedule Planner",
      description:
        "Visual calendar view for room schedules.",
      route: "/calendar",
      gradient:
        "linear-gradient(135deg,#8B5CF6,#7C3AED)",
    },
    {
      icon: "➕",
      title: "Reserve Room",
      description:
        "Create a new meeting room booking.",
      route: "/booking",
      gradient:
        "linear-gradient(135deg,#06B6D4,#0891B2)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(320px,1fr))",
        gap: "24px",
        marginTop: "50px",
        width: "100%",
        maxWidth: "1200px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          onClick={() =>
            router.push(card.route)
          }
          style={{
            cursor: "pointer",

            padding: "32px",

            borderRadius: "28px",

            background:
              "rgba(255,255,255,.08)",

            backdropFilter:
              "blur(20px)",

            border:
              "1px solid rgba(255,255,255,.12)",

            minHeight: "260px",

            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",

            transition:
              "all .3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-8px)";
            e.currentTarget.style.boxShadow =
              "0 25px 50px rgba(59,130,246,.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0)";
            e.currentTarget.style.boxShadow =
              "none";
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",

              borderRadius: "20px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: "36px",

              background:
                card.gradient,
            }}
          >
            {card.icon}
          </div>

          <div>
            <h2
              style={{
                color: "white",
                marginBottom: "12px",
              }}
            >
              {card.title}
            </h2>

            <p
              style={{
                color:
                  "rgba(255,255,255,.72)",
                lineHeight: 1.6,
              }}
            >
              {card.description}
            </p>
          </div>

          <div
            style={{
              color: "#60A5FA",
              fontWeight: 600,
            }}
          >
            Open →
          </div>
        </div>
      ))}
    </div>
  );
}