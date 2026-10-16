import ActionBox from "../components/Actions/ActionBox";
import Icon from "../components/Content/Icon";
import ImageDisplay from "../components/Content/ImageDisplay";
import LevelOneSetup from "../components/OverviewComponents/LevelOneCard";
import OverviewPageIntro from "../components/OverviewComponents/OverviewPageIntro";
import RowFrame from "../components/Layout/ContentRow";
import RulesBox from "../components/Rules/RulesBox";
import RulesRow from "../components/Rules/RulesRow";
import SkillRuleBox from "../components/Rules/SkillRuleBox";
import MarkdownSection from "../components/Content/MarkdownSection";
import { ACTION_RULES } from "../constants/RulesDescriptions/ActionRules";
import { PROGRESSION_RULES } from "../constants/RulesDescriptions/ProgressionRules";
import { STATS_RULES } from "../constants/RulesDescriptions/StatsRules";
import overviewMarkdown from "../markdown/Overview.md?raw";
import { parseMarkdownByHeaders } from "../utils/parseMarkdown";
import actions from "../data/actions";
import { Helmet } from "react-helmet-async";
import { TargetedAttacksTable } from "../components/OverviewComponents/TargetedAttacksTable";
import Section from "../components/Layout/Section";

const DESC = parseMarkdownByHeaders(overviewMarkdown);

export default function RPGOverview() {
  return (
    <>
      <Helmet>
        <title>TTRPG Overview - Kastorix</title>
      </Helmet>
      <OverviewPageIntro title={"Kastorix"} subtitle={"TTRPG Overview"} />
      <RowFrame reverse={false}>
        <MarkdownSection description={DESC.Overview} />
        <ImageDisplay
          imageLocation="./images/Maps/Kastorix.jpg"
          altText="Kastorix World Map"
          imageCaption="Kastorix World Map"
          coverImage={false}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <MarkdownSection name="Actions" description={DESC.Actions} />
        <ActionBox action="Stride" actionsList={actions} />
        <RulesBox name="Actions" rules={ACTION_RULES} />
      </RowFrame>
      <RowFrame reverse={true}>
        <MarkdownSection name="Stats" description={DESC.Stats} />
        <RulesBox name="Attributes" rules={STATS_RULES} />
      </RowFrame>
      <RowFrame reverse={true}>
        <MarkdownSection name="Skills" description={DESC.Skills} />
        <SkillRuleBox />
      </RowFrame>
      <RowFrame vertical={true} reverse={false}>
        <MarkdownSection
          name="Character building/Progression"
          description={DESC.MageRanks}
        />
        <RulesRow rules={PROGRESSION_RULES} />
        <MarkdownSection description={DESC.LearnSpells} />
        <LevelOneSetup />
      </RowFrame>
      <Section
        title="Mana"
        flavorText={DESC.ManaFlavor}
        icon="./images/ManaIcon.png"
        iconAlt="Mana Icon"
      >
        <MarkdownSection description={DESC.Mana} />
        <ActionBox action="Harness Mana" actionsList={actions} />
      </Section>
      <RowFrame reverse={false}>
        <Icon imageLocation="./images/Eldritch.png" altText="Aura Icon" />
        <MarkdownSection
          name="Aura"
          description={DESC.AuraFlavor}
          cursive={true}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <MarkdownSection description={DESC.Aura} />
        <ActionBox action="Aura Block" actionsList={actions} />
        <ActionBox action="Reinforce Aura" actionsList={actions} />
      </RowFrame>
      <RowFrame reverse={false}>
        <MarkdownSection
          name="Spellcasting"
          description={DESC.SpellcastingFlavor}
          cursive={true}
        />
      </RowFrame>
      <RowFrame reverse={false}>
        <MarkdownSection description={DESC.Spellcasting} />
        <ActionBox action="Cast a Spell" actionsList={actions} />
        <ActionBox action="Sustain" actionsList={actions} />
      </RowFrame>
      <RowFrame reverse={false}>
        <MarkdownSection name="Focus Points" description={DESC.FocusPoints} />
      </RowFrame>
      <RowFrame reverse={false}>
        <MarkdownSection name="Opposed Rolls" description={DESC.OpposedRolls} />
      </RowFrame>
      <RowFrame reverse={false}>
        <MarkdownSection
          name="Targeted Attacks"
          description={DESC.TargetedAttacks}
        />
        <TargetedAttacksTable />
      </RowFrame>
    </>
  );
}
