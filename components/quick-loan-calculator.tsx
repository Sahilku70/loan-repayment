"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ArrowRight, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useLoans } from "@/lib/loan-store"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function QuickLoanCalculator() {
  const router = useRouter()
  const { quickCalculatorValues, addLoan } = useLoans()
  const {
    loanAmount,
    interestRate,
    loanTerm,
    monthlyPayment,
    totalInterest,
    setLoanAmount,
    setInterestRate,
    setLoanTerm
  } = quickCalculatorValues

  // State for controlling the add loan dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // State for additional loan details
  const [loanDetails, setLoanDetails] = useState({
    name: "New Loan",
    lender: "Custom Lender",
    paymentsMade: 0
  })
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Function to open the dialog
  const handleOpenAddLoanDialog = () => {
    setIsDialogOpen(true)
  }
  
  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoanDetails(prev => ({
      ...prev,
      [name]: name === "paymentsMade" ? Number(value) : value
    }))
  }

  // Function to create a new loan from calculator values
  const handleAddLoan = () => {
    // Calculate the number of payments based on loan term
    const termInMonths = loanTerm * 12
    
    // Calculate progress based on payments made
    const totalPayments = termInMonths
    const paymentsRemaining = totalPayments - loanDetails.paymentsMade
    const progress = Math.round((loanDetails.paymentsMade / totalPayments) * 100)
    
    // Calculate next payment date (1 month from now)
    const nextPaymentDate = new Date()
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
    
    // Format the next payment date
    const nextPayment = nextPaymentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    
    // Calculate remaining amount based on progress
    const remainingAmount = Math.round(loanAmount * (1 - progress / 100))
    
    // Create a new loan object
    const newLoan = {
      name: loanDetails.name,
      amount: loanAmount,
      remaining: remainingAmount,
      progress,
      nextPayment,
      nextAmount: Math.round(monthlyPayment),
      interestRate: `${interestRate.toFixed(1)}%`,
      trend: "neutral" as const,
      lender: loanDetails.lender,
      paymentsMade: loanDetails.paymentsMade,
      paymentsRemaining
    }
    
    // Add the loan using the context function
    addLoan(newLoan)
    
    // Close the dialog
    setIsDialogOpen(false)
    
    // Navigate to the dashboard
    router.push("/dashboard")
  }

  return (
    <>
      <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white">
              <h3 className="text-xl font-bold mb-6">Loan Calculator</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="loan-amount" className="text-white">
                      Loan Amount: {formatCurrency(loanAmount)}
                    </Label>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    min={1000}
                    max={1000000}
                    step={1000}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="interest-rate" className="text-white">
                      Interest Rate: {interestRate}%
                    </Label>
                  </div>
                  <Slider
                    value={[interestRate]}
                    min={0.1}
                    max={20}
                    step={0.1}
                    onValueChange={(value) => setInterestRate(value[0])}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="loan-term" className="text-white">
                      Loan Term: {loanTerm} years
                    </Label>
                  </div>
                  <Slider
                    value={[loanTerm]}
                    min={1}
                    max={40}
                    step={1}
                    onValueChange={(value) => setLoanTerm(value[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Your Results</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Payment</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(monthlyPayment)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Interest</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalInterest)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Cost</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(loanAmount + totalInterest)}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 transition-all" 
                    onClick={handleOpenAddLoanDialog}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add as Loan
                  </Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 transition-all" asChild>
                    <Link href="/dashboard">
                      View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Loan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Loan</DialogTitle>
            <DialogDescription>
              Enter additional details for your new loan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Loan Name
              </Label>
              <Input
                id="name"
                name="name"
                value={loanDetails.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lender" className="text-right">
                Lender
              </Label>
              <Input
                id="lender"
                name="lender"
                value={loanDetails.lender}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentsMade" className="text-right">
                Payments Made
              </Label>
              <Input
                id="paymentsMade"
                name="paymentsMade"
                type="number"
                min="0"
                value={loanDetails.paymentsMade}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="py-2">
              <h3 className="font-medium">Loan Summary</h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Loan Amount:</span>
                  <span>{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interest Rate:</span>
                  <span>{interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Loan Term:</span>
                  <span>{loanTerm} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Monthly Payment:</span>
                  <span>{formatCurrency(monthlyPayment)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLoan}>
              Add Loan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

