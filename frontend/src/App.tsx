import { useEffect, useId, useState } from 'react'

type RoleId = 'E1' | 'E2' | 'E3' | 'E4' | 'P'

type RoleDefinition = {
  title: string
  responsibilities: string
  keyMissions: string
}

/** Rôles du projet — source unique pour la modale et les infobulles */
const ROLES: Record<RoleId, RoleDefinition> = {
  E1: {
    title: 'Product Owner / Scrum Master',
    responsibilities: 'Backlog, sprints, coordination, démonstrations',
    keyMissions:
      'Rédiger les histoires utilisateur, animer les stand-ups, suivre les jalons, préparer la démo MVP',
  },
  E2: {
    title: 'Responsable backend',
    responsibilities: 'API REST, modèle de données, authentification',
    keyMissions:
      'Authentification JWT, CRUD prestations et contrats, logique de tarification, gestion des statuts',
  },
  E3: {
    title: 'Responsable frontend',
    responsibilities: 'Interface, agenda, formulaires, exports',
    keyMissions:
      'Intégration des écrans, vue agenda filtrable, formulaires, mise en page responsive, export CSV',
  },
  E4: {
    title: 'DevOps / développement full stack',
    responsibilities: 'Dépôt GitHub, intégration continue, déploiement, base de données',
    keyMissions:
      'Mise en place GitHub (branches, PR, CI), migrations de la base, jeux de données de test, déploiement sur un environnement de démo',
  },
  P: {
    title: 'Professeur / chef de produit',
    responsibilities: 'Vision produit, arbitrages, validation',
    keyMissions:
      'Validation des choix techniques et fonctionnels, retours UX, décision go/no-go pour la livraison MVP',
  },
}

type TeamMember = {
  name: string
  roleIds: RoleId[]
}

const teamMembers: TeamMember[] = [
  {
    name: 'Vardanyan Artur',
    roleIds: ['P', 'E4'],
  },
  {
    name: 'Liogier Nolan',
    roleIds: ['E1', 'E4'],
  },
  {
    name: 'Akyurek Eren',
    roleIds: ['E2'],
  },
  {
    name: 'Lea Sourmail',
    roleIds: ['E2'],
  },
  {
    name: 'Houpert Mathéo',
    roleIds: ['E3'],
  },
]

function initials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function roleSummaryLine(roleIds: RoleId[]) {
  return roleIds.map((id) => ROLES[id].title).join(' · ')
}

function App() {
  const [selected, setSelected] = useState<TeamMember | null>(null)
  const dialogTitleId = useId()

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-200/90 via-zinc-100 to-zinc-200/70 p-6 text-zinc-900 sm:p-10">
      <div className="w-full max-w-md">
        <article className="overflow-visible rounded-2xl bg-white shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/80">
          <header className="rounded-t-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 px-8 py-10 text-white sm:px-10 sm:py-12">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Équipe
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Trainer Activity
            </h1>
            <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-zinc-400">
              Une brève présentation des personnes du projet.
            </p>
          </header>

          <ul className="divide-y divide-zinc-100 rounded-b-2xl">
            {teamMembers.map((person) => (
              <li
                key={person.name}
                className="group relative px-7 py-5 transition-colors hover:z-10 hover:bg-zinc-50/80 sm:px-10 sm:py-5"
              >
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-4 text-left"
                  onClick={() => setSelected(person)}
                  aria-haspopup="dialog"
                  aria-expanded={selected?.name === person.name}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-semibold text-zinc-700 ring-1 ring-zinc-200/80"
                    aria-hidden
                  >
                    {initials(person.name)}
                  </span>
                  <span className="text-base font-medium text-zinc-800 sm:text-[1.05rem]">
                    {person.name}
                  </span>
                </button>

                <div
                  className="pointer-events-none invisible absolute left-4 right-4 top-full z-20 mt-2 rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 text-left text-xs leading-snug text-zinc-600 opacity-0 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/5 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 sm:left-10 sm:right-10"
                  role="tooltip"
                >
                  <p className="font-medium text-zinc-800">Rôles</p>
                  <p className="mt-1 text-[0.7rem] text-zinc-600 sm:text-xs">
                    {roleSummaryLine(person.roleIds)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="max-h-[min(90vh,40rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id={dialogTitleId}
                className="text-xl font-semibold tracking-tight text-zinc-900"
              >
                {selected.name}
              </h2>
              <button
                type="button"
                className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
                onClick={() => setSelected(null)}
                aria-label="Fermer"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {selected.roleIds.map((roleId) => {
                const r = ROLES[roleId]
                return (
                  <section
                    key={roleId}
                    className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4"
                  >
                    <h4 className="text-base font-semibold text-zinc-900">
                      {r.title}
                    </h4>
                    <dl className="mt-3 space-y-3 text-sm">
                      <div>
                        <dt className="font-medium text-zinc-600">
                          Responsabilités
                        </dt>
                        <dd className="mt-0.5 leading-relaxed text-zinc-700">
                          {r.responsibilities}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-600">
                          Missions clés sur le projet
                        </dt>
                        <dd className="mt-0.5 leading-relaxed text-zinc-700">
                          {r.keyMissions}
                        </dd>
                      </div>
                    </dl>
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
