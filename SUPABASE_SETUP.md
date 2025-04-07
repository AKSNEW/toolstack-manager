
# Supabase Database Setup

This document outlines the database structure needed for the application. You need to run the migration files located in the `supabase/migrations` directory.

## Available Migrations

1. `20250407_create_sites_table.sql` - Creates the sites table
2. `20250407_create_library_tables.sql` - Creates the library_items table
3. `20250407_create_wiring_diagrams_tables.sql` - Creates the wiring_diagrams and diagram_comments tables
4. `20250407_create_union_messages_table.sql` - Creates the union_messages table

## Existing Tables

The following tables should already exist in your database:

1. `crews` - Stores information about construction crews
2. `subcrews` - Stores information about specialized sub-crews
3. `employees` - Stores employee information
4. `profiles` - Stores user profile information

## How to Run Migrations

You can run these migrations in the Supabase dashboard SQL editor or by using the Supabase CLI.

### Using Supabase Dashboard

1. Go to your Supabase project
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of each migration file
5. Execute the query

### Using Supabase CLI

```bash
supabase migration up
```

## Table Relationships

- `sites` has an optional foreign key to `crews` (`crew_id`)
- `diagram_comments` has a foreign key to `wiring_diagrams` (`diagram_id`)

## Data Adapters

The application includes several adapter files to convert between database rows and application types:

- `supabase-adapters.ts` - For crews and subcrews
- `supabase-site-adapters.ts` - For sites
- `supabase-library-adapters.ts` - For library items
- `supabase-diagram-adapters.ts` - For wiring diagrams and comments
- `supabase-union-adapters.ts` - For union messages

These adapters should be used when interacting with the Supabase database to ensure proper data transformation.
