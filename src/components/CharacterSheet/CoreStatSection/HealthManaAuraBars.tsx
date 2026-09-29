type ResourceTrack = {
  current: number;
  max: number;
};

type ResourceKey = "health" | "aura" | "mana";

type HealthManaAuraBarsProps = {
  tracks: Record<ResourceKey, ResourceTrack>;
  maxValues?: Partial<Record<ResourceKey, number>>;
  onTrackChange: (key: ResourceKey, track: ResourceTrack) => void;
};

import TrackBar from "../../TrackBar";

export default function HealthManaAuraBars({
  tracks,
  maxValues,
  onTrackChange,
}: HealthManaAuraBarsProps) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-3">
      <TrackBar
        label="Health"
        color="#ef4444"
        track={tracks.health}
        max={maxValues?.health}
        onChange={(health) => onTrackChange("health", health)}
      />
      <TrackBar
        label="Aura"
        color="#38bdf8"
        track={tracks.aura}
        max={maxValues?.aura}
        onChange={(aura) => onTrackChange("aura", aura)}
      />
      <TrackBar
        label="Mana"
        color="#a855f7"
        track={tracks.mana}
        max={maxValues?.mana}
        onChange={(mana) => onTrackChange("mana", mana)}
      />
    </div>
  );
}
