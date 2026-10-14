import "../CSS/ImageStyling.css";

interface ImageProps {
  imageLocation: string;
  altText: string;
}

export default function Icon({ imageLocation, altText }: ImageProps) {
  return (
    <>
      <div className="">
        <img src={imageLocation} alt={altText} className="portfolio-image" />
      </div>
    </>
  );
}
