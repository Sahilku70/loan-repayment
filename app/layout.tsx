import type { Metadata } from 'next'
import './globals.css'
import { LoanProvider } from '@/lib/loan-store'

export const metadata: Metadata = {
  title: 'LoanAI - Smart Loan Repayment',
  description: 'AI-powered loan repayment optimization',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <LoanProvider>
          {children}
        </LoanProvider>
      </body>
    </html>
  )
}
