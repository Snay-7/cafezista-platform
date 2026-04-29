import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cafezista \u2014 Coffee from seed to table',
  description:
    'Specialty coffee roasted in Bermondsey, London. From our family farm in Cerrado Mineiro and the world\u2019s most expressive single origins. Subscribe & save 15%.',
  alternates: { canonical: 'https://cafezistacoffee.com' },
}

const COUNTRY_CODES: Record<string, string> = {
  Brazil: 'BR', Ethiopia: 'ET', Colombia: 'CO', Panama: 'PA',
  Kenya: 'KE', Guatemala: 'GT', Indonesia: 'ID', 'Costa Rica': 'CR',
}

const REGION_SHORT: Record<string, string> = {
  'Cerrado Mineiro': 'Cerrado',
  Yirgacheffe: 'Yirgacheffe',
  Huila: 'Huila',
  Boquete: 'Gesha',
  Mantiqueira: 'Mantiqueira',
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, slug, name, subtitle, origin_country, region, process, variety, tasting_notes, bag_color, brew_method, is_featured')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .limit(4)

  const productsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (products ?? []).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.subtitle,
        category: 'Coffee',
        brand: { '@type': 'Brand', name: 'Cafezista' },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
      />

      <Header />

      <main>
        <section className="hero" aria-label="Hero">
          <div>
            <div className="hero-tag">From Brazil, with intent</div>
            <h1>
              Coffee from <em>seed</em> to table.
            </h1>
            <p className="hero-sub">
              Cafezista was born in the coffee fields of Brazil and now calls London home.
              Vinicius Oliveira grew up watching beans dry in the sun &mdash; today he sources
              the world&apos;s most expressive coffees and brings them here, roasted with care.
            </p>
            <div className="hero-actions">
              <a href="/shop" className="btn-primary">Shop the menu &rarr;</a>
              <a href="/subscribe" className="btn-ghost">Subscribe &amp; save 15%</a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-bag">
              <div className="hero-bag-label">
                <span>Origin.</span>
                <span>Cerrado</span>
              </div>
              <div className="hero-bag-brand">Cafezista.</div>
              <div className="hero-bag-meta">
                <div><span>Process</span><span>Natural</span></div>
                <div><span>Variety</span><span>Yellow Bourbon</span></div>
                <div><span>Altitude</span><span>1,200m</span></div>
                <div><span>Notes</span><span>Cocoa, Hazelnut</span></div>
              </div>
            </div>
          </div>

          <div className="hero-marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>Direct trade</span>
              <span>Single origin</span>
              <span>Roasted in London</span>
              <span>Subscribe &amp; save</span>
              <span>Wholesale partners welcome</span>
              <span>From seed to table</span>
              <span>Direct trade</span>
              <span>Single origin</span>
              <span>Roasted in London</span>
              <span>Subscribe &amp; save</span>
              <span>Wholesale partners welcome</span>
              <span>From seed to table</span>
            </div>
          </div>
        </section>

        <section className="story" aria-labelledby="story-heading">
          <div className="story-label">&mdash; Our story.</div>
          <div className="story-content">
            <h2 id="story-heading">
              A family that grew up <em>between rows of coffee.</em>
            </h2>
            <p>
              Vinicius Oliveira&apos;s earliest memories smell of fermenting cherries and freshly
              turned soil. His family has farmed coffee in Brazil for generations &mdash; picking,
              washing, drying, tasting &mdash; long before specialty became a word the industry could hold.
            </p>
            <p>
              When he moved to London, Vinicius brought one promise with him: that every bag of
              Cafezista would carry the same care his family taught him. From the seed in the
              highlands to the cup on your table &mdash; nothing rushed, nothing wasted, nothing
              without intention.
            </p>
            <p>
              Today we travel the world&apos;s growing regions in search of true taste &mdash;
              Ethiopia&apos;s wild ferments, Colombia&apos;s washed clarity, Brazil&apos;s syrupy depth
              &mdash; and roast them in small batches at our London roastery.
            </p>
            <div className="story-signature">
              Vinicius Oliveira
              <small>Founder &middot; Cafezista</small>
            </div>
          </div>
        </section>

        <section className="products" aria-labelledby="products-heading">
          <header className="products-header">
            <h2 id="products-heading">House favourites.</h2>
            <nav className="products-tabs" aria-label="Product categories">
              <a href="/shop?type=beans" className="active">Beans.</a>
              <a href="/shop?type=pods">Pods.</a>
              <a href="/shop?type=merch">Merch.</a>
            </nav>
            <a href="/shop" className="view-all">View all &rarr;</a>
          </header>

          <div className="product-grid">
            {(products ?? []).map((product) => {
              const code = COUNTRY_CODES[product.origin_country] ?? ''
              const regionShort = product.region
                ? REGION_SHORT[product.region] ?? product.region
                : product.origin_country
              const bagClass = `bag-${product.bag_color ?? 'cream'}`
              const brewLabel = product.brew_method
                ? product.brew_method.charAt(0).toUpperCase() + product.brew_method.slice(1)
                : 'Filter'

              return (
                <a key={product.id} href={`/shop/${product.slug}`} className="product-card">
                  <div className="product-image">
                    <div className="product-tags">
                      <strong>Brew.</strong> {brewLabel}
                    </div>
                    {product.is_featured && (
                      <div className="product-fav">House favourite.</div>
                    )}
                    <div className={`product-bag ${bagClass}`} aria-hidden="true">
                      <div className="product-bag-label">
                        <span>{regionShort}.</span>
                        <span>{code}</span>
                      </div>
                      <div className="product-bag-brand">Cafezista.</div>
                      <div className="product-bag-meta">
                        <div><span>Process</span><span>{product.process ? capitalize(product.process) : '\u2014'}</span></div>
                        <div><span>Variety</span><span>{product.variety ?? '\u2014'}</span></div>
                        <div><span>Notes</span><span>{product.tasting_notes ? product.tasting_notes.slice(0, 2).join(', ') : '\u2014'}</span></div>
                      </div>
                    </div>
                    <div className="bookmark" aria-hidden="true"></div>
                  </div>

                  <div className="product-info">
                    <h3>{product.name}.</h3>
                    <div className="product-meta">
                      <span className="product-meta-label">Tasting Notes.</span>
                      <span className="product-meta-label right">Origin.</span>
                      <span className="product-meta-value">{product.tasting_notes?.join(', ') ?? '\u2014'}</span>
                      <span className="product-meta-value right">{product.origin_country}</span>
                    </div>
                    <div className="add-to-cart" role="button" tabIndex={0}>
                      Add to cart <span className="plus">+</span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        <section className="panels" aria-label="Featured links">
          <a href="/shop" className="panel panel-menu">
            <div className="panel-content">
              <h3>Our menu.</h3>
              <span className="panel-link">View shop &rarr;</span>
            </div>
          </a>
          <a href="/story" className="panel panel-story">
            <div className="panel-content">
              <h3>Our story.</h3>
              <span className="panel-link">Read more &rarr;</span>
            </div>
          </a>
        </section>

        <section className="wholesale" aria-labelledby="wholesale-heading">
          <div>
            <div className="wholesale-label">&mdash; For business.</div>
            <h2 id="wholesale-heading">
              Coffee for the spaces that <em>shape your day.</em>
            </h2>
          </div>
          <div className="wholesale-content">
            <p>
              Whether you run a caf&eacute;, restaurant, hotel, or office, Cafezista partners with
              you to source, roast, and deliver coffee that lifts every cup you serve. Training,
              equipment guidance and ongoing support included.
            </p>
            <ul className="wholesale-features">
              <li><span>Tiered wholesale pricing</span><span>From &pound;18/kg</span></li>
              <li><span>Dedicated account manager</span><span>Always-on</span></li>
              <li><span>Barista training included</span><span>On-site</span></li>
              <li><span>Custom roast profiles</span><span>By request</span></li>
            </ul>
            <a href="/wholesale" className="btn-cream">Apply for wholesale &rarr;</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
