import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ children, hideFooter }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main className="flex-grow w-full flex flex-col">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
