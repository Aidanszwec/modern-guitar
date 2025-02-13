import { metadata } from './metadata'
import { Inter } from 'next/font/google'
import './globals.css'
import RootLayoutClient from './layout-client'

const inter = Inter({ subsets: ['latin'] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}
