"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Trophy } from "lucide-react"
import { education, achievements } from "@/lib/data"

const About = forwardRef<HTMLDivElement>(function About(_, ref) {
  return (
    <section ref={ref} className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">About Me</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-5 gap-8">
              {/* Bio — left column (wider) */}
              <div className="md:col-span-3">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Software Engineer at <span className="text-white font-medium">Guidewire Software</span>, building
                  internal platforms and developer tooling that serve 50+ engineers. I specialize in infrastructure
                  visibility, automation, and full-stack applications using React, Python, AWS, and Kubernetes.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  Previously built production features at <span className="text-white font-medium">CV Owl</span> and
                  contributed to <span className="text-white font-medium">HyperSwitch</span> (Juspay), a Rust-based
                  open-source payment orchestrator. I enjoy working across the stack — from Kafka event pipelines to
                  React dashboards — and building tools that make other engineers more productive.
                </p>
              </div>

              {/* Education + Achievements — right column */}
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-[#111111] border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                        <GraduationCap className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Education</h3>
                        <p className="text-white/80 text-sm mt-1">{education.degree}</p>
                        <p className="text-blue-400 text-sm">{education.institution}</p>
                        <p className="text-white/50 text-xs mt-1">
                          {education.cgpa} · {education.period}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111111] border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
                        <Trophy className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm mb-2">Achievements</h3>
                        <ul className="space-y-2">
                          {achievements.map((achievement) => (
                            <li key={achievement} className="text-white/80 text-sm">
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

export default About
