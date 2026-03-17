import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Himanshu Singh — Software Engineer',
  description:
    'Software Engineer with 2+ years of experience building internal platforms, infrastructure tooling, and full-stack applications using React, Python, AWS, and Kubernetes.',
  openGraph: {
    title: 'Himanshu Singh — Software Engineer',
    description:
      'Software Engineer building internal platforms, infrastructure tooling, and full-stack applications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himanshu Singh — Software Engineer',
    description:
      'Software Engineer building internal platforms, infrastructure tooling, and full-stack applications.',
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
