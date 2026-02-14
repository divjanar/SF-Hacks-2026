import './MarketplacePage.css'

function MarketplacePage({
  categories,
  categoryFilter,
  setCategoryFilter,
  visibleListings,
  startTradeChat,
  chats,
  listings,
  activeChatId,
  setActiveChatId,
  activeChat,
  activeListing,
  userName,
  myInventory,
  offerItem,
  setOfferItem,
  offerMessage,
  setOfferMessage,
  sendTradeOffer,
  chatInput,
  setChatInput,
  sendChatMessage,
  onOpenProfile,
}) {
  return (
    <div className="trade-app">
      <header className="hero">
        <div className="hero-top">
          <p className="eyebrow">Barter</p>
          <button className="profile-button" type="button" onClick={onOpenProfile}>
            <span className="profile-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.87 0-7 2.01-7 4.5V20h14v-1.5c0-2.49-3.13-4.5-7-4.5z" />
              </svg>
            </span>
          </button>
        </div>
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
                    <div className={`message ${message.from === userName ? 'mine' : ''}`} key={message.id}>
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

export default MarketplacePage
