"use client"

import { useEffect, useState } from "react"
import { Check, Link2, Share2 } from "lucide-react"
import { readableTextColor } from "@/lib/color-mix"

export function ShareLink({
  recipeString,
  hex,
}: {
  recipeString: string
  hex: string | null
}) {
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin + window.location.pathname)
    setCanShare(typeof navigator !== "undefined" && !!navigator.share)
  }, [])

  if (!recipeString) return null

  const shareUrl = `${origin}?c=${recipeString}`

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
        title: "Palette color",
        text: `Mixed color ${recipeString}${hex ? ` (${hex})` : ""}`,
        url: shareUrl,
      })
    } catch {
      // user cancelled or share unsupported
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Link2 className="size-3.5 text-muted-foreground" />
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Share this mix</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
          {hex ? (
            <span
              className="size-4 shrink-0 rounded-full border border-border/60"
              style={{ backgroundColor: hex }}
              aria-hidden
            />
          ) : null}
          <input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Shareable link"
            className="min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground outline-none"
          />
        </div>

        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
          style={
            hex
              ? { backgroundColor: hex, color: readableTextColor(hex) }
              : undefined
          }
          aria-label="Copy share link"
        >
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </button>

        {canShare ? (
          <button
            type="button"
            onClick={nativeShare}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-card p-2 shadow-sm transition-colors hover:bg-secondary"
            aria-label="Share via device"
          >
            <Share2 className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
