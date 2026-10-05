// src/pages/DMScreen.tsx
import { useState } from "react";
import CreatureBlock from "../components/DMScreen/CreatureBlock";
import MetaButton from "../components/CharacterSheet/MetaMenu/MetaButton";
import { useCreatureStore } from "../stores/useCreatureStore";

export default function DMScreen() {
  const [creatureBlocks, setCreatureBlocks] = useState([0]);
  const [nextBlockId, setNextBlockId] = useState(1);
  const removeCreature = useCreatureStore((state) => state.removeCreature);

  const addCreatureBlock = () => {
    setCreatureBlocks((blocks) => [...blocks, nextBlockId]);
    setNextBlockId((id) => id + 1);
  };

  const removeCreatureBlock = (blockId: number) => {
    setCreatureBlocks((blocks) => blocks.filter((id) => id !== blockId));
    removeCreature(blockId); // Clean up the store
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-3xl flex-col items-center gap-4 sm:p-4">
      <div className="grid w-full gap-4 xl:grid-cols-2">
        {creatureBlocks.map((blockId) => (
          <CreatureBlock
            key={blockId}
            blockId={blockId}
            onRemove={() => removeCreatureBlock(blockId)}
          />
        ))}
      </div>
      <MetaButton
        label={"Add New Creature"}
        variant={"characterSheet"}
        onClick={addCreatureBlock}
      />
    </div>
  );
}
