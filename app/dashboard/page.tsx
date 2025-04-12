"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  DollarSign,
  Download,
  History,
  PieChart,
  TrendingDown,
  TrendingUp,
  Calendar,
  AlertCircle,
  Trash2,
  Edit,
  PlusCircle,
  Check,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { RepaymentVisualizer } from "@/components/repayment-visualizer"
import { AIRecommendations } from "@/components/ai-recommendations"
import { PaymentSchedule } from "@/components/payment-schedule"
import { useLoans } from "@/lib/loan-store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Dashboard() {
  // Get loans and functions from the context
  const { loans, updateLoan, deleteLoan, addLoan, makePayment } = useLoans()
  
  // State for the add/edit loan dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null)
  
  // State for payment confirmation dialog
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentLoan, setPaymentLoan] = useState<number | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  
  // Form state for loan editing
  const [formState, setFormState] = useState({
    name: "",
    amount: 0,
    remaining: 0,
    lender: "",
    interestRate: "",
    nextAmount: 0,
    nextPayment: "",
    paymentsMade: 0,
    paymentsRemaining: 0,
  })
  
  // Calculate totals
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalRemaining = loans.reduce((sum, loan) => sum + loan.remaining, 0)
  const totalProgress = Math.round((1 - totalRemaining / totalLoanAmount) * 100) || 0
  
  // Calculate potential savings
  const potentialSavings = loans.reduce((sum, loan) => {
    // Convert interest rate from string to number
    const interestRate = Number.parseFloat(loan.interestRate.replace("%", "")) / 100
    
    // Calculate monthly interest
    const monthlyInterest = (loan.remaining * interestRate) / 12
    
    // Estimate savings based on accelerated payments (10% more per month)
    const monthlyExtra = loan.nextAmount * 0.1
    const monthsSaved = (loan.paymentsRemaining * loan.nextAmount) / (loan.nextAmount + monthlyExtra)
    const interestSaved = (loan.paymentsRemaining - monthsSaved) * monthlyInterest
    
    return sum + interestSaved
  }, 0)
  
  // Fix: Properly type the initial value for the reduce function to work with dates
  const nextPaymentDue = loans.reduce<Date | null>((min, loan) => {
    const date = new Date(loan.nextPayment)
    return min === null || date < min ? date : min
  }, null)
  
  const nextPaymentAmount = nextPaymentDue ? 
    loans.find((loan) => new Date(loan.nextPayment).getTime() === nextPaymentDue.getTime())?.nextAmount || 0 : 0
  
  // Track payment history
  const [recentPayments, setRecentPayments] = useState([
    { id: 1, date: "Apr 5, 2025", amount: 1250, loan: "Home Loan", status: "Completed" },
    { id: 2, date: "Apr 2, 2025", amount: 450, loan: "Auto Loan", status: "Completed" },
    { id: 3, date: "Mar 28, 2025", amount: 500, loan: "Student Loan", status: "Completed" },
    { id: 4, date: "Mar 15, 2025", amount: 1250, loan: "Home Loan", status: "Completed" },
  ])
  
  // Function to open the edit dialog
  const handleEditLoan = (loan: any) => {
    setDialogMode("edit")
    setSelectedLoanId(loan.id)
    setFormState({
      name: loan.name,
      amount: loan.amount,
      remaining: loan.remaining,
      lender: loan.lender,
      interestRate: loan.interestRate.replace("%", ""),
      nextAmount: loan.nextAmount,
      nextPayment: loan.nextPayment,
      paymentsMade: loan.paymentsMade,
      paymentsRemaining: loan.paymentsRemaining,
    })
    setIsDialogOpen(true)
  }
  
  // Function to open the add dialog
  const handleAddLoan = () => {
    setDialogMode("add")
    setSelectedLoanId(null)
    setFormState({
      name: "New Loan",
      amount: 100000,
      remaining: 100000,
      lender: "Custom Lender",
      interestRate: "5.0",
      nextAmount: 1000,
      nextPayment: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      paymentsMade: 0,
      paymentsRemaining: 60,
    })
    setIsDialogOpen(true)
  }
  
  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: name === "name" || name === "lender" || name === "nextPayment" ? value : Number(value)
    }))
  }
  
  // Function to save loan changes
  const handleSaveLoan = () => {
    // Calculate progress
    const progress = Math.round((1 - formState.remaining / formState.amount) * 100)
    
    const loanData = {
      name: formState.name,
      amount: formState.amount,
      remaining: formState.remaining,
      progress,
      nextPayment: formState.nextPayment,
      nextAmount: formState.nextAmount,
      interestRate: `${formState.interestRate}%`,
      trend: "neutral" as const,
      lender: formState.lender,
      paymentsMade: formState.paymentsMade,
      paymentsRemaining: formState.paymentsRemaining,
    }
    
    if (dialogMode === "add") {
      addLoan(loanData)
    } else if (dialogMode === "edit" && selectedLoanId !== null) {
      updateLoan(selectedLoanId, loanData)
    }
    
    setIsDialogOpen(false)
  }
  
  // Function to delete a loan with confirmation
  const handleDeleteLoan = (id: number) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      deleteLoan(id)
    }
  }
  
  // Function to open payment confirmation dialog
  const handleOpenPaymentDialog = (loanId: number) => {
    const loan = loans.find(loan => loan.id === loanId)
    if (!loan) return
    
    setPaymentLoan(loanId)
    setPaymentAmount(loan.nextAmount)
    setPaymentSuccess(false)
    setIsPaymentDialogOpen(true)
  }
  
  // Function to process a loan payment
  const handleMakePayment = () => {
    if (paymentLoan === null) return
    
    // Process the payment
    makePayment(paymentLoan)
    
    // Get loan details for the payment record
    const loan = loans.find(loan => loan.id === paymentLoan)
    if (!loan) return
    
    // Add to payment history
    const today = new Date()
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    
    const newPayment = {
      id: Date.now(),
      date: formattedDate,
      amount: paymentAmount,
      loan: loan.name,
      status: "Completed",
    }
    
    setRecentPayments(prev => [newPayment, ...prev.slice(0, 9)]) // Keep last 10 payments
    
    // Show success message briefly
    setPaymentSuccess(true)
    
    // Close the dialog after a delay
    setTimeout(() => {
      setIsPaymentDialogOpen(false)
      setPaymentSuccess(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Loan Dashboard</h1>
            <p className="text-gray-600">Track, manage, and optimize your loan repayments</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100 transition-colors">
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100 transition-colors" asChild>
              <Link href="/">
                <span>Home</span>
              </Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md"
              asChild
            >
              <Link href="/chat">
                <span>AI Assistant</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Loan Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalLoanAmount.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Across {loans.length} active loans</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Remaining Balance</CardTitle>
              <PieChart className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRemaining.toLocaleString()}</div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">{totalProgress}% paid off</span>
                <Progress value={totalProgress} className="h-1 w-16 bg-gray-200">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${totalProgress}%` }} />
                </Progress>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Next Payment Due</CardTitle>
              <Calendar className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nextPaymentDue ? 
                  nextPaymentDue.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : 
                  "No payments"
                }
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500">₹{nextPaymentAmount} payment</span>
                {nextPaymentDue && new Date().getTime() + 7 * 24 * 60 * 60 * 1000 > nextPaymentDue.getTime() && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Soon
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Potential Savings</CardTitle>
              <TrendingDown className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(potentialSavings).toLocaleString()}</div>
              <p className="text-xs text-gray-500">With optimized repayment</p>
            </CardContent>
          </Card>
        </div>

        {/* Repayment Visualizer */}
        <div className="mb-8">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Loan Repayment Visualizer</CardTitle>
              <CardDescription>Track your progress and projected payoff timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <RepaymentVisualizer loans={loans} />
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <AIRecommendations loans={loans} />
        </div>

        {/* Loans and Payments Tabs */}
        <Tabs defaultValue="loans" className="w-full">
          <TabsList className="mb-6 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger
              value="loans"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Active Loans
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Payment History
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Payment Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="loans">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={handleAddLoan}
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Loan
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {loans.length === 0 ? (
                <Card className="border-none shadow-md p-8 text-center">
                  <p className="text-gray-500 mb-4">No loans added yet</p>
                  <Button 
                    onClick={handleAddLoan}
                    className="bg-indigo-600 hover:bg-indigo-700 transition-colors mx-auto"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Loan
                  </Button>
                </Card>
              ) : (
                loans.map((loan) => (
                  <Card key={loan.id} className="border-none shadow-md hover:shadow-lg transition-all overflow-hidden">
                    <CardHeader className="pb-2 border-b">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CardTitle>{loan.name}</CardTitle>
                          {loan.trend === "down" && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              On Track
                            </span>
                          )}
                          {loan.trend === "neutral" && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Standard
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 text-gray-500"
                            onClick={() => handleEditLoan(loan)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit loan</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteLoan(loan.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete loan</span>
                          </Button>
                          <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            onClick={() => handleOpenPaymentDialog(loan.id)}
                          >
                            Make Payment
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        {loan.lender} • Original amount: ₹{loan.amount.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Remaining Balance</span>
                          <span className="font-medium">₹{loan.remaining.toLocaleString()}</span>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">{loan.progress}% Paid Off</span>
                            <span className="text-sm text-gray-500">
                              ₹{(loan.amount - loan.remaining).toLocaleString()} of ₹{loan.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                              <div
                                style={{ width: `${loan.progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 rounded transition-all duration-500"
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                          <div>
                            <p className="text-sm text-gray-500">Next Payment</p>
                            <p className="font-medium">{loan.nextPayment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment Amount</p>
                            <p className="font-medium">₹{loan.nextAmount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Interest Rate</p>
                            <p className="font-medium">{loan.interestRate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payments Remaining</p>
                            <p className="font-medium">{loan.paymentsRemaining} of {loan.paymentsMade + loan.paymentsRemaining}</p>
                          </div>
                        </div>
                        <div className="pt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            Loan Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            Payment History
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            Refinance Options
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Recent Payments</CardTitle>
                <CardDescription>View your payment history across all loans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Loan</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{payment.date}</td>
                          <td className="py-3 px-4">{payment.loan}</td>
                          <td className="py-3 px-4">₹{payment.amount}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download receipt</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <History className="mr-2 h-4 w-4" />
                    View Complete Payment History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <PaymentSchedule loans={loans} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add/Edit Loan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Add New Loan" : "Edit Loan"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "add" 
                ? "Enter the details for your new loan" 
                : "Update the details for this loan"}
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
                value={formState.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Loan Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formState.amount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remaining" className="text-right">
                Remaining
              </Label>
              <Input
                id="remaining"
                name="remaining"
                type="number"
                value={formState.remaining}
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
                value={formState.lender}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interestRate" className="text-right">
                Interest Rate
              </Label>
              <Input
                id="interestRate"
                name="interestRate"
                type="number"
                step="0.1"
                value={formState.interestRate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nextAmount" className="text-right">
                Payment Amount
              </Label>
              <Input
                id="nextAmount"
                name="nextAmount"
                type="number"
                value={formState.nextAmount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nextPayment" className="text-right">
                Next Payment
              </Label>
              <Input
                id="nextPayment"
                name="nextPayment"
                value={formState.nextPayment}
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
                value={formState.paymentsMade}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentsRemaining" className="text-right">
                Payments Left
              </Label>
              <Input
                id="paymentsRemaining"
                name="paymentsRemaining"
                type="number"
                value={formState.paymentsRemaining}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLoan}>
              {dialogMode === "add" ? "Add Loan" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Confirmation Dialog */}
      <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <AlertDialogContent>
          {!paymentSuccess ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to make a payment of ₹{paymentAmount} for your loan. This will be recorded and your loan balance will be updated.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loan:</span>
                      <span className="font-medium">{paymentLoan !== null ? loans.find(loan => loan.id === paymentLoan)?.name : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Amount:</span>
                      <span className="font-medium">₹{paymentAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleMakePayment}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Process Payment
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <div className="py-8 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-500 text-center mb-4">
                Your payment of ₹{paymentAmount} has been processed successfully.
              </p>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

