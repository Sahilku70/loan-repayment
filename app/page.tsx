import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Shield,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuickLoanCalculator } from "@/components/quick-loan-calculator"
import { Testimonials } from "@/components/testimonials"
import { FloatingChatButton } from "@/components/chat-button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Floating Chat Button */}
      <FloatingChatButton />

      {/* Hero Section with creative design */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800 py-24 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXY1aC0xdi01em0tMi0yaDF2OWgtMXYtOXptLTIgNGgxdjVoLTF2LTV6bS0yLTVoMXY5aC0xdi05em0tMiAzaDFWMzBoLTF2LTExem0tMiA1aDF2NmgtMXYtNnptLTIgMmgxdjRoLTF2LTR6bS0yLTJoMXY2aC0xdi02em0tMi0xMGgxdjE2aC0xVjEwem0tMiA4aDF2OGgtMXYtOHptLTIgNGgxdjRoLTF2LTR6bS0yLThoMXY4aC0xdi04em0tMi00aDF2MTJoLTFWMTB6bTAtOGgxdjhoLTFWMnptLTIgMTJoMXY0aC0xdi00em0tMi04aDF2MTJoLTF2LTEyek02IDJoMXY0SDZWMnptLTIgMTJoMXY0SDRWMTRjLTEuMSAwLTIgLjktMiAydjQyaDYwVjE2YzAtMS4xLS45LTItMi0yaC00djRoLTF2LTRoLTJ2NGgtMXYtNGgtMnY0aC0xdi00aC0ydjRoLTF2LTRoLTJ2NGgtMXYtNGgtMnY0aHQtMXYtNGgtMnY0aC0xdi00aC0ydjRoLTF2LTRoLTJ2NGgtMXYtNEg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="md:w-1/2 space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2 text-purple-300" />
                <span>AI-Powered Loan Management</span>
              </div>
              <div className="p-8">
      <h1 className="text-2xl font-bold">Loan Repayment Calculator</h1>
      <p className="mt-2">Welcome to your loan repayment application</p>
      
      <div className="mt-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-all">
        <p className="text-xl font-bold text-white">Developed by: Sahil Kumar Chaudhary</p>
        <div className="flex flex-col sm:flex-row sm:space-x-6 mt-1">
          <p className="text-white font-semibold"><span className="text-purple-300">Registration:</span> 12305507</p>
          <p className="text-white font-semibold"><span className="text-purple-300">Section:</span> K23PB</p>
        </div>
      </div>
    </div>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white">
                  <span className="block">Smart Loans.</span>
                  <span className="text-purple-300">Smarter Repayments.</span>
                </h1>
                <p className="text-xl text-indigo-100 max-w-lg leading-relaxed">
                  Our AI-powered platform analyzes your loans and creates a personalized repayment strategy to save you
                  time and money.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl px-8 py-6 h-auto text-lg font-medium justify-center"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center">
                    <span>Get Started Free</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">No credit check</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Free analysis</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Cancel anytime</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500 rounded-lg rotate-12 opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-indigo-500 rounded-full opacity-20"></div>

                {/* Dashboard preview */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-2 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border border-gray-700">
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 rounded-t-2xl flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <img
                    src="/ChatGPT.png?height=400&width=500"
                    alt="Loan management dashboard"
                    className="rounded-lg w-full mt-4"
                  />

                  {/* Floating stats card */}
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      <span className="font-semibold text-gray-900">Savings Projection</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-700">₹12,450</div>
                    <div className="text-sm text-gray-500">Based on your loan profile</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
            <span className="text-sm text-indigo-200 mb-2">Scroll to explore</span>
            <ChevronRight className="h-5 w-5 text-indigo-200 transform rotate-90" />
          </div>
        </div>
      </header>

      {/* Quick Calculator Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span>Loan Calculator</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Calculate Your Loan Repayment in Seconds
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Get a quick estimate of your monthly payments and see how much you could save with our optimized
                repayment strategies. Adjust the parameters to see real-time changes.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-700 font-bold">1</span>
                  </div>
                  <span className="text-gray-700">Enter loan details</span>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-700 font-bold">2</span>
                  </div>
                  <span className="text-gray-700">See payment breakdown</span>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-700 font-bold">3</span>
                  </div>
                  <span className="text-gray-700">Get personalized plan</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 transform hover:scale-[1.02] transition-all duration-300">
                <QuickLoanCalculator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with modern cards */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-purple-100 rounded-full opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Smart Features</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Intelligent Tools for Smarter Repayments</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with financial expertise to help you pay off loans faster and save
              money.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="bg-indigo-100 p-4 rounded-xl w-fit mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <BarChart3 className="h-7 w-7 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                AI-Powered Analytics
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI analyzes your loans and spending patterns to create a personalized repayment strategy that saves
                you money on interest.
              </p>
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="bg-purple-100 p-4 rounded-xl w-fit mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <CreditCard className="h-7 w-7 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                Smart Payment Scheduling
              </h3>
              <p className="text-gray-600 mb-6">
                Schedule payments automatically, get reminders, and make extra payments strategically to reduce your
                principal faster.
              </p>
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors"
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="bg-indigo-100 p-4 rounded-xl w-fit mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <MessageSquare className="h-7 w-7 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                24/7 AI Assistant
              </h3>
              <p className="text-gray-600 mb-6">
                Get instant answers to your loan questions, personalized advice, and step-by-step guidance on optimizing
                your repayments.
              </p>
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/chat"
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Try it now <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>How It Works</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Simple Process, Powerful Results</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to take control of your loans and save money with just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Connect Your Loans",
                description: "Securely link your existing loans or manually enter your loan details.",
                icon: <CreditCard className="h-6 w-6" />,
              },
              {
                step: 2,
                title: "Get AI Analysis",
                description: "Our AI analyzes your loans and identifies opportunities to save money.",
                icon: <BarChart3 className="h-6 w-6" />,
              },
              {
                step: 3,
                title: "Review Recommendations",
                description: "Explore personalized repayment strategies and savings projections.",
                icon: <Sparkles className="h-6 w-6" />,
              },
              {
                step: 4,
                title: "Implement & Save",
                description: "Put your plan into action and track your progress toward financial freedom.",
                icon: <TrendingUp className="h-6 w-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6 relative z-10">
                    <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                  </div>

                  {index < 3 && (
                    <div className="absolute top-8 left-[60%] w-full h-0.5 bg-indigo-100 z-0 hidden md:block"></div>
                  )}

                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    <span className="text-indigo-600">Step {item.step}:</span> {item.title}
                  </h3>
                  <p className="text-gray-600 text-center">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-6 h-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/dashboard">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXY1aC0xdi01em0tMi0yaDF2OWgtMXYtOXptLTIgNGgxdjVoLTF2LTV6bS0yLTVoMXY5aC0xdi05em0tMiAzaDFWMzBoLTF2LTExem0tMiA1aDF2NmgtMXYtNnptLTIgMmgxdjRoLTF2LTR6bS0yLTJoMXY2aC0xdi02em0tMi0xMGgxdjE2aC0xVjEwem0tMiA4aDF2OGgtMXYtOHptLTIgNGgxdjRoLTF2LTR6bS0yLThoMXY4aC0xdi04em0tMi00aDF2MTJoLTFWMTB6bTAtOGgxdjhoLTFWMnptLTIgMTJoMXY0aC0xdi00em0tMi04aDF2MTJoLTF2LTEyek02IDJoMXY0SDZWMnptLTIgMTJoMXY0SDRWMTRjLTEuMSAwLTIgLjktMiAydjQyaDYwVjE2YzAtMS4xLS45LTItMi0yaC00djRoLTF2LTRoLTJ2NGgtMXYtNGgtMnY0aC0xdi00aC0ydjRoLTF2LTRoLTJ2NGgtMXYtNGgtMnY0aHQtMXYtNGgtMnY0aC0xdi00aC0ydjRoLTF2LTRoLTJ2NGgtMXYtNEg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          <div className="absolute top-[10%] left-  opacity-10"></div>
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2 text-purple-300" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Join thousands of users who have simplified their loan repayment process with our platform.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* CTA Section with gradient */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[50%] -right-[10%] w-[60%] h-[100%] bg-indigo-50 rounded-full opacity-70"></div>
          <div className="absolute -bottom-[50%] -left-[10%] w-[60%] h-[100%] bg-purple-50 rounded-full opacity-70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-12 md:p-16 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2"></div>

              <div className="text-center text-white relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to take control of your loans?</h2>
                <p className="text-xl mb-10 text-indigo-100 max-w-2xl mx-auto">
                  Join thousands of users who have saved an average of ₹3,200 in interest payments.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-700 hover:bg-indigo-50 transition-all transform hover:scale-105 text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl font-semibold"
                    asChild
                  >
                    <Link href="/dashboard">
                      Start Your Free Analysis <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    className="bg-white text-indigo-700 hover:bg-indigo-50 transition-all transform hover:scale-105 text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl font-semibold"
                    asChild
                  >
                    <Link href="/chat">
                      Chat with AI Assistant <MessageSquare className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <p className="mt-6 text-sm text-indigo-100">No credit card required. Free forever.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">LoanAI</h3>
              <p className="text-gray-400 mb-6">Making loan repayment smarter and easier with AI technology.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Loan Calculator
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Debt Payoff Strategies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Financial Education
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400">
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  sahilku707@gmail.com
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  7070430207
                </li>
              </ul>
              <div className="mt-6">
                <h5 className="text-sm font-semibold mb-3 text-gray-300">Subscribe to our newsletter</h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  />
                  <button className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-r-md transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            {/* Copyright removed */}
          </div>
        </div>
      </footer>
    </div>
  )
}

