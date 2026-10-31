import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Missing Supabase env vars for RLS check.')
}

const anonClient = createClient(url, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

function expect(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

async function main() {
  console.log('RLS checks require a linked Supabase project and seeded demo users.')
  console.log('This script performs an events-read smoke check only.')

  expect(Boolean(url), 'Supabase URL is configured.')
  expect(Boolean(anonKey), 'Supabase anon key is configured.')

  const { error } = await anonClient.from('events').select('id').limit(1)
  if (error) {
    throw new Error(`Could not query events for the RLS smoke check: ${error.message}`)
  }

  console.log('Events-read smoke check passed. This does not validate the full RLS ruleset.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
