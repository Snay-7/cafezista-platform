'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface CartItem {
  productId: string
  variantId: string
  slug: string
  name: string
  size_g: number
  grind: string
  quantity: number
  pricePence: number
  subscribe: boolean
  bagColor: string
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (variantId: string, grind: string, subscribe: boolean) => void
  updateQuantity: (variantId: string, grind: string, subscribe: boolean, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalPence: number
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'cafezista-cart-v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
    }
  }, [items, hydrated])

  function addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
    setItems(prev => {
      const existingIdx = prev.findIndex(i =>
        i.variantId === item.variantId && i.grind === item.grind && i.subscribe === item.subscribe
      )
      if (existingIdx >= 0) {
        const next = [...prev]
        next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + (item.quantity ?? 1) }
        return next
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }]
    })
  }

  function removeItem(variantId: string, grind: string, subscribe: boolean) {
    setItems(prev => prev.filter(i => !(i.variantId === variantId && i.grind === grind && i.subscribe === subscribe)))
  }

  function updateQuantity(variantId: string, grind: string, subscribe: boolean, qty: number) {
    if (qty <= 0) return removeItem(variantId, grind, subscribe)
    setItems(prev => prev.map(i =>
      i.variantId === variantId && i.grind === grind && i.subscribe === subscribe
        ? { ...i, quantity: qty } : i
    ))
  }

  function clearCart() { setItems([]) }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPence = items.reduce((sum, i) => sum + i.pricePence * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPence }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
