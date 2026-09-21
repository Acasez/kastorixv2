export type ModalRequest =
  | { type: "species"; title: string }
  | { type: "background"; title: string; selectionKey: string; level: number }
  | { type: "generalFeat"; title: string; selectionKey: string; level: number }
  | { type: "arcaneFeat"; title: string; selectionKey: string; level: number }
  | { type: "advantage"; title: string; selectionKey: string; level: number }
  | { type: "ancestryFeat"; title: string; selectionKey: string; level: number }
  | { type: "golemUpgrade"; title: string; selectionKey: string; level: number }
  | {
      type: "runegunUpgrade";
      title: string;
      selectionKey: string;
      level: number;
    }
  | {
      type: "spell";
      title: string;
      selectionKey: string;
      level: number;
      rank?: string;
      replaceSpell?: string;
    }
  | { type: "weapon"; title: string; selectionKey: string; level: number }
  | {
      type: "metamagic";
      title: string;
      selectionKey: string;
      level: number;
      replaceMetamagic?: string;
    }
  | { type: "baseStats"; title: string };
