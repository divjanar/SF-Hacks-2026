import { useMemo, useState } from 'react'
import AuthPage from './AuthPage'
import MarketplacePage from './MarketplacePage'

const tradeListings = [
  {
    id: 1,
    title: 'Nintendo Switch OLED',
    category: 'Gaming',
    condition: 'Excellent',
    location: 'San Francisco',
    owner: 'Avery',
    wants: ['Mechanical keyboard', 'Steam gift card'],
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
    accent: '#73a942',
  },
]

const myInventory = [
  'Keychron K2 Keyboard',
  'JBL Flip Speaker',
  'Blue Yeti Nano Mic',
  'IKEA Desk Lamp',
  'Nintendo eShop $50 Card',
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
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [accounts, setAccounts] = useState([
    { name: 'Demo Trader', email: 'demo@tradeloop.com', password: 'demo1234' },
  ])
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [userName, setUserName] = useState('You')

  const [categoryFilter, setCategoryFilter] = useState('All')
  const [listings] = useState(tradeListings)
  const [chats, setChats] = useState(getSeededChats('You'))
  const [activeChatId, setActiveChatId] = useState(101)
  const [offerItem, setOfferItem] = useState(myInventory[0])
  const [offerMessage, setOfferMessage] = useState('')
  const [chatInput, setChatInput] = useState('')

  const categories = useMemo(
    () => ['All', ...new Set(listings.map((listing) => listing.category))],
    [listings],
  )

  const visibleListings = useMemo(() => {
    if (categoryFilter === 'All') {
      return listings
    }
    return listings.filter((listing) => listing.category === categoryFilter)
  }, [listings, categoryFilter])

  const activeChat = chats.find((chat) => chat.id === activeChatId)
  const activeListing = listings.find((listing) => listing.id === activeChat?.listingId)

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
    setChats(getSeededChats(account.name || 'You'))
    setActiveChatId(101)
    setAuthError('')
    setIsSignedIn(true)
  }

  const handleCreateAccount = (event) => {
    event.preventDefault()
    const name = authName.trim()
    const email = authEmail.trim().toLowerCase()

    if (!name || !email || !authPassword) {
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

    setAccounts((prev) => [...prev, { name, email, password: authPassword }])
    setAuthMode('signin')
    setAuthName('')
    setAuthPassword('')
    setConfirmPassword('')
    setAuthError('Account created. Sign in to continue.')
  }

  const startTradeChat = (listing) => {
    const existingChat = chats.find(
      (chat) => chat.peer === listing.owner && chat.listingId === listing.id,
    )

    if (existingChat) {
      setActiveChatId(existingChat.id)
      return
    }

    const newChatId = getNextChatId(chats)
    const newChat = {
      id: newChatId,
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

    setChats((prev) => [newChat, ...prev])
    setActiveChatId(newChatId)
  }

  const sendTradeOffer = (event) => {
    event.preventDefault()
    if (!activeChat || !offerMessage.trim()) {
      return
    }

    const newMessage = {
      id: getNextMessageId(activeChat.messages),
      from: userName,
      text: `Trade offer: ${offerItem}. Note: ${offerMessage.trim()}`,
      time: 'Now',
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
            }
          : chat,
      ),
    )
    setOfferMessage('')
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
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        authError={authError}
      />
    )
  }

  return (
    <MarketplacePage
      categories={categories}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      visibleListings={visibleListings}
      startTradeChat={startTradeChat}
      chats={chats}
      listings={listings}
      activeChatId={activeChatId}
      setActiveChatId={setActiveChatId}
      activeChat={activeChat}
      activeListing={activeListing}
      userName={userName}
      myInventory={myInventory}
      offerItem={offerItem}
      setOfferItem={setOfferItem}
      offerMessage={offerMessage}
      setOfferMessage={setOfferMessage}
      sendTradeOffer={sendTradeOffer}
      chatInput={chatInput}
      setChatInput={setChatInput}
      sendChatMessage={sendChatMessage}
    />
  )
}

export default App
