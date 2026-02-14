import { useCallback, useEffect, useRef, useState } from 'react'
import './SwipePage.css'

const swipeProducts = [
  {
    id: 1,
    title: 'Nintendo Switch OLED',
    owner: 'Avery',
    description: 'Excellent condition. Dock, case, and two extra controllers included.',
    image:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=80',
    wants: ['Keychron K2 Keyboard', 'Nintendo eShop $50 Card'],
  },
  {
    id: 2,
    title: 'Polaroid Camera Set',
    owner: 'Mina',
    description: 'Like-new instant camera with 15 film packs and carrying case.',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    wants: ['JBL Flip Speaker'],
  },
  {
    id: 3,
    title: 'Acoustic Guitar',
    owner: 'Noah',
    description: 'Warm tone, recently restrung, includes padded gig bag.',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    wants: ['Blue Yeti Nano Mic'],
  },
  {
    id: 4,
    title: 'Standing Desk Converter',
    owner: 'Eli',
    description: 'Dual monitor support, smooth lift mechanism, minimal use.',
    image:
      'https://images.unsplash.com/photo-1593476550610-87baa860004a?auto=format&fit=crop&w=1200&q=80',
    wants: ['IKEA Desk Lamp'],
  },
]

function SwipePage({
  userPlan,
  swipesUsed,
  freeSwipeLimit,
  onConsumeSwipe,
  onBackToMarketplace,
  onSelectProduct,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Swipe left or right to discover your next swap.')
  const [showChoiceOverlay, setShowChoiceOverlay] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStartXRef = useRef(null)
  const wheelDeltaXRef = useRef(0)
  const lastWheelSwipeAtRef = useRef(0)

  const currentProduct = swipeProducts[currentIndex % swipeProducts.length]
  const freeLimitReached = userPlan === 'free' && swipesUsed >= freeSwipeLimit

  const swipeLeft = useCallback(() => {
    if (freeLimitReached || showChoiceOverlay) {
      setStatusMessage('Free plan limit reached: 10 swipes. Upgrade to Pro for unlimited swipes.')
      return
    }

    onConsumeSwipe()
    setCurrentIndex((prev) => prev + 1)
    setStatusMessage('Skipped. Next product loaded.')
  }, [freeLimitReached, onConsumeSwipe, showChoiceOverlay])

  const swipeRight = useCallback(() => {
    if (freeLimitReached || showChoiceOverlay) {
      setStatusMessage('Free plan limit reached: 10 swipes. Upgrade to Pro for unlimited swipes.')
      return
    }

    onConsumeSwipe()
    setShowChoiceOverlay(true)
    setStatusMessage('Nice choice. Opening product details...')

    window.setTimeout(() => {
      setShowChoiceOverlay(false)
      onSelectProduct(currentProduct)
      setCurrentIndex((prev) => prev + 1)
    }, 820)
  }, [currentProduct, freeLimitReached, onConsumeSwipe, onSelectProduct, showChoiceOverlay])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        swipeLeft()
      }
      if (event.key === 'ArrowRight') {
        swipeRight()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [swipeLeft, swipeRight])

  useEffect(() => {
    const onWheel = (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return
      }

      const now = Date.now()
      if (now - lastWheelSwipeAtRef.current < 320) {
        return
      }

      wheelDeltaXRef.current += event.deltaX
      const threshold = 60

      if (wheelDeltaXRef.current >= threshold) {
        swipeRight()
        wheelDeltaXRef.current = 0
        lastWheelSwipeAtRef.current = now
      } else if (wheelDeltaXRef.current <= -threshold) {
        swipeLeft()
        wheelDeltaXRef.current = 0
        lastWheelSwipeAtRef.current = now
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [swipeLeft, swipeRight])

  const onPointerDownCard = (event) => {
    if (freeLimitReached || showChoiceOverlay) {
      return
    }
    dragStartXRef.current = event.clientX
  }

  const onPointerMoveCard = (event) => {
    if (dragStartXRef.current === null) {
      return
    }
    setDragOffset(event.clientX - dragStartXRef.current)
  }

  const onPointerUpCard = () => {
    const threshold = 90
    if (dragOffset >= threshold) {
      swipeRight()
    } else if (dragOffset <= -threshold) {
      swipeLeft()
    }
    dragStartXRef.current = null
    setDragOffset(0)
  }

  return (
    <div className="swipe-page-wrap">
      <header className="swipe-header">
        <button type="button" onClick={onBackToMarketplace}>
          Back to Marketplace
        </button>
        <h1>Swap Match</h1>
        <p>
          {userPlan === 'free'
            ? `${swipesUsed}/${freeSwipeLimit} swipes used (Free)`
            : `${swipesUsed} swipes used (Pro Unlimited)`}
        </p>
      </header>

      <main className="swipe-main">
        <button
          type="button"
          className="swipe-action no"
          onClick={swipeLeft}
          disabled={freeLimitReached || showChoiceOverlay}
          aria-label="Swipe left"
        >
          ✕
        </button>

        <section className="swipe-deck">
          <div className="deck-layer layer-back" />
          <div className="deck-layer layer-mid" />

          <article
            className="swipe-card"
            style={{ transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.02}deg)` }}
            onPointerDown={onPointerDownCard}
            onPointerMove={onPointerMoveCard}
            onPointerUp={onPointerUpCard}
            onPointerCancel={onPointerUpCard}
            onPointerLeave={onPointerUpCard}
          >
            <div className="swipe-image" style={{ backgroundImage: `url(${currentProduct.image})` }}>
              <div className={`choice-overlay ${showChoiceOverlay ? 'show' : ''}`}>Nice choice</div>
            </div>

            <div className="swipe-info">
              <h2>{currentProduct.title}</h2>
              <p>
                <strong>Owner:</strong> {currentProduct.owner}
              </p>
              <p>{currentProduct.description}</p>
            </div>
          </article>
        </section>

        <button
          type="button"
          className="swipe-action yes"
          onClick={swipeRight}
          disabled={freeLimitReached || showChoiceOverlay}
          aria-label="Swipe right"
        >
          ✓
        </button>
      </main>

      <p className={`swipe-status ${freeLimitReached ? 'limit' : ''}`}>{statusMessage}</p>
    </div>
  )
}

export default SwipePage
