import "./globals.css";

export const metadata = {
  title: "Ficha - Refactor",
  description: "Migracao inicial para Next.js"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/sections/formulario.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
