"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Swords, Medal } from "lucide-react"
import { getLeaderboard, getStats } from "@/lib/api"
import { LeaderboardEntry } from "@/lib/types"

const PROVIDERS = [
  { id: "", label: "الكل" },
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google" },
  { id: "mistral", label: "Mistral" }
]

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedProvider, setSelectedProvider] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [selectedProvider])

  const loadData = async () => {
    setLoading(true)
    try {
      const [leaderboardData, statsData] = await Promise.all([
        getLeaderboard(selectedProvider || undefined),
        getStats()
      ])
      setData(leaderboardData.leaderboard)
      setStats(statsData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      openai: "bg-green-500/20 text-green-400 border-green-500/30",
      anthropic: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      google: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      mistral: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
    return colors[provider] || "bg-slate-500/20 text-slate-400 border-slate-500/30"
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-6 pb-20">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-yellow-500/20 p-3 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <h1 className="text-3xl font-black text-white">قائمة التصنيف</h1>
          </div>
          <p className="text-slate-400">تصنيف مبني على {stats?.total_votes?.toLocaleString() || "..."} تصويت</p>
        </motion.div>

        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
            {[
              { label: "معركة", value: stats.total_battles?.toLocaleString(), icon: Swords },
              { label: "تصويت", value: stats.total_votes?.toLocaleString(), icon: Trophy },
              { label: "نموذج", value: stats.total_models, icon: Medal }
            ].map((s, i) => (
              <div key={i} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center">
                <s.icon className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-slate-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedProvider === p.id
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-slate-400 hover:text-white border border-dark-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">جاري التحميل...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((model, i) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-dark-800 border rounded-2xl p-5 flex items-center gap-4 transition-all hover:border-primary-500/50 ${
                    model.rank <= 3
                      ? "border-yellow-500/30 shadow-lg shadow-yellow-500/5"
                      : "border-dark-700"
                  }`}
                >
                  <div className="text-2xl font-black w-12 text-center flex-shrink-0">
                    {getRankIcon(model.rank)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-lg">{model.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getProviderColor(model.provider)}`}>
                        {model.provider}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{model.total_battles} معركة</span>
                      <span>{model.total_wins} فوز</span>
                      <span className="text-green-400">{model.win_rate}% معدل فوز</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black text-white">{model.elo_score}</div>
                    <div className="text-slate-500 text-xs">نقاط ELO</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
