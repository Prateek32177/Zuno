'use client'

import { useEffect, useState } from 'react'

type ToastKind = 'success' | 'error'

type ToastItem = {
  id: string
  title: string
  description?: string
  kind: ToastKind
}

type ToastOptions = {
  description?: string
}

type Listener = (toast: ToastItem) => void

const listeners = new Set<Listener>()

const emitToast = (kind: ToastKind, title: string, options?: ToastOptions) => {
  const item: ToastItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    description: options?.description,
    kind,
  }

  listeners.forEach((listener) => listener(item))
}

export const toast = {
  success: (title: string, options?: ToastOptions) => emitToast('success', title, options),
  error: (title: string, options?: ToastOptions) => emitToast('error', title, options),
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const listener: Listener = (incoming) => {
      setToasts((prev) => [...prev, incoming])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== incoming.id))
      }, 3000)
    }

    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex w-full max-w-md flex-col gap-2 px-4">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg ${
            item.kind === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          <p className="text-sm font-semibold">{item.title}</p>
          {item.description && <p className="mt-0.5 text-xs opacity-90">{item.description}</p>}
        </div>
      ))}
    </div>
  )
}
