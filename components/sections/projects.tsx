"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink } from "lucide-react"
import { projects } from "@/lib/data"

const Projects = forwardRef<HTMLDivElement>(function Projects(_, ref) {
  return (
    <section ref={ref} className="py-20 px-6 bg-[#080808]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Projects</h2>
          <p className="text-xl text-white/80">Things I&apos;ve built</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#111111] border-white/5 shadow-md hover:border-white/10 transition-all duration-300 h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <CardTitle className="text-white text-xl">{project.title}</CardTitle>
                        {project.badge && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            {project.badge}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-blue-400 text-base">
                        {project.tagline}
                      </CardDescription>
                      <p className="text-white/40 text-sm mt-1">{project.date}</p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-2 shrink-0 ml-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors p-1"
                          aria-label={`${project.title} GitHub`}
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {project.external && (
                        <a
                          href={project.external}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors p-1"
                          aria-label={`${project.title} external link`}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {project.bullets.map((bullet) => (
                      <li key={bullet} className="text-white/80 text-sm flex gap-2">
                        <span className="text-blue-400 mt-1 shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} className="bg-white/10 text-white border-white/20 text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default Projects
