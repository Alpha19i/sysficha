import Script from "next/script";

const LEGACY_SCRIPTS = [
  "/js/config.js",
  "/js/clear_form.js",
  "/js/state.js",
  "/js/validators.js",
  "/js/masks.js",
  "/js/ui-feedback.js",
  "/js/dates.js",
  "/js/fields.js",
  "/js/sections.js",
  "/js/navigation.js",
  "/js/pdf.js",
  "/js/json-import.js",
  "/js/images.js",
  "/js/main.js"
];

export default function LegacyScripts() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.0/html2pdf.bundle.min.js"
        strategy="afterInteractive"
      />
      {LEGACY_SCRIPTS.map((src) => (
        <Script key={src} src={src} strategy="afterInteractive" />
      ))}
    </>
  );
}
