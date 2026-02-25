import EditFichaPage from "@/app/ficha/components/edit-ficha-page";
import { getLegacyPdfSections } from "@/app/lib/legacy-index-parser";

type Params = { params: Promise<{ id: string }> };

export default async function FichaByIdPage({ params }: Params) {
  const { id } = await params;
  const pdfSections = getLegacyPdfSections();

  return <EditFichaPage id={id} pdfSections={pdfSections} />;
}
