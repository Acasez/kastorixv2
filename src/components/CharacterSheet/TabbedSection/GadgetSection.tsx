import { useState } from "react";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import { useCharacter } from "../../../contexts/CharacterContext";
import type { Gadget } from "../../../types/Gadgets";
import gadgets from "../../../JSON/gadgets.json";
import ModalWrapper from "../../ModalViews/ModalWrapper";
import { getCharacterGadgetGrant } from "../../../utils/characterSpellGrants";

interface GadgetComponentProps {
  gadget: Gadget;
  onReplaceGadget: (gadgetName: string) => void;
  onRemoveGadget: (gadgetName: string) => void;
}

function GadgetComponent({
  gadget,
  onReplaceGadget,
  onRemoveGadget,
}: GadgetComponentProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onReplaceGadget(gadget.name)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onReplaceGadget(gadget.name);
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        onRemoveGadget(gadget.name);
      }}
      aria-label={`${gadget.name}. Click to replace or right-click to remove.`}
      className="flex w-full cursor-pointer flex-col gap-2 rounded-lg border border-gray-500 bg-gray-800 px-3 py-2 text-left shadow-sm transition-colors hover:border-gray-300"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-base font-semibold text-white">
          {gadget.name}
        </span>
        <span className="text-sm text-gray-300">
          Type <strong className="text-white">{gadget.type}</strong>
        </span>
        <span className="text-sm text-gray-300">
          Level <strong className="text-white">{gadget.level}</strong>
        </span>
        {gadget.requirement && (
          <span className="text-sm text-gray-300">
            Requirement{" "}
            <strong className="text-white">{gadget.requirement}</strong>
          </span>
        )}
      </div>
      <p className="whitespace-pre-line text-sm text-gray-300">
        {gadget.effect}
      </p>
    </div>
  );
}

export default function GadgetSection() {
  const { character, updateCharacter } = useCharacter();
  const [modalRequest, setModalRequest] = useState<ModalRequest | null>(null);
  const maxKnownGadgets = getCharacterGadgetGrant(character);

  const openGadgetModal = () => {
    openGadgetModalForReplacement();
  };

  const openGadgetModalForReplacement = (replaceGadget?: string) => {
    setModalRequest({
      type: "gadget",
      title: replaceGadget ? `Replace ${replaceGadget}` : `Select Gadget`,
      selectionKey: "",
      level: character.level,
      replaceGadget,
    });
  };

  const onRemoveGadget = (gadget: string) => {
    updateCharacter({
      gadgets: character.gadgets.filter((name) => name !== gadget),
    });
  };
  return (
    <div className="p-4 text-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl mb-2">Gadgets</h2>
        <div className="flex items-center gap-3">
          <p
            className={`text-right ${
              character.gadgets.length > maxKnownGadgets
                ? "text-red-500"
                : character.gadgets.length < maxKnownGadgets
                  ? "text-green-500"
                  : "text-text-light"
            }`}
          >
            Gadgets Chosen ({character.gadgets.length}/{maxKnownGadgets})
          </p>
          <button
            type="button"
            className="bg-button-add text-white px-3 py-1 rounded border-2"
            onClick={openGadgetModal}
            aria-label="Add gadget"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2 mt-3">
          {gadgets
            .filter((gadget) => character.gadgets.includes(gadget.name))
            .map((gadget) => (
              <GadgetComponent
                key={gadget.name}
                gadget={gadget}
                onReplaceGadget={openGadgetModalForReplacement}
                onRemoveGadget={onRemoveGadget}
              />
            ))}
        </div>
      </div>
      {modalRequest && (
        <ModalWrapper
          request={modalRequest}
          closeModal={() => setModalRequest(null)}
        />
      )}
    </div>
  );
}
