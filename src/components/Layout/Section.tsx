// src/components/Layout/Section.tsx
import RowFrame from "./ContentRow";
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
  headerReverse?: boolean; // Icon on right side of header
  contentReverse?: boolean; // Children reversed
  vertical?: boolean; // Stack children vertically

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
  return (
    <div className={`section ${className}`}>
      {/* Header Row - only rendered if any header content exists */}
      {(title || subtitle || flavorText || icon) && (
        <RowFrame reverse={headerReverse}>
          {icon && <Icon imageLocation={icon} altText={iconAlt} />}
          <div className="">
            {title && (
              <h2 className="text-5xl text-orange-500 text-center font-bold">
                {title}
              </h2>
            )}
            {subtitle && <h3 className="">{subtitle}</h3>}
            {flavorText && (
              <div className=" italic text-text-flavor text-lg">
                <ReactMarkdown>{flavorText}</ReactMarkdown>
              </div>
            )}
          </div>
        </RowFrame>
      )}

      {/* Content Row */}
      <RowFrame reverse={contentReverse} vertical={vertical}>
        {children}
      </RowFrame>
    </div>
  );
}
