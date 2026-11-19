import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { PhotoAsset } from '../data/houseData';

interface PhotoLightboxProps {
  photo: PhotoAsset | undefined;
  roomTitle: string;
  photoIdxInRoom: number;
  roomPhotosCount: number;
  globalPhotoNumber: number;
  totalPhotosCount: number;
  onClose: () => void;
  onPrevPhoto: () => void;
  onNextPhoto: () => void;
}

export function PhotoLightbox({
  photo,
  roomTitle,
  photoIdxInRoom,
  roomPhotosCount,
  globalPhotoNumber,
  totalPhotosCount,
  onClose,
  onPrevPhoto,
  onNextPhoto,
}: PhotoLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsZoomed(false);
    setImgFailed(false);
  }, [photo?.id]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNextPhoto();
      if (e.key === 'ArrowLeft') onPrevPhoto();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, onNextPhoto, onPrevPhoto]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galleria ingrandita: ${roomTitle}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white backdrop-blur-2xl"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (delta > 45) onPrevPhoto();
        else if (delta < -45) onNextPhoto();
        touchStartX.current = null;
      }}
    >
      {/* Top glass bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{roomTitle}</p>
          <p className="font-mono-nums text-xs text-white/70">
            Stanza {photoIdxInRoom + 1}/{roomPhotosCount} · Totale {globalPhotoNumber}/{totalPhotosCount}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsZoomed((z) => !z)}
            aria-label={isZoomed ? 'Riduci zoom' : 'Ingrandisci foto'}
            className="liquid-glass-btn inline-flex min-h-[42px] min-w-[42px] items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium text-white"
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            <span className="hidden sm:inline">{isZoomed ? 'Adatta' : 'Zoom 2x'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi schermo intero"
            className="liquid-glass-btn inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main image stage */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto p-4 sm:p-8">
        <button
          type="button"
          onClick={onPrevPhoto}
          aria-label="Foto precedente"
          className="liquid-glass-btn absolute left-3 top-1/2 z-10 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {!imgFailed ? (
          <img
            src={photo.url}
            alt={photo.caption}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            onClick={() => setIsZoomed((z) => !z)}
            className={`max-h-full max-w-full rounded-xl object-contain transition-transform duration-200 cursor-zoom-in ${
              isZoomed ? 'scale-150 sm:scale-175 cursor-zoom-out' : 'scale-100'
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-12 text-center">
            <ImageOff className="h-10 w-10 text-white/50" />
            <p className="text-sm text-white/80">Impossibile caricare questa foto</p>
            <p className="text-xs text-white/60">{photo.caption}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onNextPhoto}
          aria-label="Foto successiva"
          className="liquid-glass-btn absolute right-3 top-1/2 z-10 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Caption footer */}
      <div className="border-t border-white/10 bg-white/[0.03] px-4 py-3 text-center sm:px-6">
        <p className="text-sm text-[#EDE6DD]">{photo.caption}</p>
        {!photo.isOriginalCaption && (
          <p className="mt-0.5 text-xs text-white/55">
            Nota: foto senza didascalia testuale nell’annuncio, associata tramite classificazione stanza Airbnb.
          </p>
        )}
      </div>
    </div>
  );
}
