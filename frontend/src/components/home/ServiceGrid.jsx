import {
  BarChart3,
  ClipboardList,
  FilePlus2,
  HelpCircle,
  LogIn,
  MapPin,
} from "lucide-react";

const services = [
  [
    FilePlus2,
    "Apply for UDID",
    "Understand the process before you apply.",
    "apply",
  ],
  [
    ClipboardList,
    "Track application",
    "See the real status of a sample application.",
    "track",
  ],
  [
    LogIn,
    "PwD login",
    "Access your application securely.",
    "login",
  ],
  [
    BarChart3,
    "Public reports",
    "Read accessible sample reports.",
    "reports",
  ],
  [
    MapPin,
    "Find medical authority",
    "Know which office can assess your case.",
    "authority",
  ],
  [
    HelpCircle,
    "FAQs and support",
    "Get plain-language answers.",
    "faq",
  ],
];

export default function ServiceGrid({ onNavigate }) {
  return (
    <section className="services">
      <div className="services-intro">
        <p className="section-tag">Services</p>

        <h2>Start with what you need.</h2>

        <p>
          Familiar government services, redesigned to be easier to understand
          and use.
        </p>
      </div>

      <div className="service-grid">
        {services.map(([Icon, title, text, route]) => (
          <button
            key={title}
            onClick={() => onNavigate(route)}
          >
            <Icon />

            <span>
              <b>{title}</b>
              <small>{text}</small>
            </span>

            <em>→</em>
          </button>
        ))}
      </div>
    </section>
  );
}