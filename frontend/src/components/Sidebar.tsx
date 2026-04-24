import { NavLink } from 'react-router-dom'
import type { IconType } from 'react-icons'
import {
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiClipboard,
  FiGrid,
  FiHelpCircle,
  FiSettings,
} from 'react-icons/fi'

type NavItem = {
  to: string
  label: string
  icon: IconType
}

const MAIN_NAV: NavItem[] = [
  { to: '/landing', label: 'Dashboard', icon: FiGrid },
  { to: '/organizations', label: 'Organisations', icon: FiBriefcase },
  { to: '/activity', label: 'Prestations', icon: FiClipboard },
  { to: '/analytics', label: 'Analyses', icon: FiBarChart2 },
  { to: '/schedule', label: 'Agenda', icon: FiCalendar },
]

const BOTTOM_NAV: NavItem[] = [
  { to: '/support', label: 'Support', icon: FiHelpCircle },
  { to: '/settings', label: 'Parametres', icon: FiSettings },
]

function NavItemLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.to === '/landing'}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition',
          isActive
            ? 'bg-[#12324D] text-[#1ABC9C]'
            : 'text-[#B8C5D0] hover:bg-[#0F2B44] hover:text-[#E6EDF3]',
        ].join(' ')
      }
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{item.label}</span>
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#1F3A52] bg-[#071A2B] px-4 py-6 text-[#E6EDF3]">
      <div className="px-2">
        <p className="text-lg font-semibold tracking-tight text-[#E6EDF3]">Trainer Activity</p>
        <p className="mt-0.5 text-xs text-[#8FA3B8]">Performance &amp; Discipline</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {MAIN_NAV.map((item) => (
          <NavItemLink key={item.to} item={item} />
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-[#1F3A52] pt-4">
        {BOTTOM_NAV.map((item) => (
          <NavItemLink key={item.to} item={item} />
        ))}
      </div>
    </aside>
  )
}
