import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { FiX } from 'react-icons/fi'

type ModalProps = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-xl rounded-xl border border-[#1F3A52] bg-[#0F2B44] shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#1F3A52] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#E6EDF3]">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-[#8FA3B8]">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenetre"
            className="rounded-md border border-[#1F3A52] bg-[#0A2236] p-2 text-[#8FA3B8] transition hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
          >
            <FiX className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
