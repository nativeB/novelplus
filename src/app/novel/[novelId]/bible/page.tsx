'use client'

import { useParams } from 'next/navigation'
import BiblePage from '@/components/bible/BiblePage'

export default function BibleRoute() {
  const params = useParams()
  return <BiblePage novelId={params.novelId as string} />
}
