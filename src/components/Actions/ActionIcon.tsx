interface ActionIconProps {
  icon: string;
}

export default function ActionIcon({ icon }: ActionIconProps) {
  return (
    <>
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="w-5 h-5 object-contain"
      />
    </>
  );
}
