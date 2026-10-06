// src/components/CharacterSheet/MetaMenu/SaveLoadButtons.tsx
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import MetaButton from "./MetaButton";
import {
  useCharacterStore,
  type Character,
} from "../../../stores/useCharacterStore";

function getSavedCharacterNames() {
  return Object.keys(localStorage)
    .filter((key) => {
      try {
        const item = localStorage.getItem(key);
        return item && isCharacter(JSON.parse(item));
      } catch {
        return false;
      }
    })
    .sort((firstName, secondName) => firstName.localeCompare(secondName));
}

// Import the type guard from the store file
function isCharacter(value: unknown): value is Character {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { name?: unknown }).name === "string"
  );
}

const CLEAR_CHARACTER = "__clear_character__";

export default function SaveLoadButtons() {
  const {
    character,
    resetCharacter,
    saveCharacter,
    loadCharacter,
    exportCharacter,
    importCharacter,
  } = useCharacterStore();

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

  const handleExport = () => {
    const characterKey = getCharacterKey();
    if (!characterKey) {
      window.alert("Enter a character name before exporting.");
      return;
    }

    const file = new Blob([exportCharacter()], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${characterKey}.json`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const fileContent = await file.text();
      importCharacter(fileContent);
    } catch {
      window.alert("The selected file is not a valid character JSON file.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <select
        value={selectedCharacterName}
        onChange={handleSavedCharacterChange}
        className="text-md px-1 bg-green-200"
      >
        <option value={CLEAR_CHARACTER}>Default</option>
        {savedCharacterNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <MetaButton
        label="Delete"
        onClick={deleteCharacter}
        variant="characterSheet"
      />
      <MetaButton
        label="Save"
        onClick={() => saveCharacter(getCharacterKey())}
        variant="characterSheet"
      />
      <MetaButton
        label="Load"
        onClick={() => loadCharacter(getCharacterKey())}
        variant="characterSheet"
      />
      <MetaButton
        label="Export"
        onClick={handleExport}
        variant="characterSheet"
      />
      <MetaButton
        label="Import"
        onClick={() => importInputRef.current?.click()}
        variant="characterSheet"
      />
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
