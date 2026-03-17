"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { navItems } from "@/lib/data"

import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import Skills from "@/components/sections/skills"
import Experience from "@/components/sections/experience"
import Projects from "@/components/sections/projects"
import Contact from "@/components/sections/contact"

export default function Portfolio() {
  const aboutRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    about: aboutRef,
    skills: skillsRef,
    experience: experienceRef,
    projects: projectsRef,
    contact: contactRef,
  }

  const scrollTo = (sectionId: string) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:p-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.span
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Himanshu Singh
            </motion.span>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.sectionId)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Nav */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#111111] border-white/10">
                <SheetTitle className="text-white">Navigation</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => scrollTo(item.sectionId)}
                      className="text-white/80 hover:text-white transition-colors text-lg text-left"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main id="main-content">
        <Hero
          onScrollToContact={() => scrollTo("contact")}
          onScrollToProjects={() => scrollTo("projects")}
        />
        <About ref={aboutRef} />
        <Skills ref={skillsRef} />
        <Experience ref={experienceRef} />
        <Projects ref={projectsRef} />
        <Contact ref={contactRef} />
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="container mx-auto text-center">
          <p className="text-white/60">&copy; {new Date().getFullYear()} Himanshu Singh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
