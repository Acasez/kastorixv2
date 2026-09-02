import "../CSS/LevelOneSetup.css";

const setupSteps = [
  {
    title: "Base Stats",
    detail:
      "Choose to distribute the standard array [3, 1, 0, −1] among your four core stats.",
  },
  {
    title: "Species",
    detail:
      "Choose a species which sets your base health and mana, and provides some abilities",
  },
  {
    title: "Background",
    detail:
      "Provides skill proficiencies, starting equipment and a general feat",
  },
  {
    title: "Advantage",
    detail:
      "Pick one advantage that differentiates your character from the rest",
  },
];

const featChoices = [
  { count: 2, label: "Arcane Feats" },
  { count: 1, label: "General Feat" },
  { count: 1, label: "Ancestry Feat" },
];

const derivedGains = [
  { stat: "WIL", gain: "Mana", note: "Increase mana by your WIL" },
  { stat: "PHY", gain: "Health", note: "Increase health by your PHY" },
  {
    stat: "INT",
    gain: "Skills",
    note: "Become trained in a number of skills equal to INT",
  },
  {
    stat: "INT",
    gain: "Spells",
    note: "Learn extra spells equal to INT, lose spells if your INT is negative",
  },
];

export default function LevelOneSetup() {
  return (
    <section className="level-one" aria-labelledby="level-one-title">
      <header className="level-one-header">
        <div className="level-one-heading">
          <h2 id="level-one-title">Level One</h2>
          <p className="level-one__subtitle">
            All the choices for a level one character
          </p>
        </div>
        <span className="level-one__rank">Rank I · Apprentice</span>
        <span className="level-one__level-badge">
          LV
          <br />
          01
        </span>
      </header>

      <div className="level-one__body">
        <ol className="level-one__steps">
          {setupSteps.map((step) => (
            <li key={step.title} className="level-one__step">
              <span className="level-one__step-dot" aria-hidden="true" />
              <div>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
          <li className="level-one__step level-one__step--feats">
            <span className="level-one__step-dot" aria-hidden="true" />
            <div>
              <strong>Feats</strong>
              <ul className="level-one__feats">
                {featChoices.map((f) => (
                  <li key={f.label}>
                    <span className="level-one__feat-count">{f.count}×</span>{" "}
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ol>

        <aside className="level-one__gains">
          <h3>Then apply</h3>
          {derivedGains.map((g) => (
            <div key={g.note} className="level-one__gain">
              <span className="level-one__gain-stat">{g.stat}</span>
              <div>
                <strong>+ {g.gain}</strong>
                <p>{g.note}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
