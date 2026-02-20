import FormSection from "@/app/components/form-section";
import LegacyHtmlSection from "@/app/components/legacy-html-section";
import LegacyScripts from "@/app/components/legacy-scripts";
import LogoutButton from "@/app/components/logout-button";
import { getLegacyPdfSections } from "@/app/lib/legacy-index-parser";

export default function AddFicha() {
  const pdfSections = getLegacyPdfSections();

  return (
    <main>
      <LogoutButton />
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
