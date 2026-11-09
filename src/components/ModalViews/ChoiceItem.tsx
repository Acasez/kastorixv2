import type { Action } from "../../types/Action";
import type { Species } from "../../types/Species";
import type { DetailField } from "./choiceData";

export interface ChoiceItem {
  name: string;
  description?: string;
  effect?: string;
  actionIcons?: string[];
  details?: DetailField[];
  aspects?: string;
  traits?: string;
  type?: string;
  weaponGroup?: string;
  requirement?: string;
  level?: number | string;
  repeatable?: boolean;
  unlockedActions?: Action[];
  techniques?: Action[];
  actionCost?: string;
  choice?: string;
  choiceOptions?: ChoiceItem[];
  species?: Species[];
}
