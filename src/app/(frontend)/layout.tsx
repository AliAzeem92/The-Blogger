import React from 'react'
import Navbar from '@/components/Navbar'
import './styles.css'

export const metadata = {
  description: 'A blog built with Payload CMS and Next.js',
  title: 'The Blogger',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="px-6 ">{children}</main>
      </body>
    </html>
  )
}
