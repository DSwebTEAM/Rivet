import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

export interface MemorySummary {
  id: string
  title: string
  content: string
  skill_tag: string | null
  created_at: string
}

export function useMemory() {
  const userId = useAuthStore((s) => s.userId)
  const [summaries, setSummaries] = useState<MemorySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const load = useCallback(async (searchQuery?: string) => {
    if (!userId) return
    setLoading(true)

    if (searchQuery && searchQuery.trim().length > 2) {
      // Semantic search via Supabase RPC (calls pgvector similarity)
      const { data } = await supabase.rpc('search_memories', {
        user_id: userId,
        query_text: searchQuery,
        match_count: 10,
      })
      setSummaries((data as MemorySummary[]) ?? [])
    } else {
      // Chronological list
      const { data } = await supabase
        .from('memory_summaries')
        .select('id, title, content, skill_tag, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
      setSummaries((data as MemorySummary[]) ?? [])
    }

    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => load(query), 400)
    return () => clearTimeout(t)
  }, [query, load])

  return { summaries, loading, query, setQuery }
}
