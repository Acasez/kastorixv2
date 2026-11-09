// src/components/ModalViews/handlers/index.ts
import type { ModalRequest } from "../modalTypes";
import {
  createSelectionHandler,
  createPropertyHandler,
  createCollectionHandler,
  createSpecialHandler,
} from "./factory";
import type { ModalHandler } from "./types";

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

  // Collection handlers - now fully type-safe
  spell: createCollectionHandler("spell"),
  weapon: createCollectionHandler("weapon"),
  gadget: createCollectionHandler("gadget"),
  metamagic: createCollectionHandler("metamagic"),
  technique: createCollectionHandler("technique"),

  // Special handlers
  baseStats: createSpecialHandler("baseStats"),
  statIncrease: createSpecialHandler("statIncrease"),
};

export type { ModalHandler };
