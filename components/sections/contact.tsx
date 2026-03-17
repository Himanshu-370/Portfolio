"use client"

import { forwardRef, useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, MapPin, Globe } from "lucide-react"
import { socialLinks } from "@/lib/data"

const Contact = forwardRef<HTMLDivElement>(function Contact(_, ref) {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus("sending")
    try {
      const formUrl = process.env.NEXT_PUBLIC_FORMSPREE_URL
      if (!formUrl) {
        setFormStatus("error")
        return
      }
      const res = await fetch(formUrl, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      })
      if (res.ok) {
        setFormStatus("sent")
        e.currentTarget.reset()
        setTimeout(() => setFormStatus("idle"), 4500)
      } else {
        setFormStatus("error")
      }
    } catch {
      setFormStatus("error")
    }
  }

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
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>{socialLinks.email}</span>
                  </a>
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                    <span>himanshusingh.dev</span>
                  </a>
                  <div className="flex items-center gap-3 text-white/80">
                    <MapPin className="h-5 w-5" />
                    <span>Bengaluru, Karnataka</span>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
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
                    <div aria-live="polite" aria-atomic="true" className="sr-only">
                      {formStatus === "sent" && "Your message has been sent successfully."}
                      {formStatus === "error" && "There was an error sending your message. Please try again."}
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
  )
})

export default Contact
