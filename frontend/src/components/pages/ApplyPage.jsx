import {
  CheckCircle2,
  FileText,
  Hospital,
  Upload,
} from "lucide-react";
import { useState } from "react";

const steps = [
  [
    FileText,
    "Complete your application",
    "Add your personal, identity and disability details.",
  ],
  [
    Upload,
    "Upload documents",
    "Keep photo ID, address proof and medical papers ready.",
  ],
  [
    Hospital,
    "Visit the selected hospital",
    "After “Submitted”, contact the hospital UDID desk for assessment scheduling.",
  ],
  [
    CheckCircle2,
    "Receive your certificate",
    "The Medical Board reviews the assessment before the card is generated.",
  ],
];

export default function ApplyPage() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="inner-page">
      <div className="page-banner">
        <div>
          <p>Apply for UDID</p>
          <h1>
            Start prepared.
            <br />
            Know every step.
          </h1>
        </div>
      </div>

      <div className="page-content">
        <p className="breadcrumb">Home / Apply for UDID</p>

        <section className="apply-intro">
          <h2>Steps to get your UDID card and disability certificate</h2>

          <p>
            Use this guide before visiting the official application portal. It
            explains the journey in the same order that your application will
            move through it.
          </p>
        </section>

        <div className="apply-steps">
          {steps.map(([Icon, title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>

              <Icon />

              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="process-alert">
          <b>Important after submission</b>

          <p>
            The portal may only show “Submitted”. This is the moment to contact
            the hospital or CMO/DMO office chosen in your application—do not
            wait indefinitely for an update.
          </p>
        </div>

        <label className="acknowledge">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />

          I understand this is a guide and the official portal handles
          applications.
        </label>

        <button
          className="primary-button"
          disabled={!confirmed}
        >
          Continue to official guidance
        </button>

        {confirmed && (
          <p className="form-success">
            Guide acknowledged. You can now use the official application
            channel.
          </p>
        )}
      </div>
    </section>
  );
}