import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import hero from "../assets/hero.png";

const Hero = () => {
  const { t } = useLanguage();

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

      <div className="relative mx-auto flex min-h-[390px] max-w-360 flex-col justify-center px-4 py-12 sm:min-h-[440px] sm:px-6 sm:py-20 lg:min-h-[560px] lg:px-6">
        <div className="hero-rise inline-flex w-fit items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-amber">
          <ShieldCheck size={13} strokeWidth={2.25} />
          {t('heroGovBadge')}
        </div>

        <h1
          className="hero-rise mt-5 max-w-2xl font-serif text-[2rem] leading-[1.08] tracking-[-0.03em] text-white sm:mt-6 sm:text-[3.4rem] lg:text-[4rem]"
          style={{ animationDelay: "80ms" }}
        >
          {t('heroMainTitle')}
        </h1>

        <p
          className="hero-rise mt-5 max-w-xl text-[0.95rem] leading-6 text-white/70 sm:mt-6 sm:text-[1.05rem] sm:leading-7"
          style={{ animationDelay: "160ms" }}
        >
          {t('heroMainSubtitle')}
        </p>

        <div
          className="hero-rise mt-7 flex w-full flex-col items-stretch gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            to="/registration"
            className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-amber px-5 py-3 text-[0.9rem] font-semibold text-navy transition-all hover:bg-amber-400 active:scale-[0.98] sm:w-auto sm:px-6 sm:text-[0.95rem]"
          >
            {t('heroCtaStart')}
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/registration/track-status"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[6px] border border-white/30 px-5 py-3 text-[0.9rem] font-medium text-white transition-all hover:border-white/60 hover:bg-white/10 active:scale-[0.98] sm:w-auto sm:px-6 sm:text-[0.95rem]"
          >
            {t('heroCtaTrack')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;