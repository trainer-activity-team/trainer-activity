import { useMemo } from 'react'

type StoredUser = {
  firstName?: string
  lastName?: string
}

export function LandingPage() {
  const userFullName = useMemo(() => {
    const userJson = localStorage.getItem('currentUser')
    if (!userJson) {
      return ''
    }

    try {
      const user = JSON.parse(userJson) as StoredUser
      return [user.firstName, user.lastName].filter(Boolean).join(' ')
    } catch {
      return ''
    }
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020F1F] px-6 py-10 text-[#E6EDF3]">
      <section className="w-full max-w-lg rounded-lg border border-[#1F3A52] bg-[#0F2B44]/95 p-8 text-center shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
        <h1 className="text-3xl font-semibold tracking-tight">Landing Page</h1>
        <p className="mt-3 text-sm text-[#B8C5D0]">
          {userFullName ? `Welcome ${userFullName}, login succeeded.` : 'You are now authenticated.'}
        </p>
      </section>
    </main>
  )
}
