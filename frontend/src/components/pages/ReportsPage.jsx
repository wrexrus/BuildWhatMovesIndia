import { Download, RotateCcw } from "lucide-react";
import { useState } from "react";

const rows = [
  ["Andhra Pradesh", "7,979", "4,506", "2,475"],
  ["Bihar", "1,25,522", "84,836", "26,015"],
  ["Delhi", "25,348", "16,563", "5,272"],
  ["Maharashtra", "43,907", "12,014", "18,886"],
];

export default function ReportsPage() {
  const [state, setState] = useState("");
  const [notice, setNotice] = useState("");

  const visibleRows = state
    ? rows.filter((row) => row[0] === state)
    : rows;

  const download = () => {
    const csv = [
      "State name,Total pending,More than 6 months,UDID generated",
      ...visibleRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "udid-saathi-sample-report.csv";
    link.click();

    URL.revokeObjectURL(url);

    setNotice("Sample CSV downloaded.");
  };

  const resetFilters = () => {
    setState("");
    setNotice("Filters reset.");
  };

  return (
    <main className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>Reports</p>
          <h1>District and hospital pendency</h1>
        </div>
      </div>

      <section className="page-content">
        <p className="breadcrumb">
          Home / Reports / Pendency report
        </p>

        <div className="report-controls">
          <label>
            State / UT

            <select
              value={state}
              onChange={(event) => setState(event.target.value)}
            >
              <option value="">All States / UTs</option>
              <option>Delhi</option>
              <option>Maharashtra</option>
            </select>
          </label>

          <button
            className="secondary-button"
            type="button"
            onClick={resetFilters}
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={download}
          >
            <Download size={17} />
            Download CSV
          </button>
        </div>

        <p className="data-note">
          Synthetic sample report for the hackathon prototype.
        </p>

        {notice && (
          <p
            className="form-success"
            role="status"
          >
            {notice}
          </p>
        )}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>State name</th>
                <th>Total pending</th>
                <th>More than 6 months</th>
                <th>UDID generated</th>
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}