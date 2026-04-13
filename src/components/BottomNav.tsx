'use client'

import Link from 'next/link'
import { Flame, Plus, Heart, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()
  const is = (p: string) => pathname.startsWith(p)

  const navItems = [
    { href: '/feed', icon: Flame, label: 'Discover', active: is('/feed') },
    { href: '/my-plans', icon: Heart, label: 'Saved', active: is('/my-plans') },
    { href: '/profile/me', icon: User, label: 'Profile', active: is('/profile') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <div className="mx-auto px-4 pb-2 max-w-2xl">
        <div className="flex max-w-md mx-auto items-center justify-between rounded-3xl border border-gray-200 dark:border-gray-700 app-card px-2 py-2 shadow-brand-lg backdrop-blur-xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center flex-1 transition-all duration-200"
            >
              <div
                className={`rounded-2xl p-3 transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-brand-md scale-110'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span
                className={`mt-2 text-xs font-bold transition-colors duration-200 ${
                  item.active
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}

          <Link
            href="/plans/create"
            className="absolute left-1/2 -translate-x-1/2 -top-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-brand-lg hover:shadow-brand-lg transition-all duration-200 hover:scale-110"
          >
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </nav>
  )
}
