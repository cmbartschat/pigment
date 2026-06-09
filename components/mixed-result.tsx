'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { hexToHsl, hexToRgb, readableTextColor } from '@/lib/color-mix'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex flex-col'>
      <span className='text-[10px] opacity-70'>{label}</span>
      <span className='text-sm tabular-nums'>{value}</span>
    </div>
  )
}

export function MixedResult({
  hex,
  recipeString,
}: {
  hex: string | null
  recipeString: string
}) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(c => (c === id ? null : c)), 1200)
  }

  if (!hex) {
    return (
      <div className='flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted-foreground'>
        Mixed color appears here
      </div>
    )
  }

  const text = readableTextColor(hex)
  const rgb = hexToRgb(hex)
  const hsl = hexToHsl(hex)

  return (
    <div
      className='relative flex aspect-[4/3] w-full flex-col justify-between rounded-2xl border border-border/40 p-5 shadow-lg transition-colors'
      style={{ backgroundColor: hex, color: text }}
    >
      <div className='flex items-start justify-between'>
        <button
          type='button'
          onClick={() => copy(recipeString, 'recipe')}
          className='inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold backdrop-blur-sm transition-opacity hover:opacity-80'
          style={{ backgroundColor: `${text}22` }}
          title='Copy recipe'
        >
          {copied === 'recipe' ? (
            <Check className='size-3.5' />
          ) : (
            <Copy className='size-3.5' />
          )}
          {recipeString}
        </button>
      </div>

      <div className='flex items-end justify-between gap-4'>
        <button
          type='button'
          onClick={() => copy(hex, 'hex')}
          className='text-left text-2xl font-bold tracking-tight transition-opacity hover:opacity-80'
          title='Copy hex'
        >
          {copied === 'hex' ? 'copied!' : hex}
        </button>
        <div className='flex gap-4'>
          <Stat label='RGB' value={`${rgb.r} ${rgb.g} ${rgb.b}`} />
          <Stat label='HSL' value={`${hsl.h} ${hsl.s} ${hsl.l}`} />
        </div>
      </div>
    </div>
  )
}
