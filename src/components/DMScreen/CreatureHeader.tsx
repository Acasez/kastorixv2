type CreatureHeaderProps = {
  title: string;
};

export default function CreatureHeader({ title }: CreatureHeaderProps) {
  return (
    <h2 className="text-center text-xl font-bold leading-6 text-striking">
      {title}
    </h2>
  );
}
