import { useState } from "react";
import CreatureBlock from "../components/DMScreen/CreatureBlock";

export default function DMScreen() {
  const [creatureBlocks, setCreatureBlocks] = useState([0]);
  const [nextBlockId, setNextBlockId] = useState(1);

  const addCreatureBlock = () => {
    setCreatureBlocks((blocks) => [...blocks, nextBlockId]);
    setNextBlockId((id) => id + 1);
  };

  const removeCreatureBlock = (blockId: number) =>
    setCreatureBlocks((blocks) => blocks.filter((id) => id !== blockId));

  return (
    <div className="mx-auto flex w-full max-w-screen-3xl flex-col items-center gap-5 p-4 sm:p-6">
      <div className="grid w-full gap-5 xl:grid-cols-2">
        {creatureBlocks.map((blockId) => (
          <CreatureBlock
            key={blockId}
            onRemove={() => removeCreatureBlock(blockId)}
          />
        ))}
      </div>
      <button className="creature-button" onClick={addCreatureBlock}>
        Add New Creature
      </button>
    </div>
  );
}
