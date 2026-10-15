import { Helmet } from "react-helmet-async";
import ImageDisplay from "../components/TextPageComponents/ImageDisplay";

export default function WorldMap() {
  return (
    <>
      <Helmet>
        <title>World Map - Kastorix</title>
      </Helmet>
      <ImageDisplay
        imageLocation="./images/Maps/Kastorix.jpg"
        altText="Kastorix World Map"
        imageCaption="Kastorix World Map"
        coverImage={true}
      />
    </>
  );
}
