import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020F1F] px-6 py-10 text-[#E6EDF3]">
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-9 flex flex-col items-center gap-2 text-center">
          <img
            src="/logo-Trainer-Activity.png"
            alt="Trainer Activity"
            className="h-20 w-auto object-contain"
          />
          <p className="text-sm text-[#8FA3B8]">Performance &amp; Discipline Suite</p>
        </div>

        <section className="rounded-lg border border-[#1F3A52] bg-[#0F2B44]/95 p-7 shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
          <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
          <p className="mt-1 text-sm text-[#B8C5D0]">Set up your account to start using the suite</p>

          <form className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="full-name"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#1ABC9C]"
              >
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                placeholder="Alex Carter"
                className="w-full rounded-md border border-[#2A4A66] bg-[#E6EDF3] px-4 py-3 text-sm text-[#0A2236] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#1ABC9C]"
              >
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="coach@proelite.com"
                className="w-full rounded-md border border-[#2A4A66] bg-[#E6EDF3] px-4 py-3 text-sm text-[#0A2236] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#1ABC9C]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#2A4A66] bg-[#E6EDF3] px-4 py-3 pr-11 text-sm text-[#0A2236] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#5F7389] transition hover:text-[#1ABC9C]"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" aria-hidden="true" /> : <FiEye className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#1ABC9C]"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#2A4A66] bg-[#E6EDF3] px-4 py-3 pr-11 text-sm text-[#0A2236] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#5F7389] transition hover:text-[#1ABC9C]"
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" aria-hidden="true" /> : <FiEye className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-md bg-[#1ABC9C] py-3 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
            >
              Create Account
            </button>
          </form>
        </section>

        <p className="mt-7 text-center text-sm text-[#8FA3B8]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#1ABC9C] transition hover:text-[#16A085]">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}
