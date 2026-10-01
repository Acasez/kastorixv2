type CreatureHeaderProps = {
  title: string;
};

export default function CreatureHeader({ title }: CreatureHeaderProps) {
  return (
    <h2 className="mb-[0.65rem] border-b border-[#3c3935] pb-[0.35rem] text-center text-xl font-bold leading-6 text-[#ff7043]">
      {title}
    </h2>
  );
}
