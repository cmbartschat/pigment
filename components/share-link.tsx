'use client'

import { useLayoutEffect, useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'
import { formatRecipe, readableTextColor, Recipe } from '@/lib/color-mix'

const ORIGIN = 'https://pigment.ribbits.org'

export function ShareLink({
  recipe,
  hex,
}: {
  recipe: Recipe
  hex: string | null
}) {
  const [copied, setCopied] = useState(false)

  const recipeString = formatRecipe(recipe)

  if (!recipeString) {
    return null
  }

  const shareUrl = `${ORIGIN}?c=${recipeString}`

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // clipboard unavailable; the field is selectable as a fallback
    }
  }

  const nativeShare = async () => {
    try {
      await navigator.share?.({
        title: 'Palette color',
        text: `Mixed color ${recipeString}${hex ? ` (${hex})` : ''}`,
        url: shareUrl,
      })
    } catch {
      // user cancelled or share unsupported
    }
  }

  return (
    <div className='rounded-2xl border border-border bg-card p-4 shadow-sm'>
      <div className='mb-2 flex items-center gap-2'>
        <Link2 className='size-3.5 text-muted-foreground' />
        <h2 className='text-lg font-bold text-muted-foreground'>Share</h2>
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 py-2'>
          <input
            readOnly
            value={shareUrl}
            onFocus={e => e.currentTarget.select()}
            aria-label='Shareable link'
            className='min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none'
          />
        </div>

        <button
          type='button'
          onClick={copy}
          className='inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition-opacity hover:opacity-90'
          style={
            hex
              ? { backgroundColor: hex, color: readableTextColor(hex) }
              : undefined
          }
          aria-label='Copy share link'
        >
          {copied ? <Check className='size-4' /> : <Link2 className='size-4' />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
