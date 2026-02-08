import "./globals.css";
import "../styles/tokens.css";

export const metadata = {
  title: "FX Web App",
  description: "FX platform UI scaffold",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
