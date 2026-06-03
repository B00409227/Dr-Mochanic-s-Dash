'use client'

interface RegPlateProps {
  reg: string
  size?: 'sm' | 'md' | 'lg'
}

export default function RegPlate({ reg, size = 'md' }: RegPlateProps) {
  const sizes = {
    sm: { container: 'h-8 px-2', text: 'text-sm', badge: 'w-6 text-[8px]' },
    md: { container: 'h-12 px-3', text: 'text-xl', badge: 'w-9 text-[10px]' },
    lg: { container: 'h-16 px-4', text: 'text-3xl', badge: 'w-12 text-xs' },
  }
  const s = sizes[size]

  return (
    <div
      className={`inline-flex items-center gap-0 rounded border-2 border-black overflow-hidden font-rajdhani font-bold ${s.container}`}
      style={{ background: '#FFC612', letterSpacing: '0.12em' }}
    >
      <div
        className={`flex flex-col items-center justify-center ${s.badge} h-full bg-blue-700 text-white leading-tight`}
        style={{ background: '#003399' }}
      >
        <span style={{ fontSize: '50%' }}>GB</span>
        <div className="w-full flex justify-center gap-0.5 mt-0.5">
          <div className="w-1 h-1 rounded-full bg-yellow-400" style={{ width: 3, height: 3 }} />
          <div className="w-1 h-1 rounded-full bg-yellow-400" style={{ width: 3, height: 3 }} />
          <div className="w-1 h-1 rounded-full bg-yellow-400" style={{ width: 3, height: 3 }} />
        </div>
      </div>
      <span className={`px-2 text-black ${s.text}`} style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
        {reg}
      </span>
    </div>
  )
}
