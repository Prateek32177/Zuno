export function AvatarStack({ names }: { names: string[] }) {
  const safeNames = Array.isArray(names) ? names : []
  
  return (
    <div className="flex items-center -space-x-1.5 text-xs">
      {safeNames.slice(0, 2).map((n, idx) => (
        <div
          key={n}
          className="h-6 w-6 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 grid place-items-center font-semibold"
        >
          {n?.slice(0, 1)?.toUpperCase() || '?'}
        </div>
      ))}
      {safeNames.length > 2 && <span className="ml-1 font-medium">+{safeNames.length - 2}</span>}
    </div>
  )
}
