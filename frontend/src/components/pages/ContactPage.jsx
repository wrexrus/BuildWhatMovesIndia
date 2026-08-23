import { useState } from "react";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="inner-page">
      <div className="page-banner compact">
        <div>
          <p>Contact us</p>
          <h1>Feedback and support</h1>
        </div>
      </div>

      <section className="page-content contact-layout">
        <aside>
          <h2>Prototype contact</h2>

          <p>
            This independent demonstration does not operate a government
            helpdesk. Use this form to give feedback on the redesign.
          </p>

          <p>
            <Phone size={17} />
            011-0000 0000
          </p>

          <p>
            <Mail size={17} />
            hello@udidsaathi.example
          </p>

          <hr />

          <small>
            Do not enter Aadhaar numbers, medical records, or other personal
            information.
          </small>
        </aside>

        {sent ? (
          <div
            className="form-success contact-success"
            role="status"
          >
            <h2>Feedback recorded</h2>

            <p>
              Thanks for helping improve this hackathon prototype. No message
              has been sent to a government department.
            </p>

            <button
              className="secondary-button"
              onClick={() => setSent(false)}
            >
              Send another response
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <h2>Send feedback</h2>

            <label>
              Name
              <input required />
            </label>

            <label>
              Email
              <input type="email" required />
            </label>

            <label>
              Subject
              <input required />
            </label>

            <label>
              Message
              <textarea rows="6" required />
            </label>

            <button
              className="primary-button"
              type="submit"
            >
              Send feedback
            </button>
          </form>
        )}
      </section>
    </main>
  );
}