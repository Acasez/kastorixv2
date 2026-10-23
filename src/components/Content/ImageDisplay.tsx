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
      <div className={coverImage ? "" : ""}>
        <div>
          <div>
            {imageCaption ? (
              <div className="max-w-700 text-center text-xl cursive">
                <img src={imageLocation} alt={altText} />
                <p>{imageCaption}</p>
              </div>
            ) : (
              <img src={imageLocation} alt={altText} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
