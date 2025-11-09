"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Define Loan type
export interface Loan {
  id: number
  name: string
  amount: number
  remaining: number
  progress: number
  nextPayment: string
  nextAmount: number
  interestRate: string
  trend: "up" | "down" | "neutral"
  lender: string
  paymentsMade: number
  paymentsRemaining: number
  createdAt: Date
}

// Define the context shape
interface LoanContextType {
  loans: Loan[]
  addLoan: (loan: Omit<Loan, "id" | "createdAt">) => void
  updateLoan: (id: number, loan: Partial<Loan>) => void
  deleteLoan: (id: number) => void
  makePayment: (id: number) => void
  quickCalculatorValues: {
    loanAmount: number
    interestRate: number
    loanTerm: number
    monthlyPayment: number
    totalInterest: number
    setLoanAmount: (amount: number) => void
    setInterestRate: (rate: number) => void
    setLoanTerm: (term: number) => void
  }
}

// Create the context with a default value
const LoanContext = createContext<LoanContextType | undefined>(undefined)

// Create a provider component
export function LoanProvider({ children }: { children: ReactNode }) {
  // This will store our loans
  const [loans, setLoans] = useState<Loan[]>([])
  
  // This will store the quick calculator values
  const [loanAmount, setLoanAmount] = useState(100000)
  const [interestRate, setInterestRate] = useState(5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  // Load saved loans from localStorage on initial render
  useEffect(() => {
    const savedLoans = localStorage.getItem("loans")
    if (savedLoans) {
      try {
        // Parse dates properly when loading from localStorage
        const parsedLoans = JSON.parse(savedLoans, (key, value) => {
          if (key === "createdAt") {
            return new Date(value)
          }
          return value
        })
        setLoans(parsedLoans)
      } catch (e) {
        console.error("Failed to parse saved loans:", e)
      }
    } else {
      // If no saved loans, initialize with default loans
      const defaultLoans: Loan[] = [
        {
          id: 1,
          name: "Home Loan",
          amount: 250000,
          remaining: 175000,
          progress: 30,
          nextPayment: "May 15, 2025",
          nextAmount: 1250,
          interestRate: "3.5%",
          trend: "down",
          lender: "National Bank",
          paymentsMade: 48,
          paymentsRemaining: 312,
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "Auto Loan",
          amount: 35000,
          remaining: 12000,
          progress: 65,
          nextPayment: "May 10, 2025",
          nextAmount: 450,
          interestRate: "4.2%",
          trend: "down",
          lender: "Auto Finance Co.",
          paymentsMade: 36,
          paymentsRemaining: 24,
          createdAt: new Date(),
        },
        {
          id: 3,
          name: "Student Loan",
          amount: 50000,
          remaining: 20000,
          progress: 60,
          nextPayment: "May 20, 2025",
          nextAmount: 500,
          interestRate: "5.0%",
          trend: "neutral",
          lender: "Student Loan Corp",
          paymentsMade: 60,
          paymentsRemaining: 60,
          createdAt: new Date(),
        },
      ]
      setLoans(defaultLoans)
    }
  }, [])

  // Save loans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("loans", JSON.stringify(loans))
  }, [loans])

  // Calculate monthly payment and total interest when quick calculator values change
  useEffect(() => {
    // Convert annual interest rate to monthly and decimal form
    const monthlyRate = interestRate / 100 / 12
    const termInMonths = loanTerm * 12

    // Calculate monthly payment using the loan formula
    const payment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
      (Math.pow(1 + monthlyRate, termInMonths) - 1)

    const totalPayment = payment * termInMonths
    const interest = totalPayment - loanAmount

    setMonthlyPayment(payment)
    setTotalInterest(interest)
  }, [loanAmount, interestRate, loanTerm])

  // Function to add a new loan
  const addLoan = (loanData: Omit<Loan, "id" | "createdAt">) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now(), // Use timestamp as ID
      createdAt: new Date(),
    }
    setLoans(prevLoans => [...prevLoans, newLoan])
  }

  // Function to update an existing loan
  const updateLoan = (id: number, loanData: Partial<Loan>) => {
    setLoans(prevLoans =>
      prevLoans.map(loan =>
        loan.id === id ? { ...loan, ...loanData } : loan
      )
    )
  }

  // Function to delete a loan
  const deleteLoan = (id: number) => {
    setLoans(prevLoans => prevLoans.filter(loan => loan.id !== id))
  }
  
  // Function to make a payment on a loan
  const makePayment = (id: number) => {
    setLoans(prevLoans => 
      prevLoans.map(loan => {
        if (loan.id !== id) return loan
        
        // Calculate new values after payment
        const newPaymentsMade = loan.paymentsMade + 1
        const newPaymentsRemaining = loan.paymentsRemaining - 1
        
        // Convert interest rate from string to number
        const interestRate = Number.parseFloat(loan.interestRate.replace("%", "")) / 100
        
        // Calculate monthly interest portion
        const monthlyInterest = (loan.remaining * interestRate) / 12
        
        // Calculate how much of the payment goes to principal
        const principalPayment = loan.nextAmount - monthlyInterest
        
        // Calculate new remaining balance
        const newRemaining = Math.max(0, loan.remaining - principalPayment)
        
        // Calculate new progress percentage
        const newProgress = Math.round((1 - newRemaining / loan.amount) * 100)
        
        // Calculate next payment date (1 month from now)
        const nextPaymentDate = new Date()
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
        
        // Format the next payment date
        const newNextPayment = nextPaymentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        
        // Update the loan with the new values
        return {
          ...loan,
          remaining: newRemaining,
          progress: newProgress,
          paymentsMade: newPaymentsMade,
          paymentsRemaining: newPaymentsRemaining,
          nextPayment: newNextPayment,
        }
      })
    )
  }

  // Create an object with the context value
  const contextValue: LoanContextType = {
    loans,
    addLoan,
    updateLoan,
    deleteLoan,
    makePayment,
    quickCalculatorValues: {
      loanAmount,
      interestRate,
      loanTerm,
      monthlyPayment,
      totalInterest,
      setLoanAmount,
      setInterestRate,
      setLoanTerm,
    }
  }

  return (
    <LoanContext.Provider value={contextValue}>
      {children}
    </LoanContext.Provider>
  )
}

// Custom hook to use the loan context
export function useLoans() {
  const context = useContext(LoanContext)
  if (context === undefined) {
    throw new Error("useLoans must be used within a LoanProvider")
  }
  return context
}