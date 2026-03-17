"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import dynamic from "next/dynamic"

const ThreeScene = dynamic(() => import("@/components/three-scene"), { ssr: false })

interface HeroProps {
  onScrollToContact: () => void
  onScrollToProjects: () => void
}

export default function Hero({ onScrollToContact, onScrollToProjects }: HeroProps) {
  return (
    <section className="h-dvh flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 w-full h-full">
        <ThreeScene />
      </div>
      <div className="relative z-10 text-center text-white px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Himanshu Singh
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/80">Software Engineer</p>
          <p className="text-base md:text-lg mb-12 text-white/60 max-w-2xl mx-auto">
            2+ years building internal platforms, infrastructure tooling, and full-stack applications.
            Focused on developer productivity, infrastructure visibility, and automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onScrollToContact}
              className="bg-white text-black hover:bg-white/90 transition-colors"
            >
              Get In Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onScrollToProjects}
              className="border-white/20 text-white hover:bg-white/10"
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/20 text-white hover:bg-white/10"
            >
              <a href="/Himanshu_Singh_Resume.pdf" download>
                <Download className="h-4 w-4 mr-2" />
                Resume
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
