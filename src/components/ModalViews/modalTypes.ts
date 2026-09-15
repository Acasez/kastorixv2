export type ModalRequest =
  | { type: "species"; title: string }
  | { type: "background"; title: string }
  | { type: "generalFeat"; title: string }
  | { type: "arcaneFeat"; title: string }
  | { type: "advantage"; title: string }
  | { type: "ancestryFeat"; title: string }
  | { type: "spell"; title: string }
  | { type: "weapon"; title: string }
  | { type: "baseStats"; title: string };
