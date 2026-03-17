"use client"

import type React from "react"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ExternalLink,
  Code,
  Database,
  Server,
  Smartphone,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import * as THREE from "three"

// Reusable vector for animations (avoids allocating in useFrame)
const _targetScale = new THREE.Vector3()

// Interactive 3D Torus Component
function InteractiveTorus() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = mousePosition.y * 0.3
      meshRef.current.rotation.y = mousePosition.x * 0.3
      meshRef.current.rotation.z += 0.01

      const s = hovered ? 1.2 : 1
      _targetScale.set(s, s, s)
      meshRef.current.scale.lerp(_targetScale, 0.1)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <torusGeometry args={[2, 0.8, 16, 100]} />
        <meshStandardMaterial color={hovered ? "#3b82f6" : "#10b981"} wireframe transparent opacity={0.8} />
      </mesh>
    </Float>
  )
}

// Floating Particles
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particlesCount = 100

  const positions = useMemo(() => {
    const arr = new Float32Array(particlesCount * 3)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002
    }
  })

  const bufferRef = useRef<THREE.BufferAttribute>(null)

  useEffect(() => {
    if (bufferRef.current) {
      bufferRef.current.needsUpdate = true
    }
  }, [positions])

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          ref={bufferRef}
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  )
}

// 3D Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <InteractiveTorus />
      <FloatingParticles />
      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

const skills = [
  "JavaScript/TypeScript",
  "Python",
  "Java",
  "C/C++",
  "Go",
  "React",
  "Node.js",
  "Express",
  "Spring",
  "MongoDB",
  "MySQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
]

const experiences = [
  {
    id: "guidewire",
    title: "Software Engineer I",
    company: "Guidewire Software",
    period: "Jan 2024 – Present",
    location: "Bengaluru, India",
    description:
      "Developed APIs for operational metrics, achieved 80%+ test coverage with SonarQube, and created Python monitoring scripts with Slack integration.",
  },
  {
    id: "cvowl",
    title: "Full Stack Developer Intern",
    company: "CV Owl",
    period: "Oct 2022 – Oct 2023",
    location: "Noida, India",
    description:
      "Achieved 25% drop-off rate reduction, led team of 3 designers, integrated AWS services (S3, CloudFront) for optimization.",
  },
  {
    id: "hyperswitch",
    title: "Open Source Contributor",
    company: "HyperSwitch - Juspay",
    period: "Oct 2023 – Nov 2023",
    location: "Remote",
    description:
      "Enhanced payment tracking in Rust, improved connector API compatibility and payment request management.",
  },
]

const services = [
  {
    id: "fullstack",
    icon: <Code className="h-8 w-8" />,
    title: "Full Stack Development",
    description:
      "End-to-end web application development using modern technologies like React, Node.js, and cloud services.",
  },
  {
    id: "api",
    icon: <Database className="h-8 w-8" />,
    title: "API Development",
    description:
      "RESTful API design and development with proper testing, documentation, and performance optimization.",
  },
  {
    id: "cloud",
    icon: <Server className="h-8 w-8" />,
    title: "Cloud Solutions",
    description: "AWS cloud architecture, containerization with Docker, and deployment automation with Kubernetes.",
  },
  {
    id: "perf",
    icon: <Smartphone className="h-8 w-8" />,
    title: "Performance Optimization",
    description: "Website optimization for speed and user experience, achieving perfect Lighthouse scores.",
  },
]

const projectTechs = ["Socket.io", "WebRTC", "JavaScript", "MongoDB", "Express.js"]

const navItems = [
  { label: "About", ref: "aboutRef" },
  { label: "Experience", ref: "projectsRef" },
  { label: "Services", ref: "servicesRef" },
  { label: "Contact", ref: "contactRef" },
] as const

export default function Portfolio() {
  const aboutRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const featuredProjectRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const refs = { aboutRef, projectsRef, servicesRef, contactRef } as const

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus("sending")
    try {
      const res = await fetch("https://formspree.io/f/xqabznjj", {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      })
      setFormStatus(res.ok ? "sent" : "error")
      if (res.ok) e.currentTarget.reset()
    } catch {
      setFormStatus("error")
    }
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
            <motion.h1
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Himanshu Singh
            </motion.h1>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(refs[item.ref])}
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
                      onClick={() => scrollToSection(refs[item.ref])}
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
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]">
          <div className="absolute inset-0 w-full h-full">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>
          <div className="relative z-10 text-center text-white">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Himanshu Singh
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-white/80">Full Stack Developer & Software Engineer</p>
              <p className="text-lg mb-12 text-white/60 max-w-2xl mx-auto">
                Crafting exceptional digital experiences with modern technologies. Specialized in React, Node.js, Python,
                and cloud solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => scrollToSection(contactRef)}
                  className="bg-white text-black hover:bg-white/90 transition-colors"
                >
                  Hire Me
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection(featuredProjectRef)}
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  View My Work
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="py-20 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">About Me</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                I&apos;m a passionate Software Engineer with expertise in full-stack development. Currently working at
                Guidewire Software, I have experience building scalable applications, optimizing performance, and
                contributing to open-source projects.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#111111] border-white/5 shadow-md">
                  <CardHeader className="text-center">
                    <CardTitle className="text-white text-2xl">Technical Skills</CardTitle>
                    <CardDescription className="text-white/80">
                      Technologies and tools I work with to build exceptional digital experiences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/20 text-sm px-4 py-2"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section ref={projectsRef} className="py-20 px-6 bg-[#080808]">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Experience</h2>
              <p className="text-xl text-white/80">My professional journey and key projects</p>
            </motion.div>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-[#111111] border-white/5 shadow-md hover:border-white/10 transition-all duration-300">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <CardTitle className="text-white text-xl">{exp.title}</CardTitle>
                          <CardDescription className="text-blue-400 text-lg">{exp.company}</CardDescription>
                        </div>
                        <div className="text-left sm:text-right text-white/60">
                          <p>{exp.period}</p>
                          <p className="text-sm">{exp.location}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80">{exp.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Featured Project */}
            <motion.div
              ref={featuredProjectRef}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Featured Project</h3>
              <Card className="bg-[#111111] border-white/5 shadow-md hover:border-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-2xl">VidVortex</CardTitle>
                      <CardDescription className="text-white/80 text-lg">
                        Video Chat and Text with Strangers
                      </CardDescription>
                    </div>
                    <a
                      href="https://github.com/Himanshu-370"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                      aria-label="View VidVortex on GitHub"
                    >
                      <ExternalLink className="h-6 w-6" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">
                    Multi-stranger video chat application using WebRTC and Socket.IO for real-time communication. Features
                    dynamic room allocation and optimized user interface for enhanced user retention.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {projectTechs.map((tech) => (
                      <Badge key={tech} className="bg-white/10 text-white border-white/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Services</h2>
              <p className="text-xl text-white/80">What I can do for your business</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-[#111111] border-white/5 shadow-md hover:border-white/10 transition-all duration-300 h-full">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-fit">
                        {service.icon}
                      </div>
                      <CardTitle className="text-white">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 text-center">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-20 px-6 bg-[#080808]">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let&apos;s Work Together</h2>
              <p className="text-xl text-white/80">Ready to bring your ideas to life</p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-[#111111] border-white/5 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Get In Touch</CardTitle>
                      <CardDescription className="text-white/80">
                        I&apos;m always open to discussing new opportunities and interesting projects.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-white/80">
                        <Mail className="h-5 w-5" />
                        <a href="mailto:himanshuich20@gmail.com" className="hover:text-white transition-colors">
                          himanshuich20@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <MapPin className="h-5 w-5" />
                        <span>Bengaluru, Karnataka</span>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                        >
                          <a href="https://github.com/Himanshu-370" target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                        >
                          <a href="https://www.linkedin.com/in/himanshusingh20/" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-[#111111] border-white/5 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="contact-name" className="text-white/80 text-sm">
                            Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            name="name"
                            required
                            className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="text-white/80 text-sm">
                            Email
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            name="email"
                            required
                            className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-message" className="text-white/80 text-sm">
                            Message
                          </label>
                          <textarea
                            id="contact-message"
                            name="message"
                            rows={4}
                            required
                            className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
                            placeholder="Tell me about your project..."
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={formStatus === "sending"}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {formStatus === "sending"
                            ? "Sending..."
                            : formStatus === "sent"
                              ? "Message Sent!"
                              : formStatus === "error"
                                ? "Failed — Try Again"
                                : "Send Message"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
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
