"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const isSignUp = mode === "sign-up"

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setPending(true)
    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password })
    setPending(false)
    if (result.error) {
      setError("We couldn&apos;t complete that request. Check your details and try again.")
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {isSignUp && <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>}
      <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
      <label>Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="button button-dark full" disabled={pending} type="submit">{pending ? "Please wait…" : isSignUp ? "Create account" : "Sign in"} <ArrowRight size={16} /></button>
    </form>
  )
}
