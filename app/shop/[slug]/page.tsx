import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BuyControls from '@/components/BuyControls'
import FlavourPentagon from '@/components/FlavourPentagon'
import type { Metadata } from 'next'

const COUNTRY_CODES: Record<string, string> = {
  Brazil: 'BR', Ethiopia: 'ET', Colombia: 'CO', Panama: 'PA',
  Kenya: 'KE', Guatemala: 'GT', Indonesia: 'ID', 'Costa Rica': 'CR',
}

const BREW_GUIDES: Record<string, { method: string; ratio: string; grind: string; time: string; steps: string[] }[]> = {
  espresso: [{
    method: 'Espresso',
    ratio: '18g in : 36g out',
    grind: 'Fine',
    time: '28-32 seconds',
    steps: [
      'Dose 18g of finely ground coffee into your portafilter.',
      'Distribute and tamp evenly with 30lb pressure.',
      'Pull a 36g shot in 28-32 seconds.',
      'Look for steady honey-coloured streams that turn pale at the end.',
    ],
  }],
  filter: [{
    method: 'V60',
    ratio: '15g coffee : 250g water',
    grind: 'Medium-fine',
    time: '3:00 total',
    steps: [
      'Rinse a paper filter with hot water and discard.',
      'Add 15g of medium-fine ground coffee.',
      'Bloom with 45g of water at 94\u00b0C for 30 seconds.',
      'Pour in 3 stages: to 100g (1:00), to 175g (1:45), to 250g (2:30).',
      'Total brew time: ~3:00 minutes.',
    ],
  }, {
    method: 'AeroPress',
    ratio: '14g coffee : 220g water',
    grind: 'Medium',
    time: '2:00 total',
    steps: [
      'Set up inverted with rinsed paper filter.',
      'Add 14g of medium ground coffee.',
      'Pour 220g of water at 88\u00b0C.',
      'Stir for 10 seconds, steep 1:30.',
      'Flip and press over 30 seconds.',
    ],
  }],
  omni: [{
    method: 'Cafeti\u00e8re',
    ratio: '30g coffee : 500g water',
    grind: 'Coarse',
    time: '4:00 total',
    steps: [
      'Add 30g of coarsely ground coffee to a 500ml French press.',
      'Pour 500g of water just off the boil.',
      'Stir gently, place lid (do not plunge).',
      'Wait 4 minutes. Plunge slowly. Decant immediately.',
    ],
  }, {
    method: 'V60',
    ratio: '15g coffee : 250g water',
    grind: 'Medium-fine',
    time: '3:00 total',
    steps: [
      'Rinse a paper filter with hot water and discard.',
      'Add 15g of medium-fine ground coffee.',
      'Bloom with 45g of water at 94\u00b0C for 30 seconds.',
      'Pour in 3 stages to 250g total.',
    ],
  }],
}

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('name, subtitle, origin_country, region, tasting_notes').eq('slug', slug).single()
  if (!product) return { title: 'Coffee not found' }
  const tn = product.tasting_notes?.join(', ') ?? ''
  return {
    title: `${product.name} \u2014 ${product.origin_country}`,
    description: `${product.subtitle}. ${tn}. Single-origin specialty coffee from ${product.region ?? product.origin_country}, roasted in London.`,
    alternates: { canonical: `https://cafezistacoffee.com/shop/${slug}` },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, size_g, price_pence')
    .eq('product_id', product.id)
    .order('size_g', { ascending: true })

  const { data: related } = await supabase
    .from('products')
    .select('id, slug, name, origin_country, region, tasting_notes, bag_color, brew_method')
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(3)

  const code = COUNTRY_CODES[product.origin_country] ?? ''
  const bagClass = `bag-${product.bag_color ?? 'cream'}`
  const brewKey = product.brew_method ?? 'omni'
  const guides = BREW_GUIDES[brewKey] ?? BREW_GUIDES.omni

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.subtitle,
    category: 'Coffee',
    brand: { '@type': 'Brand', name: 'Cafezista' },
    offers: (variants ?? []).map(v => ({
      '@type': 'Offer',
      price: (v.price_pence / 100).toFixed(2),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Header />

      <main className="product-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/shop">Shop</a>
          <span>/</span>
          <a href={`/shop?origin=${encodeURIComponent(product.origin_country)}`}>{product.origin_country}</a>
          <span>/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <section className="product-hero">
          <div className="product-hero-visual">
            <div className={`product-bag-large ${bagClass}`} aria-hidden="true">
              <div className="product-bag-label">
                <span>{product.region ?? product.origin_country}.</span>
                <span>{code}</span>
              </div>
              <div className="product-bag-brand">Cafezista.</div>
              <div className="product-bag-meta">
                <div><span>Process</span><span>{capitalize(product.process)}</span></div>
                <div><span>Variety</span><span>{product.variety ?? '\u2014'}</span></div>
                <div><span>Altitude</span><span>{product.altitude_m ? product.altitude_m + 'm' : '\u2014'}</span></div>
                <div><span>Roast</span><span>{capitalize(product.roast_level ?? 'medium')}</span></div>
              </div>
            </div>
          </div>

          <div className="product-hero-info">
            <p className="product-eyebrow">{product.origin_country} &middot; {product.region}</p>
            <h1>{product.name}.</h1>
            <p className="product-subtitle">{product.subtitle}</p>
            <ul className="product-notes">
              {(product.tasting_notes ?? []).map((n: string) => <li key={n}>{n}</li>)}
            </ul>

            <BuyControls
              productId={product.id}
              slug={product.slug}
              name={product.name}
              bagColor={product.bag_color ?? 'cream'}
              variants={variants ?? []}
            />
          </div>
        </section>

        <section className="origin-story">
          <div className="origin-label">&mdash; The origin.</div>
          <div className="origin-content">
            <h2>From <em>{product.region ?? product.origin_country}</em>, with intent.</h2>
            <p>
              {product.subtitle}. Sourced directly from {product.producer ?? 'a trusted partner farm'}, this {product.process} coffee
              expresses the character of {product.region ?? product.origin_country}{product.altitude_m ? ` at ${product.altitude_m}m above sea level` : ''}.
            </p>
            <dl className="origin-spec">
              <div><dt>Producer</dt><dd>{product.producer ?? '\u2014'}</dd></div>
              <div><dt>Variety</dt><dd>{product.variety ?? '\u2014'}</dd></div>
              <div><dt>Process</dt><dd>{capitalize(product.process)}</dd></div>
              <div><dt>Altitude</dt><dd>{product.altitude_m ? product.altitude_m + 'm' : '\u2014'}</dd></div>
              <div><dt>Roast</dt><dd>{capitalize(product.roast_level ?? 'medium')}</dd></div>
              <div><dt>Best for</dt><dd>{capitalize(product.brew_method ?? 'omni')}</dd></div>
            </dl>
          </div>
        </section>

        <section className="flavour-section">
          <div className="flavour-label">&mdash; The taste.</div>
          <div className="flavour-content">
            <div className="flavour-pentagon-wrap">
              <FlavourPentagon
                acidity={product.acidity ?? 3}
                body={product.body ?? 3}
                sweetness={product.sweetness ?? 3}
                bitterness={product.bitterness ?? 3}
                aftertaste={product.aftertaste ?? 3}
              />
            </div>
            <div className="flavour-text">
              <h2>A <em>balanced</em> profile.</h2>
              <p>
                Each cup delivers a measured interplay across the five core dimensions. Use this as a guide
                to anticipate what you&apos;ll find in your brew &mdash; and where this coffee sits compared to others in our menu.
              </p>
              <ul className="flavour-list">
                <li><span>Acidity</span><strong>{product.acidity ?? 3}/5</strong></li>
                <li><span>Body</span><strong>{product.body ?? 3}/5</strong></li>
                <li><span>Sweetness</span><strong>{product.sweetness ?? 3}/5</strong></li>
                <li><span>Bitterness</span><strong>{product.bitterness ?? 3}/5</strong></li>
                <li><span>Aftertaste</span><strong>{product.aftertaste ?? 3}/5</strong></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="brew-guide">
          <div className="brew-label">&mdash; How to brew.</div>
          <div className="brew-content">
            <h2>Brewing <em>{product.name}.</em></h2>
            <p className="brew-intro">
              Recipes calibrated to bring out the best of this coffee&apos;s character.
            </p>
            <div className="brew-cards">
              {guides.map(g => (
                <div key={g.method} className="brew-card">
                  <h3>{g.method}.</h3>
                  <dl className="brew-recipe">
                    <div><dt>Ratio</dt><dd>{g.ratio}</dd></div>
                    <div><dt>Grind</dt><dd>{g.grind}</dd></div>
                    <div><dt>Time</dt><dd>{g.time}</dd></div>
                  </dl>
                  <ol className="brew-steps">
                    {g.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="related">
          <header className="related-header">
            <h2>You may also like.</h2>
            <a href="/shop" className="view-all">All coffees &rarr;</a>
          </header>
          <div className="related-grid">
            {(related ?? []).map(r => {
              const rcode = COUNTRY_CODES[r.origin_country] ?? ''
              const rbag = `bag-${r.bag_color ?? 'cream'}`
              const rbrew = r.brew_method ? capitalize(r.brew_method) : 'Filter'
              return (
                <a key={r.id} href={`/shop/${r.slug}`} className="product-card">
                  <div className="product-image">
                    <div className="product-tags"><strong>Brew.</strong> {rbrew}</div>
                    <div className={`product-bag ${rbag}`} aria-hidden="true">
                      <div className="product-bag-label"><span>{r.region ?? r.origin_country}.</span><span>{rcode}</span></div>
                      <div className="product-bag-brand">Cafezista.</div>
                    </div>
                    <div className="bookmark" aria-hidden="true"></div>
                  </div>
                  <div className="product-info">
                    <h3>{r.name}.</h3>
                    <div className="product-meta">
                      <span className="product-meta-label">Tasting Notes.</span>
                      <span className="product-meta-label right">Origin.</span>
                      <span className="product-meta-value">{r.tasting_notes?.join(', ') ?? '\u2014'}</span>
                      <span className="product-meta-value right">{r.origin_country}</span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function capitalize(s: string | null | undefined): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
