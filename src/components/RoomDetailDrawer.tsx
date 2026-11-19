import { useRef, useState } from 'react';
import {
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Maximize2,
} from 'lucide-react';
import type { PhotoAsset, RoomSpace } from '../data/houseData';

interface RoomDetailDrawerProps {
  rooms: RoomSpace[];
  room: RoomSpace;
  nextRoomName: string;
  photos: PhotoAsset[];
  photoIdx: number;
  totalPhotosCount: number;
  globalPhotoNumber: number;
  onSelectRoom: (roomId: string) => void;
  onSelectPhotoIdx: (idx: number) => void;
  onPrevPhoto: () => void;
  onNextPhoto: () => void;
  onPrevRoom: () => void;
  onNextRoom: () => void;
  onOpenLightbox: () => void;
}

export function RoomDetailDrawer({
  rooms,
  room,
  nextRoomName,
  photos,
  photoIdx,
  totalPhotosCount,
  globalPhotoNumber,
  onSelectRoom,
  onSelectPhotoIdx,
  onPrevPhoto,
  onNextPhoto,
  onPrevRoom,
  onNextRoom,
  onOpenLightbox,
}: RoomDetailDrawerProps) {
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const activePhoto = photos[photoIdx] ?? photos[0];
  const isLastInRoom = photoIdx === photos.length - 1;
  const totalSleeps = room.beds.reduce((sum, b) => sum + b.sleeps, 0);

  return (
    <div className="space-y-4">
      {/* Category Selector Tabs in Liquid Glass */}
      <div
        role="tablist"
        aria-label="Categorie stanze e foto"
        className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1"
      >
        {rooms.map((r) => {
          const active = r.id === room.id;
          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectRoom(r.id)}
              className={`min-h-[40px] rounded-full px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                active
                  ? 'liquid-glass-accent text-white'
                  : 'liquid-glass-btn text-[#E6DDD3]'
              }`}
            >
              {r.shortName}
            </button>
          );
        })}
      </div>

      {/* Main Liquid Glass Photo & Room Card */}
      <article
        aria-label={`Galleria e dettagli: ${room.name}`}
        className="liquid-glass overflow-hidden rounded-3xl"
      >
        {/* Top Room Header + Category Jump Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#E17658]">
              {room.floorLabel} <span aria-hidden="true">·</span> Categoria {room.tourOrder}/{rooms.length}
            </p>
            <h3 className="truncate font-display text-xl font-semibold text-white sm:text-2xl">
              {room.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onPrevRoom}
              aria-label="Categoria precedente"
              className="liquid-glass-btn inline-flex min-h-[38px] items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-white"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Stanza prec.</span>
            </button>
            <button
              type="button"
              onClick={onNextRoom}
              aria-label="Categoria successiva"
              className="liquid-glass-accent inline-flex min-h-[38px] items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              <span className="hidden sm:inline">Stanza succ.</span>
              <span className="sm:hidden">Prossima</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left/Top: Photo Stage with Swipe + Continuous Auto-Advance */}
          <div className="p-4 sm:p-6 lg:col-span-7">
            <div
              className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15 bg-black/50"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
                if (delta > 40) onPrevPhoto();
                else if (delta < -40) onNextPhoto();
                touchStartX.current = null;
              }}
            >
              {activePhoto && !failedUrls[activePhoto.url] ? (
                <img
                  key={activePhoto.id}
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedUrls((prev) => ({
                      ...prev,
                      [activePhoto.url]: true,
                    }))
                  }
                  onClick={onOpenLightbox}
                  className="h-full w-full cursor-zoom-in object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-4 text-center text-[#B8AFA5]">
                  <ImageOff className="h-8 w-8 opacity-60" />
                  <p className="text-xs font-medium">{room.name}</p>
                </div>
              )}

              {/* Bottom caption scrim */}
              {activePhoto && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-3.5 pt-10">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white">
                        {activePhoto.caption}
                      </p>
                      {isLastInRoom && (
                        <p className="mt-0.5 text-[11px] text-[#F2B59F]">
                          Ultima foto di questa stanza · Scorri avanti per passare a {nextRoomName}
                        </p>
                      )}
                    </div>
                    <span className="font-mono-nums shrink-0 text-xs font-semibold text-white/90">
                      {photoIdx + 1}/{photos.length}
                    </span>
                  </div>
                </div>
              )}

              {/* Liquid Glass Prev / Next Photo Arrows (always active: auto-switch category at ends!) */}
              <button
                type="button"
                onClick={onPrevPhoto}
                aria-label="Foto precedente (passa alla stanza precedente alla prima foto)"
                className="liquid-glass-btn absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onNextPhoto}
                aria-label="Foto successiva (passa alla stanza successiva all'ultima foto)"
                className="liquid-glass-btn absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Top-left global counter + Top-right fullscreen button */}
              <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono-nums text-[11px] font-medium text-white/90 backdrop-blur-md">
                {globalPhotoNumber} / {totalPhotosCount} foto totali
              </div>

              <button
                type="button"
                onClick={onOpenLightbox}
                aria-label="Apri foto a schermo intero"
                className="liquid-glass-btn absolute right-3 top-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
              >
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Zoom</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                {photos.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPhotoIdx(idx)}
                    aria-label={`Foto ${idx + 1}: ${p.caption}`}
                    className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      idx === photoIdx
                        ? 'border-[#E17658] opacity-100'
                        : 'border-white/10 opacity-55 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={p.url}
                      alt={p.caption}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right/Bottom: Room Description, Beds & Amenities */}
          <div className="flex flex-col justify-between space-y-4 border-t border-white/10 p-4 sm:p-6 lg:col-span-5 lg:border-l lg:border-t-0">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-[#D8D0C7]">{room.description}</p>

              {room.isBedroom && room.beds.length > 0 && (
                <div className="liquid-glass-subtle rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <BedDouble className="h-4 w-4 text-[#E17658]" aria-hidden="true" />
                      <span>Posti letto</span>
                    </div>
                    <span className="font-mono-nums text-xs font-semibold text-[#F2B59F]">
                      {totalSleeps} posti
                    </span>
                  </div>

                  <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-[#DED6CD]">
                    {room.beds.map((bed) => (
                      <li key={bed.type} className="flex items-start justify-between gap-3">
                        <span>
                          {bed.type}
                          {bed.note ? (
                            <span className="block text-[11px] text-[#9E958C]">{bed.note}</span>
                          ) : null}
                        </span>
                        <span className="font-mono-nums shrink-0 font-semibold text-white">
                          ×{bed.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {room.amenities.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#9E958C]">
                    Dotazioni in questo spazio
                  </h4>
                  <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                    {room.amenities.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs leading-snug text-[#D8D0C7]"
                      >
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7DB28B]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[#B8AFA5]">
              <span>Prossima stanza:</span>
              <button
                type="button"
                onClick={onNextRoom}
                className="inline-flex items-center gap-1 font-semibold text-[#F2B59F] hover:text-white"
              >
                <span>{nextRoomName}</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
