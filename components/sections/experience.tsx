"use client"

import { forwardRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import { experiences } from "@/lib/data"

function ExperienceCard({ exp, index }: { exp: (typeof experiences)[number]; index: number }) {
  const [expanded, setExpanded] = useState(exp.defaultExpanded ?? true)
  const hasToggle = exp.bullets.length > 2

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Timeline connector */}
      {index < experiences.length - 1 && (
        <div className="absolute left-6 top-[4.5rem] bottom-0 w-px bg-white/10 hidden md:block" />
      )}

      <div className="flex gap-4 md:gap-6">
        {/* Timeline dot */}
        <div className="hidden md:flex flex-col items-center pt-6">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shrink-0" />
        </div>

        <Card className="bg-[#111111] border-white/5 shadow-md hover:border-white/10 transition-all duration-300 flex-1">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <CardTitle className="text-white text-xl">{exp.title}</CardTitle>
                <CardDescription className="text-blue-400 text-lg">{exp.company}</CardDescription>
                {exp.subtitle && (
                  <p className="text-white/50 text-sm mt-1">{exp.subtitle}</p>
                )}
              </div>
              <div className="text-left sm:text-right text-white/60 shrink-0">
                <p>{exp.period}</p>
                <p className="text-sm">{exp.location}</p>
              </div>
            </div>

            {/* Metric chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {exp.metrics.map((metric) => (
                <Badge
                  key={metric}
                  className="bg-white/5 text-white/90 border-white/10 text-xs font-medium"
                >
                  {metric}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {hasToggle ? (
              <>
                <ul className="space-y-3">
                  {(expanded ? exp.bullets : exp.bullets.slice(0, 2)).map((bullet) => (
                    <li key={bullet} className="text-white/80 text-sm flex gap-2">
                      <span className="text-blue-400 mt-1 shrink-0">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                  className="flex items-center gap-1 mt-4 text-white/50 hover:text-white/80 text-sm transition-colors min-h-[44px]"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                  {expanded
                    ? "Show less"
                    : `Show ${exp.bullets.length - 2} more`}
                </button>
              </>
            ) : (
              <ul className="space-y-3">
                {exp.bullets.map((bullet) => (
                  <li key={bullet} className="text-white/80 text-sm flex gap-2">
                    <span className="text-blue-400 mt-1 shrink-0">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

const Experience = forwardRef<HTMLDivElement>(function Experience(_, ref) {
  return (
    <section ref={ref} className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Experience</h2>
          <p className="text-xl text-white/80">My professional journey</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
})

export default Experience
