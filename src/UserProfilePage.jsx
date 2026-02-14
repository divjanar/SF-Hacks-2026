import { useMemo, useState } from 'react'
import './UserProfilePage.css'

function UserProfilePage({
  userName,
  userEmail,
  chatsCount,
  activeTradesCount,
  onBackToMarketplace,
  onSaveProfile,
  currentPlan,
  onUpgradeToPro,
  darkModeOn,
  onToggleDarkMode,
}) {
  const [activeSection, setActiveSection] = useState('about')
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [draftName, setDraftName] = useState(userName)
  const [draftEmail, setDraftEmail] = useState(userEmail)
  const [isPrivateProfile, setIsPrivateProfile] = useState(false)
  const [chatNotificationsOn, setChatNotificationsOn] = useState(true)
  const [locationSharingOn, setLocationSharingOn] = useState(true)
  const [securityNotice, setSecurityNotice] = useState('')
  const [preferencesNotice, setPreferencesNotice] = useState('')
  const [planNotice, setPlanNotice] = useState('')
  const [compactCardsOn, setCompactCardsOn] = useState(false)
  const [autoTranslateOn, setAutoTranslateOn] = useState(false)
  const [tradeRadius, setTradeRadius] = useState('10 mi')
  const [preferredLanguage, setPreferredLanguage] = useState('English')

  const sections = useMemo(
    () => [
      {
        id: 'about',
        label: 'About',
        title: 'About Your Account',
        content: [
          `Name: ${userName}`,
          `Email: ${userEmail}`,
          `Open chats: ${chatsCount}`,
          `Active listings: ${activeTradesCount}`,
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        title: 'Account Settings',
        content: [],
      },
      {
        id: 'preferences',
        label: 'Preferences',
        title: 'Trading Preferences',
        content: [],
      },
      {
        id: 'plans',
        label: 'Plans',
        title: 'Membership Plans',
        content: [],
      },
    ],
    [activeTradesCount, chatsCount, userEmail, userName],
  )

  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0]

  const startEditAbout = () => {
    setDraftName(userName)
    setDraftEmail(userEmail)
    setIsEditingAbout(true)
  }

  const cancelEditAbout = () => {
    setDraftName(userName)
    setDraftEmail(userEmail)
    setIsEditingAbout(false)
  }

  const saveAbout = () => {
    const name = draftName.trim() || userName
    const email = draftEmail.trim() || userEmail
    onSaveProfile({ name, email })
    setIsEditingAbout(false)
  }

  const handlePasswordReset = () => {
    setSecurityNotice('Password reset link sent to your email.')
  }

  const handleEnableTwoFactor = () => {
    setSecurityNotice('Two-factor authentication enabled.')
  }

  const toggleDarkMode = () => {
    onToggleDarkMode()
    setPreferencesNotice(`Dark mode ${darkModeOn ? 'disabled' : 'enabled'}.`)
  }

  const cycleTradeRadius = () => {
    const options = ['5 mi', '10 mi', '25 mi', '50 mi']
    const index = options.indexOf(tradeRadius)
    const next = options[(index + 1) % options.length]
    setTradeRadius(next)
    setPreferencesNotice(`Trade radius set to ${next}.`)
  }

  const cycleLanguage = () => {
    const options = ['English', 'Spanish', 'French', 'Japanese']
    const index = options.indexOf(preferredLanguage)
    const next = options[(index + 1) % options.length]
    setPreferredLanguage(next)
    setPreferencesNotice(`Preferred language set to ${next}.`)
  }

  const toggleCompactCards = () => {
    setCompactCardsOn((prev) => !prev)
    setPreferencesNotice(`Compact cards ${compactCardsOn ? 'disabled' : 'enabled'}.`)
  }

  const toggleAutoTranslate = () => {
    setAutoTranslateOn((prev) => !prev)
    setPreferencesNotice(`Auto-translate ${autoTranslateOn ? 'disabled' : 'enabled'}.`)
  }

  return (
    <div className="profile-page-wrap">
      <section className="profile-card">
        <div className="profile-header">
          <div>
            <p className="profile-label">User Profile</p>
            <h1>{userName}</h1>
            <p className="profile-subtitle">Manage your account and trading setup</p>
          </div>
          <button type="button" onClick={onBackToMarketplace}>
            Back to Marketplace
          </button>
        </div>

        <div className="profile-layout">
          <aside className="profile-menu" aria-label="Profile menu">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={activeSection === section.id ? 'active' : ''}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </aside>

          <article className="profile-content-card">
            <h2>{currentSection.title}</h2>
            {activeSection === 'about' ? (
              <div className="about-editor">
                <label>
                  Name
                  <input
                    type="text"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    disabled={!isEditingAbout}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={draftEmail}
                    onChange={(event) => setDraftEmail(event.target.value)}
                    disabled={!isEditingAbout}
                  />
                </label>
                <p className="about-meta">
                  Open chats: {chatsCount} · Active listings: {activeTradesCount}
                </p>
                <div className="about-actions">
                  {isEditingAbout ? (
                    <>
                      <button type="button" className="secondary" onClick={cancelEditAbout}>
                        Cancel
                      </button>
                      <button type="button" onClick={saveAbout}>
                        Save
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={startEditAbout}>
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ) : activeSection === 'settings' ? (
              <div className="settings-panel">
                <div className="settings-row">
                  <div>
                    <h3>Privacy</h3>
                    <p>Control whether your profile is visible to other traders.</p>
                  </div>
                  <button type="button" onClick={() => setIsPrivateProfile((prev) => !prev)}>
                    {isPrivateProfile ? 'Private' : 'Public'}
                  </button>
                </div>

                <div className="settings-row">
                  <div>
                    <h3>Chat Notifications</h3>
                    <p>Get notified for new chat messages and trade offers.</p>
                  </div>
                  <button type="button" onClick={() => setChatNotificationsOn((prev) => !prev)}>
                    {chatNotificationsOn ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="settings-row">
                  <div>
                    <h3>Location Sharing</h3>
                    <p>Share your general area for better local matching.</p>
                  </div>
                  <button type="button" onClick={() => setLocationSharingOn((prev) => !prev)}>
                    {locationSharingOn ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="settings-actions">
                  <button type="button" onClick={handlePasswordReset}>
                    Reset Password
                  </button>
                  <button type="button" onClick={handleEnableTwoFactor}>
                    Enable 2FA
                  </button>
                </div>

                {securityNotice && <p className="settings-notice">{securityNotice}</p>}
              </div>
            ) : activeSection === 'preferences' ? (
              <div className="settings-panel">
                <div className="settings-row">
                  <div>
                    <h3>Dark Mode</h3>
                    <p>Switch between light and dark interface themes.</p>
                  </div>
                  <button type="button" onClick={toggleDarkMode}>
                    {darkModeOn ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="settings-row">
                  <div>
                    <h3>Trade Radius</h3>
                    <p>Limit discovery to a distance that works for you.</p>
                  </div>
                  <button type="button" onClick={cycleTradeRadius}>
                    {tradeRadius}
                  </button>
                </div>
                <div className="settings-row">
                  <div>
                    <h3>Language</h3>
                    <p>Set your preferred language for marketplace text.</p>
                  </div>
                  <button type="button" onClick={cycleLanguage}>
                    {preferredLanguage}
                  </button>
                </div>
                <div className="settings-row">
                  <div>
                    <h3>Compact Listing Cards</h3>
                    <p>Use denser listing cards to view more products at once.</p>
                  </div>
                  <button type="button" onClick={toggleCompactCards}>
                    {compactCardsOn ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="settings-row">
                  <div>
                    <h3>Auto-Translate Chats</h3>
                    <p>Automatically translate incoming chat messages.</p>
                  </div>
                  <button type="button" onClick={toggleAutoTranslate}>
                    {autoTranslateOn ? 'On' : 'Off'}
                  </button>
                </div>
                {preferencesNotice && <p className="settings-notice">{preferencesNotice}</p>}
              </div>
            ) : activeSection === 'plans' ? (
              <div className="plans-grid">
                <article className={`plan-card ${currentPlan === 'free' ? 'current' : ''}`}>
                  <div className="plan-head">
                    <h3>Free</h3>
                    {currentPlan === 'free' && <span>Current Plan</span>}
                  </div>
                  <ul>
                    <li>Basic product listings</li>
                    <li>User-to-user chat access</li>
                    <li>Local trade discovery</li>
                    <li>Standard profile controls</li>
                  </ul>
                </article>

                <button
                  type="button"
                  className={`plan-card plan-card-pro ${currentPlan === 'pro' ? 'current' : ''}`}
                  onClick={() => {
                    if (currentPlan === 'pro') {
                      setPlanNotice('You are already on Pro plan.')
                      return
                    }
                    onUpgradeToPro()
                    setPlanNotice('Pro plan activated. You now have unlimited swipes.')
                  }}
                >
                  <div className="plan-head">
                    <h3>
                      Pro{' '}
                      <span className="plan-crown" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                          <path d="M3 18h18l-1.6-8.3-4.5 3.2L12 5l-2.9 7.9-4.5-3.2L3 18zm1.8 2h14.4v1.5H4.8V20z" />
                        </svg>
                      </span>
                    </h3>
                    {currentPlan === 'pro' && <span>Current Plan</span>}
                  </div>
                  <ul>
                    <li>Everything in Free</li>
                    <li>Priority listing visibility</li>
                    <li>Advanced filter and match tools</li>
                    <li>Pro badge on profile</li>
                  </ul>
                </button>
              </div>
            ) : (
              <ul>
                {currentSection.content.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {activeSection === 'plans' && planNotice && <p className="settings-notice">{planNotice}</p>}
          </article>
        </div>
      </section>
    </div>
  )
}

export default UserProfilePage
