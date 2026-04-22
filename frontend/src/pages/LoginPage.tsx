import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

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
          <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
          <p className="mt-1 text-sm text-[#B8C5D0]">
            Enter your credentials to access the suite
          </p>

          <form className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#1ABC9C]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="coach@proelite.com"
                className="w-full rounded-md border border-[#2A4A66] bg-[#E6EDF3] px-4 py-3 text-sm text-[#0A2236] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
              />
            </div>

            <div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1ABC9C]"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
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
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-[#1ABC9C] transition hover:text-[#16A085]"
              >
                Forgot?
              </button>
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-md bg-[#1ABC9C] py-3 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085]"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#1F3A52]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8FA3B8]">
              Or continue with
            </span>
            <span className="h-px flex-1 bg-[#1F3A52]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-md border border-[#1F3A52] bg-[#0A2236] px-4 py-2.5 text-sm text-[#E6EDF3] transition hover:border-[#2A4A66] hover:bg-[#12324D]"
            >
              Google
            </button>
            <button
              type="button"
              className="rounded-md border border-[#1F3A52] bg-[#0A2236] px-4 py-2.5 text-sm text-[#E6EDF3] transition hover:border-[#2A4A66] hover:bg-[#12324D]"
            >
              Apple
            </button>
          </div>
        </section>

        <p className="mt-7 text-center text-sm text-[#8FA3B8]">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-[#1ABC9C] transition hover:text-[#16A085]">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}
