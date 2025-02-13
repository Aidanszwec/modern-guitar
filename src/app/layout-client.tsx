"use client";

import { Inter } from 'next/font/google'
import { SignupProvider } from '../context/SignupContext'
import SignupModal from '../SignupModal'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <SignupProvider>
          {/* <Navbar /> */}
          {children}
          <SignupModal />
        </SignupProvider>
      </body>
    </html>
  )
}
