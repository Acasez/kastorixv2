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
          <NavLink className="portfolio-title" to={projectPageLink}>
            {name}
          </NavLink>
        ) : (
          <h1 className="portfolio-title">{name}</h1>
        )}

        <p className={`rules-item ${cursive ? "cursive" : ""}`}>
          {description}
        </p>
      </div>
    </>
  );
}
