"use client"

import { motion } from "framer-motion"
import { VoteType } from "@/lib/types"

interface VotingButtonsProps {
  onVote: (vote: VoteType) => void
}

const votes = [
  {
    type: "A" as VoteType,
    label: "A أفضل",
    emoji: "👈",
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/30"
  },
  {
    type: "tie" as VoteType,
    label: "تعادل",
    emoji: "🤝",
    color: "from-yellow-500 to-orange-500",
    shadow: "shadow-yellow-500/30"
  },
  {
    type: "both_bad" as VoteType,
    label: "كلاهما سيء",
    emoji: "👎",
    color: "from-slate-500 to-slate-600",
    shadow: "shadow-slate-500/30"
  },
  {
    type: "B" as VoteType,
    label: "B أفضل",
    emoji: "👉",
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/30"
  }
]

export default function VotingButtons({ onVote }: VotingButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white mb-2">
          🗳️ أيهما أفضل؟
        </h2>
        <p className="text-slate-400">
          قيّم الردين واختر الأفضل بشكل موضوعي
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {votes.map((vote) => (
          <motion.button
            key={vote.type}
            whileHover={{ scale: 1.05, translateY: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onVote(vote.type)}
            className={`bg-gradient-to-br ${vote.color} p-4 rounded-2xl text-white font-bold shadow-lg ${vote.shadow} transition-all`}
          >
            <div className="text-3xl mb-2">{vote.emoji}</div>
            <div className="text-sm">{vote.label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
