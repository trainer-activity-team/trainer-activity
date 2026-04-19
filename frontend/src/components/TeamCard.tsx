import { useState } from 'react'
import type { TeamMember } from '../data/team'
import {
  avatarUrlFor,
  hoverDescription,
  initials,
  roleSummaryLine,
} from '../lib/team'

type TeamCardProps = {
  member: TeamMember
  onSelect: (member: TeamMember) => void
  isExpanded: boolean
}

export function TeamCard({ member, onSelect, isExpanded }: TeamCardProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const src = avatarUrlFor(member)
  const job = roleSummaryLine(member.roleIds)
  const blurb = hoverDescription(member)

  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      aria-haspopup="dialog"
      aria-expanded={isExpanded}
      className="group relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm ring-zinc-900/5 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
    >
      <div className="flex gap-4">
        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/80">
          {!imgFailed ? (
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-600"
              aria-hidden
            >
              {initials(member.name)}
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-base font-semibold text-zinc-900">{member.name}</p>
          <p className="mt-1 text-sm leading-snug text-zinc-600">{job}</p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 flex items-end rounded-xl bg-zinc-950/85 p-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        aria-hidden
      >
        <p className="text-xs leading-relaxed text-zinc-100">{blurb}</p>
      </div>
    </button>
  )
}
