"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Swords, Trophy, Home, Zap } from "lucide-react"

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/arena", label: "Arena", icon: Swords },
  { href: "/leaderboard", label: "التصنيف", icon: Trophy }
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="bg-primary-500 p-1.5 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-black text-xl">Dreams Arena</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-primary-500 text-white"
                        : "text-slate-400 hover:text-white hover:bg-dark-800"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden md:block">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <Link href="/arena">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span className="hidden sm:block">معركة</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
