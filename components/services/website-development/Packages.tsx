export default function Packages() {
  return (
    <section id="packages" data-screen-label="Packages" style={{ position: "relative", padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,4vw,56px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(46px,6vw,96px)", lineHeight: ".88", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>Pick your</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="70" style={{ display: "block" }}>build</span></span></h2>
          <p data-r="up" style={{ maxWidth: "420px", color: "#55566a", fontSize: "17px", lineHeight: "1.55" }}>Most website projects take between 4 to 10 weeks depending on the number of pages, custom functionality, revision cycles, and content readiness.</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <article data-r="up" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "20px", padding: "clamp(24px,2.6vw,34px)", borderRadius: "12px", border: "1.5px solid #0a0c24" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "#3a5bff" }}>For campaigns</span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "44px", lineHeight: ".9", textTransform: "uppercase" }}>Launch</h3>
            <p style={{ color: "#55566a", lineHeight: "1.55" }}>Landing pages and campaign sites that need to convert fast.</p>
            <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>+</span>Conversion-focused layouts</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>+</span>SEO-ready structure</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>+</span>Speed optimisation</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>+</span>Launch support</li></ul>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingTop: "18px", borderTop: "1px solid rgba(10,12,36,.14)" }}><p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "13px", color: "#55566a" }}>Quoted on scope</p><a className="hv2" href="#contact" style={{ padding: "15px 20px", borderRadius: "6px", border: "1.5px solid #0a0c24", fontWeight: "600", textAlign: "center" }}>Start a Launch build</a></div>
          </article>
          <article data-r="up" data-d="80" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "20px", padding: "clamp(24px,2.6vw,34px)", borderRadius: "12px", background: "#080b38", color: "#fff", border: "1.5px solid #080b38" }}>
            <span style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontFamily: "'IBM Plex Mono'", fontSize: "12px", color: "#ffc83d" }}><span style={{ letterSpacing: ".08em", textTransform: "uppercase" }}>For growing businesses</span><span>Most chosen</span></span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "44px", lineHeight: ".9", textTransform: "uppercase" }}>Grow</h3>
            <p style={{ color: "rgba(255,255,255,.72)", lineHeight: "1.55" }}>Custom business websites designed to engage UK audiences and increase enquiries.</p>
            <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#ffc83d" }}>+</span>Strategic UX/UI design</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#ffc83d" }}>+</span>WordPress or custom CMS</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#ffc83d" }}>+</span>CRM + API integrations</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#ffc83d" }}>+</span>Schema + Core Web Vitals</li></ul>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,.16)" }}><p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "13px", color: "rgba(255,255,255,.65)" }}>Quoted on scope</p><a className="hv8" href="#contact" style={{ padding: "15px 20px", borderRadius: "6px", background: "#ffc83d", color: "#080b38", fontWeight: "600", textAlign: "center" }}>Start a Grow build</a></div>
          </article>
          <article data-r="up" data-d="160" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "20px", padding: "clamp(24px,2.6vw,34px)", borderRadius: "12px", border: "1.5px solid #0a0c24" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "#3a5bff" }}>For online stores</span>
            <h3 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "44px", lineHeight: ".9", textTransform: "uppercase" }}>Scale</h3>
            <p style={{ color: "#55566a", lineHeight: "1.55" }}>E-commerce stores and custom platforms with integrations, QA and staging.</p>
            <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>+</span>WooCommerce or Shopify</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>+</span>Secure checkout optimisation</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>+</span>Payment gateways</li><li style={{ display: "flex", gap: "10px" }}><span style={{ color: "#3a5bff" }}>+</span>Product schema integration</li></ul>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingTop: "18px", borderTop: "1px solid rgba(10,12,36,.14)" }}><p style={{ fontFamily: "'IBM Plex Mono'", fontSize: "13px", color: "#55566a" }}>Quoted on scope</p><a className="hv2" href="#contact" style={{ padding: "15px 20px", borderRadius: "6px", border: "1.5px solid #0a0c24", fontWeight: "600", textAlign: "center" }}>Start a Scale build</a></div>
          </article>
        </div>
      </div>
    </section>
  );
}
