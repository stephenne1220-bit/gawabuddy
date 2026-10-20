import { useState, useEffect } from 'react'
import { Quote } from 'lucide-react'
import { QUOTES } from '@/lib/quotes'

export function QuoteCard() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    // Function to pick a random quote
    const pickRandom = () => {
      const randomIndex = Math.floor(Math.random() * QUOTES.length)
      setQuote(QUOTES[randomIndex])
    }

    // Pick one immediately on load
    pickRandom()

    // Set an interval to change it every 2 minutes (120,000 ms)
    const interval = setInterval(pickRandom, 120000)

    return () => clearInterval(interval)
  }, [])

  if (!quote) return null

  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-5 shadow-sm dark:border-[#163C35] dark:bg-[#061F1B]">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-[#D4A017]/10 p-2 text-[#D4A017]">
          <Quote size={18} />
        </div>
        <div>
          <p className="text-sm font-medium italic leading-relaxed text-[#1F2937] dark:text-[#F5F8F7]">
            "{quote}"
          </p>
        </div>
      </div>
    </div>
  )
}