import axios from 'axios'

type ApiErrorBody = {
  message?: string | string[]
  error?: string
  statusCode?: number
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message

    if (Array.isArray(message) && message.length > 0) {
      return message.join(', ')
    }

    if (typeof message === 'string' && message.length > 0) {
      return message
    }

    if (error.response?.status === 401) {
      return 'Email ou mot de passe invalide.'
    }
  }

  return 'Une erreur est survenue. Veuillez reessayer.'
}
