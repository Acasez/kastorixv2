import ReactMarkdown, { type Components } from "react-markdown";
import { NavLink } from "react-router-dom";
import tooltips from "../../data/tooltips";
import TraitTooltip from "./TraitTooltip";
import React, { type JSX } from "react";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wrap each trait's FIRST occurrence in %%Name%% markers. Pure function. */
function markFirstOccurrences(markdown: string): string {
  let result = markdown;
  const names = tooltips.map((t) => t.name).sort((a, b) => b.length - a.length);
  for (const name of names) {
    // replace only the first occurrence of this trait
    result = result.replace(new RegExp(escapeRegExp(name)), `%%${name}%%`);
  }
  return result;
}

/** Split a text node on %%Trait%% markers and swap in tooltips. */
function renderText(text: string): (string | JSX.Element)[] {
  return text.split(/%%(.+?)%%/g).map((part, i) =>
    i % 2 === 1 ? (
      <TraitTooltip
        key={`${part}-${i}`}
        tooltip={tooltips.find((t) => t.name === part)!}
      >
        {part}
      </TraitTooltip>
    ) : (
      part
    ),
  );
}

function transformChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") return renderText(child);
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.props.children
    ) {
      return React.cloneElement(
        child,
        undefined,
        transformChildren(child.props.children),
      );
    }
    return child;
  });
}

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
  const marked = markFirstOccurrences(description);

  const components: Components = {
    p: ({ children }) => <p>{transformChildren(children)}</p>,
    li: ({ children }) => <li>{transformChildren(children)}</li>,
  };

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
        <ReactMarkdown components={components}>{marked}</ReactMarkdown>
      </div>
    </div>
  );
}
