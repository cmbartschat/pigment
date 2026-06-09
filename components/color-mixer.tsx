'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type BaseKey,
  type Recipe,
  formatRecipe,
  mixRecipe,
  parseRecipe,
} from '@/lib/color-mix'
import { RecipeChips } from './recipe-chips'
import { MixedResult } from './mixed-result'
import { ShareLink } from './share-link'

function initialRecipe(): Recipe {
  if (typeof window !== 'undefined') {
    const fromUrl = new URLSearchParams(window.location.search).get('c')
    if (fromUrl) {
      const parsed = parseRecipe(fromUrl)
      if (formatRecipe(parsed)) return parsed
    }
  }
  return parseRecipe('r2b1w1')
}

const PRESETS: { label: string; recipe: string }[] = [
  { label: 'Deep reddish purple', recipe: 'r2b' },
  { label: 'Pale yellowish green', recipe: 'yg2w2' },
  { label: 'Dark blueish grey', recipe: 'bw2k4' },
  { label: 'Terracotta', recipe: 'o3rw' },
  { label: 'Plum', recipe: 'v2rk' },
]

export function ColorMixer() {
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe)
  // Raw text the user is typing; null means "mirror the recipe".
  const [draft, setDraft] = useState<string | null>(null)

  const recipeString = useMemo(() => formatRecipe(recipe), [recipe])
  const hex = useMemo(() => mixRecipe(recipe), [recipe])

  // Keep the URL (?c=...) in sync so the current mix is always shareable.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (recipeString) url.searchParams.set('c', recipeString)
    else url.searchParams.delete('c')
    window.history.replaceState(null, '', url)
  }, [recipeString])

  const add = (key: BaseKey) => {
    setDraft(null)
    setRecipe(r => ({ ...r, [key]: (r[key] ?? 0) + 1 }))
  }

  const remove = (key: BaseKey) => {
    setDraft(null)
    setRecipe(r => {
      const next = { ...r }
      const v = (next[key] ?? 0) - 1
      if (v <= 0) delete next[key]
      else next[key] = v
      return next
    })
  }

  const clear = () => {
    setDraft(null)
    setRecipe({})
  }

  const onTextChange = (value: string) => {
    setDraft(value)
    setRecipe(parseRecipe(value))
  }

  const inputValue = draft ?? recipeString

  return (
    <div className='grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)]'>
      {/* Left: controls */}
      <div className='flex flex-col gap-6'>
        <div>
          <h2 className='mb-3 text-lg font-bold text-muted-foreground'>
            Try these
          </h2>
          <div className='flex flex-wrap gap-2'>
            {PRESETS.map(p => {
              const swatch = mixRecipe(parseRecipe(p.recipe))
              return (
                <button
                  key={p.recipe}
                  type='button'
                  onClick={() => {
                    setDraft(null)
                    setRecipe(parseRecipe(p.recipe))
                  }}
                  className='inline-flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3 text-sm shadow-sm transition-colors hover:bg-secondary'
                >
                  <span
                    className='size-5 rounded-full border border-border/60'
                    style={{ backgroundColor: swatch ?? 'transparent' }}
                    aria-hidden
                  />
                  <span className='text-sm'>{p.recipe}</span>
                  <span className='text-muted-foreground'>{p.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className='rounded-2xl border border-border bg-card p-4 shadow-sm'>
          <label
            htmlFor='recipe-input'
            className='mb-2 block text-lg font-bold text-muted-foreground'
          >
            Formula
          </label>
          <input
            id='recipe-input'
            value={inputValue}
            onChange={e => onTextChange(e.target.value)}
            onBlur={() => setDraft(null)}
            spellCheck={false}
            autoCapitalize='off'
            autoCorrect='off'
            placeholder='e.g. r2b1w1'
            className='w-full rounded-lg bg-background border border-input px-4 py-3 text-lg lowercase tracking-wide text-foreground shadow-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring'
          />
          <p className='mt-2 text-sm text-muted-foreground'>
            Letters are pigments, numbers are ratios. Unknown letters are
            ignored.
          </p>
        </div>

        <RecipeChips
          recipe={recipe}
          onAdd={add}
          onRemove={remove}
          onClear={clear}
        />
      </div>

      {/* Right: result + recipe breakdown */}
      <div className='flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start'>
        <MixedResult hex={hex} recipeString={recipeString || '—'} />
        <ShareLink recipeString={recipeString} hex={hex} />
      </div>
    </div>
  )
}
