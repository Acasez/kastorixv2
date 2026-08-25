import "../CSS/ImageStyling.css";

interface ImageProps {
  imageLocation: string;
  altText: string;
  imageCaption?: string;
  coverImage: boolean;
}

export default function ImageDisplay({
  imageLocation,
  altText,
  imageCaption,
  coverImage,
}: ImageProps) {
  return (
    <>
      <div className={coverImage ? "portfolio-media cover" : "portfolio-media"}>
        <div>
          <div>
            {imageCaption ? (
              <div className="image-with-caption">
                <img src={imageLocation} alt={altText} />
                <p>{imageCaption}</p>
              </div>
            ) : (
              <img
                src={imageLocation}
                alt={altText}
                className="portfolio-image"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
