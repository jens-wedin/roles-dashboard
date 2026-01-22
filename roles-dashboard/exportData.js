import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function exportData() {
  try {
    console.log('Fetching data from Supabase...')
    
    const { data, error } = await supabase
      .from('design_roles')
      .select('*')
    
    if (error) throw error
    
    console.log(`Successfully fetched ${data.length} records`)
    
    // Save to JSON file in the root folder
    const outputPath = join(__dirname, 'design_roles_data.json')
    writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')
    
    console.log(`✅ Data exported successfully to: ${outputPath}`)
    console.log(`📊 Total records: ${data.length}`)
    
  } catch (error) {
    console.error('❌ Error exporting data:', error.message)
    process.exit(1)
  }
}

exportData()
