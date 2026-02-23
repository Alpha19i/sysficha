"use client";

import { useEffect, useState, FC } from "react";

interface LegacyHtmlSectionProps {
  html: string;
}

const LegacyHtmlSection: FC<LegacyHtmlSectionProps> = ({ html }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default LegacyHtmlSection;