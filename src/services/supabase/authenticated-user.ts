import 'server-only'

import type { User } from '@supabase/supabase-js'
import { createClient } from '@/services/supabase/server'

export class AuthenticationRequiredError extends Error {
  constructor() {
    super('Sign in to use this feature.')
    this.name = 'AuthenticationRequiredError'
  }
}

export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    if (error.name === 'AuthSessionMissingError' || error.status === 401) {
      throw new AuthenticationRequiredError()
    }
    throw new Error(`Could not verify the current user: ${error.message}`)
  }

  if (!user) throw new AuthenticationRequiredError()
  return { supabase, user: user as User }
}
