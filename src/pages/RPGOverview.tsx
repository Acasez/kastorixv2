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
import { ACTION_RULES } from "../constants/ActionRules";
import { PROGRESSION_RULES } from "../constants/ProgressionRules";
import { STATS_RULES } from "../constants/StatsRules";
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
