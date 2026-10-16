// src/components/Layout/Section.tsx
import ContentRow from "./ContentRow";
import Icon from "../Content/Icon";
import ReactMarkdown from "react-markdown";

interface SectionProps {
  // Header content
  title?: string;
  subtitle?: string;
  flavorText?: string;
  icon?: string;
  iconAlt?: string;

  // Layout controls
  headerReverse?: boolean;
  contentReverse?: boolean;
  vertical?: boolean;

  // Styling
  className?: string;
  children: React.ReactNode;
}

export default function Section({
  title,
  subtitle,
  flavorText,
  icon,
  iconAlt = "",
  headerReverse = false,
  contentReverse = false,
  vertical = false,
  className = "",
  children,
}: SectionProps) {
  // Only render header if there's content for it
  const hasHeader = title || subtitle || flavorText || icon;

  return (
    <div className={`w-full ${className}`}>
      {/* Header Row */}
      {hasHeader && (
        <ContentRow reverse={headerReverse}>
          {icon && (
            <div className="shrink-0">
              <Icon imageLocation={icon} altText={iconAlt} />
            </div>
          )}
          <div className="flex-1 text-center">
            {title && (
              <h2 className="text-5xl text-orange-500 font-bold mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <h3 className="text-2xl text-orange-400 font-semibold mb-2">
                {subtitle}
              </h3>
            )}
            {flavorText && (
              <div className="text-xl text-text-flavor italic mx-auto">
                <ReactMarkdown>{flavorText}</ReactMarkdown>
              </div>
            )}
          </div>
        </ContentRow>
      )}

      {/* Content Row */}
      <ContentRow reverse={contentReverse} vertical={vertical}>
        {children}
      </ContentRow>
    </div>
  );
}
