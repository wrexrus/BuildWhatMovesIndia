import { MapPin } from "lucide-react";
import { useState } from "react";

export default function AuthorityPage() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const canSearch = state && district;

  return (
    <section className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>Find office</p>
          <h1>Find a medical authority</h1>
        </div>
      </div>

      <div className="page-content authority">
        <p className="breadcrumb">Home / Find office</p>

        <h2>Search by location</h2>

        <p>
          Select a sample state and district to see how the service would guide
          an applicant.
        </p>

        <div className="authority-controls">
          <label>
            State / UT

            <select
              value={state}
              onChange={(event) => setState(event.target.value)}
            >
              <option value="">Choose a State / UT</option>
              <option>Delhi</option>
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
            </select>
          </label>

          <label>
            District

            <select
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
            >
              <option value="">Choose a district</option>
              <option>New Delhi</option>
              <option>Pune</option>
              <option>Chennai</option>
            </select>
          </label>
        </div>

        {canSearch && (
          <div className="authority-result">
            <MapPin />

            <div>
              <b>
                {district === "Pune"
                  ? "District Hospital, Pune"
                  : `${district} Medical Authority`}
              </b>

              <span>
                Assessment and disability certification desk · synthetic
                prototype listing
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}