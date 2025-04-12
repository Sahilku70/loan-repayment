"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, Clock } from "lucide-react"
import { Loan } from "@/lib/loan-store"

// Define a type for payment schedule items
interface ScheduleItem {
  id: string;
  loanId: number;
  loanName: string;
  date: Date;
  amount: number;
  status: 'paid' | 'upcoming';
}

export function PaymentSchedule({ loans }: { loans: Loan[] }) {
  const [selectedLoan, setSelectedLoan] = useState<string>("all")
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])

  // Generate the next 12 months of payments
  useEffect(() => {
    if (!loans.length) {
      setSchedule([])
      return
    }

    const generateSchedule = () => {
      const scheduleItems: ScheduleItem[] = []
      const currentDate = new Date()

      for (let i = 0; i < 12; i++) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 15)

        loans.forEach((loan) => {
          const paymentDate = new Date(month)
          
          // Parse the loan payment date and extract the day
          let loanPaymentDay = 15; // Default to 15th
          try {
            // Expecting format like "May 15, 2025"
            const paymentParts = loan.nextPayment.split(" ")
            if (paymentParts.length >= 2) {
              // Remove any comma from the day
              loanPaymentDay = Number.parseInt(paymentParts[1].replace(',', ''))
            }
          } catch (e) {
            console.error("Error parsing payment date:", e)
          }
          
          paymentDate.setDate(loanPaymentDay)

          if (selectedLoan === "all" || selectedLoan === loan.id.toString()) {
            scheduleItems.push({
              id: `${loan.id}-${i}`,
              loanId: loan.id,
              loanName: loan.name,
              date: paymentDate,
              amount: loan.nextAmount,
              status: paymentDate < currentDate ? "paid" : "upcoming",
            })
          }
        })
      }

      // Sort by date
      return scheduleItems.sort((a, b) => a.date.getTime() - b.date.getTime())
    }

    setSchedule(generateSchedule())
  }, [loans, selectedLoan])

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Payment Schedule</CardTitle>
            <CardDescription>View your upcoming loan payments</CardDescription>
          </div>
          <Select value={selectedLoan} onValueChange={setSelectedLoan}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select loan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Loans</SelectItem>
              {loans.map((loan) => (
                <SelectItem key={loan.id} value={loan.id.toString()}>
                  {loan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {schedule.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(payment.date)}
                    </div>
                  </td>
                  <td className="py-3 px-4">{payment.loanName}</td>
                  <td className="py-3 px-4">₹{payment.amount}</td>
                  <td className="py-3 px-4">
                    {payment.status === "paid" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 flex items-center w-fit"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 flex items-center w-fit"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Upcoming
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
              {schedule.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No payments scheduled for the selected loan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

