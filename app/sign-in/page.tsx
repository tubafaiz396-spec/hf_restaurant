import Link from "next/link"
import { AuthForm } from "@/components/auth-form"

export default function SignInPage() {
  return <main className="auth-page"><section className="auth-panel"><Link className="brand" href="/"><span className="brand-mark">HF</span><span><strong>HF</strong> Restaurant</span></Link><p className="eyebrow">Welcome back</p><h1>Sign in to<br /><em>continue ordering.</em></h1><AuthForm mode="sign-in" /><p className="auth-switch">New to HF? <Link href="/sign-up">Create an account</Link></p></section></main>
}
