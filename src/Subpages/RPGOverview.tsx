import ImageDisplay from "../components/ImageDisplay";
import TitleSection from "../components/PageIntroFlair";
import RowFrame from "../components/RowFrame";
import RulesBox from "../components/RulesBox";
import TextSection from "../components/TextSection";

export default function RPGOverview() {
  return (
    <>
      <TitleSection title={"Kastorix"} subtitle={"TTRPG Overview"} />
      <RowFrame reverse={false}>
        <TextSection
          description="Kastorix is the name of both the TTRPG and the world it's set in. It's D20 based system heavily inspired by Pathfinder 2e.

In Kastorix magic is commonplace and mages are one of the main sources of power for nations. There are no classes, instead options come from feats and spells. In a sense, everyone is a mage, though there is considerable difference between different mages from the feats chosen. To start making a character players pick their species, then pick up feats and spells

The world and magic of Kastorix is inspired by magitech worlds like Eberron, Ravnica, Runeterra and Avishkar, as well as progression fantasy worlds and stories like Arcane Ascension, Mother of Learning and the Journals of Evander Tailor.

By design all powerful characters are magic users and rely on their auras instead of superhuman durability, though they need not be exactly traditional mages. There is room to build tinkering artificers, heavily armored magic knights and rogues with magical tricks"
        />
        <ImageDisplay
          imageLocation="/images/Maps/Kastorix.jpg"
          altText="Kastorix World Map"
          imageCaption="Kastorix World Map"
          coverImage={false}
        />
      </RowFrame>
      <RowFrame reverse={true}>
        <TextSection
          name="Actions"
          description="Kastorix uses a 3-action system similar to Pathfinder 2e. On each turn, players (and creatures) have three actions to spend on any activity. Common actions include Stride, Step, and Strike, but many more exist. Some activities, like spellcasting, cost 2 or 3 actions. The quickened and slowed status effects modify the number of actions a player starts with.
Creatures also have one reaction per round, usable on other players’ turns.

Some rare activities like casting powerful spells or rare rituals may cost more than 3 actions. To do these the creature needs to be hastened or perform the activity over multiple turns without interruption."
        />
        <RulesBox
          name="Actions"
          rules={[
            {
              rule: "Single Action",
              ruleIcon: "/images/Icons/OneAction.png",
            },
            {
              rule: "Two-Action Activity",
              ruleIcon: "/images/Icons/TwoActions.png",
            },
            {
              rule: "Three-Action Activity",
              ruleIcon: "/images/Icons/ThreeActions.png",
            },
            {
              rule: "Reactions",
              ruleIcon: "/images/Icons/Reaction.png",
            },
            {
              rule: "Free Action",
              ruleIcon: "/images/Icons/FreeAction.png",
            },
          ]}
        />
      </RowFrame>
    </>
  );
}
