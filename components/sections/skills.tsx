"use client"

import { forwardRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { skillCategories } from "@/lib/data"

const Skills = forwardRef<HTMLDivElement>(function Skills(_, ref) {
  const [activeTab, setActiveTab] = useState(0)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        setActiveTab((index + 1) % skillCategories.length)
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveTab((index - 1 + skillCategories.length) % skillCategories.length)
      }
    },
    [],
  )

  return (
    <section ref={ref} className="py-20 px-6 bg-[#080808]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Technical Skills</h2>
          <p className="text-xl text-white/80">Technologies and tools I work with</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Tab strip */}
          <div
            role="tablist"
            aria-label="Skill categories"
            className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide"
          >
            {skillCategories.map((cat, index) => (
              <button
                key={cat.label}
                id={`skill-tab-${index}`}
                role="tab"
                aria-selected={activeTab === index}
                aria-controls="skill-tabpanel"
                tabIndex={activeTab === index ? 0 : -1}
                onClick={() => setActiveTab(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === index
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <div
            id="skill-tabpanel"
            role="tabpanel"
            aria-labelledby={`skill-tab-${activeTab}`}
            tabIndex={0}
            className="min-h-[100px]"
          >
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              {skillCategories[activeTab].items.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/20 text-sm px-4 py-2"
                >
                  {skill}
                </Badge>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
})

export default Skills
