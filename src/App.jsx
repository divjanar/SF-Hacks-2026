import { useEffect, useMemo, useState } from 'react'
import AuthPage from './AuthPage'
import MarketplacePage from './MarketplacePage'
import UserProfilePage from './UserProfilePage'
import SwipePage from './SwipePage'
import OwnerProductPage from './OwnerProductPage'
import CreatePostPage from './CreatePostPage'

const tradeListings = [
  {
    id: 1,
    title: 'Nintendo Switch OLED',
    category: 'Gaming',
    condition: 'Excellent',
    location: 'San Francisco',
    owner: 'Avery',
    wants: ['Mechanical keyboard', 'Steam gift card'],
    price: 280,
    accent: '#73a942',
  },
  {
    id: 2,
    title: 'Polaroid Now+',
    category: 'Photography',
    condition: 'Like New',
    location: 'Oakland',
    owner: 'Mina',
    wants: ['Portable speaker', 'Vinyl records'],
    price: 140,
    accent: '#a3b18a',
  },
  {
    id: 3,
    title: 'Yamaha Acoustic Guitar',
    category: 'Music',
    condition: 'Good',
    location: 'Berkeley',
    owner: 'Noah',
    wants: ['Studio microphone', 'Midi controller'],
    price: 190,
    accent: '#73a942',
  },
  {
    id: 4,
    title: 'Standing Desk Converter',
    category: 'Home Office',
    condition: 'Great',
    location: 'San Jose',
    owner: 'Eli',
    wants: ['Ergonomic chair', 'Desk lamp'],
    price: 160,
    accent: '#a3b18a',
  },
  {
    id: 5,
    title: 'Air Fryer (5qt)',
    category: 'Kitchen',
    condition: 'Used',
    location: 'Daly City',
    owner: 'Sana',
    wants: ['Blender', 'Meal prep containers'],
    price: 95,
    accent: '#73a942',
  },
]

const getSeededChats = (currentUser) => [
  {
    id: 101,
    peer: 'Mina',
    listingId: 2,
    messages: [
      { id: 1, from: 'Mina', text: 'Hey! Still looking to trade the Polaroid?', time: '9:41 AM' },
      { id: 2, from: currentUser, text: 'Yes, I can offer a JBL Flip Speaker.', time: '9:43 AM' },
      { id: 3, from: 'Mina', text: 'That works. Can we meet in Oakland this weekend?', time: '9:46 AM' },
    ],
  },
  {
    id: 102,
    peer: 'Noah',
    listingId: 3,
    messages: [
      { id: 1, from: 'Noah', text: 'Do you have any midi controllers for trade?', time: '8:10 AM' },
      { id: 2, from: currentUser, text: 'I have one, plus a mic if needed.', time: '8:12 AM' },
    ],
  },
]

const getNextChatId = (chatList) => chatList.reduce((max, chat) => Math.max(max, chat.id), 0) + 1

const getNextMessageId = (messageList) =>
  messageList.reduce((max, message) => Math.max(max, message.id), 0) + 1

function App() {
  const freeSwipeLimit = 10
  const [darkModeOn, setDarkModeOn] = useState(() => localStorage.getItem('darkMode') === 'on')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [accounts, setAccounts] = useState([
    {
      name: 'Demo Trader',
      email: 'demo@tradeloop.com',
      password: 'demo1234',
      location: 'San Francisco, CA',
    },
  ])
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authLocation, setAuthLocation] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [userName, setUserName] = useState('You')
  const [userEmail, setUserEmail] = useState('demo@tradeloop.com')
  const [userLocation, setUserLocation] = useState('San Francisco, CA')
  const [userPlan, setUserPlan] = useState('free')
  const [postsPaused, setPostsPaused] = useState(false)
  const [profileStartSection, setProfileStartSection] = useState('about')
  const [activePage, setActivePage] = useState('marketplace')
  const [swipesUsed, setSwipesUsed] = useState(0)
  const [selectedSwipeProduct, setSelectedSwipeProduct] = useState(null)

  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [listings, setListings] = useState(tradeListings)
  const [chats, setChats] = useState(getSeededChats('You'))
  const [activeChatId, setActiveChatId] = useState(101)
  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', darkModeOn)
    localStorage.setItem('darkMode', darkModeOn ? 'on' : 'off')
  }, [darkModeOn])

  const categories = useMemo(
    () => ['All', ...new Set(listings.map((listing) => listing.category))],
    [listings],
  )

  const visibleListings = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    return listings.filter((listing) => {
      const isUserPost = listing.createdBy === userEmail || listing.owner === userName
      if (postsPaused && isUserPost) {
        return false
      }
      const categoryMatch = categoryFilter === 'All' || listing.category === categoryFilter
      const searchMatch =
        !normalized ||
        listing.title.toLowerCase().includes(normalized) ||
        listing.category.toLowerCase().includes(normalized) ||
        listing.owner.toLowerCase().includes(normalized)
      return categoryMatch && searchMatch
    })
  }, [listings, categoryFilter, searchQuery, postsPaused, userEmail, userName])

  const activeChat = chats.find((chat) => chat.id === activeChatId)
  const activeListing = listings.find((listing) => listing.id === activeChat?.listingId)

  const buildOfferCard = (itemTitle) => {
    const ownedMatch = listings.find(
      (listing) =>
        (listing.createdBy === userEmail || listing.owner === userName) && listing.title === itemTitle,
    )
    const fallbackMatch = listings.find((listing) => listing.title === itemTitle)
    const selected = ownedMatch ?? fallbackMatch

    if (!selected) {
      return null
    }

    return {
      id: selected.id,
      title: selected.title,
      category: selected.category,
      condition: selected.condition,
      location: selected.location,
      price: selected.price,
      photo: selected.photo,
      accent: selected.accent,
    }
  }

  const switchAuthMode = (mode) => {
    setAuthMode(mode)
    setAuthError('')
  }

  const handleSignIn = (event) => {
    event.preventDefault()
    const email = authEmail.trim().toLowerCase()
    const account = accounts.find((item) => item.email.toLowerCase() === email)

    if (!account || account.password !== authPassword) {
      setAuthError('Invalid email or password.')
      return
    }

    setUserName(account.name || 'You')
    setUserEmail(account.email || 'demo@tradeloop.com')
    setUserLocation(account.location || 'San Francisco, CA')
    setPostsPaused(false)
    setChats(getSeededChats(account.name || 'You'))
    setActiveChatId(101)
    setActivePage('marketplace')
    setAuthError('')
    setIsSignedIn(true)
  }

  const handleCreateAccount = (event) => {
    event.preventDefault()
    const name = authName.trim()
    const email = authEmail.trim().toLowerCase()
    const location = authLocation.trim()

    if (!name || !email || !location || !authPassword) {
      setAuthError('Please fill in all fields.')
      return
    }

    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.')
      return
    }

    if (authPassword !== confirmPassword) {
      setAuthError('Passwords do not match.')
      return
    }

    const exists = accounts.some((account) => account.email.toLowerCase() === email)
    if (exists) {
      setAuthError('An account with this email already exists.')
      return
    }

    setAccounts((prev) => [...prev, { name, email, password: authPassword, location }])
    setAuthMode('signin')
    setAuthName('')
    setAuthLocation('')
    setAuthPassword('')
    setConfirmPassword('')
    setAuthError('Account created. Sign in to continue.')
  }

  const sendInitialTradeOffer = ({ listing, item, note }) => {
    const existingChat = chats.find(
      (chat) => chat.peer === listing.owner && chat.listingId === listing.id,
    )

    let targetChat = existingChat
    let nextChats = chats

    if (!targetChat) {
      const newChat = {
        id: getNextChatId(chats),
        peer: listing.owner,
        listingId: listing.id,
        messages: [
          {
            id: 1,
            from: listing.owner,
            text: `Hi! I saw you're interested in trading for my ${listing.title}.`,
            time: 'Now',
          },
        ],
      }
      targetChat = newChat
      nextChats = [newChat, ...chats]
    }

    const normalizedNote = note.trim() || 'Interested in trading.'
    const tradeOfferMessage = {
      id: getNextMessageId(targetChat.messages),
      from: userName,
      text: `Trade offer: ${item}. Note: ${normalizedNote}`,
      time: 'Now',
      tradeOffer: buildOfferCard(item),
    }

    nextChats = nextChats.map((chat) =>
      chat.id === targetChat.id
        ? {
            ...chat,
            messages: [...chat.messages, tradeOfferMessage],
          }
        : chat,
    )

    setChats(nextChats)
    setActiveChatId(targetChat.id)
  }

  const sendChatMessage = (event) => {
    event.preventDefault()
    if (!activeChat || !chatInput.trim()) {
      return
    }

    const outgoing = {
      id: getNextMessageId(activeChat.messages),
      from: userName,
      text: chatInput.trim(),
      time: 'Now',
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [...chat.messages, outgoing],
            }
          : chat,
      ),
    )
    setChatInput('')
  }

  const openUserProfile = () => {
    setProfileStartSection('about')
    setActivePage('profile')
  }

  const openMembershipPlans = () => {
    setProfileStartSection('plans')
    setActivePage('profile')
  }

  const openSwipePage = () => {
    setActivePage('swipe')
  }

  const openOwnerProductPage = (product) => {
    setSelectedSwipeProduct(product)
    setActivePage('owner-product')
  }

  const openCreatePostPage = () => {
    setActivePage('create-post')
  }

  const backToMarketplace = () => {
    setActivePage('marketplace')
  }

  const saveUserProfile = ({ name, email, location }) => {
    setUserName(name)
    setUserEmail(email)
    setUserLocation(location)
  }

  const upgradeToPro = () => {
    setUserPlan('pro')
  }

  const createListingPost = (postData) => {
    const nextId = listings.reduce((max, listing) => Math.max(max, listing.id), 0) + 1
    const accents = ['#73a942', '#a3b18a', '#9fc5e8', '#84a98c', '#f4a261']
    const newListing = {
      id: nextId,
      accent: accents[nextId % accents.length],
      createdBy: userEmail,
      ...postData,
      wants: postData.wants.length ? postData.wants : ['Open to offers'],
    }
    setListings((prev) => [newListing, ...prev])
    setCategoryFilter('All')
    setSearchQuery('')
    setActivePage('marketplace')
  }

  const userPosts = useMemo(
    () =>
      listings.filter((listing) => listing.createdBy === userEmail || listing.owner === userName),
    [listings, userEmail, userName],
  )

  const userPostedItems = useMemo(
    () => [...new Set(userPosts.map((post) => post.title).filter(Boolean))],
    [userPosts],
  )

  const deleteUserPost = (postId) => {
    setListings((prev) => prev.filter((listing) => listing.id !== postId))

    setChats((prev) => {
      const nextChats = prev.filter((chat) => chat.listingId !== postId)
      if (!nextChats.some((chat) => chat.id === activeChatId)) {
        setActiveChatId(nextChats[0]?.id ?? null)
      }
      return nextChats
    })
  }

  if (!isSignedIn) {
    return (
      <AuthPage
        authMode={authMode}
        switchAuthMode={switchAuthMode}
        handleSignIn={handleSignIn}
        handleCreateAccount={handleCreateAccount}
        authName={authName}
        setAuthName={setAuthName}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authLocation={authLocation}
        setAuthLocation={setAuthLocation}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        authError={authError}
      />
    )
  }

  if (activePage === 'profile') {
    return (
      <UserProfilePage
        initialSection={profileStartSection}
        userName={userName}
        userEmail={userEmail}
        userLocation={userLocation}
        chatsCount={chats.length}
        activeTradesCount={postsPaused ? 0 : userPosts.length}
        userPosts={userPosts}
        onDeletePost={deleteUserPost}
        onBackToMarketplace={backToMarketplace}
        onSaveProfile={saveUserProfile}
        currentPlan={userPlan}
        onUpgradeToPro={upgradeToPro}
        postsPaused={postsPaused}
        onTogglePostVisibility={() => setPostsPaused((prev) => !prev)}
        darkModeOn={darkModeOn}
        onToggleDarkMode={() => setDarkModeOn((prev) => !prev)}
      />
    )
  }

  if (activePage === 'swipe') {
    return (
      <SwipePage
        userPlan={userPlan}
        swipesUsed={swipesUsed}
        freeSwipeLimit={freeSwipeLimit}
        onConsumeSwipe={() => setSwipesUsed((prev) => prev + 1)}
        onBackToMarketplace={backToMarketplace}
        onSelectProduct={openOwnerProductPage}
      />
    )
  }

  if (activePage === 'owner-product') {
    return (
      <OwnerProductPage
        product={selectedSwipeProduct}
        onBackToSwipe={openSwipePage}
        onBackToMarketplace={backToMarketplace}
      />
    )
  }

  if (activePage === 'create-post') {
    return (
      <CreatePostPage
        userName={userName}
        onBackToMarketplace={backToMarketplace}
        onCreatePost={createListingPost}
      />
    )
  }

  return (
    <MarketplacePage
      visibleListings={visibleListings}
      onConsumeSwipe={() => setSwipesUsed((prev) => prev + 1)}
      onSendInitialTradeOffer={sendInitialTradeOffer}
      chats={chats}
      listings={listings}
      activeChatId={activeChatId}
      setActiveChatId={setActiveChatId}
      activeChat={activeChat}
      activeListing={activeListing}
      userName={userName}
      myInventory={userPostedItems}
      chatInput={chatInput}
      setChatInput={setChatInput}
      sendChatMessage={sendChatMessage}
      onOpenProfile={openUserProfile}
      onOpenMembershipPlans={openMembershipPlans}
      onOpenSwipe={openSwipePage}
      onOpenCreatePost={openCreatePostPage}
      userPlan={userPlan}
      swipesUsed={swipesUsed}
      freeSwipeLimit={freeSwipeLimit}
    />
  )
}

export default App
