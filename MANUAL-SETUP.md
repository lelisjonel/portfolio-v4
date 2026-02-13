# Manual Strapi Setup Guide

## Step 1: Install Strapi

Open a new terminal and run:

```bash
npx create-strapi-app@latest strapi-backend --quickstart
cd strapi-backend
npm run develop
```

Wait for installation to complete (5-10 minutes). You'll see "Project information" when done.

## Step 2: Create Admin Account

1. Open browser to `http://localhost:1337/admin`
2. Fill in:
   - Email: your-email@example.com
   - Password: create a secure password
   - First Name: Jonel
   - Last Name: Lelis
3. Click "Let's Start"

## Step 3: Create Content Types

Go to **Content-Type Builder** in the left sidebar and create each collection:

### A. Projects Collection

1. Click **Create new collection type**
2. Name: `Project`
3. Add these fields:
   - `title` (Text → Short Text) ✓ Required
   - `slug` (UID) → Target field: title ✓ Required
   - `description` (Text → Long Text)
   - `thumbnail` (Media → Media) → Allowed types: Images
   - `category` (Text → Short Text)
   - `client` (Text → Short Text)
   - `websiteUrl` (Text → Short Text)
   - `featured` (Boolean → Boolean) → Default: false
   - `order` (Number → Integer) → Default: 0
4. Click **Finish** → **Save**

### B. Services Collection

1. Click **Create new collection type**
2. Name: `Service`
3. Add these fields:
   - `title` (Text → Short Text) ✓ Required
   - `slug` (UID) → Target field: title ✓ Required
   - `shortDescription` (Text → Short Text)
   - `description` (Text → Long Text)
   - `icon` (Media → Media) → Allowed types: Images
   - `order` (Number → Integer) → Default: 0
   - `isActive` (Boolean → Boolean) → Default: true
4. Click **Finish** → **Save**

### C. Testimonials Collection

1. Click **Create new collection type**
2. Name: `Testimonial`
3. Add these fields:
   - `name` (Text → Short Text) ✓ Required
   - `role` (Text → Short Text)
   - `company` (Text → Short Text)
   - `quote` (Text → Long Text) ✓ Required
   - `avatar` (Media → Media) → Allowed types: Images
   - `featured` (Boolean → Boolean) → Default: false
   - `order` (Number → Integer) → Default: 0
4. Click **Finish** → **Save**

### D. Contact Inquiries Collection

1. Click **Create new collection type**
2. Name: `Contact Inquiry`
3. Add these fields:
   - `name` (Text → Short Text) ✓ Required
   - `email` (Email) ✓ Required
   - `projectType` (Enumeration):
     - Options: `webflow-dev`, `interactions`, `cms`, `seo`, `other`
     - Default: `other`
   - `message` (Text → Long Text) ✓ Required
   - `status` (Enumeration):
     - Options: `new`, `read`, `responded`, `closed`
     - Default: `new`
   - `source` (Text → Short Text)
4. Click **Finish** → **Save**

## Step 4: Configure API Permissions

1. Click **Settings** in the left sidebar
2. Expand **Users & Permissions Plugin**
3. Click **Roles** → **Public**
4. Grant permissions:
   - **Project**: ✓ find, ✓ findOne
   - **Service**: ✓ find, ✓ findOne
   - **Testimonial**: ✓ find, ✓ findOne
   - **Contact Inquiry**: ✓ create
5. Click **Save**

## Step 5: Add Sample Content

### Add Projects

1. Click **Content Manager** → **Project** → **Create new entry**
2. Fill in fields:
   - Title: Nexus Finance
   - Category: Fintech
   - Client: Nexus Inc.
   - Upload thumbnail image
   - Featured: ✓
   - Order: 1
3. Click **Save** → **Publish**
4. Repeat for: Solara Health, Vertex Studio, Echo Commerce

### Add Testimonials

1. Click **Content Manager** → **Testimonial** → **Create new entry**
2. Fill in:
   - Name: Sarah Chen
   - Role: CEO
   - Company: Nexus Finance
   - Quote: Alex transformed our outdated site into a conversion machine. The animations alone increased our engagement by 40%.
   - Featured: ✓
3. Click **Save** → **Publish**
4. Repeat for other testimonials

## Step 6: Connect Frontend

1. Create `.env` file in your portfolio folder:
   ```
   VITE_STRAPI_URL=http://localhost:1337
   ```

2. Test by visiting `http://localhost:1337/api/projects?populate=*`

## Step 7: Start Frontend

```bash
# If using live-server
npx live-server

# Or open index.html in browser
```

## Done!

Your portfolio now uses Strapi CMS. Content updates made in Strapi will appear on your website automatically.

## Troubleshooting

- **Content not loading?** Check Strapi is running (`npm run develop`)
- **Permission errors?** Verify API permissions in Settings
- **Images not showing?** Ensure media permissions are set
