import { NavLink } from "react-router-dom";
import "../CSS/RowStructure.css";

interface TextSectionProps {
  name?: string;
  projectPageLink?: string;
  description: string;
  cursive?: boolean;
}

export default function TextSection({
  name,
  projectPageLink,
  description,
  cursive,
}: TextSectionProps) {
  return (
    <>
      <div className="portfolio-text">
        {projectPageLink ? (
          <NavLink className="text-2xl text-orange-500" to={projectPageLink}>
            {name}
          </NavLink>
        ) : (
          <h1 className="text-5xl text-orange-500 text-center font-bold">
            {name}
          </h1>
        )}

        <p className={`text-center text-xl mt-2 ${cursive ? "italic" : ""}`}>
          {description}
        </p>
      </div>
    </>
  );
}
