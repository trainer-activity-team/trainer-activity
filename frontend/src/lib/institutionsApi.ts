import { apiClient } from './apiClient'

export type Institution = {
  id: number
  name: string
  address: string
  requiresDeclaration: boolean
}

export type UpsertInstitutionPayload = {
  name: string
  address: string
  requiresDeclaration?: boolean
}

export async function getInstitutions() {
  const response = await apiClient.get<Institution[]>('/institutions')
  return response.data
}

export async function createInstitution(payload: UpsertInstitutionPayload) {
  const response = await apiClient.post<Institution>('/institutions', payload)
  return response.data
}

export async function updateInstitution(
  institutionId: number,
  payload: UpsertInstitutionPayload,
) {
  const response = await apiClient.patch<Institution>('/institutions', {
    institutionId,
    ...payload,
  })
  return response.data
}

export async function deleteInstitution(institutionId: number) {
  await apiClient.delete('/institutions', {
    data: { institutionId },
  })
}
