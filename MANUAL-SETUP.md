# Portfolio Setup Guide (Supabase CMS)

## Step 1: Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → **SQL Editor**
3. Paste the contents of `supabase-schema.sql` and click **Run**
   - This creates the `projects`, `testimonials`, and `contact_inquiries` tables
   - Sets up Row Level Security (RLS) policies
   - Seeds sample data

## Step 2: Create an Admin User

To access the Admin Dashboard, you need a Supabase Auth user:

1. In Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter your email and password
4. Click **Create User**

## Step 3: Run the Portfolio

```bash
# Using live-server
npx live-server

# Or simply open index.html in your browser
```

## Step 4: Access the Admin Dashboard

1. Open `admin.html` in your browser (e.g. `http://localhost:8080/admin.html`)
2. Log in with the email/password you created in Step 2
3. From the dashboard you can:
   - **Projects**: Add, edit, delete portfolio projects
   - **Testimonials**: Manage client testimonials
   - **Inquiries**: View and manage contact form submissions

## How It Works

| File | Purpose |
|------|---------|
| `supabase-api.js` | Connects to Supabase (URL + anon key hardcoded) |
| `script.js` | Loads projects & testimonials from Supabase, falls back to hardcoded data if disconnected |
| `admin.html` / `admin.js` / `admin.css` | Admin dashboard for content management |
| `supabase-schema.sql` | Database schema (run once in Supabase SQL Editor) |

## Troubleshooting

- **Content not loading?** Check browser console for Supabase errors
- **Admin login fails?** Ensure you created a user in Supabase Auth (Step 2)
- **Form submissions not saving?** Verify the `contact_inquiries` RLS policy allows anon inserts
