"use client"

import { Minus, Plus, X } from "lucide-react"
import { BASE_COLORS, BASE_BY_KEY, type BaseKey, type Recipe, readableTextColor, totalParts } from "@/lib/color-mix"

export function RecipeChips({
  recipe,
  onAdd,
  onRemove,
  onClear,
}: {
  recipe: Recipe
  onAdd: (key: BaseKey) => void
  onRemove: (key: BaseKey) => void
  onClear: () => void
}) {
  const active = BASE_COLORS.filter((c) => (recipe[c.key] ?? 0) > 0)
  const total = totalParts(recipe)

  if (active.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
        Your palette knife is clean. Add some pigments above to start mixing.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Recipe · {total} {total === 1 ? "part" : "parts"}
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-3" /> Clear
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {active.map((c) => {
          const parts = recipe[c.key] ?? 0
          const pct = Math.round((parts / total) * 100)
          return (
            <li key={c.key} className="flex items-center gap-3">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 font-mono text-xs font-bold uppercase"
                style={{ backgroundColor: c.hex, color: readableTextColor(c.hex) }}
              >
                {c.key}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">{BASE_BY_KEY[c.key].name}</span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">{pct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.hex }} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onRemove(c.key)}
                  aria-label={`Remove one part ${BASE_BY_KEY[c.key].name}`}
                  className="flex size-7 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-6 text-center font-mono text-sm font-semibold tabular-nums">{parts}</span>
                <button
                  type="button"
                  onClick={() => onAdd(c.key)}
                  aria-label={`Add one part ${BASE_BY_KEY[c.key].name}`}
                  className="flex size-7 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
