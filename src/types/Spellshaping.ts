export type Spellshaping = {
  proficiency: string;
  verbal: VerbalComponent;
  somatic: SomaticComponent;
  totalBonus: string;
};

export type SomaticComponent = "None" | "One Handed" | "Two Handed";

export type VerbalComponent = "None" | "Standard" | "Attuned";
