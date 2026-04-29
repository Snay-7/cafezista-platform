import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop \u2014 All coffees',
  description:
    'Browse our full range of single-origin specialty coffees, roasted in London. Filter by origin, brew method, process, and tasting notes.',
  alternates: { canonical: 'https://cafezistacoffee.com/shop' },
}

const COUNTRY_CODES: Record<string, string> = {
  Brazil: 'BR', Ethiopia: 'ET', Colombia: 'CO', Panama: 'PA',
  Kenya: 'KE', Guatemala: 'GT', Indonesia: 'ID', 'Costa Rica': 'CR',
}

interface ShopPageProps {
  searchParams: Promise<{
    origin?: string
    brew?: string
    process?: string
    note?: string
    sort?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('id, slug, name, subtitle, origin_country, region, process, variety, tasting_notes, bag_color, brew_method, is_featured')
    .eq('is_active', true)

  if (params.origin) query = query.eq('origin_country', params.origin)
  if (params.brew) query = query.eq('brew_method', params.brew)
  if (params.process) query = query.eq('process', params.process)
  if (params.note) query = query.contains('tasting_notes', [params.note])

  const sort = params.sort ?? 'featured'
  if (sort === 'a-z') query = query.order('name', { ascending: true })
  else if (sort === 'origin') query = query.order('origin_country', { ascending: true })
  else query = query.order('is_featured', { ascending: false }).order('name', { ascending: true })

  const { data: products } = await query

  const { data: allProducts } = await supabase
    .from('products')
    .select('origin_country, brew_method, process, tasting_notes')
    .eq('is_active', true)

  const origins = Array.from(new Set((allProducts ?? []).map(p => p.origin_country))).sort()
  const brews = Array.from(new Set((allProducts ?? []).map(p => p.brew_method).filter(Boolean))) as string[]
  const processes = Array.from(new Set((allProducts ?? []).map(p => p.process).filter(Boolean))) as string[]
  const notes = Array.from(
    new Set((allProducts ?? []).flatMap(p => p.tasting_notes ?? []))
  ).sort()

  const activeFilters: { label: string; key: string }[] = []
  if (params.origin) activeFilters.push({ label: params.origin, key: 'origin' })
  if (params.brew) activeFilters.push({ label: capitalize(params.brew), key: 'brew' })
  if (params.process) activeFilters.push({ label: capitalize(params.process), key: 'process' })
  if (params.note) activeFilters.push({ label: params.note, key: 'note' })

  function buildUrl(overrides: Record<string, string | undefined>) {
    const u = new URLSearchParams()
    const merged = { ...params, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) u.set(k, v) })
    const qs = u.toString()
    return qs ? `/shop?${qs}` : '/shop'
  }

  return (
    <>
      <Header />

      <main className="shop-page">
        <section className="shop-hero">
          <p className="shop-eyebrow">&mdash; The full menu.</p>
          <h1>All coffees.</h1>
          <p className="shop-sub">
            Twelve single origins, roasted in small batches at our Bermondsey roastery.
            From the everyday espresso to the once-in-a-while gesha.
          </p>
        </section>

        <div className="shop-layout">
          <aside className="shop-filters" aria-label="Filters">
            <div className="filter-group">
              <h3>Origin</h3>
              <ul>
                {origins.map(o => (
                  <li key={o}>
                    <a href={buildUrl({ origin: params.origin === o ? undefined : o })}
                       className={params.origin === o ? 'active' : ''}>
                      {o}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Brew method</h3>
              <ul>
                {brews.map(b => (
                  <li key={b}>
                    <a href={buildUrl({ brew: params.brew === b ? undefined : b })}
                       className={params.brew === b ? 'active' : ''}>
                      {capitalize(b)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Process</h3>
              <ul>
                {processes.map(p => (
                  <li key={p}>
                    <a href={buildUrl({ process: params.process === p ? undefined : p })}
                       className={params.process === p ? 'active' : ''}>
                      {capitalize(p)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Tasting notes</h3>
              <ul>
                {notes.slice(0, 12).map(n => (
                  <li key={n}>
                    <a href={buildUrl({ note: params.note === n ? undefined : n })}
                       className={params.note === n ? 'active' : ''}>
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {activeFilters.length > 0 && (
              <a href="/shop" className="clear-filters">Clear all filters</a>
            )}
          </aside>

          <div className="shop-main">
            <div className="shop-toolbar">
              <div className="shop-results">
                <span className="results-count">{products?.length ?? 0} coffees</span>
                {activeFilters.length > 0 && (
                  <div className="filter-pills">
                    {activeFilters.map(f => (
                      <a key={f.key} href={buildUrl({ [f.key]: undefined })} className="pill">
                        {f.label} <span aria-hidden="true">&times;</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="shop-sort">
                <span className="sort-label">Sort.</span>
                <a href={buildUrl({ sort: undefined })} className={sort === 'featured' ? 'active' : ''}>Featured</a>
                <a href={buildUrl({ sort: 'a-z' })} className={sort === 'a-z' ? 'active' : ''}>A&ndash;Z</a>
                <a href={buildUrl({ sort: 'origin' })} className={sort === 'origin' ? 'active' : ''}>Origin</a>
              </div>
            </div>

            <div className="shop-grid">
              {(products ?? []).map(product => {
                const code = COUNTRY_CODES[product.origin_country] ?? ''
                const bagClass = `bag-${product.bag_color ?? 'cream'}`
                const brewLabel = product.brew_method ? capitalize(product.brew_method) : 'Filter'

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
                          <span>{product.region ?? product.origin_country}.</span>
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

            {(products?.length ?? 0) === 0 && (
              <div className="shop-empty">
                <p>No coffees match those filters.</p>
                <a href="/shop" className="btn-primary">Clear filters</a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
