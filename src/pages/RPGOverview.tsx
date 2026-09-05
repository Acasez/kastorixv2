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
import { parseMarkdownByHeaders } from "../utils/parseMarkdown";

const DESC = parseMarkdownByHeaders(overviewMarkdown);

export default function RPGOverview() {
  const { actions, loading, error } = useActions();

  if (loading) return <div>Loading actions...</div>;
  if (error) return <div>{error}</div>;

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
      <RowFrame reverse={false}>
        <TextSection name="Actions" description={DESC.Actions} />
        <ActionBox action="Stride" actionsList={actions} />
        <RulesBox name="Actions" rules={ACTION_RULES} />
      </RowFrame>
      <RowFrame reverse={true}>
        <TextSection name="Stats" description={DESC.Stats} />
        <RulesBox name="Attributes" rules={STATS_RULES} />
      </RowFrame>
      <RowFrame reverse={true}>
        <TextSection name="Skills" description={DESC.Skills} />
        <SkillRuleBox />
      </RowFrame>
      <RowFrame vertical={true} reverse={false}>
        <TextSection
          name="Character building/Progression"
          description={DESC.MageRanks}
        />
        <RulesRow rules={PROGRESSION_RULES} />
        <TextSection description={DESC.LearnSpells} />
        <LevelOneSetup />
      </RowFrame>
      <RowFrame reverse={false}>
        <Icon imageLocation="/images/ManaIcon.png" altText="Mana Icon" />
        <TextSection name="Mana" description={DESC.ManaFlavor} cursive={true} />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection description={DESC.Mana} />
        <ActionBox action="Harness Mana" actionsList={actions} />
      </RowFrame>
      <RowFrame reverse={false}>
        <Icon imageLocation="/images/Eldritch.png" altText="Aura Icon" />
        <TextSection name="Aura" description={DESC.AuraFlavor} cursive={true} />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection description={DESC.Aura} />
        <ActionBox action="Aura Block" actionsList={actions} />
        <ActionBox action="Reinforce Aura" actionsList={actions} />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection
          name="Spellcasting"
          description={DESC.SpellcastingFlavor}
          cursive={true}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection description={DESC.Spellcasting} />
        <ActionBox action="Cast a Spell" actionsList={actions} />
        <ActionBox action="Sustain" actionsList={actions} />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection name="Focus Points" description={DESC.FocusPoints} />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection name="Opposed Rolls" description={DESC.OpposedRolls} />
      </RowFrame>
      <RowFrame reverse={false}>
        <TextSection
          name="Targeted Attacks"
          description={DESC.TargetedAttacks}
        />
      </RowFrame>
    </>
  );
}

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
