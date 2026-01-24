import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
    console.error('Error: Missing VITE_SUPABASE_URL in .env file')
    process.exit(1)
}

// Prefer service key for admin operations (bypasses RLS)
const supabaseKey = supabaseServiceKey || supabaseAnonKey

if (!supabaseKey) {
    console.error('Error: Missing Supabase keys in .env file')
    process.exit(1)
}

if (!supabaseServiceKey) {
    console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY not found. Using Anon key.')
    console.warn('   Import might fail if RLS policies block anonymous writes.\n')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const deleteOrphans = args.includes('--delete-orphans')

async function importData() {
    try {
        console.log('🔄 Starting import process...')
        if (isDryRun) {
            console.log('⚠️  DRY RUN MODE - No changes will be made\n')
        }

        // Read JSON file
        const jsonPath = join(__dirname, 'design_roles_data.json')
        const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'))
        console.log(`📖 Read ${jsonData.length} records from JSON file\n`)

        // Fetch existing data from Supabase
        console.log('📥 Fetching existing data from Supabase...')
        const { data: existingData, error: fetchError } = await supabase
            .from('design_roles')
            .select('*')

        if (fetchError) throw fetchError
        console.log(`📊 Found ${existingData.length} existing records in database\n`)

        // Create a map of existing records by role-name
        const existingMap = new Map(
            existingData.map(record => [record['role-name'], record])
        )

        // Track changes
        const stats = {
            toInsert: [],
            toUpdate: [],
            toDelete: [],
            unchanged: 0
        }

        // Process each record from JSON
        for (const jsonRecord of jsonData) {
            const roleName = jsonRecord['role-name']
            const existing = existingMap.get(roleName)

            if (!existing) {
                // New record - needs to be inserted
                stats.toInsert.push(jsonRecord)
            } else {
                // Check if record has changed
                const hasChanged = Object.keys(jsonRecord).some(key => {
                    return JSON.stringify(jsonRecord[key]) !== JSON.stringify(existing[key])
                })

                if (hasChanged) {
                    stats.toUpdate.push(jsonRecord)
                } else {
                    stats.unchanged++
                }

                // Remove from map to track deletions
                existingMap.delete(roleName)
            }
        }

        // Remaining records in map are orphans (exist in DB but not in JSON)
        if (deleteOrphans) {
            stats.toDelete = Array.from(existingMap.values())
        }

        // Display summary
        console.log('📋 CHANGE SUMMARY:')
        console.log('─'.repeat(50))
        console.log(`✅ Unchanged:     ${stats.unchanged}`)
        console.log(`➕ To Insert:     ${stats.toInsert.length}`)
        console.log(`✏️  To Update:     ${stats.toUpdate.length}`)
        console.log(`❌ To Delete:     ${stats.toDelete.length}`)
        console.log('─'.repeat(50))
        console.log(`📊 Total Changes: ${stats.toInsert.length + stats.toUpdate.length + stats.toDelete.length}\n`)

        // Show details of changes
        if (stats.toInsert.length > 0) {
            console.log('➕ NEW ROLES TO INSERT:')
            stats.toInsert.forEach(record => {
                console.log(`   - ${record['role-name']}`)
            })
            console.log()
        }

        if (stats.toUpdate.length > 0) {
            console.log('✏️  ROLES TO UPDATE:')
            stats.toUpdate.forEach(record => {
                console.log(`   - ${record['role-name']}`)
            })
            console.log()
        }

        if (stats.toDelete.length > 0) {
            console.log('❌ ROLES TO DELETE:')
            stats.toDelete.forEach(record => {
                console.log(`   - ${record['role-name']}`)
            })
            console.log()
        }

        // Exit if dry run
        if (isDryRun) {
            console.log('✅ Dry run complete. No changes were made.')
            console.log('💡 Run without --dry-run to apply these changes.')
            return
        }

        // Apply changes
        console.log('🚀 Applying changes to database...\n')

        // Insert new records
        if (stats.toInsert.length > 0) {
            console.log(`➕ Inserting ${stats.toInsert.length} new records...`)
            const { error: insertError } = await supabase
                .from('design_roles')
                .insert(stats.toInsert)

            if (insertError) {
                console.error('❌ Insert error:', insertError.message)
                throw insertError
            }
            console.log('✅ Insert complete')
        }

        // Update existing records
        if (stats.toUpdate.length > 0) {
            console.log(`✏️  Updating ${stats.toUpdate.length} records...`)
            for (const record of stats.toUpdate) {
                const { error: updateError } = await supabase
                    .from('design_roles')
                    .update(record)
                    .eq('role-name', record['role-name'])

                if (updateError) {
                    console.error(`❌ Update error for ${record['role-name']}:`, updateError.message)
                    throw updateError
                }
            }
            console.log('✅ Update complete')
        }

        // Delete orphaned records
        if (stats.toDelete.length > 0) {
            console.log(`❌ Deleting ${stats.toDelete.length} orphaned records...`)
            for (const record of stats.toDelete) {
                const { error: deleteError } = await supabase
                    .from('design_roles')
                    .delete()
                    .eq('role-name', record['role-name'])

                if (deleteError) {
                    console.error(`❌ Delete error for ${record['role-name']}:`, deleteError.message)
                    throw deleteError
                }
            }
            console.log('✅ Delete complete')
        }

        console.log('\n✅ Import completed successfully!')
        console.log(`📊 Summary: ${stats.toInsert.length} inserted, ${stats.toUpdate.length} updated, ${stats.toDelete.length} deleted`)

    } catch (error) {
        console.error('\n❌ Import failed:', error.message)
        process.exit(1)
    }
}

// Display usage information
if (args.includes('--help')) {
    console.log(`
📚 USAGE: node importData.js [options]

OPTIONS:
  --dry-run          Preview changes without applying them
  --delete-orphans   Delete records that exist in DB but not in JSON
  --help             Show this help message

EXAMPLES:
  node importData.js --dry-run                    # Preview changes
  node importData.js                              # Apply changes (insert + update only)
  node importData.js --delete-orphans             # Apply all changes including deletions
  node importData.js --dry-run --delete-orphans   # Preview all changes including deletions

⚠️  IMPORTANT:
  - Always run with --dry-run first to preview changes
  - Use --delete-orphans carefully as it will remove records not in JSON
  - Make sure your .env file contains valid Supabase credentials
`)
    process.exit(0)
}

importData()
