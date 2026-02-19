export default function LegacyHtmlSection({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
