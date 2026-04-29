'use client'

import { useCart } from '@/lib/cart/CartContext'

export default function Header() {
  const { totalItems } = useCart()

  return (
    <nav className="site-nav" aria-label="Primary">
      <a href="/" className="logo" aria-label="Cafezista home">
        Cafezista<span>.</span>
      </a>
      <div className="nav-center">
        <a href="/subscribe">Subscribe</a>
        <a href="/shop">Shop</a>
        <a href="/wholesale">Wholesale</a>
        <a href="/story">Story</a>
      </div>
      <div className="nav-right">
        <a href="/search" aria-label="Search">Search</a>
        <a href="/account" aria-label="Login">Login</a>
        <a href="/cart" aria-label="Cart">
          Cart<span className="cart-badge">{totalItems}</span>
        </a>
      </div>
    </nav>
  )
}
