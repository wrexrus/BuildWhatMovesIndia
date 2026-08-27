import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../assets/hero.png";

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden bg-navy">
      <style>{`
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-rise { animation: heroRise 700ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise { animation: none; }
        }
      `}</style>

      <img
        src={hero}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-95"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[360px] max-w-360 flex-col justify-center px-6 py-16 sm:min-h-[440px] sm:py-20 lg:min-h-[560px]">
        <div className="hero-rise inline-flex w-fit items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-amber">
          <ShieldCheck size={13} strokeWidth={2.25} />
          Government of India
        </div>

        <h1
          className="hero-rise mt-6 max-w-2xl font-serif text-[2.6rem] leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.4rem] lg:text-[4rem]"
          style={{ animationDelay: "80ms" }}
        >
          Goods and Services Tax, simplified for every taxpayer.
        </h1>

        <p
          className="hero-rise mt-6 max-w-xl text-[1.05rem] leading-7 text-white/70"
          style={{ animationDelay: "160ms" }}
        >
          Register, file returns, track applications and manage payments
          through a single, secure GST Portal built for businesses across
          India.
        </p>

        <div
          className="hero-rise mt-9 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            to="/registration"
            className="group inline-flex items-center gap-2 rounded-[6px] bg-amber px-6 py-3 text-[0.95rem] font-semibold text-navy transition-all hover:bg-amber-400 active:scale-[0.98]"
          >
            Start new registration
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/registration/track-status"
            className="inline-flex items-center gap-2 rounded-[6px] border border-white/30 px-6 py-3 text-[0.95rem] font-medium text-white transition-all hover:border-white/60 hover:bg-white/10 active:scale-[0.98]"
          >
            Track application status
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;