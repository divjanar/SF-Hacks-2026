import { useMemo, useState } from 'react'
import './App.css'

const currentUser = 'You'

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

const seededChats = [
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

function App() {
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [listings] = useState(tradeListings)
  const [chats, setChats] = useState(seededChats)
  const [activeChatId, setActiveChatId] = useState(seededChats[0].id)
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

  const startTradeChat = (listing) => {
    const existingChat = chats.find(
      (chat) => chat.peer === listing.owner && chat.listingId === listing.id,
    )

    if (existingChat) {
      setActiveChatId(existingChat.id)
      return
    }

    const newChatId = Date.now()
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
      id: Date.now(),
      from: currentUser,
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
      id: Date.now(),
      from: currentUser,
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

  return (
    <div className="trade-app">
      <header className="hero">
        <p className="eyebrow">Barter</p>
        <h1>Exchange products with people nearby</h1>
        <p>
          List what you have, show what you want, and negotiate directly through chat before
          meeting.
        </p>
      </header>

      <main className="layout">
        <section className="marketplace panel">
          <div className="panel-header">
            <h2>Available Trades</h2>
            <div className="filter-row">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`chip ${categoryFilter === category ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="listing-grid">
            {visibleListings.map((listing) => (
              <article className="listing-card" key={listing.id}>
                <div className="listing-banner" style={{ backgroundColor: listing.accent }}>
                  <span>{listing.category}</span>
                </div>
                <div className="listing-content">
                  <h3>{listing.title}</h3>
                  <p>
                    <strong>Owner:</strong> {listing.owner}
                  </p>
                  <p>
                    <strong>Condition:</strong> {listing.condition}
                  </p>
                  <p>
                    <strong>Location:</strong> {listing.location}
                  </p>
                  <p>
                    <strong>Wants:</strong> {listing.wants.join(', ')}
                  </p>
                  <button type="button" onClick={() => startTradeChat(listing)}>
                    Start Chat for Trade
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="chat panel">
          <div className="chat-sidebar">
            <h2>Chats</h2>
            <ul>
              {chats.map((chat) => {
                const listing = listings.find((item) => item.id === chat.listingId)
                return (
                  <li key={chat.id}>
                    <button
                      className={`chat-thread ${activeChatId === chat.id ? 'selected' : ''}`}
                      onClick={() => setActiveChatId(chat.id)}
                      type="button"
                    >
                      <span>{chat.peer}</span>
                      <small>{listing?.title}</small>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="chat-main">
            {activeChat ? (
              <>
                <div className="chat-header">
                  <h3>Trade with {activeChat.peer}</h3>
                  <p>{activeListing?.title}</p>
                </div>

                <div className="messages">
                  {activeChat.messages.map((message) => (
                    <div
                      className={`message ${message.from === currentUser ? 'mine' : ''}`}
                      key={message.id}
                    >
                      <p>{message.text}</p>
                      <small>
                        {message.from} · {message.time}
                      </small>
                    </div>
                  ))}
                </div>

                <form className="offer-form" onSubmit={sendTradeOffer}>
                  <h4>Send trade offer</h4>
                  <div className="offer-row">
                    <select value={offerItem} onChange={(event) => setOfferItem(event.target.value)}>
                      {myInventory.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Add a short trade note"
                      value={offerMessage}
                      onChange={(event) => setOfferMessage(event.target.value)}
                    />
                    <button type="submit">Offer</button>
                  </div>
                </form>

                <form className="chat-input" onSubmit={sendChatMessage}>
                  <input
                    type="text"
                    placeholder="Write a message"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                  />
                  <button type="submit">Send</button>
                </form>
              </>
            ) : (
              <p>Select a listing and start a trade chat.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
