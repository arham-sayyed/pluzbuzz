import ServiceCard from '@/components/site/ServiceCard';

export default function Related() {
  return (
    <section data-screen-label="Related services" style={{ position: "relative", padding: "0 clamp(20px,4vw,56px) clamp(64px,8vw,110px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55566a" }}>Related Services</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "12px" }}>
          <ServiceCard service="app" kicker="Related service" />
          <ServiceCard service="seo" kicker="Related service" />
          <ServiceCard service="all" kicker="Explore" />
        </div>
      </div>
    </section>
  );
}
