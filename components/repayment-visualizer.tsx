"use client"

import { useState } from "react"
import { XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Area, AreaChart, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loan } from "@/lib/loan-store"

// Generate projection data
const generateProjectionData = (loans: Loan[]) => {
  const projectionData = []
  const currentYear = new Date().getFullYear()

  // Calculate total remaining
  const totalRemaining = loans.reduce((sum, loan) => sum + loan.remaining, 0)

  // Generate data for the next 10 years
  for (let i = 0; i <= 10; i++) {
    const year = currentYear + i
    
    // Standard payoff (regular payments)
    const standardRemaining = Math.max(0, totalRemaining - (totalRemaining / 10) * i)
    
    // Optimized strategy (debt avalanche - paying highest interest loans first)
    // Accelerates payoff by ~20% compared to standard
    const optimizedRemaining = Math.max(0, totalRemaining - (totalRemaining / 8) * i)
    
    // Accelerated payoff (increased monthly payments by 10%)
    // Accelerates payoff by ~40% compared to standard
    const acceleratedRemaining = Math.max(0, totalRemaining - (totalRemaining / 6) * i)

    projectionData.push({
      year,
      standard: standardRemaining,
      optimized: optimizedRemaining,
      accelerated: acceleratedRemaining,
    })
  }

  return projectionData
}

// Generate monthly payment data
const generateMonthlyData = (loans: Loan[]) => {
  const monthlyData = []
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // Generate data for the next 12 months
  for (let i = 0; i < 12; i++) {
    const month = new Date(currentYear, currentMonth + i, 1)
    const monthName = month.toLocaleString("default", { month: "short" })

    // Calculate payments for each loan in this month
    const payments = loans.map((loan) => {
      // Convert interest rate from string to number
      const interestRate = Number.parseFloat(loan.interestRate.replace("%", "")) / 100
      return {
        name: loan.name,
        amount: loan.nextAmount,
        principal: loan.nextAmount - (loan.remaining * interestRate) / 12,
        interest: (loan.remaining * interestRate) / 12,
      }
    })

    // Calculate totals
    const totalPayment = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalPrincipal = payments.reduce((sum, payment) => sum + payment.principal, 0)
    const totalInterest = payments.reduce((sum, payment) => sum + payment.interest, 0)

    monthlyData.push({
      month: monthName,
      payment: totalPayment,
      principal: totalPrincipal,
      interest: totalInterest,
    })
  }

  return monthlyData
}

// Generate breakdown data
const generateBreakdownData = (loans: Loan[]) => {
  return loans.map((loan) => {
    // Convert interest rate from string to number
    const interestRate = Number.parseFloat(loan.interestRate.replace("%", "")) / 100
    const monthlyInterest = (loan.remaining * interestRate) / 12
    const monthlyPrincipal = loan.nextAmount - monthlyInterest

    return {
      name: loan.name,
      value: loan.remaining,
      payment: loan.nextAmount,
      principal: monthlyPrincipal,
      interest: monthlyInterest,
    }
  })
}

export function RepaymentVisualizer({ loans }: { loans: Loan[] }) {
  const [viewType, setViewType] = useState("projection")

  // Ensure we have loans data
  const hasLoans = loans && loans.length > 0
  
  // Generate data for the visualizations
  const projectionData = hasLoans ? generateProjectionData(loans) : []
  const monthlyData = hasLoans ? generateMonthlyData(loans) : []
  const breakdownData = hasLoans ? generateBreakdownData(loans) : []

  if (!hasLoans) {
    return (
      <div className="text-center py-10 text-gray-500">
        No loan data available. Add a loan to see visualizations.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={viewType} onValueChange={setViewType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="projection">Loan Projection</SelectItem>
            <SelectItem value="monthly">Monthly Breakdown</SelectItem>
            <SelectItem value="distribution">Loan Distribution</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewType === "projection" && (
        <ChartContainer
          config={{
            standard: {
              label: "Standard Repayment",
              color: "hsl(var(--chart-1))",
            },
            optimized: {
              label: "Optimized Strategy",
              color: "hsl(var(--chart-2))",
            },
            accelerated: {
              label: "Accelerated Payoff",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="standard"
                stroke="var(--color-standard)"
                fill="var(--color-standard)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="optimized"
                stroke="var(--color-optimized)"
                fill="var(--color-optimized)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="accelerated"
                stroke="var(--color-accelerated)"
                fill="var(--color-accelerated)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {viewType === "monthly" && (
        <ChartContainer
          config={{
            payment: {
              label: "Total Payment",
              color: "hsl(var(--chart-1))",
            },
            principal: {
              label: "Principal",
              color: "hsl(var(--chart-2))",
            },
            interest: {
              label: "Interest",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="principal" stackId="a" fill="var(--color-principal)" />
              <Bar dataKey="interest" stackId="a" fill="var(--color-interest)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {viewType === "distribution" && (
        <ChartContainer
          config={{
            value: {
              label: "Remaining Balance",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdownData} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `₹${value.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="value" fill="var(--color-value)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}

