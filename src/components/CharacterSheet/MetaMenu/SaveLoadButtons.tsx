import { useEffect, useRef, useState, type ChangeEvent } from "react";
import MetaButton from "./MetaButton";
import {
  useCharacter,
  type Character,
} from "../../../contexts/CharacterContext";

function isCharacter(value: unknown): value is Character {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { name?: unknown }).name === "string"
  );
}

function getSavedCharacterNames() {
  return Object.keys(localStorage)
    .filter((key) => {
      try {
        return isCharacter(JSON.parse(localStorage.getItem(key) ?? ""));
      } catch {
        return false;
      }
    })
    .sort((firstName, secondName) => firstName.localeCompare(secondName));
}

const CLEAR_CHARACTER = "__clear_character__";

function mergeCharacter(current: Character, saved: Character): Character {
  return {
    ...current,
    ...saved,
    baseStats: { ...current.baseStats, ...saved.baseStats },
    health: { ...current.health, ...saved.health },
    aura: { ...current.aura, ...saved.aura },
    mana: { ...current.mana, ...saved.mana },
    speeds: { ...current.speeds, ...saved.speeds },
    spellShaping: { ...current.spellShaping, ...saved.spellShaping },
  };
}

export default function SaveLoadButtons() {
  const { character, setCharacter, resetCharacter } = useCharacter();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [savedCharacterNames, setSavedCharacterNames] = useState(
    getSavedCharacterNames,
  );
  const [selectedCharacterName, setSelectedCharacterName] = useState("");

  const refreshSavedCharacters = () =>
    setSavedCharacterNames(getSavedCharacterNames());

  useEffect(() => {
    const handleStorageChange = () =>
      setSavedCharacterNames(getSavedCharacterNames());

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getCharacterKey = () => character.name.trim();

  const saveCharacter = () => {
    const characterKey = getCharacterKey();
    if (!characterKey) {
      window.alert("Enter a character name before saving.");
      return;
    }

    localStorage.setItem(characterKey, JSON.stringify(character));
    refreshSavedCharacters();
    window.alert(`Saved character "${characterKey}".`);
  };

  const loadCharacter = (selectedKey = getCharacterKey()) => {
    const characterKey = selectedKey;
    if (!characterKey) {
      window.alert("Enter a character name before loading.");
      return;
    }

    const savedCharacter = localStorage.getItem(characterKey);
    if (!savedCharacter) {
      window.alert(`No saved character found for "${characterKey}".`);
      return;
    }

    try {
      const savedData: unknown = JSON.parse(savedCharacter);
      if (!isCharacter(savedData)) {
        throw new Error("Invalid character format");
      }

      setCharacter((current) => mergeCharacter(current, savedData));
    } catch {
      window.alert(`Saved character "${characterKey}" is invalid.`);
    }
  };

  const handleSavedCharacterChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedKey = event.target.value;
    if (selectedKey === CLEAR_CHARACTER) {
      clearCharacter();
      setSelectedCharacterName("");
      return;
    }

    if (selectedKey) {
      setSelectedCharacterName(selectedKey);
      loadCharacter(selectedKey);
    }
  };

  const deleteCharacter = () => {
    if (!selectedCharacterName) {
      window.alert("Select a saved character before deleting.");
      return;
    }

    if (
      !window.confirm(
        `Delete saved character "${selectedCharacterName}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    localStorage.removeItem(selectedCharacterName);
    setSelectedCharacterName("");
    refreshSavedCharacters();
  };

  const exportCharacter = () => {
    const characterKey = getCharacterKey();
    if (!characterKey) {
      window.alert("Enter a character name before exporting.");
      return;
    }

    const file = new Blob([JSON.stringify(character, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${characterKey}.json`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const importCharacter = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const importedCharacter: unknown = JSON.parse(await file.text());
      if (!isCharacter(importedCharacter)) {
        throw new Error("Invalid character format");
      }

      setCharacter((current) => mergeCharacter(current, importedCharacter));
    } catch {
      window.alert("The selected file is not a valid character JSON file.");
    }
  };

  const clearCharacter = () => {
    if (
      !window.confirm(
        "Clear the current character? Saved characters will not be affected.",
      )
    ) {
      return;
    }

    resetCharacter();
  };

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <select
        value={selectedCharacterName}
        onChange={handleSavedCharacterChange}
        className="text-sm px-1 py-1 bg-green-200"
      >
        <option value={CLEAR_CHARACTER}>Default</option>
        {savedCharacterNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <MetaButton label="Delete" onClick={deleteCharacter} />
      <MetaButton label="Save" onClick={saveCharacter} />
      <MetaButton label="Load" onClick={loadCharacter} />
      <MetaButton label="Export" onClick={exportCharacter} />
      <MetaButton
        label="Import"
        onClick={() => importInputRef.current?.click()}
      />
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        onChange={importCharacter}
        className="hidden"
      />
    </div>
  );
}
