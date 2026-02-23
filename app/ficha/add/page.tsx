import FormSection from "@/app/components/form-section";
import LegacyHtmlSection from "@/app/components/legacy-html-section";
import LogoutButton from "@/app/components/logout-button";
import { getLegacyPdfSections } from "@/app/lib/legacy-index-parser";
import { FichaProvider } from "@/app/ficha/state/ficha-store";

export default function AddFicha() {
  const pdfSections: string[] = getLegacyPdfSections();

  return (
    <FichaProvider>
      <main>
        <LogoutButton />
        <FormSection />

        <div id="pagina-pdf">
          {pdfSections.map((section, index) => (
            <LegacyHtmlSection key={index} html={section} />
          ))}
        </div>
      </main>
    </FichaProvider>
  );
}
