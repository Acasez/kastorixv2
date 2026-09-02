import { NavLink } from "react-router-dom";
import "../CSS/RowStructure.css";

interface TextSectionProps {
  name?: string;
  projectPageLink?: string;
  description: string;
}

export default function TextImageSection({
  name,
  projectPageLink,
  description,
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
        <p className="portfolio-description">{description}</p>
      </div>
    </>
  );
}
