"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Sparkles, Loader2, ChevronRight, MessageSquare, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { generateChatResponse } from "../actions/chat-actions"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const commonQuestions = [
    "How can I reduce my loan interest?",
    "What happens if I miss a payment?",
    "How do I make an extra payment?",
    "Can I refinance my current loan?",
    "What's the best strategy to pay off multiple loans?",
    "How does my credit score affect my loans?",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleTopicSelect = (topic: string) => {
    setInput(topic)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Add user message to the chat
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])

    // Clear input and error
    setInput("")
    setErrorMessage(null)
    setIsLoading(true)

    try {
      // Call the server action with all messages including the new one
      const aiResponse = await generateChatResponse([...messages, userMessage])

      // Add AI response to the chat
      setMessages((prev) => [...prev, { 
        role: "assistant" as const, 
        content: aiResponse.content 
      }])
    } catch (error) {
      console.error("Error getting chat response:", error)
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full shadow-inner">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">AI Loan Assistant</CardTitle>
                <CardDescription className="text-indigo-100 mt-1">
                  Powered by Google Gemini • Your personal loan advisor
                </CardDescription>
                
                <div className="mt-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg p-3 shadow-lg transform hover:scale-105 transition-all">
                  <p className="text-xl font-bold text-white flex items-center">
                    <span className="mr-2">👨‍💻</span>
                    Developed by: Sahil Kumar Chaudhary
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-6 mt-1">
                    <p className="text-white font-semibold"><span className="text-purple-300">Registration:</span> 12305507</p>
                    <p className="text-white font-semibold"><span className="text-purple-300">Section:</span> K23PB</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[70vh] max-h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" id="chat-messages">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4 shadow-md">
                      <MessageSquare className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">How can I help you today?</h3>
                    <p className="text-gray-600 mb-8 max-w-md">
                      Ask me anything about your loans, payments, or get personalized financial advice
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                      {commonQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-between h-auto py-3 px-4 text-left border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                          onClick={() => handleTopicSelect(question)}
                        >
                          <span className="truncate mr-2">{question}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex items-start gap-3 max-w-[90%] sm:max-w-[80%] ${
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <Avatar className={message.role === "user" ? "bg-purple-100" : "bg-indigo-100"}>
                            <AvatarImage 
                              src={message.role === "user" ? "/profile.png" : "/robot.png"} 
                              alt={message.role === "user" ? "User" : "AI"} 
                            />
                            <AvatarFallback>
                              {message.role === "user" ? "U" : "AI"}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.role === "user"
                                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md"
                                : "bg-white border border-indigo-100 shadow-sm"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <div className="whitespace-pre-wrap text-gray-800">
                                {message.content.split("\n").map((paragraph, i) => (
                                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              message.content
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {errorMessage && (
                      <div className="flex justify-center">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center max-w-[90%] sm:max-w-[80%]">
                          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              <div className="border-t border-indigo-100 p-3 md:p-4 bg-white">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your question here..."
                    className="flex-1 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all rounded-xl py-6"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors rounded-xl px-5"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

