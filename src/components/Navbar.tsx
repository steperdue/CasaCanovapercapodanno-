import { Camera, ExternalLink, Info, Map as MapIcon } from 'lucide-react';
import { HOUSE_DATA } from '../data/houseData';

export function Navbar() {
  return (
    <>
      {/* Top Glass Header (3-zone contract: wordmark · 3 links · 1 Airbnb action) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0A09]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-13 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <a
            href="#top"
            className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#F5EFE6] whitespace-nowrap shrink-0"
          >
            Capodanno a Cà Nova
          </a>

          <nav
            aria-label="Navigazione principale"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#B8AFA5]"
          >
            <a
              href="#foto"
              className="hover:text-[#F5EFE6] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Foto stanze
            </a>
            <a
              href="#planimetria"
              className="hover:text-[#F5EFE6] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Planimetria 2D
            </a>
            <a
              href="#info"
              className="hover:text-[#F5EFE6] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Info casa
            </a>
          </nav>

          <a
            href={HOUSE_DATA.meta.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-btn inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#F5EFE6] transition-all whitespace-nowrap shrink-0"
          >
            <span>Airbnb</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#E17658]" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* Mobile Floating Liquid Glass Bottom Dock (3 destinations: Foto · Planimetria · Info) */}
      <nav
        aria-label="Menu mobile"
        className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 md:hidden"
      >
        <div className="liquid-glass grid h-14 grid-cols-3 items-center rounded-full px-2">
          <a
            href="#foto"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium text-[#F5EFE6] transition-colors hover:bg-white/10"
          >
            <Camera className="h-4 w-4 text-[#E17658]" aria-hidden="true" />
            <span>Foto</span>
          </a>

          <a
            href="#planimetria"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium text-[#D6CEC4] transition-colors hover:bg-white/10"
          >
            <MapIcon className="h-4 w-4" aria-hidden="true" />
            <span>Planimetria</span>
          </a>

          <a
            href="#info"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium text-[#D6CEC4] transition-colors hover:bg-white/10"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
            <span>Info casa</span>
          </a>
        </div>
      </nav>
    </>
  );
}
