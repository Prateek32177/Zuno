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
    <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
      <div className="mx-auto max-w-2xl px-4 pb-2">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 app-card px-3 py-2.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center flex-1 py-1">
              <div className={`p-2 transition-colors ${item.active ? 'text-gray-900 dark:text-white' : 'app-muted'}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-medium mt-0.5 ${item.active ? 'text-gray-900 dark:text-white' : 'app-muted'}`}>
                {item.label}
              </span>
            </Link>
          ))}

          <Link
            href="/plans/create"
            className="absolute left-1/2 -translate-x-1/2 -top-5 rounded-full p-3 transition-colors text-white"
            style={{ backgroundColor: 'var(--brand)' }}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </nav>
  )
}
