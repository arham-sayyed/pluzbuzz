import LocalTime from '@/components/home/LocalTime';

const MAP_EMBED = 'https://www.openstreetmap.org/export/embed.html?bbox=-0.0975%2C51.5210%2C-0.0785%2C51.5315&layer=mapnik&marker=51.5262%2C-0.0870';
const MAP_LINK = 'https://www.openstreetmap.org/?mlat=51.5262&mlon=-0.0870#map=16/51.5262/-0.0870';

export default function Headquarters() {
  return (
    <section id="hq" data-screen-label="Headquarters" style={{ padding: "clamp(64px,8vw,120px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px,3.4vw,48px)" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "clamp(46px,6vw,96px)", lineHeight: ".88", textTransform: "uppercase" }}>
          <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" style={{ display: "block" }}>PluzBuzz</span></span>
          <span style={{ display: "block", overflow: "hidden" }}><span data-r="mask" data-d="80" style={{ display: "block" }}>Headquarters</span></span>
        </h2>
        {/* Map beside the address card on desktop, stacked on phones (.ct-hq in globals.css). */}
        <div data-r="up" className="ct-hq" style={{ border: "1.5px solid #0a0c24", borderRadius: "12px", overflow: "hidden" }}>
          <iframe className="ct-hq__map" src={MAP_EMBED} title="PluzBuzz London Headquarters Map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", border: "0", display: "block", filter: "grayscale(1) contrast(1.05)" }}></iframe>
          <aside className="ct-hq__aside" style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "clamp(24px,2.6vw,36px)", background: "#fff" }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#3a5bff" }}>GB · Main hub</span>
            <strong style={{ fontFamily: "'Barlow Condensed'", fontWeight: "800", fontSize: "40px", lineHeight: ".9", textTransform: "uppercase" }}>United Kingdom</strong>
            <address style={{ fontStyle: "normal", fontSize: "17px", fontWeight: "500" }}>Old Street, Shoreditch, London</address>
            <p style={{ color: "#55566a", lineHeight: "1.6" }}>Old Street, Shoreditch, London, United Kingdom.</p>
            <dl style={{ margin: "auto 0 0", display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 18px", paddingTop: "18px", borderTop: "1px solid rgba(10,12,36,.14)", fontFamily: "'IBM Plex Mono'", fontSize: "13px" }}>
              <dt style={{ color: "#55566a" }}>Hours</dt><dd style={{ margin: "0" }}>Mon–Sat · 10:00–19:00</dd>
              <dt style={{ color: "#55566a" }}>Local time</dt><dd style={{ margin: "0" }}><LocalTime timeZone="Europe/London" color="#0a0c24" /></dd>
              <dt style={{ color: "#55566a" }}>Coords</dt><dd style={{ margin: "0" }}>51.5262° N, 0.0870° W</dd>
            </dl>
            <a className="hv2" href={MAP_LINK} target="_blank" rel="noreferrer" style={{ alignSelf: "flex-start", padding: "13px 18px", border: "1.5px solid #0a0c24", borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>Open in maps ↗</a>
          </aside>
        </div>
      </div>
    </section>
  );
}
