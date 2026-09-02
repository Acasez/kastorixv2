import ActionBox from "../components/ActionBox";
import ImageDisplay from "../components/ImageDisplay";
import LevelOneSetup from "../components/LevelOneCard";
import TitleSection from "../components/PageIntroFlair";
import RowFrame from "../components/RowFrame";
import RulesBox from "../components/RulesBox";
import RulesRow from "../components/RulesRow";
import SkillRuleBox from "../components/SkillRuleBox";
import TextSection from "../components/TextSection";
import { useActions } from "../hooks/useActions";

export default function RPGOverview() {
  const { actions, loading, error } = useActions();

  if (loading) return <div>Loading actions...</div>;
  if (error) return <div>{error}</div>;

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
        <ActionBox action="Stride" actionsList={actions} />
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
          name="Attributes"
          rules={[
            {
              rule: "Physique (PHY)",
              description:
                "Health, Fortitude saves, weapon attacks and damage rolls, carrying capacity, armor requirements.",
              isHeader: true,
            },
            {
              rule: "Dexterity (DEX)",
              description:
                "Reflex saving throws, spellshaping checks, finesse and ranged weapon attacks, initiative.",
              isHeader: true,
            },
            {
              rule: "Intelligence (INT)",
              description:
                "Spellshaping checks, free spells and skill proficiencies, feat bonuses and requirements, many connected skills.",
              isHeader: true,
            },
            {
              rule: "Will (WIL)",
              description:
                "Mana and aura amount, Will saves, attuned Spellshaping checks, mana recovery checks. ",
              isHeader: true,
            },
          ]}
        />
      </RowFrame>
      <RowFrame reverse={true}>
        <TextSection name="Skills" description={DESCRIPTIONS.skills} />
        <SkillRuleBox />
      </RowFrame>
      <RowFrame vertical={true} reverse={false}>
        <TextSection
          name="Character building/Progression"
          description="There are up to 20 levels, divided in the five ranks of magic users. Apprentice, Adept, Magus, Grand Magus and Archmage. Each level provides a small increase in mana (and therefore aura), as well as two feats and some other benefits."
        />
        <RulesRow
          rules={[
            {
              rule: "Arcane Feats",
              description:
                "come from your practice and learning of magic. You can pick one new arcane feat each level.",
            },
            {
              rule: "General Feats",
              description:
                "come from your combat and general life experience. You can pick one new combat feat each level.",
            },
            {
              rule: "Advantages",
              description:
                "are powerful feats that shape your character. You can pick one new advantage every fourth level.",
            },
            {
              rule: "Ancestry Feats",
              description:
                "come from your species and its biology and cultural traditions. You can pick one new ancestry feat every fifth level.",
            },
            {
              rule: "Stat Increases",
              description:
                "happen every third level. You can increase one of your core stats by 1, though you cannot pick the same stat twice in a row",
            },
          ]}
        />
        <TextSection description="Arcane feats are generally the main way of learning new spells, but spells can also be learned during downtime. Additionally when a character reaches a new mage rank they also learn spells of that rank equaling to their INT. " />
        <LevelOneSetup />
      </RowFrame>
      <RowFrame reverse={true}>
        <TextSection name="Mana" description={DESCRIPTIONS.mana} />
        <ActionBox action="Harness Mana" actionsList={actions} />
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
  stats: `There are 4 (yes only four) primary stats in the game. They are designed to all be useful in some way, so you can’t “dump” a stat without consequences.

  When designing them I began by cutting out merging the traditional Strength and Constitution, as the difference is flimsy anyway, and this TTRPG is mostly about mages. Physique is a stat for both Strength and Constitution, which has worked well so far. It increases your health, scales your Fortitude saving throws, gets added to weapon attack and damage rolls and is useful for a few skills like Athletics and Brawling. Physique also determines which armor you can wear, and as armor provides a flat damage reduction, that's very useful for adventurers.  

Dexterity has two main things going for it, Reflex saving throws and Spellshaping rolls. As there are no armor classes in the game, most things that would normally target that, instead target Reflex saving throws, making them extra important.  If you are coming from DnD it’s important to note that while finesse weapons attack with Dex, the damage rolls still add Phy (like in Pathfinder). So if you want to be swinging weapons and doing damage, you can’t dump Phy. Finally initiative rolls are also based on Dexterity. 

When it comes to mental stats, I’ve also cut one out. Will serves as a mix of Wisdom and Charisma. The main benefit of Will is increasing your Mana and Aura every level. High Will characters can protect themselves with their aura and cast more spells using their larger mana pool. Characters with an Attunement can also cast their Attuned spells using their Will, allowing them to forgo int if they don’t value flexibility. Finally Wil is used in WIll saves, the rarest kind of saving throws used against things like fear, dimensional and mind altering effects.

Intelligence is used in spellshaping modifiers (when not casting Attuned spells), and provides characters with extra spells and skill proficiencies. Unlike the other stats Int doesn’t have an associated saving throw. But instead Int is also used in many feats that either scale on or are locked behind high Int, with powerful feats like Studied Ahead providing adept spells ahead on curve requiring 3 or more Int. Int is also the stat with most connected skills, having more than double that of Phy and Dex
`,
  skills: `Skills work similar to Pathfinder 2e, with the proficiency without levels variant. The proficiency bonus is +2 for trained, +4 for expert, +6 for master and +8 for legendary. At character creation you get training in 2 skills from your background and a number equal to your Int. The main source of skill increases is feats, which generally say something like “Your proficiency level in brawling increases (max Master)”, meaning you increase your proficiency level with that skill one step, up to the specified rank.

My current game design principle has been to restrict Master level in a skill to feats level 4 or higher and Legendary level to feats level 10 or higher, with advantages and certain feats sometimes breaking those limits. Skill proficiencies are allowed to go to higher levels faster than other proficiencies since they aren’t used to directly attack and defend in combat.

Also taken from pathfinder is the idea of Lore skills. Lore skills are specific skills that aren’t in the main list. They are more narrow and specific than the core skills and therefore more potent. Lore skills can for example be a field of magic (Alchemy Lore, Souls Lore), Lore about a certain nation, place or creature (Draconium Lore, Jungle Lore, Hydra Lore) or specific profession (Legal Lore, Academic Lore, Farming Lore). Making a check with a lore skill will be easier than using a broader skill and perhaps come with extra info, but by design be rarer. Lore skills are Int based by default, but you might make an Alchemy Lore (DEX) check to carefully mix ingredients in a potion or use Mining Lore (PHY) to dig out a secure tunnel.`,
  characterBuilding: ``,
  mana: `There are no spell slots in Kastorix, Mana is the resource used to cast all spells. Casting spells costs mana depending on their rank and traits. Mages can cast spells beyond their natural mana limit, but doing so risks mana poisoning and possibly death.

The rate of mana regeneration is based on the Mana Density of the location, but can be increased by certain feats and actions. Mages can generally recover all their mana during a long rest, but in low mana density areas this can take longer. You can read more about mana here`,
} as const;
