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

  console.log(color);

  return (
    <div className="flex flex-col items-center gap-2 p-1">
      <div className="h-4 w-9/10 overflow-hidden rounded-full bg-bg-creature mb-1">
        <div
          className={`h-full rounded-full transition-all duration-200 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div>
        <span className="font-bold text-text-light pr-1 text-xl">{label}:</span>
        <NumberInput
          value={track.current}
          min={0}
          max={track.max}
          onChange={(v) => onChange({ ...track, current: v })}
        />
        <span className="text-text-light text-xl">/</span>
        {maxEditable ? (
          <NumberInput
            value={track.max}
            min={1}
            max={max ?? Number.MAX_SAFE_INTEGER}
            onChange={(v) => onChange({ ...track, max: v })}
          />
        ) : (
          <span className="inline-block w-16 text-center font-bold border-2 border-striking bg-white text-text-flavor">
            {track.max}
          </span>
        )}
      </div>
    </div>
  );
}
