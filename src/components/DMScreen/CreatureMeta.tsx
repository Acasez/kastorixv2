import MetaButton from "../CharacterSheet/MetaMenu/MetaButton";

export default function CreatureMeta() {
  function saveCreature(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-bg-rules text-text-black w-100 h-20 text-center">
      <MetaButton label="Save" onClick={saveCreature} />
    </div>
  );
}
