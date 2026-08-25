import "../CSS/RowStructure.css";

export default function RPGOverview() {
  return (
    <>
      <header>
        <h3 className="portfolio-title">Kastorix</h3>
        <p className="portfolio-subtitle">TTRPG Overview</p>
      </header>

      <section className="portfolio-row reverse">
        {" "}
        {/* Overview */}
        <div className="portfolio-text">
          <img
            className="floated-image"
            src="/images/Maps/Kastorix.jpg"
            alt="Kastorix World Map"
          />
          <p className="portfolio-description">
            Kastorix is the name of both the TTRPG and the world it's set in.
            It's D20 based system heavily inspired by Pathfinder 2e.
            <br />
            <br />
            In Kastorix magic is commonplace and mages are one of the main
            sources of power for nations. There are no classes, instead options
            come from feats and spells. In a sense, everyone is a mage, though
            there is considerable difference between different mages from the
            feats chosen. To start making a character players pick their
            species, then pick up feats and spells
            <br />
            <br />
            The world and magic of Kastorix is inspired by magitech worlds like
            Eberron, Ravnica, Runeterra and Avishkar, as well as progression
            fantasy worlds and stories like Arcane Ascension, Mother of Learning
            and the Journals of Evander Tailor.
            <br />
            <br />
            By design all powerful characters are magic users and rely on their
            auras instead of superhuman durability, though they need not be
            exactly traditional mages. There is room to build tinkering
            artificers, heavily armored magic knights and rogues with magical
            tricks
          </p>
        </div>
      </section>
    </>
  );
}
