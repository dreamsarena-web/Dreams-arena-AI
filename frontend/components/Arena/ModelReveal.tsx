"use client"

import { motion } from "framer-motion"
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { VoteResult } from "@/lib/types"

interface ModelRevealProps {
  result: VoteResult
  onNewBattle: () => void
}

export default function ModelReveal({ result, onNewBattle }: ModelRevealProps) {
  const getWinnerLabel = () => {
    switch (result.winner) {
      case "A": return `🏆 ${result.revealed.model_a} فاز!`
      case "B": return `🏆 ${result.revealed.model_b} فاز!`
      case "tie": return "🤝 تعادل!"
      case "both_bad": return "👎 كلاهما لم يكن جيداً"
    }
  }

  const getEloIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-dark-800 border border-dark-600 rounded-3xl p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        >
          <div className="text-5xl mb-4">
            {result.winner === "tie" ? "🤝" : result.winner === "both_bad" ? "😕" : "🏆"}
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {getWinnerLabel()}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 my-6">
          {[
            { name: result.revealed.model_a, changes: result.elo_changes?.model_a },
            { name: result.revealed.model_b, changes: result.elo_changes?.model_b }
          ].map((model, i) => (
            <div key={i} className="bg-dark-900/50 rounded-2xl p-4">
              <div className="text-white font-bold text-sm mb-2">{model.name}</div>
              {model.changes && (
                <>
                  <div className="flex items-center justify-center gap-1">
                    {getEloIcon(model.changes.change)}
                    <span className={`font-black text-lg ${
                      model.changes.change > 0 ? "text-green-400" :
                      model.changes.change < 0 ? "text-red-400" : "text-slate-400"
                    }`}>
                      {model.changes.change > 0 ? "+" : ""}{model.changes.change}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    {model.changes.old} → {model.changes.new} ELO
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewBattle}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          معركة جديدة
        </motion.button>
      </div>
    </motion.div>
  )
}
