import ActionBox from "../components/Actions/ActionBox";
import ImageDisplay from "../components/Content/ImageDisplay";
import LevelOneSetup from "../components/OverviewComponents/LevelOneCard";
import OverviewPageIntro from "../components/OverviewComponents/OverviewPageIntro";
import RulesBox from "../components/Rules/RulesBox";
import RulesRow from "../components/Rules/RulesRow";
import SkillRuleBox from "../components/Rules/SkillRuleBox";
import MarkdownSection from "../components/Content/MarkdownSection";
import { ACTION_RULES } from "../constants/RulesDescriptions/ActionRules";
import { PROGRESSION_RULES } from "../constants/RulesDescriptions/ProgressionRules";
import { STATS_RULES } from "../constants/RulesDescriptions/StatsRules";
import overviewMarkdown from "../markdown/Overview.md?raw";
import { parseMarkdownByHeaders } from "../utils/parseMarkdown";
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
      <Section>
        <MarkdownSection description={DESC.Overview} />
        <ImageDisplay
          imageLocation="./images/Maps/Kastorix.jpg"
          altText="Kastorix World Map"
          imageCaption="Kastorix World Map"
          coverImage={false}
        />
      </Section>
      <Section title="Actions">
        <MarkdownSection description={DESC.Actions} />
        <ActionBox action="Stride" />
        <RulesBox name="Actions" rules={ACTION_RULES} />
      </Section>
      <Section title="Stats" contentReverse={true}>
        <MarkdownSection description={DESC.Stats} />
        <RulesBox name="Attributes" rules={STATS_RULES} />
      </Section>
      <Section title="Skills" contentReverse={true}>
        <MarkdownSection description={DESC.Skills} />
        <SkillRuleBox />
      </Section>
      <Section
        title="Character building/Progression"
        flavorText={DESC.MageRanks}
        vertical={true}
      >
        <RulesRow rules={PROGRESSION_RULES} />
        <MarkdownSection description={DESC.LearnSpells} />
        <LevelOneSetup />
      </Section>
      <Section
        title="Mana"
        flavorText={DESC.ManaFlavor}
        icon="./images/ManaIcon.png"
        iconAlt="Mana Icon"
      >
        <MarkdownSection description={DESC.Mana} />
        <ActionBox action="Harness Mana" />
      </Section>
      <Section
        title="Aura"
        flavorText={DESC.AuraFlavor}
        icon="./images/Eldritch.png"
        iconAlt="Aura Icon"
      >
        <MarkdownSection description={DESC.Aura} />
        <ActionBox action="Aura Block" />
        <ActionBox action="Reinforce Aura" />
      </Section>
      <Section title="Spellcasting" flavorText={DESC.SpellcastingFlavor}>
        <MarkdownSection description={DESC.Spellcasting} />
        <ActionBox action="Cast a Spell" />
        <ActionBox action="Sustain" />
      </Section>
      <Section title="Focus Points">
        <MarkdownSection description={DESC.FocusPoints} />
      </Section>
      <Section title="Opposed Rolls">
        <MarkdownSection description={DESC.OpposedRolls} />
      </Section>
      <Section title="Targeted Attacks">
        <MarkdownSection description={DESC.TargetedAttacks} />
        <TargetedAttacksTable />
      </Section>
    </>
  );
}
