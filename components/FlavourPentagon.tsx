interface FlavourPentagonProps {
  acidity: number
  body: number
  sweetness: number
  bitterness: number
  aftertaste: number
}

export default function FlavourPentagon({ acidity, body, sweetness, bitterness, aftertaste }: FlavourPentagonProps) {
  const cx = 150, cy = 150, maxR = 110
  const axes = [
    { label: 'Acidity', value: acidity, angle: -90 },
    { label: 'Body', value: body, angle: -18 },
    { label: 'Sweetness', value: sweetness, angle: 54 },
    { label: 'Bitterness', value: bitterness, angle: 126 },
    { label: 'Aftertaste', value: aftertaste, angle: -162 },
  ]

  const pointFor = (angleDeg: number, r: number) => {
    const a = (angleDeg * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }

  // Background rings (1, 2, 3, 4, 5)
  const rings = [1, 2, 3, 4, 5].map(level => {
    const r = (level / 5) * maxR
    return axes.map(a => pointFor(a.angle, r).join(',')).join(' ')
  })

  // Flavour shape
  const shape = axes.map(a => pointFor(a.angle, (a.value / 5) * maxR).join(',')).join(' ')

  return (
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flavour profile">
      {/* Background rings */}
      {rings.map((points, i) => (
        <polygon key={i} points={points} fill="none" stroke="rgba(26,20,16,0.08)" strokeWidth="1" />
      ))}
      {/* Axes */}
      {axes.map((a, i) => {
        const [x, y] = pointFor(a.angle, maxR)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(26,20,16,0.08)" strokeWidth="1" />
      })}
      {/* Flavour shape */}
      <polygon points={shape} fill="rgba(184,92,60,0.18)" stroke="#b85c3c" strokeWidth="2" strokeLinejoin="round" />
      {/* Dots at vertices */}
      {axes.map((a, i) => {
        const [x, y] = pointFor(a.angle, (a.value / 5) * maxR)
        return <circle key={i} cx={x} cy={y} r="4" fill="#b85c3c" />
      })}
      {/* Labels */}
      {axes.map((a, i) => {
        const [x, y] = pointFor(a.angle, maxR + 22)
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize="11" fill="#1a1410" fontFamily="var(--font-inter)" fontWeight="500" letterSpacing="0.05em">
            {a.label.toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}
