import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  FiActivity,
  FiBriefcase,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi'
import { Modal } from '../components/Modal'
import { Sidebar } from '../components/Sidebar'

type OrganizationStatus = 'active' | 'pending' | 'inactive'

type Organization = {
  id: string
  name: string
  sector: string
  contactName: string
  contactEmail: string
  phone: string
  city: string
  status: OrganizationStatus
  employees: number
}

type OrganizationFormValues = Omit<Organization, 'id'>

const STATUS_LABEL: Record<OrganizationStatus, string> = {
  active: 'Actif',
  pending: 'En attente',
  inactive: 'Inactif',
}

const STATUS_STYLES: Record<OrganizationStatus, string> = {
  active: 'border-[#27AE60]/40 bg-[#27AE60]/15 text-[#27AE60]',
  pending: 'border-[#F39C12]/40 bg-[#F39C12]/15 text-[#F39C12]',
  inactive: 'border-[#7F8C8D]/40 bg-[#7F8C8D]/15 text-[#B8C5D0]',
}

const EMPTY_FORM: OrganizationFormValues = {
  name: '',
  sector: '',
  contactName: '',
  contactEmail: '',
  phone: '',
  city: '',
  status: 'active',
  employees: 1,
}

const PAGE_SIZE = 5

const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Spartan Athletics',
    sector: 'Performance sportive',
    contactName: 'Lucas Martin',
    contactEmail: 'lucas@spartan-athletics.fr',
    phone: '06 42 88 91 77',
    city: 'Lyon',
    status: 'active',
    employees: 22,
  },
  {
    id: 'org-2',
    name: 'Metro Track Club',
    sector: 'Athletisme',
    contactName: 'Emma Roussel',
    contactEmail: 'emma@metrotrack.fr',
    phone: '07 56 13 40 29',
    city: 'Lille',
    status: 'pending',
    employees: 14,
  },
  {
    id: 'org-3',
    name: 'Elite Academy',
    sector: 'Coaching prive',
    contactName: 'Noe Dupont',
    contactEmail: 'contact@eliteacademy.fr',
    phone: '06 17 33 88 52',
    city: 'Nantes',
    status: 'active',
    employees: 8,
  },
  {
    id: 'org-4',
    name: 'Horizon Wellness',
    sector: 'Bien-etre',
    contactName: 'Clara Fontaine',
    contactEmail: 'clara@horizonwellness.fr',
    phone: '06 22 45 67 89',
    city: 'Bordeaux',
    status: 'active',
    employees: 17,
  },
  {
    id: 'org-5',
    name: 'Velocity Track',
    sector: 'Preparation physique',
    contactName: 'Hugo Lemaire',
    contactEmail: 'hugo@velocitytrack.fr',
    phone: '07 77 12 33 44',
    city: 'Marseille',
    status: 'inactive',
    employees: 5,
  },
  {
    id: 'org-6',
    name: 'Apex Rugby Club',
    sector: 'Rugby amateur',
    contactName: 'Julien Moreau',
    contactEmail: 'julien@apexrugby.fr',
    phone: '06 98 76 54 32',
    city: 'Toulouse',
    status: 'pending',
    employees: 28,
  },
  {
    id: 'org-7',
    name: 'Aqua Performance',
    sector: 'Natation',
    contactName: 'Sarah Nguyen',
    contactEmail: 'sarah@aquaperf.fr',
    phone: '07 01 22 45 89',
    city: 'Strasbourg',
    status: 'active',
    employees: 11,
  },
]

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(SEED_ORGANIZATIONS)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrganizationStatus>('all')
  const [formValues, setFormValues] = useState<OrganizationFormValues>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredOrganizations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return organizations.filter((organization) => {
      const matchesQuery =
        !normalizedQuery ||
        organization.name.toLowerCase().includes(normalizedQuery) ||
        organization.city.toLowerCase().includes(normalizedQuery) ||
        organization.contactName.toLowerCase().includes(normalizedQuery)
      const matchesStatus = statusFilter === 'all' || organization.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [organizations, query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredOrganizations.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedOrganizations = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredOrganizations.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredOrganizations, safeCurrentPage])

  const activeCount = organizations.filter((organization) => organization.status === 'active').length
  const totalEmployees = organizations.reduce((acc, organization) => acc + organization.employees, 0)

  const startEntry = filteredOrganizations.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1
  const endEntry = Math.min(safeCurrentPage * PAGE_SIZE, filteredOrganizations.length)

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: 'all' | OrganizationStatus) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const resetForm = () => {
    setFormValues(EMPTY_FORM)
    setEditingId(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (organization: Organization) => {
    setEditingId(organization.id)
    setFormValues({
      name: organization.name,
      sector: organization.sector,
      contactName: organization.contactName,
      contactEmail: organization.contactEmail,
      phone: organization.phone,
      city: organization.city,
      status: organization.status,
      employees: organization.employees,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editingId) {
      setOrganizations((previous) =>
        previous.map((organization) =>
          organization.id === editingId ? { ...organization, ...formValues } : organization,
        ),
      )
    } else {
      const newOrganization: Organization = {
        ...formValues,
        id: `org-${crypto.randomUUID()}`,
      }
      setOrganizations((previous) => [newOrganization, ...previous])
    }

    closeModal()
  }

  const handleDelete = (id: string) => {
    setOrganizations((previous) => previous.filter((organization) => organization.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-[#020F1F] text-[#E6EDF3]">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden bg-[#0A2236] px-8 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Suivi des Organisations</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#B8C5D0]">
                Gere les structures clientes, leurs contacts et leur niveau d&apos;engagement sur les
                prestations.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-md bg-[#1ABC9C] px-4 py-2.5 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
            >
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Ajouter une organisation
            </button>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3B8]">
                Organisations
              </p>
              <p className="mt-3 text-3xl font-semibold">{organizations.length}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#1ABC9C]">
                <FiBriefcase className="h-3.5 w-3.5" aria-hidden="true" />
                Base active
              </p>
            </article>

            <article className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3B8]">Actives</p>
              <p className="mt-3 text-3xl font-semibold">{activeCount}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#1ABC9C]">
                <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Statut valide
              </p>
            </article>

            <article className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3B8]">
                Membres suivis
              </p>
              <p className="mt-3 text-3xl font-semibold">{totalEmployees}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#1ABC9C]">
                <FiUsers className="h-3.5 w-3.5" aria-hidden="true" />
                Utilisateurs rattaches
              </p>
            </article>
          </section>

          <section className="rounded-lg border border-[#1F3A52] bg-[#0F2B44]">
            <div className="flex flex-col gap-3 border-b border-[#1F3A52] p-4 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <FiSearch
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F7389]"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Rechercher une organisation, une ville ou un contact..."
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] py-2.5 pl-9 pr-3 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => handleStatusFilterChange(event.target.value as 'all' | OrganizationStatus)}
                className="rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#1F3A52] text-left">
                <thead className="bg-[#0A2236] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8FA3B8]">
                  <tr>
                    <th className="px-4 py-3">Organisation</th>
                    <th className="px-4 py-3">Secteur</th>
                    <th className="px-4 py-3">Ville</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#1F3A52] text-sm">
                  {paginatedOrganizations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#8FA3B8]">
                        Aucune organisation ne correspond a votre recherche.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrganizations.map((organization) => (
                      <tr key={organization.id} className="transition hover:bg-[#12324D]">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#E6EDF3]">{organization.name}</p>
                          <p className="mt-1 text-xs text-[#8FA3B8]">
                            {organization.employees} membres relies
                          </p>
                        </td>
                        <td className="px-4 py-3 text-[#B8C5D0]">{organization.sector}</td>
                        <td className="px-4 py-3 text-[#B8C5D0]">{organization.city}</td>
                        <td className="px-4 py-3">
                          <p className="text-[#E6EDF3]">{organization.contactName}</p>
                          <p className="mt-1 text-xs text-[#8FA3B8]">{organization.contactEmail}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[organization.status]}`}
                          >
                            {STATUS_LABEL[organization.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(organization)}
                              aria-label={`Modifier ${organization.name}`}
                              className="inline-flex items-center gap-1 rounded-md border border-[#2A4A66] bg-[#0A2236] px-2.5 py-1.5 text-xs font-semibold text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
                            >
                              <FiEdit2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Editer
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(organization.id)}
                              aria-label={`Supprimer ${organization.name}`}
                              className="inline-flex items-center gap-1 rounded-md border border-[#E74C3C]/40 bg-[#E74C3C]/10 px-2.5 py-1.5 text-xs font-semibold text-[#E74C3C] transition hover:bg-[#E74C3C]/20"
                            >
                              <FiTrash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#1F3A52] px-4 py-3 text-sm text-[#8FA3B8] sm:flex-row sm:items-center sm:justify-between">
              <p>
                {filteredOrganizations.length === 0
                  ? 'Aucun resultat'
                  : `Affichage ${startEntry} a ${endEntry} sur ${filteredOrganizations.length} organisations`}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                  disabled={safeCurrentPage === 1}
                  aria-label="Page precedente"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2A4A66] bg-[#0A2236] text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>

                <span className="text-xs font-semibold text-[#E6EDF3]">
                  Page {safeCurrentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                  disabled={safeCurrentPage === totalPages}
                  aria-label="Page suivante"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2A4A66] bg-[#0A2236] text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Modifier une organisation' : 'Ajouter une organisation'}
        description={
          editingId
            ? 'Mets a jour les informations de cette structure cliente.'
            : 'Renseigne les informations de base pour relier cette structure a tes prestations.'
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
              Nom
            </span>
            <input
              value={formValues.name}
              onChange={(event) => setFormValues((previous) => ({ ...previous, name: event.target.value }))}
              required
              placeholder="Ex: Horizon Wellness"
              className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
              Secteur
            </span>
            <input
              value={formValues.sector}
              onChange={(event) => setFormValues((previous) => ({ ...previous, sector: event.target.value }))}
              required
              placeholder="Ex: Fitness, Sante, Club"
              className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                Contact
              </span>
              <input
                value={formValues.contactName}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, contactName: event.target.value }))
                }
                required
                placeholder="Nom prenom"
                className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                Ville
              </span>
              <div className="relative">
                <FiMapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F7389]"
                  aria-hidden="true"
                />
                <input
                  value={formValues.city}
                  onChange={(event) => setFormValues((previous) => ({ ...previous, city: event.target.value }))}
                  required
                  placeholder="Paris"
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] py-2.5 pl-9 pr-3 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </div>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
              Email
            </span>
            <input
              type="email"
              value={formValues.contactEmail}
              onChange={(event) =>
                setFormValues((previous) => ({ ...previous, contactEmail: event.target.value }))
              }
              required
              placeholder="contact@organization.fr"
              className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                Telephone
              </span>
              <input
                value={formValues.phone}
                onChange={(event) => setFormValues((previous) => ({ ...previous, phone: event.target.value }))}
                required
                placeholder="06 00 00 00 00"
                className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                Membres
              </span>
              <input
                type="number"
                min={1}
                value={formValues.employees}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    employees: Math.max(1, Number(event.target.value) || 1),
                  }))
                }
                required
                className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
              Statut
            </span>
            <select
              value={formValues.status}
              onChange={(event) =>
                setFormValues((previous) => ({
                  ...previous,
                  status: event.target.value as OrganizationStatus,
                }))
              }
              className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
            >
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="inactive">Inactif</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md border border-[#2A4A66] bg-[#0A2236] px-4 py-2.5 text-sm font-semibold text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#E6EDF3]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-[#1ABC9C] px-4 py-2.5 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
            >
              <FiActivity className="h-4 w-4" aria-hidden="true" />
              {editingId ? 'Mettre a jour' : 'Creer organisation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
