import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiEdit2, FiMapPin, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal } from '../components/Modal'
import { Sidebar } from '../components/Sidebar'
import {
  createInstitution,
  deleteInstitution,
  getInstitutions,
  updateInstitution,
  type Institution,
  type UpsertInstitutionPayload,
} from '../lib/institutionsApi'
import { getApiErrorMessage } from '../lib/apiError'

type InstitutionFormValues = {
  name: string
  address: string
  requiresDeclaration: boolean
}

const PAGE_SIZE = 6
const MAX_VISIBLE_PAGES = 5

const EMPTY_VALUES: InstitutionFormValues = {
  name: '',
  address: '',
  requiresDeclaration: false,
}

export function InstitutionsPage() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null)

  const { data: institutions = [], isLoading } = useQuery({
    queryKey: ['institutions'],
    queryFn: getInstitutions,
  })

  const { register, handleSubmit, reset } = useForm<InstitutionFormValues>({
    defaultValues: EMPTY_VALUES,
  })

  const createMutation = useMutation({
    mutationFn: createInstitution,
    onSuccess: () => {
      toast.success('Etablissement cree.')
      void queryClient.invalidateQueries({ queryKey: ['institutions'] })
      closeModal()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpsertInstitutionPayload }) =>
      updateInstitution(id, payload),
    onSuccess: () => {
      toast.success('Etablissement mis a jour.')
      void queryClient.invalidateQueries({ queryKey: ['institutions'] })
      closeModal()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteInstitution,
    onSuccess: () => {
      toast.success('Etablissement supprime.')
      void queryClient.invalidateQueries({ queryKey: ['institutions'] })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

  const filteredInstitutions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return institutions
    }

    return institutions.filter((institution) => {
      return (
        institution.name.toLowerCase().includes(normalizedQuery) ||
        institution.address.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [institutions, query])

  const pageCount = Math.max(1, Math.ceil(filteredInstitutions.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, pageCount - 1)
  const pageStart = safeCurrentPage * PAGE_SIZE
  const paginatedInstitutions = filteredInstitutions.slice(pageStart, pageStart + PAGE_SIZE)
  const paginationStart = Math.max(
    0,
    Math.min(safeCurrentPage - Math.floor(MAX_VISIBLE_PAGES / 2), pageCount - MAX_VISIBLE_PAGES),
  )
  const visiblePages = Array.from(
    { length: Math.min(MAX_VISIBLE_PAGES, pageCount) },
    (_, index) => paginationStart + index,
  )

  const openCreateModal = () => {
    setEditingInstitution(null)
    reset(EMPTY_VALUES)
    setIsModalOpen(true)
  }

  const openEditModal = (institution: Institution) => {
    setEditingInstitution(institution)
    reset({
      name: institution.name,
      address: institution.address,
      requiresDeclaration: institution.requiresDeclaration,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingInstitution(null)
    reset(EMPTY_VALUES)
  }

  const onSubmit = (values: InstitutionFormValues) => {
    if (editingInstitution) {
      updateMutation.mutate({ id: editingInstitution.id, payload: values })
      return
    }

    createMutation.mutate({
      ...values,
      requiresDeclaration: values.requiresDeclaration ?? false,
    })
  }

  const startEntry = filteredInstitutions.length === 0 ? 0 : pageStart + 1
  const endEntry = Math.min(pageStart + PAGE_SIZE, filteredInstitutions.length)

  return (
    <div className="flex min-h-screen bg-[#020F1F] text-[#E6EDF3]">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden bg-[#0A2236] px-8 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Gestion des Etablissements</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#B8C5D0]">
                Gere les etablissements scolaires relies aux interventions.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-md bg-[#1ABC9C] px-4 py-2.5 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
            >
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Ajouter un etablissement
            </button>
          </header>

          <section className="rounded-lg border border-[#1F3A52] bg-[#0F2B44]">
            <div className="flex flex-col gap-3 border-b border-[#1F3A52] p-4">
              <label className="relative flex-1">
                <FiSearch
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F7389]"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setCurrentPage(0)
                  }}
                  placeholder="Rechercher un etablissement ou une adresse..."
                  className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] py-2.5 pl-9 pr-3 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </label>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-14">
                <TailSpin height={40} width={40} color="#1ABC9C" ariaLabel="Chargement" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#1F3A52] text-left">
                  <thead className="bg-[#0A2236] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8FA3B8]">
                    <tr>
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Adresse</th>
                      <th className="px-4 py-3">Declaration requise</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F3A52] text-sm">
                    {paginatedInstitutions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-[#8FA3B8]">
                          Aucun etablissement ne correspond a votre recherche.
                        </td>
                      </tr>
                    ) : (
                      paginatedInstitutions.map((institution) => (
                        <tr key={institution.id} className="transition hover:bg-[#12324D]">
                          <td className="px-4 py-3 font-semibold text-[#E6EDF3]">{institution.name}</td>
                          <td className="px-4 py-3 text-[#B8C5D0]">{institution.address}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                institution.requiresDeclaration
                                  ? 'border-[#1ABC9C]/40 bg-[#1ABC9C]/15 text-[#1ABC9C]'
                                  : 'border-[#7F8C8D]/40 bg-[#7F8C8D]/15 text-[#B8C5D0]'
                              }`}
                            >
                              {institution.requiresDeclaration ? 'Oui' : 'Non'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(institution)}
                                className="inline-flex items-center gap-1 rounded-md border border-[#2A4A66] bg-[#0A2236] px-2.5 py-1.5 text-xs font-semibold text-[#B8C5D0] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
                              >
                                <FiEdit2 className="h-3.5 w-3.5" aria-hidden="true" />
                                Editer
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteMutation.mutate(institution.id)}
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
            )}

            <div className="flex flex-col gap-3 border-t border-[#1F3A52] px-4 py-3 text-sm text-[#8FA3B8] sm:flex-row sm:items-center sm:justify-between">
              <p>
                {filteredInstitutions.length === 0
                  ? 'Aucun resultat'
                  : `Affichage ${startEntry} a ${endEntry} sur ${filteredInstitutions.length} etablissements`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
                  disabled={safeCurrentPage === 0}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2A4A66] bg-[#0A2236] text-xs text-[#B8C5D0] disabled:opacity-40"
                >
                  {'<'}
                </button>
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs ${
                      page === safeCurrentPage
                        ? 'border-[#1ABC9C] bg-[#1ABC9C]/10 text-[#1ABC9C]'
                        : 'border-[#2A4A66] bg-[#0A2236] text-[#B8C5D0]'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, pageCount - 1))}
                  disabled={safeCurrentPage === pageCount - 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2A4A66] bg-[#0A2236] text-xs text-[#B8C5D0] disabled:opacity-40"
                >
                  {'>'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingInstitution ? 'Modifier un etablissement' : 'Ajouter un etablissement'}
        description="Renseigne les champs correspondant a la table Institutions."
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
              Nom
            </span>
            <input
              {...register('name', { required: true })}
              placeholder="Ex: College Victor Hugo"
              className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#1ABC9C]">
              Adresse
            </span>
            <div className="relative">
              <FiMapPin
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F7389]"
                aria-hidden="true"
              />
              <input
                {...register('address', { required: true })}
                placeholder="12 rue des Ecoles, Paris"
                className="w-full rounded-md border border-[#2A4A66] bg-[#0A2236] py-2.5 pl-9 pr-3 text-sm text-[#E6EDF3] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
              />
            </div>
          </label>

          <label className="flex items-center gap-2 rounded-md border border-[#2A4A66] bg-[#0A2236] px-3 py-2.5 text-sm text-[#E6EDF3]">
            <input type="checkbox" {...register('requiresDeclaration')} />
            Declaration requise
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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-[#1ABC9C] px-4 py-2.5 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085] disabled:opacity-70"
            >
              {editingInstitution ? 'Mettre a jour' : 'Creer etablissement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
