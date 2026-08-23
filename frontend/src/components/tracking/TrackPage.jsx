import { ArrowRight } from "lucide-react";
import StageTimeline from "../common/StageTimeline";

export default function TrackPage() {
  return (
    <>
      <div className="crumb">
        Home / Track application / Application UDID-S-1028
      </div>

      <section className="title">
        <div>
          <p>APPLICATION UDID-S-1028</p>
          <h1>Physical assessment</h1>
        </div>

        <span>District Hospital, Pune</span>
      </section>

      <section className="tracking">
        <StageTimeline />

        <aside>
          <p className="section-tag">Action needed</p>

          <h2>What to do now</h2>

          <ol>
            <li>Contact the hospital UDID desk.</li>
            <li>Ask for your assessment queue position.</li>
          </ol>

          <button type="button">
            See escalation guidance
            <ArrowRight size={18} />
          </button>
        </aside>
      </section>

      <p className="note">
        Note: All data shown here is synthetic and for reference only.
      </p>
    </>
  );
}