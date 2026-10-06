import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  getRedirectResult,
  updateProfile,
} from 'firebase/auth'
import { auth, demoEmail, demoPassword, isFirebaseConfigured } from '../lib/firebase'
import { friendlyAuthError, signUpProblems } from '../lib/authHelpers'
import { createLocalAccount, verifyLocalAccount } from '../lib/localAccounts'
import { schedulePublicStatsRefresh } from '../lib/dataStore'

// Session object for an account created in this browser (local mode, no Firebase)
const localSessionUser = (account) => ({
  uid: account.uid,
  displayName: account.name,
  email: account.email,
  photoURL: '',
  providerId: 'local',
  createdAt: account.createdAt,
  signedInAt: new Date().toISOString(),
})

const DEMO_SESSION_KEY = 'gjimt:lms:demo-session'
const AuthContext = createContext(null)

const getStoredDemoUser = () => {
  const raw = localStorage.getItem(DEMO_SESSION_KEY) || sessionStorage.getItem(DEMO_SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

const saveDemoSession = (user, remember) => {
  const payload = JSON.stringify(user)
  localStorage.removeItem(DEMO_SESSION_KEY)
  sessionStorage.removeItem(DEMO_SESSION_KEY)
  ;(remember ? localStorage : sessionStorage).setItem(DEMO_SESSION_KEY, payload)
}

const clearDemoSession = () => {
  localStorage.removeItem(DEMO_SESSION_KEY)
  sessionStorage.removeItem(DEMO_SESSION_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let unsubscribe = () => {}

    if (!isFirebaseConfigured) {
      setUser(getStoredDemoUser())
      setLoading(false)
      return undefined
    }

    unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
      if (nextUser) schedulePublicStatsRefresh(3000) // keep the login-page numbers current for existing data
    })

    getRedirectResult(auth).catch((error) => {
      if (error?.code !== 'auth/no-auth-event') {
        setAuthError(error?.message || 'Google sign-in could not be completed.')
      }
    })

    return () => unsubscribe()
  }, [])

  const signInEmail = async (email, password, remember = true) => {
    setAuthError('')

    if (!isFirebaseConfigured) {
      if (email.trim().toLowerCase() === demoEmail.toLowerCase() && password === demoPassword) {
        const demoUser = {
          uid: 'demo-placement-cell',
          displayName: 'Placement Cell Demo',
          email: demoEmail,
          photoURL: '',
          providerId: 'demo',
          signedInAt: new Date().toISOString(),
        }
        saveDemoSession(demoUser, remember)
        setUser(demoUser)
        return demoUser
      }
      // Accounts created with "Create account" while Firebase is not connected
      const account = await verifyLocalAccount(email, password)
      const localUser = localSessionUser(account)
      saveDemoSession(localUser, remember)
      setUser(localUser)
      return localUser
    }

    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
      const result = await signInWithEmailAndPassword(auth, email.trim(), password)
      setUser(result.user)
      return result.user
    } catch (error) {
      throw new Error(friendlyAuthError(error, 'Sign-in failed. Please check your details.'))
    }
  }

  // Create a new account — Firebase when connected, otherwise an account kept in this browser.
  const signUpEmail = async ({ name, email, password, confirm = password, remember = true }) => {
    setAuthError('')
    const problems = signUpProblems({ name, email, password, confirm })
    const firstProblem = Object.values(problems)[0]
    if (firstProblem) throw new Error(firstProblem)
    const cleanName = name.trim().replace(/\s+/g, ' ')

    if (!isFirebaseConfigured) {
      if (email.trim().toLowerCase() === demoEmail.toLowerCase()) throw new Error('This email is reserved. Please use a different email.')
      const account = await createLocalAccount({ name: cleanName, email, password })
      const localUser = localSessionUser(account)
      saveDemoSession(localUser, remember)
      setUser(localUser)
      return { user: localUser, verificationSent: false }
    }

    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(result.user, { displayName: cleanName })
      let verificationSent = false
      try { await sendEmailVerification(result.user); verificationSent = true } catch { /* account still works; email can be re-sent later */ }
      const fresh = { ...auth.currentUser, displayName: cleanName } // new object so the header shows the name at once
      setUser(fresh)
      return { user: fresh, verificationSent }
    } catch (error) {
      throw new Error(friendlyAuthError(error, 'Your account could not be created.'))
    }
  }

  const signInGoogle = async (remember = true) => {
    setAuthError('')
    if (!isFirebaseConfigured) {
      throw new Error('Google Login is ready in the code but needs your Firebase project configuration first.')
    }

    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
      return result.user
    } catch (error) {
      if (error?.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider)
        return null
      }
      throw new Error(friendlyAuthError(error, 'Google sign-in failed.'))
    }
  }

  const resetPassword = async (email) => {
    setAuthError('')
    if (!isFirebaseConfigured) {
      throw new Error('Password reset by email works once Firebase is connected. For now, create a new account.')
    }
    try { await sendPasswordResetEmail(auth, email.trim()) } catch (error) { throw new Error(friendlyAuthError(error, 'Password reset could not be sent.')) }
  }

  const logout = async () => {
    clearDemoSession()
    if (isFirebaseConfigured) {
      await signOut(auth)
    }
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      isFirebaseConfigured,
      demoEmail,
      demoPassword,
      signInEmail,
      signUpEmail,
      signInGoogle,
      resetPassword,
      logout,
    }),
    [user, loading, authError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
