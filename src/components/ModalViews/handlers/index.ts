// src/components/ModalViews/handlers/index.ts
import type { ModalRequest } from "../modalTypes";
import {
  createSelectionHandler,
  createPropertyHandler,
  createCollectionHandler,
  createSpecialHandler,
} from "./factory";
import type { ModalHandler, UpdateFn } from "./types";

// Handler registry
export const handlers: Record<ModalRequest["type"], ModalHandler> = {
  // Property handlers
  species: createPropertyHandler("species", "species"),
  background: createPropertyHandler("background", "background"),
  armor: createPropertyHandler("armor", "armor"),

  // Selection handlers
  generalFeat: createSelectionHandler("generalFeat"),
  arcaneFeat: createSelectionHandler("arcaneFeat"),
  advantage: createSelectionHandler("advantage"),
  ancestryFeat: createSelectionHandler("ancestryFeat"),
  golemUpgrade: createSelectionHandler("golemUpgrade"),
  runegunUpgrade: createSelectionHandler("runegunUpgrade"),

  // Collection handlers
  spell: createCollectionHandler("spell", {
    collectionKey: "knownSpells",
    replaceKey: "replaceSpell",
  }),
  weapon: createCollectionHandler("weapon", {
    collectionKey: "weapons",
    replaceKey: "replaceWeapon",
  }),
  gadget: createCollectionHandler("gadget", {
    collectionKey: "gadgets",
    replaceKey: "replaceGadget",
  }),
  metamagic: createCollectionHandler("metamagic", {
    collectionKey: "metamagics",
    replaceKey: "replaceMetamagic",
  }),
  technique: createCollectionHandler("technique", {
    collectionKey: "unlockedActions",
    replaceKey: "replaceTechnique",
  }),

  // Special handlers
  baseStats: createSpecialHandler("baseStats"),
  statIncrease: createSpecialHandler("statIncrease"),
};

// Export types
export type { ModalHandler, UpdateFn };
