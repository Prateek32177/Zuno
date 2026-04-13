export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-screen bg-white">
      {children}
    </main>
  )
}
