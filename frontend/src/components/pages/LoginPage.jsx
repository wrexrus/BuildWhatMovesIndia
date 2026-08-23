import { CalendarDays, LockKeyhole } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage(
      "Login verified for this prototype. No information has been stored.",
    );
  };

  return (
    <section className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>PwD login</p>
          <h1>Access your application</h1>
        </div>
      </div>

      <section className="page-content auth-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <LockKeyhole />

          <h2>PwD login</h2>

          <p>
            Use your enrolment or UDID number and date of birth.
          </p>

          <label>
            Enrolment number / UDID number

            <input
              required
              placeholder="Enter your number"
            />
          </label>

          <label>
            Date of birth

            <span className="input-icon">
              <input
                required
                placeholder="DD / MM / YYYY"
              />
              <CalendarDays size={18} />
            </span>
          </label>

          <label>
            Quick verification

            <input
              required
              pattern="7"
              placeholder="Enter 7 (3 + 4)"
            />
          </label>

          <button
            className="primary-button"
            type="submit"
          >
            Login
          </button>

          {message && (
            <p
              className="form-success"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <small>
            This is a prototype. No information entered here is stored.
          </small>
        </form>
      </section>
    </section>
  );
}