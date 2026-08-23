import { Download, FileText } from "lucide-react";

const documents = [
  [
    "Application process guide",
    "Plain-language guide to the nine stages.",
  ],
  [
    "Document checklist",
    "Documents to prepare before applying.",
  ],
  [
    "Assessment visit checklist",
    "What to carry when you visit the hospital.",
  ],
];

function downloadFile(name, content) {
  const blob = new Blob([content], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `${name
    .toLowerCase()
    .replaceAll(" ", "-")}.txt`;

  anchor.click();

  URL.revokeObjectURL(url);
}

export default function DownloadsPage() {
  return (
    <section className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>Downloads</p>
          <h1>Forms and guides</h1>
        </div>
      </div>

      <div className="page-content downloads">
        <p className="breadcrumb">Home / Downloads</p>

        <h2>Useful resources</h2>

        <p>
          These prototype downloads are generated locally and contain no
          personal data.
        </p>

        {documents.map(([title, detail]) => (
          <article key={title}>
            <FileText />

            <div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>

            <button
              onClick={() =>
                downloadFile(
                  title,
                  `${title}\n\n${detail}\n\nUDID Saathi independent hackathon prototype.`,
                )
              }
            >
              <Download size={17} />
              Download
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}