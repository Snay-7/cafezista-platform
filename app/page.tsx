import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, name, subtitle, origin_country, region, tasting_notes, bag_color, is_featured')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f5efe4',
      color: '#1a1410',
      fontFamily: 'Georgia, serif',
      padding: '4rem 2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Hero */}
        <section style={{ marginBottom: '6rem', textAlign: 'center' }}>
          <p style={{
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '0.75rem',
            color: '#b85c3c',
            marginBottom: '1rem'
          }}>
            Cafezista — Bermondsey, London
          </p>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            Brazilian roots. <em style={{ color: '#b85c3c' }}>Global palate.</em>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#4a5240',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Coffee from our family farm in Cerrado Mineiro,
            and the world&apos;s most singular origins, roasted in London.
          </p>
        </section>

        {/* Products grid */}
        <section>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '2rem',
            borderBottom: '1px solid #1a1410',
            paddingBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 400 }}>
              House favourites.
            </h2>
            <span style={{ fontSize: '0.875rem', color: '#4a5240' }}>
              {products?.length ?? 0} coffees in stock
            </span>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              border: '1px solid #b85c3c',
              color: '#b85c3c',
              marginBottom: '2rem'
            }}>
              <strong>Database error:</strong> {error.message}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {products?.map((product) => (
              <article
                key={product.id}
                style={{
                  background: 'white',
                  padding: '2rem 1.5rem',
                  border: '1px solid #c9b896',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {/* Visual bag mockup */}
                <div style={{
                  height: '200px',
                  backgroundColor: bagColors[product.bag_color ?? 'cream'],
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    color: '#1a1410',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    opacity: 0.6
                  }}>
                    Cafezista
                  </span>
                </div>

                <div>
                  <p style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#b85c3c',
                    marginBottom: '0.5rem'
                  }}>
                    {product.origin_country}
                    {product.region && ` · ${product.region}`}
                  </p>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    marginBottom: '0.25rem'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#4a5240',
                    fontStyle: 'italic'
                  }}>
                    {product.subtitle}
                  </p>
                </div>

                {product.tasting_notes && (
                  <p style={{ fontSize: '0.85rem', color: '#1a1410' }}>
                    {product.tasting_notes.join(' · ')}
                  </p>
                )}

                {product.is_featured && (
                  <span style={{
                    alignSelf: 'flex-start',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    background: '#1a1410',
                    color: '#f5efe4',
                    padding: '0.4rem 0.8rem'
                  }}>
                    House espresso
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>

        <footer style={{
          marginTop: '6rem',
          paddingTop: '2rem',
          borderTop: '1px solid #c9b896',
          fontSize: '0.85rem',
          color: '#4a5240',
          textAlign: 'center'
        }}>
          © {new Date().getFullYear()} Cafezista. London.
        </footer>

      </div>
    </main>
  )
}

const bagColors: Record<string, string> = {
  rose: '#d4a290',
  sand: '#c9b896',
  terra: '#b85c3c',
  moss: '#4a5240',
  cream: '#f5efe4',
  espresso: '#1a1410',
}
