'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {
  novelId: string
}

const navItems = [
  { label: 'World Bible', href: 'bible', icon: '📖' },
  { label: 'Consistency', href: 'consistency', icon: '🔍' },
  { label: 'Search', href: 'search', icon: '⌕' },
]

export default function SidebarNav({ novelId }: Props) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-1 border-t border-zinc-800 pt-3">
      {navItems.map((item) => {
        const href = `/novel/${novelId}/${item.href}`
        const active = pathname.startsWith(href)
        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            )}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
