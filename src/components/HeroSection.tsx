import { useState } from 'react';
import { Home } from 'lucide-react';
import { HOUSE_DATA } from '../data/houseData';

export function HeroSection() {
  const [imgError, setImgError] = useState(false);
  const heroPhoto = HOUSE_DATA.photos[0];

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#161310]">
      {!imgError && heroPhoto ? (
        <img
          src={heroPhoto.url}
          alt={heroPhoto.caption}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-70"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 flex items-center justify-center bg-gradient-to-br from-[#2B221B] via-[#171310] to-[#0B0A09]"
        >
          <Home className="h-16 w-16 text-white/15" />
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/60 to-black/35"
      />

      <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-11">
        <p className="text-xs font-medium text-[#F2D5C4]">
          {HOUSE_DATA.meta.locationShort} <span aria-hidden="true">·</span> ★{' '}
          {HOUSE_DATA.reviews.overallRating.toFixed(2).replace('.', ',')} ({HOUSE_DATA.reviews.totalCount} recensioni)
        </p>

        <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {HOUSE_DATA.meta.heroTitle}
        </h1>

        <div className="liquid-glass-subtle mt-4 inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl px-4 py-2 text-xs sm:text-sm text-[#F5EFE6]">
          <span>
            <strong className="font-mono-nums font-semibold text-white">16+</strong> ospiti
          </span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span>
            <strong className="font-mono-nums font-semibold text-white">{HOUSE_DATA.overview.bedrooms}</strong> camere
          </span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span>
            <strong className="font-mono-nums font-semibold text-white">{HOUSE_DATA.overview.beds}</strong> letti
          </span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span>
            <strong className="font-mono-nums font-semibold text-white">{HOUSE_DATA.overview.bathroomsShared}</strong> bagni ospiti
          </span>
        </div>
      </div>
    </section>
  );
}
