import { Helmet } from "react-helmet-async";

export default function WorldMap() {
  return (
    <>
      <Helmet>
        <title>World Map - Kastorix</title>
      </Helmet>
      <div className="">
        <img
          className="-mt-1.5"
          src="./images/Maps/Kastorix.jpg"
          alt="Kastorix World Map"
        />
      </div>
    </>
  );
}
