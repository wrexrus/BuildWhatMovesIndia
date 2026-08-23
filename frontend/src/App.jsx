import { useEffect, useState } from "react";
import {
  FileCheck2,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import ServiceGrid from "./components/home/ServiceGrid";
import TrackPage from "./components/tracking/TrackPage";

import ApplyPage from "./components/pages/ApplyPage";
import LoginPage from "./components/pages/LoginPage";
import ReportsPage from "./components/pages/ReportsPage";
import FaqPage from "./components/pages/FaqPage";
import ContactPage from "./components/pages/ContactPage";
import AboutPage from "./components/pages/AboutPage";
import CheckStatusPage from "./components/pages/CheckStatusPage";
import DownloadsPage from "./components/pages/DownloadsPage";
import AuthorityPage from "./components/pages/AuthorityPage";

import "./components/pages/FunctionalPages.css";

function Home({ onNavigate }) {
  const principles = [
    [FileCheck2, "Clear steps"],
    [ShieldCheck, "Synthetic data"],
    [HelpCircle, "Accessible help"],
  ];

  const notices = [
    "Carry original documents for verification during assessment.",
    "Ask the selected hospital for your assessment schedule.",
    "This prototype uses synthetic application data only.",
  ];

  return (
    <>
      <Hero
        onTrack={() => onNavigate("track")}
        onApply={() => onNavigate("apply")}
      />

      <ServiceGrid onNavigate={onNavigate} />

      <section className="home-information">
        <article>
          <p className="section-tag">About UDID Saathi</p>

          <h2>
            Built around the person,
            <br />
            not the portal.
          </h2>

          <p>
            We show the real application steps, the office responsible for
            your file, and the appropriate action if your case is delayed.
          </p>

          <div className="principles">
            {principles.map(([Icon, label]) => (
              <span key={label}>
                <Icon size={22} />
                {label}
              </span>
            ))}
          </div>
        </article>

        <aside>
          <div className="notice-head">
            <h2>Important notices</h2>

            <button
              type="button"
              onClick={() => onNavigate("downloads")}
            >
              View all →
            </button>
          </div>

          {notices.map((notice, index) => (
            <button
              className="notice-row"
              key={notice}
              type="button"
              onClick={() => onNavigate("downloads")}
            >
              <i className={index === 2 ? "amber" : ""} />

              <span>
                {notice}
                <small>Read notice →</small>
              </span>
            </button>
          ))}
        </aside>
      </section>
    </>
  );
}

const pageComponents = {
  apply: ApplyPage,
  login: LoginPage,
  reports: ReportsPage,
  faq: FaqPage,
  contact: ContactPage,
};

export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const Page = pageComponents[page];

  let content;

  if (page === "home") {
    content = <Home onNavigate={setPage} />;
  } else if (page === "track") {
    content = <TrackPage />;
  } else if (page === "about") {
    content = <AboutPage onNavigate={setPage} />;
  } else if (page === "status") {
    content = <CheckStatusPage onNavigate={setPage} />;
  } else if (page === "downloads") {
    content = <DownloadsPage />;
  } else if (page === "authority") {
    content = <AuthorityPage />;
  } else if (Page) {
    content = <Page />;
  } else {
    content = <Home onNavigate={setPage} />;
  }

  return (
    <>
      <Header
        page={page}
        onNavigate={setPage}
      />

      <main id="main">{content}</main>

      <Footer />
    </>
  );
}