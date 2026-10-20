import { defaultShouldDehydrateQuery, type Query, type QueryClient } from '@tanstack/react-query'
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { del, get, set } from 'idb-keyval'
import { supabase } from '@/lib/supabase'
export const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24 * 7
export const persister = createAsyncStoragePersister({ key: 'gawa-query-cache', storage: { getItem: (key) => get<string>(key), setItem: (key, value) => set(key, value), removeItem: (key) => del(key) } })
export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister, maxAge: PERSIST_MAX_AGE, buster: 'gawa-1',
  dehydrateOptions: { shouldDehydrateQuery: (query: Query) => defaultShouldDehydrateQuery(query) && query.queryKey[0] !== 'manage' },
}
export function initOfflineCleanup(queryClient: QueryClient) { supabase.auth.onAuthStateChange((event) => { if (event !== 'SIGNED_OUT') return; queryClient.clear(); void persister.removeClient() }) }