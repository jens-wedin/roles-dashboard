# Data Sync Workflow - Quick Reference

This guide shows how to sync JSON file changes from GitHub PRs back to your Supabase database.

## When You Receive a PR

Someone has submitted changes to `design_roles_data.json`. Here's what to do:

### Step 1: Review the PR on GitHub
- Check what roles were added, modified, or removed
- Review the changes for accuracy
- Merge the PR if everything looks good

### Step 2: Pull Changes Locally
```bash
git pull origin main
```

### Step 3: Preview Changes (Dry Run)
```bash
npm run data:import:dry
```

This shows you exactly what will change without modifying the database:
- ✅ Unchanged records
- ➕ New records to insert
- ✏️ Existing records to update
- ❌ Records to delete (only if using `--delete-orphans`)

### Step 4: Apply Changes
```bash
npm run data:import
```

This syncs the changes to Supabase (insert + update only).

### Step 5: Verify
- Check your Supabase dashboard
- Verify the changes were applied correctly

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run data:export` | Export all data from Supabase to JSON |
| `npm run data:import:dry` | Preview changes without applying |
| `npm run data:import` | Apply changes (insert + update) |
| `npm run data:import:dry-all` | Preview all changes including deletions |
| `npm run data:import:all` | Apply all changes including deletions |

## Safety Features

✅ **Dry run by default** - Always preview first  
✅ **No deletions** - Unless you use `--delete-orphans`  
✅ **Change detection** - Only updates what changed  
✅ **Detailed logging** - See exactly what happens  

## Example Output

```
🔄 Starting import process...
⚠️  DRY RUN MODE - No changes will be made

📖 Read 160 records from JSON file
📥 Fetching existing data from Supabase...
📊 Found 158 existing records in database

📋 CHANGE SUMMARY:
──────────────────────────────────────────────────
✅ Unchanged:     157
➕ To Insert:     2
✏️  To Update:     1
❌ To Delete:     0
──────────────────────────────────────────────────
📊 Total Changes: 3

➕ NEW ROLES TO INSERT:
   - AI Ethics Designer
   - Metaverse Designer

✏️  ROLES TO UPDATE:
   - Product Designer

✅ Dry run complete. No changes were made.
💡 Run without --dry-run to apply these changes.
```

## Tips

💡 **Always run dry-run first** to see what will change  
💡 **Keep JSON and DB in sync** by exporting regularly  
💡 **Use version control** - commit JSON changes with meaningful messages  
💡 **Test locally** before applying to production  

## Troubleshooting

**Q: Import script shows errors about missing credentials**  
A: Make sure your `.env` file exists and contains valid Supabase credentials

**Q: Changes aren't showing up in Supabase**  
A: Run with `--dry-run` first to see if changes are detected. Check for errors in the output.

**Q: I want to delete records that were removed from JSON**  
A: Use `npm run data:import:all` (but preview with `npm run data:import:dry-all` first!)
