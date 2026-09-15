export type ModalRequest =
  | { type: "species"; title: string }
  | { type: "background"; title: string; selectionKey: string }
  | { type: "generalFeat"; title: string; selectionKey: string }
  | { type: "arcaneFeat"; title: string; selectionKey: string }
  | { type: "advantage"; title: string; selectionKey: string }
  | { type: "ancestryFeat"; title: string; selectionKey: string }
  | { type: "spell"; title: string; selectionKey: string }
  | { type: "weapon"; title: string; selectionKey: string }
  | { type: "baseStats"; title: string };
