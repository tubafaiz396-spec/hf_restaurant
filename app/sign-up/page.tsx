import Link from "next/link"
import { AuthForm } from "@/components/auth-form"

export default function SignUpPage() {
  return <main className="auth-page"><section className="auth-panel"><Link className="brand" href="/"><span className="brand-mark">HF</span><span><strong>HF</strong> Restaurant</span></Link><p className="eyebrow">Join the table</p><h1>Create your<br /><em>HF account.</em></h1><AuthForm mode="sign-up" /><p className="auth-switch">Already have an account? <Link href="/sign-in">Sign in</Link></p></section></main>
}
