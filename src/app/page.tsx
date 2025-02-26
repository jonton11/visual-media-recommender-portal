"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

interface Recommendation {
  title: string
  description: string
  matchPercentage: number
}

interface WatchHistoryEntry {
  title: string
  timestamp: number
  recommendations: Recommendation[]
}

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    title: "Breaking Bad",
    description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future.",
    matchPercentage: 98,
  },
  {
    title: "Better Call Saul",
    description: "The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White and Jesse Pinkman.",
    matchPercentage: 95,
  },
  {
    title: "The Wire",
    description: "A complex, multi-layered examination of the city of Baltimore through the lens of law enforcement, politics, education, and the criminal world.",
    matchPercentage: 92,
  },
  {
    title: "True Detective",
    description: "Seasonal anthology series in which police investigations unearth the personal and professional secrets of those involved, both within and outside the law.",
    matchPercentage: 89,
  },
  {
    title: "The Sopranos",
    description: "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life that affect his mental state.",
    matchPercentage: 87,
  },
  {
    title: "Fargo",
    description: "Various chronicles of deception, intrigue and murder in and around frozen Minnesota. Yet all of these tales mysteriously lead back one way or another to Fargo, North Dakota.",
    matchPercentage: 85,
  }
]

export default function Home() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [watchHistory, setWatchHistory] = useState<WatchHistoryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<WatchHistoryEntry>()

  useEffect(() => {
    // Load watch history from localStorage
    const savedHistory = localStorage.getItem("watchHistory")
    if (savedHistory) {
      setWatchHistory(JSON.parse(savedHistory))
    }
  }, [])

  const getRandomRecommendations = () => {
    // Create a copy of the recommendations array
    const shuffled = [...MOCK_RECOMMENDATIONS]
    // Get random number between 2 and 4 for number of recommendations
    const numRecommendations = Math.floor(Math.random() * 3) + 2
    
    // Shuffle array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    // Return first 2-4 items
    return shuffled.slice(0, numRecommendations)
  }

  const handleGetRecommendations = async () => {
    if (!input.trim()) return
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const randomRecommendations = getRandomRecommendations()
    
    // Create new history entry
    const newEntry: WatchHistoryEntry = {
      title: input,
      timestamp: Date.now(),
      recommendations: randomRecommendations
    }

    // Update watch history
    const updatedHistory = [newEntry, ...watchHistory]
    setWatchHistory(updatedHistory)
    localStorage.setItem("watchHistory", JSON.stringify(updatedHistory))

    setRecommendations(randomRecommendations)
    setIsLoading(false)
    setInput("")
  }

  const handleHistoryEntryClick = (entry: WatchHistoryEntry) => {
    setSelectedEntry(entry)
    setRecommendations(entry.recommendations)
    setInput(entry.title)
  }

  return (
    <>
      <Sidebar 
        watchHistory={watchHistory}
        onEntryClick={handleHistoryEntryClick}
        selectedEntry={selectedEntry}
      />
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a show or movie you enjoyed..."
            className="w-full rounded-md border bg-background px-4 py-2 text-center text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && handleGetRecommendations()}
          />
          <button 
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="w-full rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Get Recommendations
          </button>

          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {!isLoading && recommendations.length > 0 && (
            <div className="space-y-4 pt-8">
              {recommendations.map((rec) => (
                <div
                  key={rec.title}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{rec.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {rec.matchPercentage}% Match
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
} 