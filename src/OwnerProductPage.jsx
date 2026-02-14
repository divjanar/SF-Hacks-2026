import './OwnerProductPage.css'

function OwnerProductPage({ product, onBackToSwipe, onBackToMarketplace }) {
  if (!product) {
    return (
      <div className="owner-page-wrap">
        <section className="owner-page-card">
          <h1>No product selected</h1>
          <p>Go back to swipe mode and choose a product first.</p>
          <button type="button" onClick={onBackToSwipe}>
            Back to Swipe Mode
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="owner-page-wrap">
      <section className="owner-page-card">
        <div className="owner-actions">
          <button type="button" onClick={onBackToSwipe}>
            Back to Swipe
          </button>
          <button type="button" onClick={onBackToMarketplace}>
            Back to Marketplace
          </button>
        </div>

        <div className="owner-layout">
          <div className="owner-image" style={{ backgroundImage: `url(${product.image})` }} />

          <div className="owner-details">
            <p className="owner-tag">Matched Product</p>
            <h1>{product.title}</h1>
            <p>
              <strong>Owner:</strong> {product.owner}
            </p>
            <p>{product.description}</p>

            <h3>Owner wants:</h3>
            <ul>
              {product.wants.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <button type="button">Start Trade Chat</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OwnerProductPage
