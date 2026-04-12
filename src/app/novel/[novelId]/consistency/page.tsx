'use client'

import { useParams } from 'next/navigation'
import ConsistencyChecker from '@/components/consistency/ConsistencyChecker'

export default function ConsistencyPage() {
  const params = useParams()
  return <ConsistencyChecker novelId={params.novelId as string} />
}
