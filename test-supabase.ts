
import { createClient } from '@supabase/supabase-js'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    console.log('Testing connection to Supabase...')
    console.log('URL:', supabaseUrl)

    // Test 1: Simple health check / query
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })

    if (error) {
        console.error('Error connecting to Supabase:', error.message)
        // Try another common table if profiles doesn't exist
        console.log('Trying to fetch from any table...')
        const { error: error2 } = await supabase.from('leads').select('count', { count: 'exact', head: true })
        if (error2) {
            console.error('Error connecting to leads table:', error2.message)
            console.log('Connection might be working but tables might not exist yet, or RLS is blocking.')
        } else {
            console.log('Successfully connected to "leads" table!')
        }
    } else {
        console.log('Successfully connected to "profiles" table!')
    }

    // Test 2: Auth check (should at least not fail)
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) {
        console.error('Auth check failed:', authError.message)
    } else {
        console.log('Auth service is reachable.')
    }
}

testConnection()
