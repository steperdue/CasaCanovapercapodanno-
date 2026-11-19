import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  ShieldAlert,
  Star,
  User,
  WifiOff,
  XCircle,
} from 'lucide-react';
import { HOUSE_DATA } from '../data/houseData';

export function InfoSections() {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const { lat, lng } = HOUSE_DATA.meta.coordinates;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.035}%2C${
    lat - 0.022
  }%2C${lng + 0.035}%2C${lat + 0.022}&layer=mapnik&marker=${lat}%2C${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div id="info" className="scroll-mt-16 space-y-10">
      {/* =====================================================================
          1. PANORAMICA CASA
         ===================================================================== */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5EFE6]">
          Panoramica dell’immobile
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="liquid-glass-subtle rounded-2xl p-4">
            <p className="text-xs text-[#B8AFA5]">Ospiti</p>
            <p className="mt-0.5 font-mono-nums text-lg font-semibold text-white">16+</p>
          </div>
          <div className="liquid-glass-subtle rounded-2xl p-4">
            <p className="text-xs text-[#B8AFA5]">Camere / Letti</p>
            <p className="mt-0.5 font-mono-nums text-lg font-semibold text-white">
              {HOUSE_DATA.overview.bedrooms} · {HOUSE_DATA.overview.beds} letti
            </p>
          </div>
          <div className="liquid-glass-subtle rounded-2xl p-4">
            <p className="text-xs text-[#B8AFA5]">Bagni ospiti</p>
            <p className="mt-0.5 font-mono-nums text-lg font-semibold text-white">
              {HOUSE_DATA.overview.bathroomsShared}{' '}
              <span className="text-xs font-normal text-[#B8AFA5]">(+1 host)</span>
            </p>
          </div>
          <div className="liquid-glass-subtle rounded-2xl p-4">
            <p className="text-xs text-[#B8AFA5]">Metratura</p>
            <p className="mt-0.5 text-sm font-semibold text-[#F2B59F]">Da confermare</p>
          </div>
        </div>

        <div className="liquid-glass space-y-3 rounded-3xl p-5 sm:p-6">
          <p className="text-xs font-medium text-[#B8AFA5]">
            {HOUSE_DATA.overview.levelsNote}
          </p>
          <div className="space-y-2.5 border-t border-white/10 pt-3 text-sm leading-relaxed text-[#D8D0C7]">
            {HOUSE_DATA.overview.summaryParagraphs.map((p, i) => (
              <p key={i}>
                {p.title && <strong className="text-[#F5EFE6]">{p.title}: </strong>}
                {p.text}
              </p>
            ))}
          </div>
          <p className="text-xs text-[#9E958C]">
            CIN: <span className="font-mono-nums font-medium text-[#D8D0C7]">{HOUSE_DATA.meta.cin}</span>
          </p>
        </div>
      </section>

      {/* =====================================================================
          2. POSIZIONE & DINTORNI
         ===================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5EFE6]">
              Posizione e dintorni
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#B8AFA5]">
              {HOUSE_DATA.meta.exactAddress} · {HOUSE_DATA.meta.altitude}
            </p>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[#F5EFE6]"
          >
            <MapPin className="h-4 w-4 text-[#E17658]" aria-hidden="true" />
            <span>Apri Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="liquid-glass overflow-hidden rounded-3xl lg:col-span-7">
            <iframe
              title="Mappa di Cà Nova di Caminata (PC)"
              src={osmEmbedUrl}
              loading="lazy"
              className="h-[250px] w-full border-0 brightness-90 contrast-105 sm:h-[300px]"
            />
          </div>

          <div className="liquid-glass rounded-3xl p-5 lg:col-span-5 sm:p-6">
            <h3 className="text-base font-semibold text-[#F5EFE6]">Dintorni utili</h3>
            <ul className="mt-3 divide-y divide-white/10">
              {HOUSE_DATA.surroundings.map((item) => (
                <li key={item.name} className="py-2.5 first:pt-0 last:pb-0">
                  <p className="text-xs font-semibold text-[#E17658]">
                    {item.category} · <span className="text-[#F5EFE6]">{item.name}</span>
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#B8AFA5]">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. SERVIZI & LIMITAZIONI
         ===================================================================== */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5EFE6]">
          Servizi e cosa non è incluso
        </h2>

        {/* Alert Box for Missing Amenities */}
        <div className="rounded-3xl border border-[#E17658]/35 bg-[#B84A2E]/15 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F5EFE6]">
            <WifiOff className="h-4 w-4 text-[#E17658]" aria-hidden="true" />
            <span>Attenzione: cosa manca in casa</span>
          </div>
          <ul className="mt-3 grid grid-cols-1 gap-2 text-xs text-[#E8DFD6] sm:grid-cols-2 lg:grid-cols-3">
            {HOUSE_DATA.unavailableAmenities.map((item) => (
              <li key={item.title} className="flex items-start gap-1.5">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E17658]" aria-hidden="true" />
                <span>
                  <strong className="text-white">{item.title}</strong>
                  {item.subtitle ? ` — ${item.subtitle}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clean Amenity Category Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOUSE_DATA.amenitiesGroups.map((grp) => (
            <div key={grp.id} className="liquid-glass rounded-3xl p-5">
              <h3 className="border-b border-white/10 pb-2.5 text-sm font-semibold text-[#F5EFE6]">
                {grp.title}
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-[#D8D0C7]">
                {grp.items.map((item) => (
                  <li key={item.title} className="flex items-start gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7DB28B]"
                      aria-hidden="true"
                    />
                    <span>
                      {item.title}
                      {item.subtitle ? ` (${item.subtitle})` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. REGOLE, CHECK-IN/OUT & CANCELLAZIONE
         ===================================================================== */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="liquid-glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#E17658]" aria-hidden="true" />
            <h3 className="font-display text-xl font-semibold text-[#F5EFE6]">
              Regole e sicurezza
            </h3>
          </div>
          <ul className="mt-3 space-y-2.5 text-xs sm:text-sm">
            {HOUSE_DATA.rules.standard.map((r) => (
              <li key={r.title} className="text-[#D8D0C7]">
                <strong className="text-[#F5EFE6]">{r.title}:</strong> {r.detail}
              </li>
            ))}
            {HOUSE_DATA.rules.hostNotes.map((r) => (
              <li key={r.title} className="text-[#D8D0C7]">
                <strong className="text-[#F5EFE6]">{r.title}:</strong> {r.detail}
              </li>
            ))}
            {HOUSE_DATA.rules.safety.map((s) => (
              <li key={s.title} className="flex items-start gap-1.5 text-[#D8D0C7]">
                {s.isWarning && (
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E17658]" aria-hidden="true" />
                )}
                <span>
                  <strong className="text-[#F5EFE6]">{s.title}:</strong> {s.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="liquid-glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#E17658]" aria-hidden="true" />
            <h3 className="font-display text-xl font-semibold text-[#F5EFE6]">
              Check-in, orari e cancellazione
            </h3>
          </div>
          <dl className="mt-3 space-y-3 text-xs sm:text-sm">
            <div>
              <dt className="text-xs text-[#9E958C]">Check-in / Check-out</dt>
              <dd className="mt-0.5 font-semibold text-[#F2B59F]">
                Da confermare con Maria Enrica (non esposti senza prenotazione)
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9E958C]">Politica di cancellazione</dt>
              <dd className="mt-0.5 text-[#D8D0C7]">
                {HOUSE_DATA.stayLogistics.cancellationPolicy}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#9E958C]">Supplemento cucina</dt>
              <dd className="mt-0.5 text-[#D8D0C7]">
                {HOUSE_DATA.stayLogistics.kitchenSurchargeNote}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* =====================================================================
          5. HOST & VALUTAZIONI
         ===================================================================== */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="liquid-glass rounded-3xl p-5 lg:col-span-5 sm:p-6">
          <div className="flex items-center gap-3.5">
            {!avatarFailed ? (
              <img
                src={HOUSE_DATA.host.avatarUrl}
                alt={`Host ${HOUSE_DATA.host.name}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="h-14 w-14 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="liquid-glass-subtle flex h-14 w-14 items-center justify-center rounded-full">
                <User className="h-6 w-6 text-[#B8AFA5]" />
              </div>
            )}
            <div>
              <h3 className="font-display text-xl font-semibold text-[#F5EFE6]">
                Host: {HOUSE_DATA.host.name}
              </h3>
              <p className="text-xs text-[#B8AFA5]">
                {HOUSE_DATA.host.yearsHosting} anni da host · Risposta {HOUSE_DATA.host.responseRate} (
                {HOUSE_DATA.host.responseTime})
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#D8D0C7]">
            “{HOUSE_DATA.host.bio}”
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 lg:col-span-7 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-[#E17658] text-[#E17658]" aria-hidden="true" />
              <span className="font-mono-nums text-lg font-bold text-white">
                {HOUSE_DATA.reviews.overallRating.toFixed(2).replace('.', ',')} / 5
              </span>
              <span className="text-xs text-[#B8AFA5]">
                ({HOUSE_DATA.reviews.totalCount} recensioni)
              </span>
            </div>
            <span className="text-xs font-medium text-[#88B894]">
              {HOUSE_DATA.reviews.badgeLabel}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
            {HOUSE_DATA.reviews.categories.map((cat) => (
              <div
                key={cat.label}
                className="flex items-center justify-between border-b border-white/10 pb-1.5"
              >
                <span className="text-[#B8AFA5]">{cat.label}</span>
                <span className="font-mono-nums font-semibold text-[#F5EFE6]">{cat.rating}</span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-[#B8AFA5]">
            Temi più citati:{' '}
            {HOUSE_DATA.reviews.tags
              .slice(0, 6)
              .map((t) => `${t.label} (${t.count})`)
              .join(' · ')}
            . {HOUSE_DATA.reviews.textReviewsNote}
          </p>
        </div>
      </section>
    </div>
  );
}
