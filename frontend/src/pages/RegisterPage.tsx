import { useState } from 'react'
import type { FormEvent } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../lib/apiError'
import { register } from '../lib/authApi'

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const cleanedFirstName = firstName.trim()
    const cleanedLastName = lastName.trim()
    const cleanedEmail = email.trim()

    if (!cleanedFirstName || !cleanedLastName || !cleanedEmail || !password || !confirmPassword) {
      setErrorMessage('Tous les champs sont obligatoires.')
      return
    }

    if (!PASSWORD_RULE.test(password)) {
      setErrorMessage(
        'Le mot de passe doit contenir au moins 8 caracteres, une majuscule, une minuscule et un chiffre.',
      )
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        email: cleanedEmail,
        password,
        firstName: cleanedFirstName,
        lastName: cleanedLastName,
      })
      navigate('/login', { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

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

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#1ABC9C]"
                >
                  First Name
                </label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="Alex"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  className="w-full rounded-md border border-[#2A4A66] bg-[#E6EDF3] px-4 py-3 text-sm text-[#0A2236] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#1ABC9C]"
                >
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Carter"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  className="w-full rounded-md border border-[#2A4A66] bg-[#E6EDF3] px-4 py-3 text-sm text-[#0A2236] placeholder:text-[#5F7389] outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/35"
                />
              </div>
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
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
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
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

            {errorMessage ? (
              <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-md bg-[#1ABC9C] py-3 text-sm font-semibold text-[#020F1F] transition hover:bg-[#16A085] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
