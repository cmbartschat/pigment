import { ColorMixer } from '@/components/color-mixer'

export default function Page() {
  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14'>
      <header className='mb-5 max-w-2xl'>
        <h1 className='text-balance text-3xl font-bold tracking-tight sm:text-4xl'>
          Pigment
        </h1>
      </header>

      <ColorMixer />

      <footer className='mt-14 border-t border-border pt-6'>
        <p className='mt-6 text-sm leading-relaxed text-muted-foreground'>
          Idea by{' '}
          <a
            href='https://news.ycombinator.com/item?id=48390269#48428728'
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground'
          >
            Gary Pegg
          </a>
          . Source on{' '}
          <a
            href='https://github.com/cmbartschat/pigment'
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground'
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </main>
  )
}
