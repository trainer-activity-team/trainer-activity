import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  FiArrowLeft,
  FiArrowRight,
  FiDownload,
  FiEdit2,
  FiEye,
  FiFileText,
  FiLayers,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi'
import { Modal } from '../components/Modal'
import { Sidebar } from '../components/Sidebar'

type PricingType = 'Heure' | 'Demi-journee' | 'Journee' | 'Forfait' | 'Libre'

type Contract = {
  id: string
  name: string
  description: string
  reference: string
  organization: string
  organizationSector: string
  startDate: string
  endDate: string
  plannedVolume: string
  pricingType: PricingType
  unitPrice: number
  notes: string
}

type ContractFormValues = Omit<Contract, 'id'>

const PRICING_OPTIONS: PricingType[] = ['Heure', 'Demi-journee', 'Journee', 'Forfait', 'Libre']

const EMPTY_FORM: ContractFormValues = {
  name: '',
  description: '',
  reference: '',
  organization: '',
  organizationSector: '',
  startDate: '',
  endDate: '',
  plannedVolume: '',
  pricingType: 'Heure',
  unitPrice: 0,
  notes: '',
}

const SEED_CONTRACTS: Contract[] = [
  {
    id: 'ctr-1',
    name: 'Interventions Marketing M1',
    description: 'Master Marketing',
    reference: 'CTR-2024-001',
    organization: 'Spartan Athletics',
    organizationSector: 'Performance sportive',
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    plannedVolume: '120 h',
    pricingType: 'Heure',
    unitPrice: 80,
    notes: '',
  },
  {
    id: 'ctr-2',
    name: 'Coaching individuel',
    description: 'Programme performance',
    reference: 'CTR-2024-002',
    organization: 'Elite Academy',
    organizationSector: 'Coaching prive',
    startDate: '2024-10-01',
    endDate: '2025-09-30',
    plannedVolume: '60 h',
    pricingType: 'Forfait',
    unitPrice: 1200,
    notes: '',
  },
  {
    id: 'ctr-3',
    name: 'Preparation physique',
    description: 'Saison 24/25',
    reference: 'CTR-2024-003',
    organization: 'Velocity Track',
    organizationSector: 'Preparation physique',
    startDate: '2024-08-15',
    endDate: '2025-06-15',
    plannedVolume: '80 h',
    pricingType: 'Heure',
    unitPrice: 70,
    notes: '',
  },
  {
    id: 'ctr-4',
    name: 'Interventions Athletisme',
    description: 'Modules techniques',
    reference: 'CTR-2024-004',
    organization: 'Metro Track Club',
    organizationSector: 'Athletisme',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    plannedVolume: '100 h',
    pricingType: 'Demi-journee',
    unitPrice: 250,
    notes: '',
  },
  {
    id: 'ctr-5',
    name: 'Bien-etre & recuperation',
    description: 'Ateliers trimestriels',
    reference: 'CTR-2024-005',
    organization: 'Horizon Wellness',
    organizationSector: 'Bien-etre',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    plannedVolume: '90 h',
    pricingType: 'Forfait',
    unitPrice: 1800,
    notes: '',
  },
]

function formatDate(value: string) {
  if (!value) {
    return '-'
  }
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR')
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

function getVolumeNumber(volume: string) {
  const parsed = Number.parseFloat(volume.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

export function ContratsPage() {
  const [contracts, setContracts] = useState<Contract[]>(SEED_CONTRACTS)
  const [query, setQuery] = useState('')
  const [organizationFilter, setOrganizationFilter] = useState('all')
  const [pricingFilter, setPricingFilter] = useState<'all' | PricingType>('all')
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [formValues, setFormValues] = useState<ContractFormValues>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [detailContract, setDetailContract] = useState<Contract | null>(null)
  const [formStep, setFormStep] = useState<1 | 2>(1)

  const organizationOptions = useMemo(() => {
    return Array.from(new Set(contracts.map((contract) => contract.organization))).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [contracts])

  const filteredContracts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return contracts.filter((contract) => {
      const matchesQuery =
        !normalizedQuery ||
        contract.name.toLowerCase().includes(normalizedQuery) ||
        contract.reference.toLowerCase().includes(normalizedQuery) ||
        contract.organization.toLowerCase().includes(normalizedQuery)

      const matchesOrganization =
        organizationFilter === 'all' || contract.organization === organizationFilter
      const matchesPricing = pricingFilter === 'all' || contract.pricingType === pricingFilter
      const matchesStartDate = !startDateFilter || contract.startDate >= startDateFilter
      const matchesEndDate = !endDateFilter || contract.endDate <= endDateFilter

      return (
        matchesQuery &&
        matchesOrganization &&
        matchesPricing &&
        matchesStartDate &&
        matchesEndDate
      )
    })
  }, [contracts, endDateFilter, organizationFilter, pricingFilter, query, startDateFilter])

  const totalPlannedVolume = useMemo(() => {
    return contracts.reduce((acc, contract) => acc + getVolumeNumber(contract.plannedVolume), 0)
  }, [contracts])

  const projectedRevenue = useMemo(() => {
    return contracts.reduce((acc, contract) => acc + contract.unitPrice, 0)
  }, [contracts])

  const uniqueOrganizations = useMemo(() => new Set(contracts.map((contract) => contract.organization)).size, [contracts])
  const averagePrice = contracts.length ? projectedRevenue / contracts.length : 0

  const resetForm = () => {
    setFormValues(EMPTY_FORM)
    setEditingId(null)
    setFormStep(1)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    resetForm()
  }

  const openCreateModal = () => {
    resetForm()
    setIsFormModalOpen(true)
  }

  const openEditModal = (contract: Contract) => {
    setEditingId(contract.id)
    setFormValues({
      name: contract.name,
      description: contract.description,
      reference: contract.reference,
      organization: contract.organization,
      organizationSector: contract.organizationSector,
      startDate: contract.startDate,
      endDate: contract.endDate,
      plannedVolume: contract.plannedVolume,
      pricingType: contract.pricingType,
      unitPrice: contract.unitPrice,
      notes: contract.notes,
    })
    setFormStep(1)
    setIsFormModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const target = contracts.find((contract) => contract.id === id)
    if (!target) {
      return
    }

    if (window.confirm(`Supprimer le contrat "${target.name}" ?`)) {
      setContracts((previous) => previous.filter((contract) => contract.id !== id))
    }
  }

  const handleResetFilters = () => {
    setQuery('')
    setOrganizationFilter('all')
    setPricingFilter('all')
    setStartDateFilter('')
    setEndDateFilter('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editingId) {
      setContracts((previous) =>
        previous.map((contract) => (contract.id === editingId ? { ...contract, ...formValues } : contract)),
      )
    } else {
      const newContract: Contract = {
        ...formValues,
        id: `ctr-${crypto.randomUUID()}`,
      }
      setContracts((previous) => [newContract, ...previous])
    }

    closeFormModal()
  }

  return (
    <div className="flex min-h-screen bg-[#020F1F] text-[#E6EDF3]">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden bg-[#0A2236] px-8 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Contrats</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#B8C5D0]">
                Gerez les contrats d&apos;intervention avec les organisations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-[#2A4A66] bg-[#0A2236] px-4 py-2.5 text-sm font-semibold text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#E6EDF3]"
              >
                <FiDownload className="h-4 w-4" aria-hidden="true" />
                Exporter
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-md bg-[#1ABC9C] px-4 py-2.5 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
              >
                <FiPlus className="h-4 w-4" aria-hidden="true" />
                Nouveau contrat
              </button>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <article className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3B8]">Contrats</p>
              <p className="mt-3 text-3xl font-semibold">{contracts.length}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#1ABC9C]">
                <FiFileText className="h-3.5 w-3.5" aria-hidden="true" />
                Total actifs en base
              </p>
            </article>

            <article className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3B8]">
                Volume prevu
              </p>
              <p className="mt-3 text-3xl font-semibold">{totalPlannedVolume} h</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#1ABC9C]">
                <FiLayers className="h-3.5 w-3.5" aria-hidden="true" />
                Volume cumule
              </p>
            </article>

            <article className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3B8]">
                CA previsionnel
              </p>
              <p className="mt-3 text-3xl font-semibold">{formatCurrency(projectedRevenue)}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#1ABC9C]">
                <FiDownload className="h-3.5 w-3.5" aria-hidden="true" />
                Estimation actuelle
              </p>
            </article>

            <article className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3B8]">
                Organisations liees
              </p>
              <p className="mt-3 text-3xl font-semibold">{uniqueOrganizations}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#1ABC9C]">
                <FiUsers className="h-3.5 w-3.5" aria-hidden="true" />
                Entites partenaires
              </p>
            </article>

            <article className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3B8]">
                Tarif moyen
              </p>
              <p className="mt-3 text-3xl font-semibold">{formatCurrency(averagePrice)}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-[#1ABC9C]">
                <FiLayers className="h-3.5 w-3.5" aria-hidden="true" />
                Prix unitaire moyen
              </p>
            </article>
          </section>

          <section className="rounded-lg border border-[#1F3A52] bg-[#0F2B44] p-4">
            <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
              <label className="relative">
                <FiSearch
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F7389]"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un contrat, une organisation, une reference..."
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] py-2.5 pl-9 pr-3 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </label>

              <select
                value={organizationFilter}
                onChange={(event) => setOrganizationFilter(event.target.value)}
                className="rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
              >
                <option value="all">Toutes les organisations</option>
                {organizationOptions.map((organization) => (
                  <option key={organization} value={organization}>
                    {organization}
                  </option>
                ))}
              </select>

              <select
                value={pricingFilter}
                onChange={(event) => setPricingFilter(event.target.value as 'all' | PricingType)}
                className="rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
              >
                <option value="all">Tous les types</option>
                {PRICING_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={startDateFilter}
                onChange={(event) => setStartDateFilter(event.target.value)}
                className="rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
              />

              <input
                type="date"
                value={endDateFilter}
                onChange={(event) => setEndDateFilter(event.target.value)}
                className="rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
              />

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm font-semibold text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#E6EDF3]"
              >
                <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
                Reinitialiser
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-[#1F3A52] bg-[#0F2B44]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#1F3A52] text-left">
                <thead className="bg-[#0A2236] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8FA3B8]">
                  <tr>
                    <th className="px-4 py-3">Contrat</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Organisation</th>
                    <th className="px-4 py-3">Periode</th>
                    <th className="px-4 py-3">Volume prevu</th>
                    <th className="px-4 py-3">Tarification</th>
                    <th className="px-4 py-3">Prix unitaire</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#1F3A52] text-sm">
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-[#8FA3B8]">
                        Aucun contrat ne correspond aux filtres actifs.
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((contract) => (
                      <tr key={contract.id} className="transition hover:bg-[#12324D]">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#E6EDF3]">{contract.name}</p>
                          <p className="mt-1 text-xs text-[#8FA3B8]">{contract.description}</p>
                        </td>
                        <td className="px-4 py-3 text-[#B8C5D0]">{contract.reference}</td>
                        <td className="px-4 py-3">
                          <p className="text-[#E6EDF3]">{contract.organization}</p>
                          <p className="mt-1 text-xs text-[#8FA3B8]">{contract.organizationSector}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#B8C5D0]">
                          <p>{formatDate(contract.startDate)}</p>
                          <p className="mt-1">{formatDate(contract.endDate)}</p>
                        </td>
                        <td className="px-4 py-3 text-[#B8C5D0]">{contract.plannedVolume}</td>
                        <td className="px-4 py-3 text-[#B8C5D0]">{contract.pricingType}</td>
                        <td className="px-4 py-3 text-[#E6EDF3]">{formatCurrency(contract.unitPrice)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailContract(contract)}
                              aria-label={`Voir le detail de ${contract.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2A4A66] bg-[#0A2236] text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
                            >
                              <FiEye className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(contract)}
                              aria-label={`Modifier ${contract.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2A4A66] bg-[#0A2236] text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
                            >
                              <FiEdit2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(contract.id)}
                              aria-label={`Supprimer ${contract.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E74C3C]/40 bg-[#E74C3C]/10 text-[#E74C3C] transition hover:bg-[#E74C3C]/20"
                            >
                              <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Modal
        open={isFormModalOpen}
        onClose={closeFormModal}
        title={editingId ? 'Modifier un contrat' : 'Nouveau contrat'}
        description="Renseignez les informations contractuelles et la tarification associee."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {formStep === 1 ? (
            <>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                  Nom du contrat
                </span>
                <input
                  value={formValues.name}
                  onChange={(event) => setFormValues((previous) => ({ ...previous, name: event.target.value }))}
                  required
                  placeholder="Ex: Interventions Marketing M1"
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Reference contrat
                  </span>
                  <input
                    value={formValues.reference}
                    onChange={(event) =>
                      setFormValues((previous) => ({ ...previous, reference: event.target.value }))
                    }
                    placeholder="CTR-2024-001"
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Organisation liee
                  </span>
                  <input
                    value={formValues.organization}
                    onChange={(event) =>
                      setFormValues((previous) => ({ ...previous, organization: event.target.value }))
                    }
                    required
                    placeholder="Ex: Spartan Athletics"
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                  Description courte
                </span>
                <input
                  value={formValues.description}
                  onChange={(event) =>
                    setFormValues((previous) => ({ ...previous, description: event.target.value }))
                  }
                  placeholder="Programme, niveau, public cible..."
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </label>
            </>
          ) : null}

          {formStep === 2 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Date de debut
                  </span>
                  <input
                    type="date"
                    value={formValues.startDate}
                    onChange={(event) =>
                      setFormValues((previous) => ({ ...previous, startDate: event.target.value }))
                    }
                    required
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Date de fin
                  </span>
                  <input
                    type="date"
                    value={formValues.endDate}
                    onChange={(event) =>
                      setFormValues((previous) => ({ ...previous, endDate: event.target.value }))
                    }
                    required
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Volume prevu
                  </span>
                  <input
                    value={formValues.plannedVolume}
                    onChange={(event) =>
                      setFormValues((previous) => ({ ...previous, plannedVolume: event.target.value }))
                    }
                    placeholder="Ex: 120 h"
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Type de tarification
                  </span>
                  <select
                    value={formValues.pricingType}
                    onChange={(event) =>
                      setFormValues((previous) => ({
                        ...previous,
                        pricingType: event.target.value as PricingType,
                      }))
                    }
                    required
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
                  >
                    {PRICING_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Prix unitaire
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formValues.unitPrice}
                    onChange={(event) =>
                      setFormValues((previous) => ({
                        ...previous,
                        unitPrice: Number(event.target.value) || 0,
                      }))
                    }
                    required
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                  Secteur organisation
                </span>
                <input
                  value={formValues.organizationSector}
                  onChange={(event) =>
                    setFormValues((previous) => ({ ...previous, organizationSector: event.target.value }))
                  }
                  placeholder="Ex: Performance sportive"
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                  Remarques
                </span>
                <textarea
                  value={formValues.notes}
                  onChange={(event) =>
                    setFormValues((previous) => ({ ...previous, notes: event.target.value }))
                  }
                  rows={3}
                  placeholder="Informations complementaires..."
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </label>
            </>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeFormModal}
              className="rounded-md border border-[#2A4A66] bg-[#0A2236] px-4 py-2.5 text-sm font-semibold text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#E6EDF3]"
            >
              Annuler
            </button>

            {formStep === 2 ? (
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className="inline-flex items-center gap-2 rounded-md border border-[#2A4A66] bg-[#0A2236] px-4 py-2.5 text-sm font-semibold text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#E6EDF3]"
              >
                <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                Precedent
              </button>
            ) : null}

            {formStep === 1 ? (
              <button
                type="button"
                onClick={() => setFormStep(2)}
                className="inline-flex items-center gap-2 rounded-md bg-[#1ABC9C] px-4 py-2.5 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
              >
                Suivant
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-[#1ABC9C] px-4 py-2.5 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
              >
                <FiPlus className="h-4 w-4" aria-hidden="true" />
                {editingId ? 'Mettre a jour' : 'Creer le contrat'}
              </button>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(detailContract)}
        onClose={() => setDetailContract(null)}
        title={detailContract ? detailContract.name : 'Detail contrat'}
        description="Apercu detaille du contrat selectionne."
      >
        {detailContract ? (
          <div className="space-y-3 text-sm text-[#B8C5D0]">
            <p>
              <span className="font-semibold text-[#E6EDF3]">Reference :</span> {detailContract.reference}
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Organisation :</span>{' '}
              {detailContract.organization}
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Periode :</span>{' '}
              {formatDate(detailContract.startDate)} - {formatDate(detailContract.endDate)}
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Tarification :</span>{' '}
              {detailContract.pricingType} ({formatCurrency(detailContract.unitPrice)})
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Volume prevu :</span>{' '}
              {detailContract.plannedVolume}
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Description :</span>{' '}
              {detailContract.description || 'Aucune'}
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Remarques :</span>{' '}
              {detailContract.notes || 'Aucune'}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
