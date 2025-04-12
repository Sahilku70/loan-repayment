/**
 * Calculate the Equated Monthly Installment (EMI) for a loan
 * @param principal The loan amount
 * @param annualInterestRate Annual interest rate (in percentage)
 * @param termInMonths Loan term in months
 * @returns The monthly payment amount
 */
export function calculateEMI(principal: number, annualInterestRate: number, termInMonths: number): number {
  // Convert annual interest rate to monthly decimal rate
  const monthlyRate = annualInterestRate / 12 / 100

  // Calculate EMI using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / (Math.pow(1 + monthlyRate, termInMonths) - 1)

  // Round to 2 decimal places
  return Math.round(emi * 100) / 100
}

/**
 * Calculate the total interest paid over the life of a loan
 * @param principal The loan amount
 * @param monthlyPayment The monthly payment amount
 * @param termInMonths Loan term in months
 * @returns The total interest paid
 */
export function calculateTotalInterest(principal: number, monthlyPayment: number, termInMonths: number): number {
  const totalPayment = monthlyPayment * termInMonths
  const totalInterest = totalPayment - principal

  // Round to 2 decimal places
  return Math.round(totalInterest * 100) / 100
}

