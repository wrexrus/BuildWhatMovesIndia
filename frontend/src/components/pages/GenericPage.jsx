const content = {
  about: [
    "About UDID",
    "A national disability identity journey, made clearer.",
    "UDID Saathi is an independent hackathon prototype that helps applicants understand the real path from application to certificate.",
  ],

  status: [
    "Check status",
    "See your application in context.",
    "Use the Track application screen to view the full synthetic application journey, including the office responsible for the current stage.",
  ],

  downloads: [
    "Downloads",
    "Forms, receipts and application resources.",
    "This prototype provides a clearer place to find documents and understand how they are used during the UDID process.",
  ],

  authority: [
    "Find medical authority",
    "Know where your application is assessed.",
    "Select a state and district on the official journey to identify the appropriate hospital or medical authority.",
  ],
};

export default function GenericPage({ page }) {
  const [title, subtitle, copy] = content[page];

  return (
    <main className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>{title}</p>
          <h1>{subtitle}</h1>
        </div>
      </div>

      <section className="page-content simple-content">
        <p className="breadcrumb">Home / {title}</p>

        <h2>{title}</h2>

        <p>{copy}</p>

        <div className="simple-points">
          <span>Clear guidance</span>
          <span>Accessible layout</span>
          <span>Synthetic prototype data</span>
        </div>
      </section>
    </main>
  );
}