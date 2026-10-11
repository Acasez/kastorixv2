// src/components/CharacterSheet/MetaMenu/SaveLoadButtons.tsx
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import MetaButton from "./MetaButton";
import {
  useCharacterStore,
  type Character,
} from "../../../stores/useCharacterStore";

// Constants
const STORAGE_PREFIX = "character_";
const STORAGE_CHANGE_EVENT = "character-storage-change";

function getSavedCharacterKeys(): string[] {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .filter((key) => {
      try {
        const item = localStorage.getItem(key);
        return item && isCharacter(JSON.parse(item));
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.localeCompare(b));
}

function isCharacter(value: unknown): value is Character {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { name?: unknown }).name === "string"
  );
}

// Helper to strip prefix for display
function getDisplayName(key: string): string {
  return key.startsWith(STORAGE_PREFIX)
    ? key.substring(STORAGE_PREFIX.length)
    : key;
}

const CLEAR_CHARACTER = "__clear_character__";

export default function SaveLoadButtons() {
  const {
    character,
    resetCharacter,
    loadCharacter,
    exportCharacter,
    importCharacter,
  } = useCharacterStore();

  const importInputRef = useRef<HTMLInputElement>(null);
  const [savedCharacterKeys, setSavedCharacterKeys] = useState<string[]>(
    getSavedCharacterKeys,
  );
  const [selectedCharacterKey, setSelectedCharacterKey] = useState("");

  useEffect(() => {
    const refreshSavedCharacters = () =>
      setSavedCharacterKeys(getSavedCharacterKeys());

    window.addEventListener("storage", refreshSavedCharacters);
    window.addEventListener(STORAGE_CHANGE_EVENT, refreshSavedCharacters);

    return () => {
      window.removeEventListener("storage", refreshSavedCharacters);
      window.removeEventListener(STORAGE_CHANGE_EVENT, refreshSavedCharacters);
    };
  }, []);

  // Returns prefixed key for current character
  const getCurrentCharacterKey = (): string => {
    return `${STORAGE_PREFIX}${character.name.trim()}`;
  };

  const handleSavedCharacterChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedKey = event.target.value;
    if (selectedKey === CLEAR_CHARACTER) {
      clearCharacter();
      setSelectedCharacterKey("");
      return;
    }

    if (selectedKey) {
      setSelectedCharacterKey(selectedKey);
      loadCharacter(selectedKey);
    }
  };

  const handleLoad = () => {
    const name = window.prompt("Enter character name to load:");
    if (!name) return;

    const nameTrimmed = name.trim();
    if (!nameTrimmed) {
      window.alert("Please enter a valid character name.");
      return;
    }

    // Try prefixed first, then non-prefixed (legacy)
    const keysToTry = [`${STORAGE_PREFIX}${nameTrimmed}`, nameTrimmed];

    for (const key of keysToTry) {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed: unknown = JSON.parse(saved);
          if (isCharacter(parsed)) {
            loadCharacter(key);
            setSelectedCharacterKey(key);
            return;
          }
        } catch {
          // Try next key
        }
      }
    }

    window.alert(`No character found with name "${nameTrimmed}"`);
  };

  const deleteCharacter = () => {
    if (!selectedCharacterKey) {
      window.alert("Select a saved character before deleting.");
      return;
    }

    if (
      !window.confirm(
        `Delete saved character "${getDisplayName(selectedCharacterKey)}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    localStorage.removeItem(selectedCharacterKey);
    setSelectedCharacterKey("");
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
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
    if (!character.name.trim()) {
      window.alert("Enter a character name before exporting.");
      return;
    }

    const file = new Blob([exportCharacter()], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${character.name.trim()}.json`;
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

  const handleSave = () => {
    const key = getCurrentCharacterKey();
    if (!character.name.trim()) {
      window.alert("Enter a character name before saving.");
      return;
    }
    localStorage.setItem(key, JSON.stringify(character));
    setSelectedCharacterKey(key);
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  };

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <select
        value={selectedCharacterKey}
        onChange={handleSavedCharacterChange}
        className="text-md px-1 bg-green-200"
      >
        <option value={CLEAR_CHARACTER}>Default</option>
        {savedCharacterKeys.map((key) => (
          <option key={key} value={key}>
            {getDisplayName(key)}
          </option>
        ))}
      </select>
      <MetaButton
        label="Delete"
        onClick={deleteCharacter}
        variant="characterSheet"
      />
      <MetaButton label="Save" onClick={handleSave} variant="characterSheet" />
      <MetaButton label="Load" onClick={handleLoad} variant="characterSheet" />
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
