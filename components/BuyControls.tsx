'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart/CartContext'

interface Variant {
  id: string
  size_g: number
  price_pence: number
}

interface BuyControlsProps {
  productId: string
  slug: string
  name: string
  bagColor: string
  variants: Variant[]
}

const GRIND_OPTIONS = [
  { value: 'whole-bean', label: 'Whole bean' },
  { value: 'espresso', label: 'Espresso' },
  { value: 'filter', label: 'Filter / V60' },
  { value: 'aeropress', label: 'AeroPress' },
  { value: 'cafetiere', label: 'Cafeti\u00e8re' },
  { value: 'moka', label: 'Moka pot' },
]

export default function BuyControls({ productId, slug, name, bagColor, variants }: BuyControlsProps) {
  const { addItem } = useCart()
  const sortedVariants = [...variants].sort((a, b) => a.size_g - b.size_g)
  const [selectedVariantId, setSelectedVariantId] = useState(sortedVariants[0]?.id ?? '')
  const [grind, setGrind] = useState('whole-bean')
  const [quantity, setQuantity] = useState(1)
  const [subscribe, setSubscribe] = useState(false)
  const [added, setAdded] = useState(false)

  const selectedVariant = sortedVariants.find(v => v.id === selectedVariantId) ?? sortedVariants[0]
  const basePrice = selectedVariant?.price_pence ?? 0
  const finalPrice = subscribe ? Math.round(basePrice * 0.85) : basePrice
  const savings = subscribe ? basePrice - finalPrice : 0

  function formatPrice(pence: number) {
    return '\u00a3' + (pence / 100).toFixed(2)
  }

  function formatSize(grams: number) {
    if (grams >= 1000) return (grams / 1000) + 'kg'
    return grams + 'g'
  }

  function handleAdd() {
    if (!selectedVariant) return
    addItem({
      productId,
      variantId: selectedVariant.id,
      slug,
      name,
      size_g: selectedVariant.size_g,
      grind,
      pricePence: finalPrice,
      subscribe,
      bagColor,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2400)
  }

  return (
    <div className="buy-controls">
      <div className="buy-block">
        <label className="buy-label">Size.</label>
        <div className="buy-options">
          {sortedVariants.map(v => (
            <button
              key={v.id}
              type="button"
              className={`buy-option ${selectedVariantId === v.id ? 'active' : ''}`}
              onClick={() => setSelectedVariantId(v.id)}
            >
              <span className="opt-label">{formatSize(v.size_g)}</span>
              <span className="opt-price">{formatPrice(v.price_pence)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="buy-block">
        <label className="buy-label" htmlFor="grind-select">Grind.</label>
        <select id="grind-select" className="buy-select" value={grind} onChange={e => setGrind(e.target.value)}>
          {GRIND_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="buy-block">
        <label className="buy-label">Quantity.</label>
        <div className="qty-stepper">
          <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease">&minus;</button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => setQuantity(q => q + 1)} aria-label="Increase">+</button>
        </div>
      </div>

      <button
        type="button"
        className={`subscribe-toggle ${subscribe ? 'active' : ''}`}
        onClick={() => setSubscribe(s => !s)}
        aria-pressed={subscribe}
      >
        <div className="sub-tog-row">
          <span className="sub-tog-name">Subscribe &amp; save 15%</span>
          <span className="sub-tog-check">{subscribe ? '\u2713' : ''}</span>
        </div>
        <span className="sub-tog-desc">
          Free UK delivery. Pause or cancel anytime. {subscribe && savings > 0 && <strong>You save {formatPrice(savings)} per delivery.</strong>}
        </span>
      </button>

      <button type="button" className={`add-cart-btn ${added ? 'added' : ''}`} onClick={handleAdd} disabled={added}>
        {added ? '\u2713 Added to cart' : <><span>Add to cart</span><span className="add-cart-price">{formatPrice(finalPrice * quantity)}</span></>}
      </button>

      <p className="ships-note">Roasted to order. Ships within 48 hours.</p>
    </div>
  )
}
