import { ArrowUp, Info } from 'lucide-react';
import { HOUSE_DATA, type FloorId, type RoomSpace } from '../data/houseData';

interface FloorplanSVGProps {
  activeFloor: FloorId;
  selectedRoomId: string;
  selectedRoomName: string;
  onSelectFloor: (floor: FloorId) => void;
  onSelectRoom: (roomId: string) => void;
}

export function FloorplanSVG({
  activeFloor,
  selectedRoomId,
  selectedRoomName,
  onSelectFloor,
  onSelectRoom,
}: FloorplanSVGProps) {
  const floorRooms = HOUSE_DATA.rooms.filter((r) => r.floor === activeFloor);

  const handleRoomKey = (e: React.KeyboardEvent, roomId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectRoom(roomId);
    }
  };

  const renderRoomBox = (room: RoomSpace) => {
    const isSelected = room.id === selectedRoomId;
    const { x, y, w, h } = room.floorplan;
    return (
      <g
        key={room.id}
        role="button"
        tabIndex={0}
        aria-label={`Seleziona ${room.name}`}
        onClick={() => onSelectRoom(room.id)}
        onKeyDown={(e) => handleRoomKey(e, room.id)}
        className="cursor-pointer outline-none group"
      >
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={8}
          className={`transition-colors duration-150 ${
            isSelected
              ? 'fill-[#E17658]/26 stroke-[#E17658]'
              : 'fill-[#1F1C19] stroke-[#4A423A] group-hover:fill-[#E17658]/14 group-hover:stroke-[#E17658]'
          }`}
          strokeWidth={isSelected ? 3 : 1.6}
        />
      </g>
    );
  };

  return (
    <div className="liquid-glass flex flex-col rounded-3xl p-4 sm:p-6">
      {/* Header + 3 Liquid Glass Floor Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Scegli il piano della planimetria"
          className="liquid-glass-subtle grid w-full grid-cols-3 gap-1.5 rounded-full p-1 sm:w-auto"
        >
          {HOUSE_DATA.floors.map((floor) => {
            const active = floor.id === activeFloor;
            return (
              <button
                key={floor.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectFloor(floor.id)}
                className={`min-h-[40px] rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'liquid-glass-accent text-white'
                    : 'text-[#B8AFA5] hover:text-white'
                }`}
              >
                {floor.shortLabel}
              </button>
            );
          })}
        </div>

        <a
          href="#foto"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F2B59F] hover:text-white"
        >
          <span>Attiva: {selectedRoomName} · Vedi foto</span>
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Dark Blueprint SVG */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#12100E]">
        <svg
          viewBox="0 0 600 400"
          className="h-auto w-full select-none"
          role="img"
          aria-label={`Planimetria 2D: ${
            HOUSE_DATA.floors.find((f) => f.id === activeFloor)?.label ?? ''
          }`}
        >
          <defs>
            <pattern id="fp-grid-dark" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#26221E"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="600" height="400" fill="url(#fp-grid-dark)" />

          {activeFloor !== 'esterni' && (
            <rect
              x="28"
              y="28"
              width="544"
              height="344"
              rx="10"
              fill="none"
              stroke="#5A5046"
              strokeWidth="3.5"
            />
          )}

          {floorRooms.map(renderRoomBox)}

          {/* PIANO TERRA */}
          {activeFloor === 'terra' && (
            <g className="pointer-events-none">
              <rect x="52" y="52" width="145" height="24" rx="3" fill="#494037" />
              <circle cx="88" cy="64" r="5" fill="#8B7D6E" />
              <circle cx="104" cy="64" r="5" fill="#8B7D6E" />
              <rect x="206" y="52" width="26" height="32" rx="3" fill="#4E5A5A" />
              <text x="142" y="122" textAnchor="middle" fill="#F5EFE6" className="text-[14px] font-semibold">
                Cucina
              </text>
              <text x="142" y="140" textAnchor="middle" fill="#E17658" className="text-[11px] font-medium">
                (sovrapprezzo/gg)
              </text>

              <rect x="295" y="84" width="130" height="44" rx="5" fill="#8B6844" />
              {[308, 338, 368, 398].map((cx) => (
                <g key={cx}>
                  <rect x={cx} y="72" width="16" height="8" rx="2" fill="#6F5336" />
                  <rect x={cx} y="132" width="16" height="8" rx="2" fill="#6F5336" />
                </g>
              ))}
              <text x="360" y="164" textAnchor="middle" fill="#F5EFE6" className="text-[14px] font-semibold">
                Sala Pranzo
              </text>

              <rect x="492" y="54" width="48" height="22" rx="4" fill="#4B6363" />
              <ellipse cx="516" cy="110" rx="11" ry="14" fill="#5E7676" />
              <text x="517" y="156" textAnchor="middle" fill="#F5EFE6" className="text-[12px] font-semibold">
                Bagno P.T.
              </text>

              <rect x="64" y="218" width="105" height="58" rx="5" fill="#2E6B47" stroke="#6E492D" strokeWidth="3" />
              <rect x="200" y="216" width="120" height="64" rx="3" fill="#2A5C78" stroke="#D8D0C7" strokeWidth="2" />
              <line x1="260" y1="216" x2="260" y2="280" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
              <rect x="350" y="224" width="88" height="48" rx="3" fill="#B84A2E" stroke="#5C3A21" strokeWidth="2.5" />
              <text x="252" y="316" textAnchor="middle" fill="#F5EFE6" className="text-[15px] font-semibold">
                Sala Giochi
              </text>
              <text x="252" y="335" textAnchor="middle" fill="#B8AFA5" className="text-[11px]">
                Biliardo · Ping Pong · Calcetto
              </text>

              <rect x="475" y="195" width="85" height="165" rx="6" fill="#28231E" stroke="#595047" strokeWidth="1.5" />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <line key={i} x1="483" y1={215 + i * 16} x2="552" y2={215 + i * 16} stroke="#8F8274" strokeWidth="1.5" />
              ))}
              <text x="517" y="344" textAnchor="middle" fill="#B8AFA5" className="text-[11px] font-medium">
                Scale ↑
              </text>

              <text x="252" y="389" textAnchor="middle" fill="#7DB28B" className="text-[12px] font-semibold">
                ▲ Ingresso Ospiti dal Prato (piano intermedio riservato all’host)
              </text>
            </g>
          )}

          {/* MANSARDA */}
          {activeFloor === 'mansarda' && (
            <g className="pointer-events-none">
              <rect x="54" y="54" width="66" height="54" rx="4" fill="#8A6542" />
              <line x1="132" y1="50" x2="132" y2="128" stroke="#8E7B68" strokeWidth="3" strokeDasharray="5 3" />
              {[148, 195, 242, 289].map((bx) => (
                <rect key={bx} x={bx} y="54" width="38" height="58" rx="3" fill="#B57B52" stroke="#5E3C23" strokeWidth="1.5" />
              ))}
              <rect x="58" y="140" width="70" height="26" rx="3" fill="#7A6550" />
              <rect x="160" y="140" width="76" height="26" rx="4" fill="#5D6F56" />
              <text x="190" y="195" textAnchor="middle" fill="#F5EFE6" className="text-[14px] font-semibold">
                Camerata (10 posti + culla)
              </text>
              <text x="190" y="213" textAnchor="middle" fill="#B8AFA5" className="text-[11px]">
                1 matrimoniale con separè + 4 castelli
              </text>

              <rect x="372" y="56" width="74" height="56" rx="4" fill="#8A6542" />
              <rect x="488" y="56" width="52" height="56" rx="3" fill="#B57B52" stroke="#5E3C23" strokeWidth="1.5" />
              <text x="455" y="150" textAnchor="middle" fill="#F5EFE6" className="text-[13px] font-semibold">
                Camera 2 (4 posti)
              </text>
              <text x="455" y="168" textAnchor="middle" fill="#B8AFA5" className="text-[11px]">
                1 matrimoniale + 1 castello
              </text>

              <rect x="372" y="222" width="74" height="56" rx="4" fill="#8A6542" />
              <rect x="492" y="222" width="44" height="56" rx="3" fill="#A67D58" />
              <text x="455" y="316" textAnchor="middle" fill="#F5EFE6" className="text-[13px] font-semibold">
                Camera 3 (3 posti)
              </text>
              <text x="455" y="334" textAnchor="middle" fill="#B8AFA5" className="text-[11px]">
                1 matrimoniale + 1 singolo
              </text>

              <rect x="235" y="250" width="88" height="34" rx="6" fill="#4B6363" />
              <text x="280" y="322" textAnchor="middle" fill="#F5EFE6" className="text-[13px] font-semibold">
                Bagno Camere
              </text>

              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="56" y1={254 + i * 13} x2="112" y2={254 + i * 13} stroke="#8F8274" strokeWidth="1.5" />
              ))}
              <text x="125" y="322" textAnchor="middle" fill="#F5EFE6" className="text-[13px] font-semibold">
                Anticamera
              </text>
            </g>
          )}

          {/* ESTERNI */}
          {activeFloor === 'esterni' && (
            <g className="pointer-events-none">
              <rect x="36" y="36" width="528" height="328" rx="8" fill="#1E2820" />
              <rect x="175" y="70" width="250" height="120" rx="6" fill="#322B24" stroke="#9C6644" strokeWidth="2.5" />
              <text x="300" y="126" textAnchor="middle" fill="#F5EFE6" className="text-[15px] font-semibold">
                Casa Colonica (3 piani)
              </text>
              <text x="300" y="146" textAnchor="middle" fill="#B8AFA5" className="text-[11px]">
                P. Terra + Mansarda ospiti
              </text>

              <rect x="55" y="235" width="165" height="95" rx="6" fill="#6F563D" stroke="#9A7B5A" strokeWidth="2" />
              <text x="137" y="278" textAnchor="middle" fill="#F5EFE6" className="text-[13px] font-semibold">
                Cascina coperta
              </text>
              <text x="137" y="296" textAnchor="middle" fill="#DFD5C8" className="text-[11px]">
                Tavoli per 40 persone
              </text>

              <circle cx="290" cy="275" r="24" fill="#B84A2E" />
              <text x="290" y="279" textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-semibold">
                BBQ
              </text>
              <text x="290" y="320" textAnchor="middle" fill="#F5EFE6" className="text-[11px] font-medium">
                Prato & Giochi
              </text>

              <rect x="395" y="235" width="145" height="95" rx="6" fill="#2B2825" stroke="#6B645D" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="467" y="280" textAnchor="middle" fill="#F5EFE6" className="text-[13px] font-semibold">
                Parcheggio
              </text>
              <text x="467" y="298" textAnchor="middle" fill="#B8AFA5" className="text-[11px]">
                Gratuito in loco
              </text>

              <text x="300" y="54" textAnchor="middle" fill="#88B894" className="text-[11px] font-semibold">
                ↑ Panorama colline, boschi e vigneti dell’Oltrepò
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 flex items-start gap-2 text-[11px] leading-snug text-[#B8AFA5]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E17658]" aria-hidden="true" />
        <p>{HOUSE_DATA.meta.floorplanDisclaimer}</p>
      </div>
    </div>
  );
}
