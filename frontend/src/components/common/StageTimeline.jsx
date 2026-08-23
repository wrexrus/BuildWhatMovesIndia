import { stages } from "../../data/application";

export default function StageTimeline({ compact = false }) {
  return (
    <ol className={compact ? "hero-process" : "timeline"}>
      {stages.map(([number, title, detail]) => (
        <li
          className={number === "07" ? "current" : ""}
          key={number}
        >
          <span>{Number(number)}</span>

          <div>
            <b>
              {compact && number === "07"
                ? "Physical assessment"
                : title}
            </b>

            {(!compact || number === "07") && (
              <small>{detail}</small>
            )}

            {compact && number === "07" && (
              <em>Current stage</em>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}