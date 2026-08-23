import { Search } from "lucide-react";
import { useState } from "react";

export default function CheckStatusPage({ onNavigate }) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();

    if (id.trim().toUpperCase() !== "UDID-S-1028") {
      setError("Use the sample application ID: UDID-S-1028.");
      return;
    }

    onNavigate("track");
  };

  return (
    <section className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>Check status</p>
          <h1>Find your application</h1>
        </div>
      </div>

      <div className="page-content lookup-wrap">
        <form className="lookup-form" onSubmit={submit}>
          <Search />

          <h2>Check application status</h2>

          <p>
            Enter the sample ID <b>UDID-S-1028</b> to view the live prototype
            journey.
          </p>

          <label>
            Application ID

            <input
              value={id}
              onChange={(event) => {
                setId(event.target.value);
                setError("");
              }}
              placeholder="e.g. UDID-S-1028"
              aria-describedby="lookup-error"
            />
          </label>

          {error && (
            <p id="lookup-error" className="form-error">
              {error}
            </p>
          )}

          <button className="primary-button" type="submit">
            View status
          </button>
        </form>
      </div>
    </section>
  );
}