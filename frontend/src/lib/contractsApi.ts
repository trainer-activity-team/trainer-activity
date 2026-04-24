import { apiClient } from './apiClient'

export type ContractRelationOption = {
  id: number
  name: string
}

export type ContractRecord = {
  id: number
  institutionId: number
  pricingModeId: number
  contractNumber: string
  startDate: string
  endDate: string
  hourlyVolumePlanned: string
  unitPrice: string
  institution: ContractRelationOption
  pricingMode: ContractRelationOption
}

export type UpsertContractPayload = {
  institutionId: number
  pricingModeId: number
  contractNumber: string
  startDate: string
  endDate: string
  hourlyVolumePlanned: number
  unitPrice: number
}

export type ContractLookups = {
  institutions: ContractRelationOption[]
  pricingModes: ContractRelationOption[]
}

export async function getContracts() {
  const response = await apiClient.get<ContractRecord[]>('/contracts')
  return response.data
}

export async function getContract(id: number) {
  const response = await apiClient.get<ContractRecord>(`/contracts/${id}`)
  return response.data
}

export async function createContract(payload: UpsertContractPayload) {
  const response = await apiClient.post<ContractRecord>('/contracts', payload)
  return response.data
}

export async function updateContract(
  contractId: number,
  payload: Partial<UpsertContractPayload>,
) {
  const response = await apiClient.patch<ContractRecord>('/contracts', { contractId, ...payload })
  return response.data
}

export async function deleteContract(contractId: number) {
  await apiClient.delete('/contracts', {
    data: { contractId },
  })
}

export async function getContractLookups() {
  const response = await apiClient.get<ContractLookups>('/contracts/lookups')
  return response.data
}
