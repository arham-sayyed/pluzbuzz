export default function Reviews() {
  return (
    <section id="reviews" data-screen-label="Testimonials" style={{ position: "relative", background: "#fff", padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,4vw,56px)" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(46px,6vw,96px)", lineHeight: ".88", textTransform: "uppercase" }}><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>What clients</span></span><span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="70" style={{ display: "block", color: "#3a5bff" }}>say</span></span></h2>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #0a0c24" }}>
          <figure className="wd-rev" data-r="up" style={{ margin: "0", display: "grid", gap: "18px clamp(24px,5vw,80px)", padding: "clamp(26px,3vw,40px) 0", borderBottom: "1px solid rgba(10,12,36,.14)" }}>
            <dl style={{ margin: "0", display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'IBM Plex Mono'", fontSize: "11.5px", letterSpacing: ".08em", textTransform: "uppercase" }}>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Review</dt><dd style={{ margin: "0", color: "#3a5bff" }}>01</dd></div>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Sector</dt><dd style={{ margin: "0" }}>Industrial engineering</dd></div>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Project</dt><dd style={{ margin: "0" }}>Website rebuild</dd></div>
            </dl>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <blockquote style={{ margin: "0", fontSize: "clamp(20px,1.9vw,27px)", lineHeight: "1.4", fontWeight: "500", maxWidth: "880px", textWrap: "pretty" }}>“Our old site was costing us leads. PluzBuzz rebuilt it around what our buyers actually look for, and the quality of enquiries improved almost straight away.”</blockquote>
              <figcaption style={{ fontSize: "15px", color: "#55566a" }}><strong style={{ color: "#0a0c24", fontWeight: "600" }}>Daniel Hughes</strong> · Operations Director</figcaption>
            </div>
          </figure>
          <figure className="wd-rev" data-r="up" style={{ margin: "0", display: "grid", gap: "18px clamp(24px,5vw,80px)", padding: "clamp(26px,3vw,40px) 0", borderBottom: "1px solid rgba(10,12,36,.14)" }}>
            <dl style={{ margin: "0", display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'IBM Plex Mono'", fontSize: "11.5px", letterSpacing: ".08em", textTransform: "uppercase" }}>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Review</dt><dd style={{ margin: "0", color: "#3a5bff" }}>02</dd></div>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Sector</dt><dd style={{ margin: "0" }}>Healthcare services</dd></div>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Project</dt><dd style={{ margin: "0" }}>Website revamp</dd></div>
            </dl>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <blockquote style={{ margin: "0", fontSize: "clamp(20px,1.9vw,27px)", lineHeight: "1.4", fontWeight: "500", maxWidth: "880px", textWrap: "pretty" }}>“Clear timelines, weekly check-ins and no jargon. We always knew what was being built, why it mattered, and when it would be ready.”</blockquote>
              <figcaption style={{ fontSize: "15px", color: "#55566a" }}><strong style={{ color: "#0a0c24", fontWeight: "600" }}>Priya Shah</strong> · Head of Marketing</figcaption>
            </div>
          </figure>
          <figure className="wd-rev" data-r="up" style={{ margin: "0", display: "grid", gap: "18px clamp(24px,5vw,80px)", padding: "clamp(26px,3vw,40px) 0", borderBottom: "1px solid rgba(10,12,36,.14)" }}>
            <dl style={{ margin: "0", display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'IBM Plex Mono'", fontSize: "11.5px", letterSpacing: ".08em", textTransform: "uppercase" }}>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Review</dt><dd style={{ margin: "0", color: "#3a5bff" }}>03</dd></div>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Sector</dt><dd style={{ margin: "0" }}>Retail</dd></div>
              <div style={{ display: "flex", gap: "10px" }}><dt style={{ color: "#55566a", width: "74px" }}>Project</dt><dd style={{ margin: "0" }}>E-commerce store</dd></div>
            </dl>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <blockquote style={{ margin: "0", fontSize: "clamp(20px,1.9vw,27px)", lineHeight: "1.4", fontWeight: "500", maxWidth: "880px", textWrap: "pretty" }}>“The new store is faster, easier to manage, and checkout finally works properly on mobile. Our team updates products without calling a developer.”</blockquote>
              <figcaption style={{ fontSize: "15px", color: "#55566a" }}><strong style={{ color: "#0a0c24", fontWeight: "600" }}>Olivia Carter</strong> · Founder</figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
