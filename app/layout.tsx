import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Himanshu Singh — Full Stack Developer',
  description:
    'Full Stack Developer & Software Engineer specializing in React, Node.js, Python, and cloud solutions. Currently at Guidewire Software.',
  openGraph: {
    title: 'Himanshu Singh — Full Stack Developer',
    description:
      'Full Stack Developer & Software Engineer specializing in React, Node.js, Python, and cloud solutions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himanshu Singh — Full Stack Developer',
    description:
      'Full Stack Developer & Software Engineer specializing in React, Node.js, Python, and cloud solutions.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
