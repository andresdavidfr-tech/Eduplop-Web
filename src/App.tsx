import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import AppScreenshots from "./components/AppScreenshots";
import AIPlayground from "./components/AIPlayground";
import RegistrationForm from "./components/RegistrationForm";
import AdminConsole from "./components/AdminConsole";
import Footer from "./components/Footer";

export default function App() {
  const [refreshLeadsTrigger, setRefreshLeadsTrigger] = useState(0);

  const handleScrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 80; // Offset for stick-fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleLeadAdded = () => {
    setRefreshLeadsTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-coral-100 selection:text-coral-600">
      {/* Dynamic Header / Navigation bar */}
      <Navbar onScrollTo={handleScrollToSection} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onScrollTo={handleScrollToSection} />

        {/* Feature grid highlighting key value propositions */}
        <Features />

        {/* Live-reproduced cell phone mockups and highlights */}
        <AppScreenshots />

        {/* Dynamic AI interactive playground */}
        <AIPlayground />

        {/* Secure lead registration form (50% presale off) */}
        <RegistrationForm onLeadAdded={handleLeadAdded} />
      </main>

      {/* Persistent admin console diagnostics preview */}
      <AdminConsole refreshTrigger={refreshLeadsTrigger} />

      {/* Multi-grid beautiful footer */}
      <Footer onScrollTo={handleScrollToSection} />
    </div>
  );
}

