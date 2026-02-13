# Strapi Setup Guide for Portfolio v4

## Quick Setup (Automated)

### Step 1: Create Strapi Project

```bash
# Create a new Strapi project
npx create-strapi-app@latest strapi-backend --quickstart

# Navigate to the project
cd strapi-backend

# Start the development server
npm run develop
```

### Step 2: Create Admin Account

When Strapi starts, you'll be prompted to create an admin user:
- Fill in your details
- This gives you access to the Strapi Admin panel at `http://localhost:1337/admin`

### Step 3: Create Content Types

Option A: Manual (Recommended for beginners)
1. Go to **Content-Type Builder** in the sidebar
2. Click **Create new collection type**
3. Add fields using the schema from [`headless-cms-context.md`](headless-cms-context.md)

Option B: Automated (Run the setup script)
```bash
# Copy the setup script to your Strapi project
cp setup-strapi.js strapi-backend/

# Run it
cd strapi-backend
node setup-strapi.js

# Restart Strapi
npm run develop
```

### Step 4: Configure API Permissions

1. Go to **Settings** > **Users & Permissions Plugin** > **Roles**
2. Click on **Public** role
3. Grant permissions:
   - **Projects**: `find`, `findOne`
   - **Services**: `find`, `findOne`
   - **Testimonials**: `find`, `findOne`
   - **Contact Inquiries**: `create`
4. Click **Save**

### Step 5: Add Sample Content

1. Go to **Content Manager**
2. Create entries for:
   - Projects (add your portfolio work)
   - Services (add your service offerings)
   - Testimonials (add client reviews)

### Step 6: Connect Frontend

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set your Strapi URL
# For local development: VITE_STRAPI_URL=http://localhost:1337
# For production: VITE_STRAPI_URL=https://your-strapi-app.herokuapp.com
```

## Content Types Overview

### Projects
| Field | Type | Description |
|-------|------|-------------|
| title | Text | Project name |
| slug | UID | URL-friendly ID |
| description | Long Text | Project details |
| thumbnail | Media | Featured image |
| category | Text | Project category |
| client | Text | Client name |
| websiteUrl | Text | Live URL |
| featured | Boolean | Show on homepage |

### Services
| Field | Type | Description |
|-------|------|-------------|
| title | Text | Service name |
| slug | UID | URL-friendly ID |
| shortDescription | Text | Brief summary |
| description | Long Text | Full details |
| icon | Media | Service icon |
| order | Number | Display order |

### Testimonials
| Field | Type | Description |
|-------|------|-------------|
| name | Text | Author name |
| role | Text | Author role |
| company | Text | Company name |
| quote | Long Text | Testimonial text |
| avatar | Media | Author photo |
| featured | Boolean | Show in marquee |

### Contact Inquiries
| Field | Type | Description |
|-------|------|-------------|
| name | Text | Client name |
| email | Email | Client email |
| projectType | Enumeration | Service type |
| message | Long Text | Project details |
| status | Enumeration | new/read/responded/closed |

## Deployment Options

### Option 1: Strapi Cloud (Recommended)
1. Sign up at [strapi.cloud](https://strapi.cloud)
2. Create a new project
3. Connect your Git repository
4. Deploy

### Option 2: Render
1. Create account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your Strapi repository
4. Set build command: `npm install`
5. Set start command: `npm run start`
6. Add environment variables in Render dashboard

### Option 3: Railway
1. Sign up at [railway.app](https://railway.app)
2. Deploy from GitHub
3. Add PostgreSQL database
4. Set environment variables

### Option 4: DigitalOcean App Platform
1. Create account at [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Create new app from GitHub
3. Add PostgreSQL database
4. Configure environment variables

## Environment Variables for Production

Create a `.env` file in your Strapi project:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
JWT_SECRET=tobemodified

# Database (PostgreSQL recommended for production)
DATABASE_CLIENT=postgres
DATABASE_FILENAME=.tmp/data.db
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=your_db_host

# Optional: Email provider (SendGrid, Mailgun, etc.)
EMAIL_PROVIDER=sendgrid
EMAIL_ADDRESS=your@email.com
EMAIL_TOKEN=your_email_token
```

## Frontend Configuration

Update your frontend `.env` file:

```env
# Local development
VITE_STRAPI_URL=http://localhost:1337

# Production (replace with your Strapi URL)
VITE_STRAPI_URL=https://your-strapi-app.herokuapp.com
VITE_STRAPI_TOKEN=your-public-api-token
```

## Troubleshooting

### Content not loading?
- Check Strapi is running: `http://localhost:1337/api/projects`
- Verify API permissions: Settings > Users & Permissions > Roles > Public
- Check browser console for errors

### Images not showing?
- Configure media library permissions
- Check Strapi server logs for upload errors
- Verify image URLs are correct

### Form submissions failing?
- Ensure POST permission is enabled for contact-inquiries
- Check Strapi logs for validation errors
- Verify form data matches schema requirements

## Need Help?

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi Community](https://discord.gg/strapi)
- [GitHub Issues](https://github.com/strapi/strapi/issues)
