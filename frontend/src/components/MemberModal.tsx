import { useEffect, useId } from 'react'
import { ROLES, type TeamMember } from '../data/team'

type MemberModalProps = {
  member: TeamMember
  onClose: () => void
}

export function MemberModal({ member, onClose }: MemberModalProps) {
  const dialogTitleId = useId()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
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
            {member.name}
          </h2>
          <button
            type="button"
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
            onClick={onClose}
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {member.roleIds.map((roleId) => {
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
  )
}
