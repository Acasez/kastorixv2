import ActionBox from "../components/ActionBox";
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
        <TextSection description={DESCRIPTIONS.overview} />
        <ImageDisplay
          imageLocation="/images/Maps/Kastorix.jpg"
          altText="Kastorix World Map"
          imageCaption="Kastorix World Map"
          coverImage={false}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection name="Actions" description={DESCRIPTIONS.actions} />
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
      <RowFrame reverse={true}>
        <TextSection name="Stats" description={DESCRIPTIONS.stats} />
        <RulesBox
          name="Stats"
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
      <RowFrame reverse={true}>
        <ActionBox action="Harness Mana" />
      </RowFrame>
    </>
  );
}

const DESCRIPTIONS = {
  overview: `Kastorix is the name of both the TTRPG and the world it's set in. It's a D20-based system heavily inspired by Pathfinder 2e.

In Kastorix, magic is commonplace and mages are one of the main sources of power for nations. There are no classes; instead, options come from feats and spells. In a sense, everyone is a mage, though there is considerable difference between mages based on the feats chosen. To start making a character, players pick their species, then select feats and spells.

The world and magic of Kastorix are inspired by magitech settings like Eberron, Ravnica, Runeterra, and Avishkar, as well as progression fantasy worlds and stories like *Arcane Ascension*, *Mother of Learning*, and *The Journals of Evander Tailor*.

By design, all powerful characters are magic users and rely on their auras instead of superhuman durability, though they need not be traditional mages. There is room to build tinkering artificers, heavily armored magic knights, and rogues with magical tricks.`,
  actions: `Kastorix uses a 3-action system similar to Pathfinder 2e. On each turn, players (and creatures) have three actions to spend on any activity. Common actions include Stride, Step, and Strike, but many more exist. Some activities, like spellcasting, cost 2 or 3 actions. The Quickened and Slowed status effects modify the number of actions a player starts with.

Creatures also have one reaction per round, usable on other players’ turns.

Some rare activities like casting powerful spells or rare rituals may cost more than 3 actions. To do these, the creature needs to be hastened or perform the activity over multiple turns without interruption.`,
  stats: `There are 4 (yes, only four) primary stats in the game which are designed to all be useful to all characters in some way, so you can’t “dump” a stat without consequences.
I began by cutting out Strength as the difference between Strength and Constitution is flimsy anyway, and the TTRPG is mostly about mages. Physique is a stat for both Strength and Constitution, which has worked well so far. It increases your health, scales your Fortitude saving throws, adds to weapon attack and damage rolls and is useful for a few skills like Athletics and Brawling. Physique also determines which armor you can wear, and as armor provides a flat damage reduction, that's very useful for adventurers.

Dexterity has two main things going for it, Reflex saving throws and spellshaping rolls. Initiative rolls are also based on Dexterity. Reflex saving throws are extra important here since there is no armor class and every attack is a roll against them. If you are coming from DnD it’s important to note that while finesse weapons attack with Dex, the damage rolls still add Phy (like in Pathfinder). So if you want to be swinging weapons and doing damage, you can’t dump Phy.

When it comes to mental stats, I’ve also cut one out. Will serves as a mix of Wisdom and Charisma. The main benefit of Will is increasing your Mana and Aura every level. High Will characters can protect themselves with their aura and cast more spells using their larger mana pool. Characters with an Attunement can also cast their Attuned spells using their Will, allowing them to forgo int if they don’t value flexibility. Finally Wil is used in WIll saves, the rarest kind of saving throws used against things like fear and mind altering effects.

Intelligence is used in spellshaping modifiers (when not casting Attuned spells), and provides characters with extra spells and skills learned. Unlike the other stats Int doesn’t have an associated saving throw. But instead Int is also used in many feats that either scale on or are locked behind high Int, with powerful feats like Studied Ahead providing adept spells ahead on curve requiring 3 or more Int. Int is also the stat with most connected skills, having more than double that of Phy and Dex `,
  skills: ``,
  characterBuilding: ``,
} as const;
