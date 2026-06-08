import { Github } from "lucide-react"
import { ColorMixer } from "@/components/color-mixer"

export default function Page() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 max-w-2xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Mix colors like paint</p>
          <a
            href="https://github.com/cmbartschat/pigment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="size-3.5" /> GitHub
          </a>
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Palette</h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Build a color from a recipe of base pigments. Start with chroma —{" "}
          <span className="font-mono text-foreground">r2b1</span> for a deep reddish purple — then stir in white or
          black to push lightness and saturation. <span className="font-mono text-foreground">r2b1w1</span>,{" "}
          <span className="font-mono text-foreground">r2b1w2</span>, and so on.
        </p>
      </header>

      <ColorMixer />

      <footer className="mt-14 border-t border-border pt-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">The pigments</p>
        <p className="mt-2 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
          <span className="font-mono text-foreground">R</span> red ·{" "}
          <span className="font-mono text-foreground">O</span> orange ·{" "}
          <span className="font-mono text-foreground">Y</span> yellow ·{" "}
          <span className="font-mono text-foreground">G</span> green ·{" "}
          <span className="font-mono text-foreground">B</span> blue ·{" "}
          <span className="font-mono text-foreground">I</span> indigo ·{" "}
          <span className="font-mono text-foreground">V</span> violet ·{" "}
          <span className="font-mono text-foreground">W</span> white ·{" "}
          <span className="font-mono text-foreground">K</span> key (black). Each pigment is weighted by its parts and
          averaged together, so the more parts a color has, the more it pulls the mix toward itself.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Idea by{" "}
          <a
            href="https://news.ycombinator.com/item?id=48390269#48428728"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Gary Pegg
          </a>
          . Source on{" "}
          <a
            href="https://github.com/cmbartschat/pigment"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </main>
  )
}
