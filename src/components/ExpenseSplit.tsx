import { Expense } from '@/lib/types'

export function ExpenseSplit({ expenses }: { expenses: Expense[] }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : []
  if (!safeExpenses.length) {
    return (
      <section className="space-y-2 rounded-xl border bg-white p-4">
        <h3 className="font-semibold">Expenses</h3>
        <p className="text-sm text-gray-500">No expenses yet</p>
      </section>
    )
  }
  return (
    <section className="space-y-2 rounded-xl border bg-white p-4">
      <h3 className="font-semibold">Expenses</h3>
      {safeExpenses.map((e) => (
        <div key={e?.id || Math.random()} className="flex justify-between text-sm">
          <span>{e?.label || 'Expense'}</span>
          <span>₹{Number(e?.total_amount || 0).toFixed(0)}</span>
        </div>
      ))}
    </section>
  )
}
