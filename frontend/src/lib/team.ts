import { ROLES, type RoleId, type TeamMember } from '../data/team'

export function initials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function roleSummaryLine(roleIds: RoleId[]) {
  return roleIds.map((id) => ROLES[id].title).join(' · ')
}

/** Texte court affiché au survol de la carte (premier rôle). */
export function hoverDescription(member: TeamMember) {
  const first = member.roleIds[0]
  return ROLES[first].responsibilities
}

export function avatarUrlFor(member: TeamMember) {
  if (member.avatarUrl) return member.avatarUrl
  const q = encodeURIComponent(member.name)
  return `https://ui-avatars.com/api/?name=${q}&size=160&background=3f3f46&color=fafafa&bold=true`
}
