import { useCallback, useState } from 'react'
import { Hero } from './components/Hero'
import { MemberModal } from './components/MemberModal'
import { TeamCard } from './components/TeamCard'
import { teamMembers, type TeamMember } from './data/team'

function App() {
  const [selected, setSelected] = useState<TeamMember | null>(null)
  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <Hero title="Trainer Activity" eyebrow="Équipe">
        <p>
          Projet de fin d'année.
        </p>
      </Hero>

      <section className="mx-auto max-w-6xl px-6 py-14 text-center sm:px-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Notre équipe
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600">
          Survol pour un aperçu, clic pour les rôles.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {teamMembers.map((person, index) => {
            const isLast = index === teamMembers.length - 1
            return (
              <div
                key={person.name}
                className={
                  isLast ? 'sm:col-span-2 sm:flex sm:justify-center' : undefined
                }
              >
                <div
                  className={
                    isLast
                      ? 'w-full sm:max-w-[calc(50%-0.75rem)]'
                      : 'w-full'
                  }
                >
                  <TeamCard
                    member={person}
                    onSelect={setSelected}
                    isExpanded={selected?.name === person.name}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {selected ? (
        <MemberModal member={selected} onClose={closeModal} />
      ) : null}
    </main>
  )
}

export default App
