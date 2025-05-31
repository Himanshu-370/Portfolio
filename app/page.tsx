"use client"

import type React from "react"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, Code, Database, Server, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import * as THREE from "three"

// Interactive 3D Torus Component
function InteractiveTorus() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle mouse movement
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
      // Rotate based on mouse position
      meshRef.current.rotation.x = mousePosition.y * 0.3
      meshRef.current.rotation.y = mousePosition.x * 0.3

      // Add continuous rotation
      meshRef.current.rotation.z += 0.01

      // Scale based on hover
      const targetScale = hovered ? 1.2 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
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
  const positions = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
  }

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
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

export default function Portfolio() {
  const aboutRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  const featuredProjectRef = useRef<HTMLElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
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
      title: "Software Engineer I",
      company: "Guidewire Software",
      period: "Jan 2024 – Present",
      location: "Bengaluru, India",
      description:
        "Developed APIs for operational metrics, achieved 80%+ test coverage with SonarQube, and created Python monitoring scripts with Slack integration.",
    },
    {
      title: "Full Stack Developer Intern",
      company: "CV Owl",
      period: "Oct 2022 – Oct 2023",
      location: "Noida, India",
      description:
        "Achieved 25% drop-off rate reduction, led team of 3 designers, integrated AWS services (S3, CloudFront) for optimization.",
    },
    {
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
      icon: <Code className="h-8 w-8" />,
      title: "Full Stack Development",
      description:
        "End-to-end web application development using modern technologies like React, Node.js, and cloud services.",
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "API Development",
      description:
        "RESTful API design and development with proper testing, documentation, and performance optimization.",
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "Cloud Solutions",
      description: "AWS cloud architecture, containerization with Docker, and deployment automation with Kubernetes.",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Performance Optimization",
      description: "Website optimization for speed and user experience, achieving perfect Lighthouse scores.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection(aboutRef)}
                className="text-white/80 hover:text-white transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection(projectsRef)}
                className="text-white/80 hover:text-white transition-colors"
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection(servicesRef)}
                className="text-white/80 hover:text-white transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-white/80 hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

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
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Himanshu Singh
            </h1>
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
                className="border-white/20 text-black hover:bg-white/10 hover:text-white"
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
              I'm a passionate Software Engineer with expertise in full-stack development. Currently working at
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
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-black border-white/20 text-sm px-4 py-2"
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
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#111111] border-white/5 shadow-md hover:border-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-xl">{exp.title}</CardTitle>
                        <CardDescription className="text-blue-400 text-lg">{exp.company}</CardDescription>
                      </div>
                      <div className="text-right text-white/60">
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
                  <ExternalLink className="h-6 w-6 text-white/60" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Multi-stranger video chat application using WebRTC and Socket.IO for real-time communication. Features
                  dynamic room allocation and optimized user interface for enhanced user retention.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Socket.io", "WebRTC", "JavaScript", "MongoDB", "Express.js"].map((tech, index) => (
                    <Badge key={index} className="bg-white/10 text-white border-white/20">
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
                key={index}
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Work Together</h2>
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
                      I'm always open to discussing new opportunities and interesting projects.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <Mail className="h-5 w-5" />
                      <span>himanshuich20@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Phone className="h-5 w-5" />
                      <span>(+91) 9502865370</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <MapPin className="h-5 w-5" />
                      <span>Visakhapatnam, Andhra Pradesh</span>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button size="sm" variant="outline" className="border-white/20 text-black hover:bg-white/10 hover:text-white">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-black hover:bg-white/10 hover:text-white">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
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
                    <div>
                      <label className="text-white/80 text-sm">Name</label>
                      <input
                        type="text"
                        className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-white/80 text-sm">Email</label>
                      <input
                        type="email"
                        className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-white/80 text-sm">Message</label>
                      <textarea
                        rows={4}
                        className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
                        placeholder="Tell me about your project..."
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="container mx-auto text-center">
          <p className="text-white/60">© 2024 Himanshu Singh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
