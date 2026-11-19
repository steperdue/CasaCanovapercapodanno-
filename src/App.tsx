import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { FloorplanSVG } from './components/FloorplanSVG';
import { HeroSection } from './components/HeroSection';
import { InfoSections } from './components/InfoSections';
import { Navbar } from './components/Navbar';
import { PhotoLightbox } from './components/PhotoLightbox';
import { RoomDetailDrawer } from './components/RoomDetailDrawer';
import { HOUSE_DATA, type FloorId } from './data/houseData';

export default function App() {
  const [activeFloor, setActiveFloor] = useState<FloorId>('esterni');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('esterni');
  const [photoIdx, setPhotoIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Sequenza logica delle stanze/categorie (1..10)
  const tourRooms = useMemo(
    () => [...HOUSE_DATA.rooms].sort((a, b) => a.tourOrder - b.tourOrder),
    []
  );

  const selectedRoomIdx = useMemo(() => {
    const idx = tourRooms.findIndex((r) => r.id === selectedRoomId);
    return idx >= 0 ? idx : 0;
  }, [tourRooms, selectedRoomId]);

  const selectedRoom = tourRooms[selectedRoomIdx];
  const nextRoom = tourRooms[(selectedRoomIdx + 1) % tourRooms.length];

  const selectedRoomPhotos = useMemo(
    () =>
      selectedRoom.photoIds
        .map((id) => HOUSE_DATA.photos.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [selectedRoom]
  );

  const totalPhotosCount = useMemo(
    () => tourRooms.reduce((sum, r) => sum + r.photoIds.length, 0),
    [tourRooms]
  );

  const globalPhotoNumber = useMemo(() => {
    let before = 0;
    for (let i = 0; i < selectedRoomIdx; i++) {
      before += tourRooms[i].photoIds.length;
    }
    return before + photoIdx + 1;
  }, [tourRooms, selectedRoomIdx, photoIdx]);

  const handleSelectRoom = (roomId: string) => {
    const room = tourRooms.find((r) => r.id === roomId);
    if (!room) return;
    setSelectedRoomId(room.id);
    setActiveFloor(room.floor);
    setPhotoIdx(0);
  };

  const handleSelectFloor = (floor: FloorId) => {
    setActiveFloor(floor);
    if (selectedRoom.floor !== floor) {
      const firstOnFloor = tourRooms.find((r) => r.floor === floor);
      if (firstOnFloor) {
        setSelectedRoomId(firstOnFloor.id);
        setPhotoIdx(0);
      }
    }
  };

  const handleStepRoom = (direction: 1 | -1) => {
    const nextIdx = (selectedRoomIdx + direction + tourRooms.length) % tourRooms.length;
    const targetRoom = tourRooms[nextIdx];
    setSelectedRoomId(targetRoom.id);
    setActiveFloor(targetRoom.floor);
    setPhotoIdx(0);
  };

  const handleNextPhoto = () => {
    if (photoIdx < selectedRoomPhotos.length - 1) {
      setPhotoIdx((prev) => prev + 1);
      return;
    }
    const nextIdx = (selectedRoomIdx + 1) % tourRooms.length;
    const targetRoom = tourRooms[nextIdx];
    setSelectedRoomId(targetRoom.id);
    setActiveFloor(targetRoom.floor);
    setPhotoIdx(0);
  };

  const handlePrevPhoto = () => {
    if (photoIdx > 0) {
      setPhotoIdx((prev) => prev - 1);
      return;
    }
    const prevIdx = (selectedRoomIdx - 1 + tourRooms.length) % tourRooms.length;
    const targetRoom = tourRooms[prevIdx];
    setSelectedRoomId(targetRoom.id);
    setActiveFloor(targetRoom.floor);
    setPhotoIdx(Math.max(0, targetRoom.photoIds.length - 1));
  };

  const activePhoto = selectedRoomPhotos[photoIdx] ?? selectedRoomPhotos[0];

  return (
    <div className="min-h-screen text-[#F5EFE6]">
      <Navbar />

      <HeroSection />

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-16">
        {/* ===================================================================
            SEZIONE 1 (PRINCIPALE): GALLERIA FOTO PER STANZA CON PASSAGGIO AUTOMATICO
           =================================================================== */}
        <section id="foto" className="scroll-mt-16 space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-[#F5EFE6] sm:text-2xl">
              Esplora le foto per stanza
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#B8AFA5]">
              Scegli una categoria o scorri le foto: al termine di ogni stanza si passa automaticamente alla successiva.
            </p>
          </div>

          <RoomDetailDrawer
            rooms={tourRooms}
            room={selectedRoom}
            nextRoomName={nextRoom.shortName}
            photos={selectedRoomPhotos}
            photoIdx={photoIdx}
            totalPhotosCount={totalPhotosCount}
            globalPhotoNumber={globalPhotoNumber}
            onSelectRoom={handleSelectRoom}
            onSelectPhotoIdx={setPhotoIdx}
            onPrevPhoto={handlePrevPhoto}
            onNextPhoto={handleNextPhoto}
            onPrevRoom={() => handleStepRoom(-1)}
            onNextRoom={() => handleStepRoom(1)}
            onOpenLightbox={() => setLightboxOpen(true)}
          />
        </section>

        {/* ===================================================================
            SEZIONE 2: PLANIMETRIA 2D INTERATTIVA
           =================================================================== */}
        <section id="planimetria" className="scroll-mt-16 space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-[#F5EFE6] sm:text-2xl">
              Planimetria 2D della casa
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#B8AFA5]">
              Tocca qualsiasi stanza sulla mappa per aggiornare la galleria sopra e consultare letti e dotazioni.
            </p>
          </div>

          <FloorplanSVG
            activeFloor={activeFloor}
            selectedRoomId={selectedRoom.id}
            selectedRoomName={selectedRoom.shortName}
            onSelectFloor={handleSelectFloor}
            onSelectRoom={handleSelectRoom}
          />
        </section>

        {/* ===================================================================
            SEZIONE 3: INFORMAZIONI SU CASA, POSIZIONE E HOST
           =================================================================== */}
        <InfoSections />
      </main>

      <footer className="border-t border-white/10 bg-black/40 pb-24 pt-6 text-xs text-[#9E958C] backdrop-blur-xl md:pb-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <p>
            Fonte dati: Airbnb #{HOUSE_DATA.meta.listingId} · CIN {HOUSE_DATA.meta.cin}
          </p>
          <a
            href={HOUSE_DATA.meta.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium text-[#F5EFE6]"
          >
            <span>Vedi annuncio su Airbnb</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#E17658]" aria-hidden="true" />
          </a>
        </div>
      </footer>

      {lightboxOpen && (
        <PhotoLightbox
          photo={activePhoto}
          roomTitle={selectedRoom.name}
          photoIdxInRoom={photoIdx}
          roomPhotosCount={selectedRoomPhotos.length}
          globalPhotoNumber={globalPhotoNumber}
          totalPhotosCount={totalPhotosCount}
          onClose={() => setLightboxOpen(false)}
          onPrevPhoto={handlePrevPhoto}
          onNextPhoto={handleNextPhoto}
        />
      )}
    </div>
  );
}
