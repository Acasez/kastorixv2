// TrackBar.tsx
import NumberInput from "./NumberInput";

type Track = {
  current: number;
  max: number;
};

type TrackBarProps = {
  label: string;
  color: string;
  track: Track;
  max?: number;
  maxEditable?: boolean;
  onChange: (next: Track) => void;
};

export default function TrackBar({
  label,
  color,
  track,
  max,
  maxEditable = true,
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
        <span className="font-bold text-gray-200 pr-1 text-xl">{label}:</span>
        <NumberInput
          value={track.current}
          min={0}
          max={track.max}
          onChange={(v) => onChange({ ...track, current: v })}
        />
        <span className="text-gray-400">/</span>
        {maxEditable ? (
          <NumberInput
            value={track.max}
            min={1}
            max={max ?? Number.MAX_SAFE_INTEGER}
            onChange={(v) => onChange({ ...track, max: v })}
          />
        ) : (
          <span className="inline-block w-16 text-center font-bold border-2 border-orange-300 bg-white text-text-flavor">
            {track.max}
          </span>
        )}
      </div>
    </div>
  );
}
