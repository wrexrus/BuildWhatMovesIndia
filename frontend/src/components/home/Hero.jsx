import { ArrowRight } from "lucide-react";
import StageTimeline from "../common/StageTimeline";

export default function Hero({ onTrack, onApply }) {
  return (
    <section className="hero">
      <div>
        <p className="section-tag">A clearer UDID journey</p>

        <h1>
          A clearer path to
          <br />
          your UDID card.
        </h1>

        <p>
          Track the real steps, know which office holds your application,
          and get help when it is delayed.
        </p>

        <div className="hero-actions">
          <button className="cta" onClick={onTrack}>
            Track application
            <ArrowRight size={18} />
          </button>

          <button className="hero-secondary" onClick={onApply}>
            Apply for UDID
          </button>
        </div>
      </div>

      <StageTimeline compact />
    </section>
  );
}