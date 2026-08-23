import { Accessibility, FileText } from "lucide-react";

export default function Brand() {
  return (
    <span className="brand">
      <span className="mark">
        <FileText size={24} />
        <Accessibility size={15} />
      </span>

      <span>
        <b>UDID Saathi</b>
        <small>Disability Application Support</small>
      </span>
    </span>
  );
}