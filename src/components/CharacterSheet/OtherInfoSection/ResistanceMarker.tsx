interface ResistanceMarkerProps {
  damageType: string;
  value: number;
}

export default function ResistanceMarker({
  damageType,
  value,
}: ResistanceMarkerProps) {
  return (
    <div className="border border-dashed rounded-md border-bg-quartz px-1">
      <h2 key={damageType} className=" text-text-light text">
        {damageType}: {value}
      </h2>
    </div>
  );
}
