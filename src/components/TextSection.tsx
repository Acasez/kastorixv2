import ReactMarkdown from "react-markdown";
import { NavLink } from "react-router-dom";

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
    <div className="portfolio-text">
      {projectPageLink ? (
        <NavLink className="text-2xl text-header" to={projectPageLink}>
          {name}
        </NavLink>
      ) : (
        <h1 className="text-5xl text-orange-500 text-center font-bold">
          {name}
        </h1>
      )}
      <p
        className={`text-center text-xl m-2 text-text-flavor ${cursive ? "italic text-text" : ""}`}
      >
        <ReactMarkdown>{description}</ReactMarkdown>
      </p>
    </div>
  );
}
