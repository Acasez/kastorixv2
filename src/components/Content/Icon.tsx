interface ImageProps {
  imageLocation: string;
  altText: string;
}

export default function Icon({ imageLocation, altText }: ImageProps) {
  return (
    <>
      <img src={imageLocation} alt={altText} />
    </>
  );
}
