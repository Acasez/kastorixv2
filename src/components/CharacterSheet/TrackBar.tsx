// TrackBar.tsx
import type { Track } from "../../contexts/CharacterContext";
import NumberInput from "../NumberInput";

type TrackBarProps = {
  label: string;
  color: string;
  track: Track;
  onChange: (next: Track) => void;
};

export default function TrackBar({
  label,
  color,
  track,
  onChange,
}: TrackBarProps) {
  const percentage = Math.min(
    100,
    (track.current / Math.max(1, track.max)) * 100,
  );

  return (
    <div className="flex flex-col items-center gap-2 p-1">
      <div className="h-4 w-9/10 overflow-hidden rounded-full bg-gray-700 mb-1">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div>
        <span className="font-bold text-gray-200 pr-1">{label}:</span>
        <NumberInput
          value={track.current}
          min={0}
          max={track.max}
          onChange={(v) => onChange({ ...track, current: v })}
        />
        <span className="text-gray-400">/</span>
        <NumberInput
          value={track.max}
          min={1}
          max={999}
          onChange={(v) => onChange({ ...track, max: v })}
        />
      </div>
    </div>
  );
}
