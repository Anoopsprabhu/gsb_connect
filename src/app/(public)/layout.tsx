import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ScrollRevealProvider>
      <Navbar />
      <main className="flex-grow flex flex-col w-full">{children}</main>
      <Footer />
    </ScrollRevealProvider>
  );
}
