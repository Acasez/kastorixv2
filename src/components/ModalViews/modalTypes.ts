export type ModalRequest =
  | { type: "species"; title: string }
  | { type: "background"; title: string; selectionKey: string; level: number }
  | { type: "generalFeat"; title: string; selectionKey: string; level: number }
  | { type: "arcaneFeat"; title: string; selectionKey: string; level: number }
  | { type: "advantage"; title: string; selectionKey: string; level: number }
  | { type: "ancestryFeat"; title: string; selectionKey: string; level: number }
  | { type: "spell"; title: string; selectionKey: string; level: number }
  | { type: "weapon"; title: string; selectionKey: string; level: number }
  | { type: "baseStats"; title: string };
