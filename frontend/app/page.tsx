"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Swords, Trophy, Zap, Users, Star } from "lucide-react"

export default function HomePage() {
  const stats = [
    { label: "معركة", value: "50K+", icon: Swords },
    { label: "نموذج AI", value: "12+", icon: Zap },
    { label: "مستخدم", value: "10K+", icon: Users },
    { label: "تصويت", value: "45K+", icon: Star }
  ]

  const features = [
    { icon: "⚔️", title: "معارك مباشرة", desc: "قارن نموذجين بشكل مجهول" },
    { icon: "🏆", title: "تصنيف ELO", desc: "نظام تصنيف عالمي دقيق" },
    { icon: "⚡", title: "بث فوري", desc: "شاهد الردود في الوقت الفعلي" },
    { icon: "📊", title: "إحصائيات", desc: "تحليل عميق لكل نموذج" }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm">منصة مقارنة الذكاء الاصطناعي</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="text-white">Dreams </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)"
                }}
              >
                Arena
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              قارن بين أقوى نماذج الذكاء الاصطناعي وصوّت للأفضل
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/arena">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
                >
                  <Swords className="w-5 h-5" />
                  ابدأ المعركة
                </motion.button>
              </Link>

              <Link href="/leaderboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-dark-800 border border-dark-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
                >
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  قائمة التصنيف
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-dark-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center">
                <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-white text-center mb-16">
            لماذا Dreams Arena؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
