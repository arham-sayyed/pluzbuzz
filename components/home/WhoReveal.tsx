export default function WhoReveal() {
  return (
    <section id="who" data-screen-label="Who we are (reveal)" style={{ background: "#080b38", color: "#fff", padding: "clamp(72px,9vw,140px) clamp(20px,4vw,56px)", overflow: "hidden" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,4vw,56px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(44px,6vw,96px)", lineHeight: ".9", textTransform: "uppercase", maxWidth: "980px" }}>
            <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>UK&apos;s Trusted Digital Marketing</span></span>
            <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="80" style={{ display: "block" }}>Agency for <span style={{ color: "#ffc83d" }}>Measurable Growth</span></span></span>
          </h2>
          <p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.55)" }}>Who We Are</p>
        </div>
        <p data-words="" style={{ fontSize: "clamp(24px,2.9vw,44px)", lineHeight: "1.22", fontWeight: "500", letterSpacing: "-.01em", maxWidth: "1200px" }}>We work with UK businesses that are serious about growth - not just ticking boxes, but building something that actually moves the needle. Over the years, we&apos;ve helped everyone from early-stage startups finding their feet to established brands looking to sharpen their edge online.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "24px 64px", borderTop: "1px solid rgba(255,255,255,.14)", paddingTop: "28px" }}>
          <p data-r="up" style={{ color: "rgba(255,255,255,.7)", fontSize: "17px", lineHeight: "1.6" }}>Whether you&apos;re based in London or anywhere across the UK, we bring the same level of care and strategic thinking to every project we take on.</p>
          <p data-r="up" data-d="100" style={{ fontFamily: "'Barlow Condensed'", fontWeight: "700", fontSize: "clamp(30px,3vw,44px)", lineHeight: "1", textTransform: "uppercase" }}>We <span style={{ position: "relative", color: "rgba(255,255,255,.4)" }}>make<span aria-hidden="true" style={{ position: "absolute", left: "-4%", right: "-4%", top: "50%", height: "4px", background: "#ffc83d" }}></span></span> build brands together.</p>
        </div>
      </div>
    </section>
  );
}
