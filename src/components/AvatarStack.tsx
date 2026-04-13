export function AvatarStack({ names }: { names: string[] }) {
  const safeNames = Array.isArray(names) ? names : []
  const colors = ['bg-blue-200 dark:bg-blue-700', 'bg-purple-200 dark:bg-purple-700', 'bg-pink-200 dark:bg-pink-700', 'bg-amber-200 dark:bg-amber-700']
  const textColors = ['text-blue-700 dark:text-blue-100', 'text-purple-700 dark:text-purple-100', 'text-pink-700 dark:text-pink-100', 'text-amber-700 dark:text-amber-100']
  
  return (
    <div className="flex items-center -space-x-2">
      {safeNames.slice(0, 3).map((n, idx) => (
        <div
          key={n}
          className={`h-8 w-8 rounded-full border-2 border-white dark:border-gray-700 text-xs font-bold grid place-items-center shadow-brand ${colors[idx % colors.length]} ${textColors[idx % textColors.length]}`}
        >
          {n?.slice(0, 2)?.toUpperCase() || '?'}
        </div>
      ))}
      {safeNames.length > 3 && (
        <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-700 bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-700 dark:to-pink-700 text-xs font-bold grid place-items-center shadow-brand text-orange-700 dark:text-orange-100">
          +{safeNames.length - 3}
        </div>
      )}
    </div>
  )
}
