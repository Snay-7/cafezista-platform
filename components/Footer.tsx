export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Coffee, with <em>care.</em></h3>
          <p>
            Roasted in London. Sourced from the world. Served with the same attention
            Vinicius&apos;s family taught him in the fields of Minas Gerais.
          </p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="/shop">All beans</a></li>
            <li><a href="/subscribe">Subscriptions</a></li>
            <li><a href="/shop?category=equipment">Equipment</a></li>
            <li><a href="/shop?category=gift">Gift cards</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Cafezista</h4>
          <ul>
            <li><a href="/story">Our story</a></li>
            <li><a href="/wholesale">Wholesale</a></li>
            <li><a href="/visit">Visit us</a></li>
            <li><a href="/journal">Journal</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:Brew@cafezistacoffee.com">Brew@cafezistacoffee.com</a></li>
            <li><a href="https://instagram.com/cafezista" rel="noopener noreferrer" target="_blank">Instagram</a></li>
            <li><a href="/help">Help &amp; FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; Cafezista {new Date().getFullYear()}. All rights reserved.</span>
        <span>Made in London &middot; Grown in Brazil</span>
      </div>
    </footer>
  )
}
