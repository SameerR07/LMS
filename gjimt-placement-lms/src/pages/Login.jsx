import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowForwardRounded, AutoAwesomeRounded, BadgeOutlined, CheckCircleRounded, EmailOutlined, LockRounded, ShieldRounded, VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { passwordStrength, signUpProblems } from '../lib/authHelpers'
import LoginRail from '../components/LoginRail'

const HEADINGS = {
  login: { title: 'Welcome back', text: 'Sign in to continue to your Placement LMS.' },
  signup: { title: 'Create your account', text: 'Join the GJIMT Placement LMS in under a minute.' },
}

function PasswordInput({ id, value, onChange, show, onToggle, placeholder, autoComplete, invalid }) {
  return (
    <div className={`input-shell ${invalid ? 'invalid' : ''}`}>
      <LockRounded />
      <input id={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} placeholder={placeholder} value={value} onChange={onChange} aria-invalid={invalid || undefined} required />
      <button type="button" className="input-action" onClick={onToggle} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <VisibilityOffRounded /> : <VisibilityRounded />}</button>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { user, signInEmail, signUpEmail, signInGoogle, resetPassword, isFirebaseConfigured } = useAuth()
  const { push } = useToast()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const switchMode = (next) => { setMode(next); setError(''); setTouched(false); setShowPassword(false); if (next !== 'signup') setConfirm('') }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signInEmail(email, password, remember)
      push('Welcome back — your workspace is ready.')
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your details.')
    } finally { setBusy(false) }
  }

  const problems = signUpProblems({ name, email, password, confirm })
  const strength = passwordStrength(password)

  const signUp = async (event) => {
    event.preventDefault()
    setTouched(true)
    setError('')
    if (Object.keys(problems).length) return
    setBusy(true)
    try {
      const { user: created, verificationSent } = await signUpEmail({ name, email, password, confirm, remember })
      push(`Welcome, ${created.displayName.split(' ')[0]} — your account is ready.`)
      if (verificationSent) push('We sent a verification link to your email.', 'info')
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Your account could not be created.')
    } finally { setBusy(false) }
  }

  const googleLogin = async () => {
    setError('')
    setBusy(true)
    try {
      const result = await signInGoogle(remember)
      if (result) navigate('/')
    } catch (err) {
      setError(err?.message || 'Google Login failed.')
    } finally { setBusy(false) }
  }

  const forgot = async () => {
    setError('')
    if (!email.trim()) { setError('Enter your email first, then use Forgot password.'); return }
    setBusy(true)
    try { await resetPassword(email); push('Password reset email sent. Check your inbox.') }
    catch (err) { setError(err?.message || 'Password reset could not be sent.') }
    finally { setBusy(false) }
  }

  const heading = HEADINGS[mode]
  const show = (field) => touched && problems[field]

  return (
    <div className="login-page">
      <div className="login-layout">
        <div className="login-card-shell">
          <section className="login-showcase" aria-label="About the GJIMT Placement LMS">
            <div className="login-brand-row">
              <span className="logo-plate"><img src="/gjimt-brand.png" alt="GJIMT — NAAC accredited" className="login-brand" /></span>
              <span className="brand-pill"><ShieldRounded /> Verified campus portal</span>
            </div>
            <div className="showcase-copy">
              <span className="showcase-kicker"><AutoAwesomeRounded /> Built for your placement journey</span>
              <h1>Learn. Prepare.<br /><em>Get placed.</em></h1>
              <p>One refined workspace for internships, placement drives, student records, industry connect and career-readiness activities.</p>
            </div>
            <div className="showcase-highlights">
              <div><strong>01</strong><span>Centralised student data</span></div>
              <div><strong>02</strong><span>Faster placement coordination</span></div>
              <div><strong>03</strong><span>Google &amp; secure sign-in</span></div>
            </div>
            <div className="showcase-footer"><span>Gian Jyoti Institute of Management &amp; Technology</span><span className="motto">Aspire · Achieve · Ascend</span></div>
          </section>

          <section className="login-form-panel">
            <div className="login-head">
              <span className="login-eyebrow">Placement Cell</span>
              <h2>{heading.title}</h2>
              <p>{heading.text}</p>
            </div>
            <div className="auth-tabs" role="tablist" aria-label="Sign-in options">
              <button role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Sign in</button>
              <button role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Create account</button>
            </div>

            {mode === 'login' && <form className="login-form" onSubmit={submit}>
              <label className="field-label" htmlFor="login-email">Login ID</label>
              <div className="input-shell"><EmailOutlined /><input id="login-email" type="email" autoComplete="username" placeholder="name@gjimt.ac.in" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} required /></div>
              <div className="password-row"><label className="field-label" htmlFor="login-password">Password</label><button type="button" className="forgot-link" onClick={forgot}>Forgot password?</button></div>
              <PasswordInput id="login-password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} show={showPassword} onToggle={() => setShowPassword((value) => !value)} placeholder="Enter your password" autoComplete="current-password" />
              <div className="remember-row"><label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>Remember me</span></label></div>
              {error && <div className="form-error" role="alert">{error}</div>}
              <button className="primary-login" disabled={busy} type="submit"><span>{busy ? 'Signing in…' : 'Sign in'}</span><ArrowForwardRounded /></button>
              <div className="divider"><span>or</span></div>
              <button className="google-login" type="button" onClick={googleLogin} disabled={busy}><GoogleMark /><span>Continue with Google</span></button>
              <p className="switch-auth">New to the Placement LMS? <button type="button" onClick={() => switchMode('signup')}>Create an account</button></p>
            </form>}

            {mode === 'signup' && <form className="login-form signup-form" onSubmit={signUp} noValidate>
              <label className="field-label" htmlFor="signup-name">Full name</label>
              <div className={`input-shell ${show('name') ? 'invalid' : ''}`}><BadgeOutlined /><input id="signup-name" autoComplete="name" placeholder="e.g. Simran Kaur" value={name} onChange={(e) => { setName(e.target.value); setError('') }} aria-invalid={Boolean(show('name')) || undefined} required /></div>
              {show('name') && <span className="field-hint error">{problems.name}</span>}

              <label className="field-label spaced" htmlFor="signup-email">Email</label>
              <div className={`input-shell ${show('email') ? 'invalid' : ''}`}><EmailOutlined /><input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} aria-invalid={Boolean(show('email')) || undefined} required /></div>
              {show('email') && <span className="field-hint error">{problems.email}</span>}

              <label className="field-label spaced" htmlFor="signup-password">Password</label>
              <PasswordInput id="signup-password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} show={showPassword} onToggle={() => setShowPassword((value) => !value)} placeholder="At least 8 characters" autoComplete="new-password" invalid={Boolean(show('password'))} />
              {password && <div className={`strength s${strength.score}`} aria-live="polite"><span className="strength-bars"><i /><i /><i /><i /></span><span>{strength.label} password</span></div>}
              <span className={`field-hint ${show('password') ? 'error' : ''}`}>{show('password') ? problems.password : 'Use 8+ characters with at least one letter and one number.'}</span>

              <label className="field-label spaced" htmlFor="signup-confirm">Confirm password</label>
              <PasswordInput id="signup-confirm" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError('') }} show={showPassword} onToggle={() => setShowPassword((value) => !value)} placeholder="Type it again" autoComplete="new-password" invalid={Boolean(show('confirm'))} />
              {show('confirm') && <span className="field-hint error">{problems.confirm}</span>}
              {!problems.confirm && confirm && !problems.password && <span className="field-hint ok"><CheckCircleRounded /> Passwords match</span>}

              <div className="remember-row"><label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>Keep me signed in</span></label></div>
              {error && <div className="form-error" role="alert">{error}</div>}
              <button className="primary-login" disabled={busy} type="submit"><span>{busy ? 'Creating account…' : 'Create account'}</span><ArrowForwardRounded /></button>
              <div className="divider"><span>or</span></div>
              <button className="google-login" type="button" onClick={googleLogin} disabled={busy}><GoogleMark /><span>Sign up with Google</span></button>
              <p className="switch-auth">Already have an account? <button type="button" onClick={() => switchMode('login')}>Sign in</button></p>
              {!isFirebaseConfigured && <p className="secure-note">Your account is saved on this device. Your password is never stored as plain text.</p>}
            </form>}

            <div className="login-bottom-note"><span>© {new Date().getFullYear()} GJIMT Placement Cell</span></div>
          </section>
        </div>
        <LoginRail />
      </div>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg className="google-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}
