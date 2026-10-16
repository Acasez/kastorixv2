import ReactMarkdown from "react-markdown";
import { NavLink } from "react-router-dom";

interface MarkdownSectionProps {
  name?: string;
  projectPageLink?: string;
  description: string;
  cursive?: boolean;
}

export default function MarkdownSection({
  name,
  projectPageLink,
  description,
  cursive,
}: MarkdownSectionProps) {
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
      <div
        className={`text-center text-xl m-2 text-text-flavor ${cursive ? "italic text-text" : ""}`}
      >
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </div>
  );
}
