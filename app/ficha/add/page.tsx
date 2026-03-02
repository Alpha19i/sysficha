import FormSection from "@/app/components/form-section";
import LegacyHtmlSection from "@/app/components/legacy-html-section";
import LogoutButton from "@/app/components/logout-button";
import { getLegacyPdfSections } from "@/app/lib/legacy-index-parser";
import { FichaProvider } from "@/app/ficha/state/ficha-store";
import Link from "next/link";

export default function AddFicha() {
  const pdfSections: string[] = getLegacyPdfSections();

  return (
    <FichaProvider>
      <main>
        <LogoutButton />
        <div style={{ maxWidth: 980, margin: "8px auto 0", padding: "0 10px" }}>
          <Link href="/" className="btn" style={{ textDecoration: "none", color: "#000" }}>
            Voltar para Home
          </Link>
        </div>
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
