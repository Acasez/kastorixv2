import "../CSS/LevelOneSetup.css";

const setupSteps = [
  {
    title: "Species",
    detail: "Grants base mana & health, stat increases and special abilities.",
  },
  {
    title: "Base Stats",
    detail: "Assign the standard array (3, 1, 0, −1) to your four core stats.",
  },
  {
    title: "Background",
    detail: "Provides skill proficiencies and special abilities.",
  },
  { title: "Advantage", detail: "Pick one — grants a special ability." },
];

const featChoices = [
  { count: 2, label: "Arcane Feats" },
  { count: 1, label: "General Feat" },
  { count: 1, label: "Ancestry Feat" },
];

const derivedGains = [
  { stat: "WIL", gain: "Mana", note: "Increase mana by your WIL" },
  { stat: "PHY", gain: "Health", note: "Increase health by your PHY" },
  { stat: "INT", gain: "Skills", note: "Skill proficiencies based on INT" },
  {
    stat: "INT",
    gain: "Spells",
    note: "Extra spells based on INT — lost if INT is negative",
  },
];

export default function LevelOneSetup() {
  return (
    <section className="level-one" aria-labelledby="level-one-title">
      <header className="level-one__header">
        <div className="level-one__heading">
          <span className="level-one__rank">Rank I · Apprentice</span>
          <h2 id="level-one-title">Level One</h2>
          <p className="level-one__subtitle">
            Everything a new character creates at first level.
          </p>
        </div>
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
