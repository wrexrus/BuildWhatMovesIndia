export default function AboutPage({ onNavigate }) {
  return (
    <section className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>About UDID</p>
          <h1>A transparent public-service journey</h1>
        </div>
      </div>

      <div className="page-content about-page">
        <p className="breadcrumb">Home / About UDID</p>

        <h2>What this prototype changes</h2>

        <p>
          The existing journey often compresses a multi-office process into
          vague status labels. UDID Saathi makes the nine stages visible: from
          registration and document upload through hospital assessment, Medical
          Board review, and certificate generation.
        </p>

        <div className="about-columns">
          <article>
            <h3>For applicants</h3>
            <p>
              See the current stage, the responsible office, the expected next
              action, and when a delay needs follow-up.
            </p>
          </article>

          <article>
            <h3>For officers</h3>
            <p>
              Use the same process language to understand where queues form and
              what applicants need to know.
            </p>
          </article>
        </div>

        <button
          className="primary-button"
          onClick={() => onNavigate("status")}
        >
          Try the status checker
        </button>

        <p className="disclosure">
          Independent hackathon prototype. It is not affiliated with or
          endorsed by the Government of India. All data is synthetic.
        </p>
      </div>
    </section>
  );
}