import { NavLink } from "react-router-dom";
import "../CSS/RowStructure.css";
import ImageDisplay from "../components/ImageDisplay";

interface PortFolioProps {
  imageLocation: string;
  altText: string;
  imageCaption?: string;

  name?: string;
  projectPageLink?: string;
  description: string;
}

export default function TextImageSection({
  imageLocation,
  altText,
  imageCaption,
  name,
  projectPageLink,
  description,
}: PortFolioProps) {
  return (
    <>
      <div>
        <div className="portfolio-media">
          {imageLocation && (
            <ImageDisplay
              imageLocation={imageLocation}
              altText={altText}
              imageCaption={imageCaption}
              coverImage={false}
            />
          )}
        </div>
      </div>

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
