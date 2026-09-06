import LevelSidebar from "../components/CharacterSheet/LevelSidebar";
import { CharacterProvider } from "../components/CharacterSheet/CharacterContext";

export default function RPGOverview() {
  return (
    <>
      <CharacterProvider>
        <LevelSidebar />
      </CharacterProvider>
    </>
  );
}
