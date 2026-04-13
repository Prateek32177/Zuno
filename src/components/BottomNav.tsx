'use client'

import Link from 'next/link'
import { Flame, Compass, Plus, Heart, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export function BottomNav() {
  const pathname = usePathname()
  const is = (p: string) => pathname.startsWith(p)

  const navItems = [
    { href: '/feed', icon: Flame, label: 'Discover', active: is('/feed') },
    { href: '/feed', icon: Compass, label: 'Explore', active: false },
    { href: '/my-plans', icon: Heart, label: 'Saved', active: is('/my-plans') },
    { href: '/profile/me', icon: User, label: 'Profile', active: is('/profile') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
      <div className="mx-auto flex max-w-2xl items-center justify-between px-3 py-2">
        {/* Nav items */}
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justif-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all ${
                item.active
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </motion.div>
            <span className={`text-xs mt-1 font-medium ${
              item.active ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {item.label}
            </span>
          </Link>
        ))}

        {/* Create button */}
        <Link href="/plans/create">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-11 h-11 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow">
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </motion.div>
        </Link>
      </div>
    </nav>
  )
}
