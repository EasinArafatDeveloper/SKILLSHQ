import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Courses from "@/components/Courses"
import Pricing from "@/components/Pricing"
import Testimonials from "@/components/Testimonials"
import CTA from "@/components/CTA"
import FAQ from "@/components/FAQ"
import Footer from "@/components/Footer"
import StickyCountdownBar from "@/components/StickyCountdownBar"
import FloatingContact from "@/components/FloatingContact"

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <StickyCountdownBar />
      <Header />
      <Hero />
      <Features />
      <Courses />
      <Pricing />
      <Testimonials />
      <CTA />
      <FAQ />
      <Footer />
      <FloatingContact />
    </main>
  )
}
