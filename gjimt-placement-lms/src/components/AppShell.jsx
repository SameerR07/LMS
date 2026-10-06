import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronRightRounded, CloseRounded, DarkModeRounded, KeyboardArrowDownRounded, LightModeRounded, MenuRounded, NotificationsNoneRounded, SearchRounded, SettingsRounded } from '@mui/icons-material'
import { sideNav } from '../config/modules'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { greetingName, initials } from '../lib/utils'
import ProfileMenu from './ProfileMenu'

const workspaceNav = sideNav.filter((item) => item.route !== '/reports')
const insightNav = sideNav.filter((item) => item.route === '/reports')

export default function AppShell({ children, title = 'Overview', subtitle = 'Placement Cell' }) {
  const { user, logout, isFirebaseConfigured } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchRef = useRef(null)
  const notificationRef = useRef(null)
  const profileRef = useRef(null)

  // Close the account / notification menus on a click outside them or on Escape.
  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return undefined
    const onPointer = (event) => {
      if (profileRef.current?.contains(event.target) || notificationRef.current?.contains(event.target)) return
      setProfileOpen(false); setNotificationsOpen(false)
    }
    const onKey = (event) => { if (event.key === 'Escape') { setProfileOpen(false); setNotificationsOpen(false) } }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onPointer); document.removeEventListener('keydown', onKey) }
  }, [profileOpen, notificationsOpen])

  // Press "/" anywhere (outside a text field) to jump into Quick find.
  useEffect(() => {
    const onKey = (event) => {
      const tag = event.target?.tagName
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && !event.target?.isContentEditable) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const searchResults = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return []
    return sideNav.filter((item) => item.label.toLowerCase().includes(term)).slice(0, 5)
  }, [search])

  const handleLogout = async () => { setProfileOpen(false); await logout(); navigate('/login', { replace: true }) }
  const go = (route) => { navigate(route); setSearch(''); setSidebarOpen(false); setProfileOpen(false) }
  const displayName = greetingName(user)

  const renderLink = (item) => {
    const Icon = item.icon
    return <NavLink key={item.route} to={item.route} end={item.route === '/' || item.route === '/students'} className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`} onClick={() => setSidebarOpen(false)}><Icon /><span>{item.label}</span></NavLink>
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <Link to="/" onClick={() => setSidebarOpen(false)} className="sidebar-brand-link">
            <span className="logo-plate"><img src="/gjimt-brand.png" alt="GJIMT — NAAC accredited" className="brand-logo" /></span>
            <span className="brand-product">Placement LMS</span>
          </Link>
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><CloseRounded /></button>
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav className="side-nav" aria-label="Main navigation">{workspaceNav.map(renderLink)}</nav>
        <div className="sidebar-label">Insights</div>
        <nav className="side-nav" aria-label="Insights">{insightNav.map(renderLink)}</nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-footer">
          <NavLink to="/settings" className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`} onClick={() => setSidebarOpen(false)}><SettingsRounded /><span>Settings</span></NavLink>
          <div className="sidebar-mini-note"><span className="live-dot" /><div><strong>Portal online</strong><small>GJIMT Placement Cell</small></div></div>
        </div>
      </aside>

      <main className="shell-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><MenuRounded /></button>
            <div className="topbar-heading">
              <p className="topbar-eyebrow"><span>GJIMT</span><ChevronRightRounded /><span>{subtitle}</span></p>
              <h1 className="topbar-title">{title}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="global-search">
              <SearchRounded />
              <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Jump to a module…" aria-label="Quick find" />
              <kbd>/</kbd>
              {searchResults.length > 0 && <div className="search-popover">{searchResults.map((result) => { const Icon = result.icon; return <button key={result.route} onClick={() => go(result.route)}><Icon /><span>{result.label}</span></button> })}</div>}
            </div>
            <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>{theme === 'light' ? <DarkModeRounded /> : <LightModeRounded />}</button>
            <div className="notification-wrap" ref={notificationRef}>
              <button className="icon-button" onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false) }} aria-label="Notifications"><NotificationsNoneRounded /><span className="notification-dot">3</span></button>
              {notificationsOpen && <div className="floating-menu notification-menu">
                <div className="floating-menu-head"><strong>Notifications</strong><span>3 new</span></div>
                <button onClick={() => setNotificationsOpen(false)}><span className="notif-chip orange">JD</span><div><strong>TechNova drive</strong><small>Eligibility list is ready.</small></div></button>
                <button onClick={() => setNotificationsOpen(false)}><span className="notif-chip blue">EV</span><div><strong>Industrial visit</strong><small>Faculty coordinator updated.</small></div></button>
                <button onClick={() => setNotificationsOpen(false)}><span className="notif-chip green">TA</span><div><strong>Alumni talk</strong><small>Speaker confirmed the slot.</small></div></button>
              </div>}
            </div>
            <div className="profile-wrap" ref={profileRef}>
              <button className="profile-trigger" onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false) }} aria-label="Your account" aria-expanded={profileOpen} aria-haspopup="dialog">
                {user?.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : <span className="avatar-fallback">{initials(user?.displayName || displayName)}</span>}
                <div className="profile-text"><strong>{displayName}</strong><span>{user?.providerId === 'demo' ? 'Demo account' : user?.providerId === 'local' ? 'Local account' : 'Placement Cell'}</span></div>
                <KeyboardArrowDownRounded />
              </button>
              {profileOpen && <ProfileMenu user={user} cloud={isFirebaseConfigured} theme={theme} onToggleTheme={toggleTheme} onOpenSettings={() => go('/settings')} onSignOut={handleLogout} />}
            </div>
          </div>
        </header>
        <section className="shell-content">{children}</section>
      </main>
    </div>
  )
}
