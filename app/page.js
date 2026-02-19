import FormSection from "./components/form-section";
import LegacyHtmlSection from "./components/legacy-html-section";
import LegacyScripts from "./components/legacy-scripts";
import { getLegacyPdfSections } from "./lib/legacy-index-parser";

export default function Home() {
  const pdfSections = getLegacyPdfSections();

  return (
    <main>
      <FormSection />
      <div id="pagina-pdf">
        {pdfSections.map((section, index) => (
          <LegacyHtmlSection key={`pdf-section-${index}`} html={section} />
        ))}
      </div>
      <LegacyScripts />
    </main>
  );
}
