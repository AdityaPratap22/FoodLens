// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f9fafb",
        color: "#111",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>🍽️ FoodLens</h1>
      <p style={{ marginTop: 10, fontSize: "1rem" }}>
        Scan your food to check its nutrition and health score.
      </p>

      <Link
        href="/scan"
        style={{
          marginTop: 20,
          background: "#2563eb",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Go to Scanner
      </Link>
    </main>
  );
}
