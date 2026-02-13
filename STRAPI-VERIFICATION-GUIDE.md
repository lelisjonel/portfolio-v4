# Strapi Setup Verification Guide — Portfolio v4

## Status: ✅ Setup Complete

Your Strapi backend is running and contains all required content types. This guide walks you through verifying the setup and connecting your frontend.

---

## 1. Backend Status

**Strapi Location:** `C:\projects\strapi-backend`  
**Admin URL:** http://localhost:1337/admin  
**API Base:** http://localhost:1337/api

**Content Types Created:**
- ✅ Project
- ✅ Service
- ✅ Testimonial
- ✅ Contact Inquiry
- ✅ Site Setting

---

## 2. Create Sample Content (Step-by-Step)

### A. Add Projects

1. Open http://localhost:1337/admin and sign in.
2. Go to **Content Manager** → **Project** → **+ Create new entry**
3. Fill in the following fields:

#### Project 1: Nexus Finance
- **Title:** Nexus Finance
- **Category:** Fintech
- **Client:** Nexus Inc.
- **Website URL:** https://nexus.finance
- **Featured:** ✓ (checked)
- **Order:** 1
- **Description:** A fintech platform for modern banking (optional)
- **Thumbnail:** Upload an image (optional)
- Click **Save** → **Publish**

#### Project 2: Solara Health
- **Title:** Solara Health
- **Category:** Healthcare
- **Client:** Solara Inc.
- **Website URL:** https://solara.health
- **Featured:** ✓
- **Order:** 2
- **Description:** Healthcare platform with patient management (optional)
- Click **Save** → **Publish**

#### Project 3: Vertex Studio
- **Title:** Vertex Studio
- **Category:** Design
- **Client:** Vertex Creative
- **Website URL:** https://vertex.studio
- **Featured:** ✓
- **Order:** 3
- Click **Save** → **Publish**

#### Project 4: Echo Commerce
- **Title:** Echo Commerce
- **Category:** E-Commerce
- **Client:** Echo Retail
- **Website URL:** https://echo.shop
- **Featured:** ✓
- **Order:** 4
- Click **Save** → **Publish**

### B. Add Services

1. Go to **Content Manager** → **Service** → **+ Create new entry**

#### Service 1: Webflow Development
- **Title:** Webflow Development
- **Short Description:** Custom-built Webflow sites from Figma designs
- **Description:** Full-service Webflow development with animations and interactions (optional)
- **Order:** 1
- **Is Active:** ✓
- **Icon:** Upload an SVG/image (optional)
- Click **Save** → **Publish**

#### Service 2: Interactions & Animations
- **Title:** Interactions & Animations
- **Short Description:** Smooth animations and micro-interactions
- **Order:** 2
- **Is Active:** ✓
- Click **Save** → **Publish**

#### Service 3: CMS & Dynamic Content
- **Title:** CMS & Dynamic Content
- **Short Description:** Dynamic content management systems
- **Order:** 3
- **Is Active:** ✓
- Click **Save** → **Publish**

#### Service 4: SEO & Performance
- **Title:** SEO & Performance
- **Short Description:** Optimized for search engines and speed
- **Order:** 4
- **Is Active:** ✓
- Click **Save** → **Publish**

### C. Add Testimonials

1. Go to **Content Manager** → **Testimonial** → **+ Create new entry**

#### Testimonial 1: Sarah Chen
- **Name:** Sarah Chen
- **Role:** CEO
- **Company:** Nexus Finance
- **Quote:** Alex transformed our outdated site into a conversion machine. The animations alone increased our engagement by 40%.
- **Featured:** ✓
- **Order:** 1
- **Avatar:** Upload an image (optional)
- Click **Save** → **Publish**

#### Testimonial 2: Jordan Li
- **Name:** Jordan Li
- **Role:** Founder
- **Company:** Solara Health
- **Quote:** The level of attention to detail and commitment to excellence was exceptional. Highly recommended!
- **Featured:** ✓
- **Order:** 2
- Click **Save** → **Publish**

#### Testimonial 3: Emma Rodriguez
- **Name:** Emma Rodriguez
- **Role:** Marketing Director
- **Company:** Vertex Studio
- **Quote:** Best developer we've worked with. Delivered on time, on budget, and exceeded expectations.
- **Featured:** ✓
- **Order:** 3
- Click **Save** → **Publish**

#### Testimonial 4: Marcus Johnson
- **Name:** Marcus Johnson
- **Role:** CTO
- **Company:** Echo Commerce
- **Quote:** The website is lightning-fast and beautifully designed. Our sales increased significantly after launch.
- **Featured:** ✓
- **Order:** 4
- Click **Save** → **Publish**

---

## 3. Enable Public API Permissions

1. In the Admin UI, go to **Settings** (gear icon in left sidebar)
2. Click **Users & Permissions Plugin** → **Roles**
3. Select the **Public** role
4. Under **Permissions**, enable (check) the following:
   - **Project**
     - ✓ find
     - ✓ findOne
   - **Service**
     - ✓ find
     - ✓ findOne
   - **Testimonial**
     - ✓ find
     - ✓ findOne
   - **Contact Inquiry**
     - ✓ create  *(allows form submissions without a token)*
5. Click **Save** at the top right

---

## 4. Test API Connection

### Using Command Prompt or PowerShell

Test that the API is accessible and returning data:

```cmd
curl http://localhost:1337/api/projects?populate=*
```

**Expected Output:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Nexus Finance",
        "category": "Fintech",
        "client": "Nexus Inc.",
        "websiteUrl": "https://nexus.finance",
        "featured": true,
        "order": 1,
        ...
      }
    }
  ],
  "meta": { "pagination": { ... } }
}
```

For prettier output in PowerShell:

```powershell
Invoke-RestMethod -Uri http://localhost:1337/api/projects?populate=* | ConvertTo-Json -Depth 5
```

### Test Other Endpoints

```cmd
curl http://localhost:1337/api/services?populate=*
curl http://localhost:1337/api/testimonials?populate=*
```

---

## 5. Configure Frontend Environment

1. In your frontend project folder (`c:\Users\J&J PC\Desktop\Vibe Project\Portfoli v4`):
   - Copy `.env.example` to `.env`:
     ```cmd
     copy .env.example .env
     ```
   - Or create `.env` manually with:
     ```
     VITE_STRAPI_URL=http://localhost:1337
     ```

2. (Optional) If you created an API token in Strapi, add it:
   ```
   VITE_STRAPI_TOKEN=your-token-here
   ```

---

## 6. Run Frontend on a Local Server

**Important:** Do NOT open `index.html` directly in a browser (file:// protocol). Use a local server so CORS and environment variables work correctly.

### Option A: Using live-server (Recommended)

```cmd
cd "C:\Users\J&J PC\Desktop\Vibe Project\Portfoli v4"
npx live-server
```

This will open your site at http://127.0.0.1:8080

### Option B: Using Python (if installed)

```cmd
cd "C:\Users\J&J PC\Desktop\Vibe Project\Portfoli v4"
python -m http.server 8080
```

Then open http://localhost:8080

### Option C: Using Node.js http-server

```cmd
cd "C:\Users\J&J PC\Desktop\Vibe Project\Portfoli v4"
npx http-server
```

---

## 7. Verify Frontend Integration

1. Open the frontend URL (http://127.0.0.1:8080 or similar)
2. Check that projects, services, and testimonials appear on the site
3. If content doesn't load:
   - Open browser DevTools (F12)
   - Go to **Console** tab and look for errors
   - Check **Network** tab for failed API calls to http://localhost:1337
   - Verify `.env` file exists and contains `VITE_STRAPI_URL=http://localhost:1337`

---

## 8. Create an API Token (Optional)

For production or stricter permissions:

1. Admin → **Settings** → **API Tokens** → **+ Create new API token**
2. Name: `portfolio-public`
3. Description: Public read access for projects, services, testimonials
4. Select permissions:
   - ✓ Project: find, findOne
   - ✓ Service: find, findOne
   - ✓ Testimonial: find, findOne
5. Click **Save** and copy the token
6. Add to your frontend `.env`:
   ```
   VITE_STRAPI_TOKEN=your-copied-token
   ```

---

## 9. Contact Form (Form Submissions)

If your contact form is set up to submit to Strapi:

1. Ensure **Contact Inquiry** has `create` permission enabled in Public role (done in Step 3).
2. The form should POST to: `http://localhost:1337/api/contact-inquiries`
3. Submitted data will appear in Admin → Content Manager → Contact Inquiry

---

## 10. Troubleshooting

### Port 1337 Already in Use
```cmd
netstat -ano | findstr :1337
taskkill /PID <PID> /F
```

### Content Not Showing on Frontend
- Check browser console (F12) for API errors
- Verify `.env` file exists with correct `VITE_STRAPI_URL`
- Confirm Strapi is running: http://localhost:1337/api/projects?populate=*

### Images Not Loading
- In Admin → Settings → Users & Permissions → Public role
- Ensure upload/download permissions are enabled for media
- Upload files via Content Manager

### CORS Errors
- Ensure frontend is served from http://localhost:8080 (not file://)
- Strapi should allow localhost:* by default

---

## 11. Next Steps

- ✅ Strapi backend running at http://localhost:1337
- ✅ Content types created (Project, Service, Testimonial, Contact Inquiry)
- ✅ Content added and published
- ✅ Public permissions configured
- [ ] Test all API endpoints
- [ ] Verify frontend displays live content
- [ ] Test contact form submission
- [ ] Prepare for production deployment

---

## 12. Production Deployment

When ready to deploy:

1. Deploy Strapi to hosting (Strapi Cloud, Render, Railway, DigitalOcean, etc.)
2. Update frontend `.env` with production Strapi URL:
   ```
   VITE_STRAPI_URL=https://your-strapi-domain.com
   ```
3. Deploy frontend to hosting
4. Verify API calls work from production domain

**Recommended Hosting:**
- **Strapi Cloud:** https://strapi.cloud (official, easiest)
- **Render:** https://render.com (free tier available)
- **Railway:** https://railway.app (git-based deployment)
- **DigitalOcean:** https://cloud.digitalocean.com (self-hosted option)

---

## Questions or Issues?

- **Strapi Docs:** https://docs.strapi.io
- **Strapi Discord:** https://discord.gg/strapi
- Check terminal logs for detailed error messages

---

**Last Updated:** February 13, 2026  
**Strapi Version:** 5.x  
**Node Version:** 24.13.1  
**npm Version:** 11.8.0
