export type ModalRequest =
  | { type: "Species"; title: string }
  | { type: "Background"; title: string; selectionKey: string; level: number }
  | { type: "General Feat"; title: string; selectionKey: string; level: number }
  | { type: "Arcane Feat"; title: string; selectionKey: string; level: number }
  | { type: "Advantage"; title: string; selectionKey: string; level: number }
  | {
      type: "Ancestry Feat";
      title: string;
      selectionKey: string;
      level: number;
      species: string | null;
    }
  | {
      type: "Golem Upgrade";
      title: string;
      selectionKey: string;
      level: number;
    }
  | {
      type: "Runegun Upgrade";
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
  | {
      type: "weapon";
      title: string;
      selectionKey: string;
      level: number;
      replaceWeapon?: string;
      excludedTypes?: string[];
      includedTypes?: string[];
      includedWeaponGroups?: string[];
      owner?: "character" | "golem";
    }
  | {
      type: "gadget";
      title: string;
      selectionKey: string;
      level: number;
      replaceGadget?: string;
    }
  | {
      type: "metamagic";
      title: string;
      selectionKey: string;
      level: number;
      replaceMetamagic?: string;
    }
  | { type: "armor"; title: string; selectionKey: string; level: number }
  | { type: "baseStats"; title: string }
  | {
      type: "statIncrease";
      title: string;
      selectionKey: string;
      level: number;
    };
