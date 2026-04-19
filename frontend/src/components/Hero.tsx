import type { ReactNode } from 'react'

type HeroProps = {
  title: string
  eyebrow?: string
  children: ReactNode
}

export function Hero({ title, eyebrow, children }: HeroProps) {
  return (
    <section className="bg-[#161619] px-6 py-20 text-center text-white sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {eyebrow ? (
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-zinc-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <div className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          {children}
        </div>
      </div>
    </section>
  )
}
