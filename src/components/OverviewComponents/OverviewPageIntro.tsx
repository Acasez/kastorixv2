import "../../CSS/PageintroFlair.css";
interface OverviewPageIntroProps {
  title: string;
  subtitle: string;
  extraLine?: string;
}

export default function OverviewPageIntro({
  title,
  subtitle,
  extraLine,
}: OverviewPageIntroProps) {
  return (
    <>
      <div className="TitleSection">
        <h1 className="TitleText text-6xl text-center ">{title} </h1>
        <h2 className="text-xl">{subtitle} </h2>
        {extraLine && <h3>{extraLine} </h3>}
      </div>
    </>
  );
}
