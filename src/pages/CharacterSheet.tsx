import LevelSidebar from "../components/CharacterSheet/LevelSidebar";
import { CharacterProvider } from "../contexts/CharacterProvider";

export default function RPGOverview() {
  return (
    <>
      <CharacterProvider>
        <LevelSidebar />
      </CharacterProvider>
    </>
  );
}
