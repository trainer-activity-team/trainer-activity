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
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal } from '../components/Modal'
import { Sidebar } from '../components/Sidebar'
import { getApiErrorMessage } from '../lib/apiError'
import {
  createContract,
  deleteContract,
  getContractLookups,
  getContracts,
  updateContract,
  type ContractRecord,
  type UpsertContractPayload,
} from '../lib/contractsApi'

type ContractFormValues = {
  institutionId: number
  pricingModeId: number
  contractNumber: string
  startDate: string
  endDate: string
  hourlyVolumePlanned: string
  unitPrice: string
}

const EMPTY_FORM: ContractFormValues = {
  institutionId: 0,
  pricingModeId: 0,
  contractNumber: '',
  startDate: '',
  endDate: '',
  hourlyVolumePlanned: '',
  unitPrice: '',
}

function formatDate(value: string) {
  if (!value) {
    return '-'
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10)
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

function parseDecimal(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function ContratsPage() {
  const queryClient = useQueryClient()

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: getContracts,
  })

  const { data: lookups, isLoading: isLoadingLookups } = useQuery({
    queryKey: ['contract-lookups'],
    queryFn: getContractLookups,
  })

  const [query, setQuery] = useState('')
  const [organizationFilter, setOrganizationFilter] = useState('all')
  const [pricingFilter, setPricingFilter] = useState('all')
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [formValues, setFormValues] = useState<ContractFormValues>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [detailContract, setDetailContract] = useState<ContractRecord | null>(null)
  const [formStep, setFormStep] = useState<1 | 2>(1)

  const createMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      toast.success('Contrat cree.')
      void queryClient.invalidateQueries({ queryKey: ['contracts'] })
      closeFormModal()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      contractId,
      payload,
    }: {
      contractId: number
      payload: Partial<UpsertContractPayload>
    }) => updateContract(contractId, payload),
    onSuccess: () => {
      toast.success('Contrat mis a jour.')
      void queryClient.invalidateQueries({ queryKey: ['contracts'] })
      closeFormModal()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContract,
    onSuccess: () => {
      toast.success('Contrat supprime.')
      void queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

  const organizationOptions = useMemo(() => {
    return Array.from(new Set(contracts.map((contract) => contract.institution.name))).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [contracts])

  const pricingOptions = useMemo(() => {
    return Array.from(new Set(contracts.map((contract) => contract.pricingMode.name))).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [contracts])

  const filteredContracts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return contracts.filter((contract) => {
      const matchesQuery =
        !normalizedQuery ||
        contract.contractNumber.toLowerCase().includes(normalizedQuery) ||
        contract.institution.name.toLowerCase().includes(normalizedQuery) ||
        contract.pricingMode.name.toLowerCase().includes(normalizedQuery)

      const matchesOrganization =
        organizationFilter === 'all' || contract.institution.name === organizationFilter
      const matchesPricing = pricingFilter === 'all' || contract.pricingMode.name === pricingFilter
      const matchesStartDate = !startDateFilter || contract.startDate.slice(0, 10) >= startDateFilter
      const matchesEndDate = !endDateFilter || contract.endDate.slice(0, 10) <= endDateFilter

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
    return contracts.reduce((acc, contract) => acc + parseDecimal(contract.hourlyVolumePlanned), 0)
  }, [contracts])

  const projectedRevenue = useMemo(() => {
    return contracts.reduce((acc, contract) => acc + parseDecimal(contract.unitPrice), 0)
  }, [contracts])

  const uniqueOrganizations = useMemo(
    () => new Set(contracts.map((contract) => contract.institution.name)).size,
    [contracts],
  )
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

  const openEditModal = (contract: ContractRecord) => {
    setEditingId(contract.id)
    setFormValues({
      institutionId: contract.institutionId,
      pricingModeId: contract.pricingModeId,
      contractNumber: contract.contractNumber,
      startDate: contract.startDate.slice(0, 10),
      endDate: contract.endDate.slice(0, 10),
      hourlyVolumePlanned: String(parseDecimal(contract.hourlyVolumePlanned)),
      unitPrice: String(parseDecimal(contract.unitPrice)),
    })
    setFormStep(1)
    setIsFormModalOpen(true)
  }

  const handleDelete = (id: number) => {
    const target = contracts.find((contract) => contract.id === id)
    if (!target) {
      return
    }

    if (window.confirm(`Supprimer le contrat "${target.contractNumber}" ?`)) {
      deleteMutation.mutate(id)
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
    if (formStep === 1) {
      setFormStep(2)
      return
    }

    const payload: UpsertContractPayload = {
      institutionId: formValues.institutionId,
      pricingModeId: formValues.pricingModeId,
      contractNumber: formValues.contractNumber.trim(),
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      hourlyVolumePlanned: Number(formValues.hourlyVolumePlanned),
      unitPrice: Number(formValues.unitPrice),
    }

    if (editingId) {
      updateMutation.mutate({ contractId: editingId, payload })
    } else {
      createMutation.mutate(payload)
    }
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
                disabled={isLoadingLookups || !lookups}
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
                onChange={(event) => setPricingFilter(event.target.value)}
                className="rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
              >
                <option value="all">Tous les types</option>
                {pricingOptions.map((option) => (
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
            {isLoading ? (
              <div className="flex justify-center py-14">
                <TailSpin height={40} width={40} color="#1ABC9C" ariaLabel="Chargement" />
              </div>
            ) : (
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
                            <p className="font-semibold text-[#E6EDF3]">{contract.contractNumber}</p>
                            <p className="mt-1 text-xs text-[#8FA3B8]">ID #{contract.id}</p>
                          </td>
                          <td className="px-4 py-3 text-[#B8C5D0]">{contract.contractNumber}</td>
                          <td className="px-4 py-3 text-[#E6EDF3]">{contract.institution.name}</td>
                          <td className="px-4 py-3 text-xs text-[#B8C5D0]">
                            <p>{formatDate(contract.startDate)}</p>
                            <p className="mt-1">{formatDate(contract.endDate)}</p>
                          </td>
                          <td className="px-4 py-3 text-[#B8C5D0]">
                            {parseDecimal(contract.hourlyVolumePlanned)} h
                          </td>
                          <td className="px-4 py-3 text-[#B8C5D0]">{contract.pricingMode.name}</td>
                          <td className="px-4 py-3 text-[#E6EDF3]">
                            {formatCurrency(parseDecimal(contract.unitPrice))}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setDetailContract(contract)}
                                aria-label={`Voir le detail de ${contract.contractNumber}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2A4A66] bg-[#0A2236] text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
                              >
                                <FiEye className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(contract)}
                                aria-label={`Modifier ${contract.contractNumber}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2A4A66] bg-[#0A2236] text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
                              >
                                <FiEdit2 className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(contract.id)}
                                aria-label={`Supprimer ${contract.contractNumber}`}
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
            )}
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
                  Reference contrat
                </span>
                <input
                  value={formValues.contractNumber}
                  onChange={(event) =>
                    setFormValues((previous) => ({ ...previous, contractNumber: event.target.value }))
                  }
                  required
                  placeholder="CTR-2024-001"
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Organisation liee
                  </span>
                  <select
                    value={formValues.institutionId || ''}
                    onChange={(event) =>
                      setFormValues((previous) => ({
                        ...previous,
                        institutionId: Number(event.target.value),
                      }))
                    }
                    required
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
                  >
                    <option value="">Selectionner...</option>
                    {(lookups?.institutions ?? []).map((institution) => (
                      <option key={institution.id} value={institution.id}>
                        {institution.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
                    Type de tarification
                  </span>
                  <select
                    value={formValues.pricingModeId || ''}
                    onChange={(event) =>
                      setFormValues((previous) => ({
                        ...previous,
                        pricingModeId: Number(event.target.value),
                      }))
                    }
                    required
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C]"
                  >
                    <option value="">Selectionner...</option>
                    {(lookups?.pricingModes ?? []).map((pricingMode) => (
                      <option key={pricingMode.id} value={pricingMode.id}>
                        {pricingMode.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formValues.hourlyVolumePlanned}
                    onChange={(event) =>
                      setFormValues((previous) => ({
                        ...previous,
                        hourlyVolumePlanned: event.target.value,
                      }))
                    }
                    placeholder="Ex: 120"
                    required
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                  />
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
                        unitPrice: event.target.value,
                      }))
                    }
                    placeholder="Ex: 65"
                    required
                    className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                  />
                </label>
              </div>
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
                onClick={(event) => {
                  event.preventDefault()
                  setFormStep(2)
                }}
                className="inline-flex items-center gap-2 rounded-md bg-[#1ABC9C] px-4 py-2.5 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
              >
                Suivant
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
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
        title={detailContract ? detailContract.contractNumber : 'Detail contrat'}
        description="Apercu detaille du contrat selectionne."
      >
        {detailContract ? (
          <div className="space-y-3 text-sm text-[#B8C5D0]">
            <p>
              <span className="font-semibold text-[#E6EDF3]">Reference :</span>{' '}
              {detailContract.contractNumber}
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Organisation :</span>{' '}
              {detailContract.institution.name}
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Periode :</span>{' '}
              {formatDate(detailContract.startDate)} - {formatDate(detailContract.endDate)}
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Tarification :</span>{' '}
              {detailContract.pricingMode.name} ({formatCurrency(parseDecimal(detailContract.unitPrice))})
            </p>
            <p>
              <span className="font-semibold text-[#E6EDF3]">Volume prevu :</span>{' '}
              {parseDecimal(detailContract.hourlyVolumePlanned)} h
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
