import ActionBox from "../components/ActionBox";
import Icon from "../components/Icon";
import ImageDisplay from "../components/ImageDisplay";
import LevelOneSetup from "../components/LevelOneCard";
import TitleSection from "../components/PageIntroFlair";
import RowFrame from "../components/RowFrame";
import RulesBox from "../components/RulesBox";
import RulesRow from "../components/RulesRow";
import SkillRuleBox from "../components/SkillRuleBox";
import TextSection from "../components/TextSection";
import { useActions } from "../hooks/useActions";
import overviewMarkdown from "../markdown/Overview.md?raw";
const DESC = {
  overview: overviewMarkdown,
} as const;

export default function RPGOverview() {
  const { actions, loading, error } = useActions();

  if (loading) return <div>Loading actions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <TitleSection title={"Kastorix"} subtitle={"TTRPG Overview"} />
      <RowFrame reverse={false}>
        <TextSection description={DESC.overview} />
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
        <RulesBox name="Actions" rules={ACTION_RULES} />
      </RowFrame>
      <RowFrame reverse={true}>
        <TextSection name="Stats" description={DESCRIPTIONS.stats} />
        <RulesBox name="Attributes" rules={STATS_RULES} />
      </RowFrame>
      <RowFrame reverse={true}>
        <TextSection name="Skills" description={DESCRIPTIONS.skills} />
        <SkillRuleBox />
      </RowFrame>
      <RowFrame vertical={true} reverse={false}>
        <TextSection
          name="Character building/Progression"
          description={DESCRIPTIONS.mageRanks}
        />
        <RulesRow rules={PROGRESSION_RULES} />
        <TextSection description={DESCRIPTIONS.learnSpells} />
        <LevelOneSetup />
      </RowFrame>
      <RowFrame reverse={false}>
        <Icon imageLocation="/images/ManaIcon.png" altText="Mana Icon" />
        <TextSection
          name="Mana"
          description={DESCRIPTIONS.manaFlavor}
          cursive={true}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection description={DESCRIPTIONS.mana} />
        <ActionBox action="Harness Mana" actionsList={actions} />
      </RowFrame>
      <RowFrame reverse={false}>
        <Icon imageLocation="/images/Eldritch.png" altText="Aura Icon" />
        <TextSection
          name="Aura"
          description={DESCRIPTIONS.auraFlavor}
          cursive={true}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection description={DESCRIPTIONS.aura} />
        <ActionBox action="Aura Block" actionsList={actions} />
        <ActionBox action="Reinforce Aura" actionsList={actions} />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection
          name="Spellcasting"
          description={DESCRIPTIONS.spellFlavor}
          cursive={true}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection description={DESCRIPTIONS.spellcasting} />
        <ActionBox action="Cast a Spell" actionsList={actions} />
        <ActionBox action="Sustain" actionsList={actions} />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection
          name="Focus Points"
          description={DESCRIPTIONS.focusPoints}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection
          name="Opposed Rolls"
          description={DESCRIPTIONS.opposedRolls}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection
          name="Targeted Attacks"
          description={DESCRIPTIONS.targetedAttacks}
        />
      </RowFrame>
    </>
  );
}

const DESCRIPTIONS = {
  overview: `
**Kastorix** is the name of both the TTRPG and the world it's set in.
It's a D20-based system heavily inspired by Pathfinder 2e.
In Kastorix, magic is commonplace and mages are one of the main sources of power for nations.
There are no classes; instead, options come from feats and spells.
In a sense, everyone is a mage, though there is considerable difference between mages based on the feats chosen.
To start making a character, players pick their species, then select feats and spells.

&nbsp;  

The world and magic of Kastorix are inspired by magitech settings like Eberron, Ravnica, Runeterra, and Avishkar,
as well as progression fantasy worlds and stories like *Arcane Ascension*, *Mother of Learning*, and *The Journals of Evander Tailor*.
By design, all powerful characters are magic users and rely on their *auras* instead of superhuman durability,
though they need not be traditional mages. There is room to build tinkering artificers, heavily armored magic knights, and rogues with magical tricks.
  `,
  actions: `Kastorix uses a 3-action system similar to Pathfinder 2e. 
  On each turn, players (and creatures) have three actions to spend on any activity. 
  Common actions include *Stride*, *Step*, and *Strike*, but many more exist. 
  Some activities, like spellcasting, cost 2 or 3 actions. 
  The *Quickened* and *Slowed* status effects modify the number of actions a player starts with.

  Creatures also have one reaction per round, usable on other players’ turns.

&nbsp;  

Some rare activities like casting powerful spells or rare rituals may cost more than 3 actions. To do these, the creature needs to be hastened or perform the activity over multiple turns without interruption.`,
  stats: `There are 4 (yes only four) primary stats in the game. They are designed to all be useful in some way, so you can’t “dump” a stat without consequences.

&nbsp;  

  When designing them I began by cutting out merging the traditional Strength and Constitution, as the difference is flimsy anyway, and this TTRPG is mostly about mages. Physique is a stat for both Strength and Constitution, which has worked well so far. It increases your health, scales your Fortitude saving throws, gets added to weapon attack and damage rolls and is useful for a few skills like Athletics and Brawling. Physique also determines which armor you can wear, and as armor provides a flat damage reduction, that's very useful for adventurers.  

&nbsp;  

Dexterity has two main things going for it, Reflex saving throws and Spellshaping rolls. As there are no armor classes in the game, most things that would normally target that, instead target Reflex saving throws, making them extra important.  If you are coming from DnD it’s important to note that while finesse weapons attack with Dex, the damage rolls still add Phy (like in Pathfinder). So if you want to be swinging weapons and doing damage, you can’t dump Phy. Finally initiative rolls are also based on Dexterity. 

&nbsp;  

When it comes to mental stats, I’ve also cut one out. Will serves as a mix of Wisdom and Charisma. The main benefit of Will is increasing your Mana and Aura every level. High Will characters can protect themselves with their aura and cast more spells using their larger mana pool. Characters with an Attunement can also cast their Attuned spells using their Will, allowing them to forgo int if they don’t value flexibility. Finally Wil is used in WIll saves, the rarest kind of saving throws used against things like fear, dimensional and mind altering effects.

&nbsp;  

Intelligence is used in spellshaping modifiers (when not casting Attuned spells), and provides characters with extra spells and skill proficiencies. Unlike the other stats Int doesn’t have an associated saving throw. But instead Int is also used in many feats that either scale on or are locked behind high Int, with powerful feats like Studied Ahead providing adept spells ahead on curve requiring 3 or more Int. Int is also the stat with most connected skills, having more than double that of Phy and Dex
`,
  skills: `Skills work similar to Pathfinder 2e, with the proficiency without levels variant. The proficiency bonus is +2 for trained, +4 for expert, +6 for master and +8 for legendary. At character creation you get training in 2 skills from your background and a number equal to your Int. The main source of skill increases is feats, which generally say something like “Your proficiency level in brawling increases (max Master)”, meaning you increase your proficiency level with that skill one step, up to the specified rank.

My current game design principle has been to restrict Master level in a skill to feats level 4 or higher and Legendary level to feats level 10 or higher, with advantages and certain feats sometimes breaking those limits. Skill proficiencies are allowed to go to higher levels faster than other proficiencies since they aren’t used to directly attack and defend in combat.

Also taken from pathfinder is the idea of Lore skills. Lore skills are specific skills that aren’t in the main list. They are more narrow and specific than the core skills and therefore more potent. Lore skills can for example be a field of magic (Alchemy Lore, Souls Lore), Lore about a certain nation, place or creature (Draconium Lore, Jungle Lore, Hydra Lore) or specific profession (Legal Lore, Academic Lore, Farming Lore). Making a check with a lore skill will be easier than using a broader skill and perhaps come with extra info, but by design be rarer. Lore skills are Int based by default, but you might make an Alchemy Lore (DEX) check to carefully mix ingredients in a potion or use Mining Lore (PHY) to dig out a secure tunnel.`,
  mageRanks: `There are up to 20 levels, divided in the five ranks of magic users. Apprentice, Adept, Magus, Grand Magus and Archmage. Each level provides a small increase in mana (and therefore aura), as well as two feats and some other benefits.`,
  learnSpells: `Arcane feats are generally the main way of learning new spells, but spells can also be learned during downtime. Additionally when a character reaches a new mage rank they also learn spells of that rank equaling to their INT.`,
  manaFlavor: `Mana exists in all living things and is necessary for life. Creatures absorb mana from their surroundings, into their mana well. Larger and more magical creatures generally have larger mana wells. Magical creatures use mana to fuel their magical abilities, like a dragon's breath or a coatls flight. Spellcasting relies on using the mana in one’s mana well to cast spells. As mana is used, the mana well depletes, and must be refilled by absorbing mana from the nearby area. Doing this will over time grow the mana well, allowing more mana to be stored. However if a creature's mana well runs out of mana, the creature will quickly die.`,
  mana: `There are no spell slots in Kastorix, Mana is the resource used to cast all spells. Casting spells costs mana depending on their rank and traits. Mages can cast spells beyond their natural mana limit, but doing so risks mana poisoning and possibly death.

The rate of mana regeneration is based on the Mana Density of the location, but can be increased by certain feats and actions. Mages can generally recover all their mana during a long rest, but in low mana density areas this can take longer. You can read more about mana here`,
  aura: `All creatures have an Aura Health with a max equal to their Max Mana. Whenever they take damage, half of that is absorbed by their aura, which can be restored far easier than normal health. For example if a creature were to take 12 damage it would take 6 aura damage and 6 health damage. If the damage amount is uneven the creature can choose whether the aura or their health should take higher half. If a creature's Aura reaches zero, that creature takes full damage until the Aura Health is restored. Vital damage bypasses auras, as do ingested and contact poisons (but not effects like poison clouds).

  &nbsp;

Mages can spend three actions to raise or lower their aura. While down it won't protect them, but it also can't be detected by mana sensing. They also have the Aura Block reaction and the Reinforce Aura action
`,
  auraFlavor: `Just as we breathe out carbon, mana not used by the soul is also expelled. This forms what's known as an aura, clinging to the creature like breath on a cold day. Auras are invisible to most, but mages can learn to see them, and some creatures can naturally see them. They provide a weak magical shield around the creature, protecting them from harm. As mana wells grow, so do auras, becoming stronger and more protective. Mages can also learn to manipulate their auras, shaping them and using them for magical effects.`,
  spellFlavor: `Spells are the tools of mages, allowing them to manipulate the world around them. Spells are learned through study and practice, and can be modified and changed by the mage. Spells are cast by expending mana, shaping it into the desired effect. Spells can be cast quickly in the heat of battle, or prepared ahead of time for more complex effects. Some spells are simple and straightforward, while others are complex and require careful planning. Spells are invented, refined, and recorded by spellcasters around the world, resulting in thousands of spells and variants. Many spells have been independently invented by different cultures and individuals across Kastorix. `,
  spellcasting: `To cast any spell in Kastorix you need to pay the mana cost and make a spellshaping check to see if you succeed. The difficulty of the check depends on the complexity and rank of the spell you are casting and the characters may have many bonuses and penalties to the roll. In general spellcasting checks are designed so that you succeed most of the time. The result of the spellcasting check also serves as the "Spell Save DC" of other systems.
Spells have a vocal and somatic component, which adds INT and DEX to the spellcasting check respectively. Attempting to cast a spell while silenced or restrained means casting without that component. Attuned creatures can use their WIL instead of INT when casting spells of their attuned aspect as they channeling it innately instead of using their knowledge of magic

  &nbsp;

Many spells can be sustained to maintain them. This is done via the Sustain action. Spells can be modified with metamagics, which changes the spellshaping DC and adds extra effects to spell. By default you can only use one metamagic per spell, but feats and abilities may allow you to use more.`,
  focusPoints: `Focus points are the main non-magical resource in Kastorix. Players gain a new one every four levels, and recover spent ones by simply taking a 10 minute rest. By default they can only be used to gain advantage on Death Saving Throws, but feats and advantages unlock new ways to spend them such as combat maneuvers and other abilities, as well as empowering other actions. Certain feats also provide new ways to recover or gain temporary focus points. `,
  opposedRolls: `Kastorix works based on opposed rolls, meaning for every action both combatants roll dice. So there is no more "do I roll a dice? no its a spell so I roll against your saving throw". Every spell cast requires a spellshaping check

Basic attacks also use opposed rolls. Instead of having an armor class, characters make Reflex saves against attack rolls. Attacks hit if the attacker rolls higher than the defender. Armor instead provides resistance to different types of damage, making it easier to survive hits and allowing armored characters to shrug off weak attacks. `,
  targetedAttacks: `When making attacks or casting spells with the Targeting trait, attackers can choose to target a specific part of the body. This can inflict special conditions, like blinding or slowing the target, but makes the attack harder to hit.

Creatures gain a bonus to their Reflex saves based on the part of the body being targeted. Attacks with a weapon or spell with the Precision trait reduce this bonus by 2. On a critical success the penalty is doubled.Some creatures have special body parts that can be targeted, like a dragon's wings or Losungi's venom fangs. But there are some common weak points on most sapient creatures: `,
} as const;

const ACTION_RULES = [
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
];

const STATS_RULES = [
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
];

const PROGRESSION_RULES = [
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
];
