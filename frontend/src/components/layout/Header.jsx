import { useState } from "react";
import {
  CircleHelp,
  Home,
  MapPin,
  Menu,
  UserRound,
} from "lucide-react";
import Brand from "../common/Brand";

const links = [
  ["home", "Home"],
  ["about", "About UDID"],
  ["apply", "Apply for UDID"],
  ["track", "Track application"],
  ["status", "Check status"],
  ["downloads", "Downloads"],
  ["faq", "FAQs"],
  ["contact", "Contact us"],
];

export default function Header({ page, onNavigate }) {
  const [open, setOpen] = useState(false);

  const go = (next) => {
    onNavigate(next);
    setOpen(false);
  };

  return (
    <header>
      <a className="skip" href="#main">
        Skip to main content
      </a>

      <div className="utility-bar">
        <div>
          <span>Skip to main content</span>
          <span>Screen reader access</span>

          <button>A-</button>
          <button>A</button>
          <button>A+</button>

          <span className="contrast">High contrast</span>
        </div>

        <button>English⌄</button>
      </div>

      <div className="identity-bar">
        <button
          className="brandbtn"
          onClick={() => go("home")}
        >
          <Brand />
        </button>

        <div className="utility-links">
          <button onClick={() => go("faq")}>
            <CircleHelp />
            Help
          </button>

          <button onClick={() => go("authority")}>
            <MapPin />
            Find office
          </button>

          <button onClick={() => go("login")}>
            <UserRound />
            Login
          </button>
        </div>

        <button
          className="menubtn"
          aria-label="Open navigation"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>
      </div>

      <nav className={open ? "open" : ""}>
        {links.map(([key, label]) => (
          <button
            className={page === key ? "active" : ""}
            onClick={() => go(key)}
            key={key}
          >
            {key === "home" && <Home />}
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}