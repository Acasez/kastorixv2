import "../CSS/PageIntroFlair.css";
interface TitleSectionProps {
  title: string;
  subtitle: string;
  extraLine?: string;
}

export default function TitleSection({
  title,
  subtitle,
  extraLine,
}: TitleSectionProps) {
  return (
    <>
      <div className="TitleSection">
        <h1 className="TitleText text-6xl text-center ">{title} </h1>
        <h2>{subtitle} </h2>
        {extraLine && <h3>{extraLine} </h3>}
      </div>
    </>
  );
}
