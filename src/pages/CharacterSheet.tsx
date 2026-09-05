import ImageDisplay from "../components/ImageDisplay";
import TitleSection from "../components/PageIntroFlair";
import RowFrame from "../components/RowFrame";
import TextSection from "../components/TextSection";
import overviewMarkdown from "../markdown/Overview.md?raw";
import { parseMarkdownByHeaders } from "../utils/parseMarkdown";

const DESC = parseMarkdownByHeaders(overviewMarkdown);

export default function RPGOverview() {
  return (
    <>
      <TitleSection title={"Kastorix"} subtitle={"TTRPG Overview"} />
      <RowFrame reverse={false}>
        <TextSection description={DESC.Overview} />
        <ImageDisplay
          imageLocation="/images/Maps/Kastorix.jpg"
          altText="Kastorix World Map"
          imageCaption="Kastorix World Map"
          coverImage={false}
        />
      </RowFrame>
    </>
  );
}
