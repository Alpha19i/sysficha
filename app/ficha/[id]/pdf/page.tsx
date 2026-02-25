import FichaPdfPage from "@/app/ficha/components/ficha-pdf-page";
import { getLegacyPdfSections } from "@/app/lib/legacy-index-parser";

type Params = { params: Promise<{ id: string }> };

export default async function FichaPdfByIdPage({ params }: Params) {
  const { id } = await params;
  const pdfSections = getLegacyPdfSections();

  return <FichaPdfPage id={id} pdfSections={pdfSections} />;
}
