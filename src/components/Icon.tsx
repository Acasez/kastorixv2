import "../CSS/ImageStyling.css";

interface ImageProps {
  imageLocation: string;
  altText: string;
}

export default function Icon({ imageLocation, altText }: ImageProps) {
  return (
    <>
      <div className="">
        <div>
          <div>
            <img
              src={imageLocation}
              alt={altText}
              className="portfolio-image"
            />
          </div>
        </div>
      </div>
    </>
  );
}
