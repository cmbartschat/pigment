'use client'

import {
  BASE_COLORS,
  type BaseKey,
  type Recipe,
  readableTextColor,
} from '@/lib/color-mix'

export function BasePalette({
  recipe,
  onAdd,
  onRemove,
}: {
  recipe: Recipe
  onAdd: (key: BaseKey) => void
  onRemove: (key: BaseKey) => void
}) {
  return (
    <div>
      <div className='mb-3 flex items-baseline justify-between'>
        <h2 className='font-mono text-xs uppercase tracking-widest text-muted-foreground'>
          Palette
        </h2>
        <p className='text-xs text-muted-foreground'>
          Click to add a part · right-click to remove
        </p>
      </div>
      <div className='grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9'>
        {BASE_COLORS.map(c => {
          const parts = recipe[c.key] ?? 0
          const active = parts > 0
          return (
            <button
              key={c.key}
              type='button'
              onClick={() => onAdd(c.key)}
              onContextMenu={e => {
                e.preventDefault()
                onRemove(c.key)
              }}
              aria-label={`Add one part ${c.name}`}
              className='group relative flex aspect-square flex-col items-center justify-between overflow-hidden rounded-lg border border-border/70 p-2 shadow-sm outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring'
              style={{
                backgroundColor: c.hex,
                color: readableTextColor(c.hex),
              }}
            >
              <span className='self-start font-mono text-sm font-bold uppercase opacity-90'>
                {c.key}
              </span>
              {active && (
                <span
                  className='absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 font-mono text-xs font-bold tabular-nums'
                  style={{
                    backgroundColor: readableTextColor(c.hex),
                    color: c.hex,
                  }}
                >
                  {parts}
                </span>
              )}
              <span className='self-start text-[10px] font-medium leading-tight opacity-80'>
                {c.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
