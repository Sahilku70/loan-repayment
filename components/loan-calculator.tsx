"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Calculator, RefreshCw } from "lucide-react"

interface CalculatorResults {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  amortizationSchedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000)
  const [interestRate, setInterestRate] = useState(5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [results, setResults] = useState<CalculatorResults | null>(null)

  const calculateLoan = () => {
    // Convert annual interest rate to monthly and decimal form
    const monthlyRate = interestRate / 100 / 12
    const termInMonths = loanTerm * 12

    // Calculate monthly payment using the loan formula
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
      (Math.pow(1 + monthlyRate, termInMonths) - 1)

    const totalPayment = monthlyPayment * termInMonths
    const totalInterest = totalPayment - loanAmount

    // Generate amortization schedule
    let balance = loanAmount
    const amortizationSchedule = []

    for (let month = 1; month <= termInMonths; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance -= principalPayment

      // Only store every 12th month to keep the data manageable
      if (month % 12 === 0 || month === 1) {
        amortizationSchedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance),
        })
      }
    }

    setResults({
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule,
    })
  }

  // Calculate on initial render and when inputs change
  useEffect(() => {
    calculateLoan()
  }, [loanAmount, interestRate, loanTerm])

  const resetCalculator = () => {
    setLoanAmount(100000)
    setInterestRate(5)
    setLoanTerm(30)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Loan Calculator</CardTitle>
            <CardDescription>Calculate your monthly payments and total interest</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={resetCalculator}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Reset calculator</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="loan-amount">Loan Amount: {formatCurrency(loanAmount)}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="loan-amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              min={1000}
              max={1000000}
              className="w-24"
            />
            <Slider
              value={[loanAmount]}
              min={1000}
              max={1000000}
              step={1000}
              onValueChange={(value) => setLoanAmount(value[0])}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interest-rate">Interest Rate: {interestRate}%</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="interest-rate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min={0.1}
              max={20}
              step={0.1}
              className="w-24"
            />
            <Slider
              value={[interestRate]}
              min={0.1}
              max={20}
              step={0.1}
              onValueChange={(value) => setInterestRate(value[0])}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="loan-term">Loan Term: {loanTerm} years</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="loan-term"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              min={1}
              max={40}
              className="w-24"
            />
            <Slider
              value={[loanTerm]}
              min={1}
              max={40}
              step={1}
              onValueChange={(value) => setLoanTerm(value[0])}
              className="flex-1"
            />
          </div>
        </div>

        {results && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Monthly Payment</p>
                <p className="text-xl font-bold">{formatCurrency(results.monthlyPayment)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Payment</p>
                <p className="text-xl font-bold">{formatCurrency(results.totalPayment)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Interest</p>
                <p className="text-xl font-bold">{formatCurrency(results.totalInterest)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={calculateLoan}>
          <Calculator className="mr-2 h-4 w-4" />
          Calculate
        </Button>
      </CardFooter>
    </Card>
  )
}

