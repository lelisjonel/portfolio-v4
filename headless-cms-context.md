# Strapi Headless CMS Integration

This document outlines the Strapi CMS setup for the Jonel Lelis portfolio website.

## Quick Start

### 1. Install Strapi

```bash
npx create-strapi-app@latest strapi-backend --quickstart
cd strapi-backend
npm run develop
```

### 2. Create Content Types

Create the following collections in Strapi Admin:

- **Projects** - Portfolio work samples
- **Services** - Service offerings  
- **Testimonials** - Client testimonials
- **Contact Inquiries** - Form submissions

Use the schemas in the **Content Types Schema** section below.

### 3. Configure API Permissions

1. Go to **Settings > Users & Permissions Plugin > Roles**
2. For **Public** role, grant:
   - `find` and `findOne` for: projects, services, testimonials
   - `create` for: contact-inquiries

### 4. Deploy Strapi (Optional)

Recommended options:
- **Strapi Cloud** - Official hosting (strapi.cloud)
- **Render** - render.com (free tier available)
- **Railway** - railway.app
- **DigitalOcean** - App Platform

### 5. Update Frontend Environment

```bash
cp .env.example .env
# Edit .env with your Strapi URL
```

## Content Types Schema

See below for detailed field schemas for each content type.

## Content Types Schema

### 1. Projects Collection

**API Endpoint:** `/api/projects`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| title | Text (Short) | Project name |
| slug | UID | URL-friendly identifier |
| description | Text (Long) | Project description |
| thumbnail | Media (Image) | Project featured image |
| category | Text (Short) | Project category (e.g., "Fintech", "Healthcare") |
| client | Text (Short) | Client name |
| websiteUrl | Text (Short) | Live URL |
| featured | Boolean | Feature on homepage |
| order | Number | Display order |
| createdAt | Date | Creation date |

**Example JSON Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Nexus Finance",
        "slug": "nexus-finance",
        "description": "A fintech platform for modern banking",
        "category": "Fintech",
        "client": "Nexus Inc.",
        "websiteUrl": "https://nexus.finance",
        "featured": true,
        "order": 1,
        "thumbnail": {
          "data": {
            "attributes": {
              "url": "/uploads/nexus-finance-thumb.jpg"
            }
          }
        }
      }
    }
  ]
}
```

### 2. Services Collection

**API Endpoint:** `/api/services`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| title | Text (Short) | Service name |
| slug | UID | URL-friendly identifier |
| description | Text (Long) | Service description |
| shortDescription | Text (Short) | Brief summary |
| icon | Media (Image) | Service icon |
| order | Number | Display order |
| isActive | Boolean | Visible on site |

**Example JSON Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Webflow Development",
        "slug": "webflow-development",
        "shortDescription": "Custom-built Webflow sites from Figma designs",
        "order": 1,
        "icon": {
          "data": {
            "attributes": {
              "url": "/uploads/code-icon.svg"
            }
          }
        }
      }
    }
  ]
}
```

### 3. Testimonials Collection

**API Endpoint:** `/api/testimonials`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| name | Text (Short) | Author name |
| role | Text (Short) | Author role/title |
| company | Text (Short) | Company name |
| quote | Text (Long) | Testimonial text |
| avatar | Media (Image) | Author photo |
| featured | Boolean | Feature in marquee |
| order | Number | Display order |

**Example JSON Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Sarah Chen",
        "role": "CEO",
        "company": "Nexus Finance",
        "quote": "Alex transformed our outdated site into a conversion machine.",
        "featured": true,
        "order": 1,
        "avatar": {
          "data": {
            "attributes": {
              "url": "/uploads/sarah-chen.jpg"
            }
          }
        }
      }
    }
  ]
}
```

### 4. Contact Inquiries Collection

**API Endpoint:** `/api/contact-inquiries`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| name | Text (Short) | Client name |
| email | Text (Short) | Client email |
| projectType | Enumeration | Service type |
| message | Text (Long) | Project details |
| status | Enumeration | new, read, responded, closed |
| source | Text (Short) | Website origin |
| createdAt | Date | Submission date |

**Enumeration Values for projectType:**
- `webflow-dev` - Webflow Development
- `interactions` - Interactions & Animations
- `cms` - CMS & Dynamic Content
- `seo` - SEO & Performance
- `other` - Other

**Enumeration Values for status:**
- `new` - Default, needs review
- `read` - Message reviewed
- `responded` - Client contacted
- `closed` - Project completed/archived

## API Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=your-api-token-here
```

### Strapi Permissions

1. Go to **Settings > Users & Permissions Plugin > Roles**
2. For **Public** role, grant:
   - `find` and `findOne` for: projects, services, testimonials
   - `create` for: contact-inquiries
3. For **Authenticated** role (for admin features):
   - Full access to all collections

## Usage Examples

### Fetch Projects

```javascript
import StrapiAPI from './strapi-api.js';

const projects = await StrapiAPI.getProjects({
    populate: ['thumbnail', 'category'],
    sort: '-createdAt'
});
```

### Submit Contact Form

```javascript
const result = await StrapiAPI.submitContactForm({
    name: 'John Doe',
    email: 'john@example.com',
    projectType: 'webflow-dev',
    message: 'I need a portfolio website'
});
```

## Setup Instructions

### 1. Install Strapi

```bash
npx create-strapi-app@latest strapi-backend --quickstart
```

### 2. Create Content Types

Use the Schema definitions above to create collections in Strapi Admin.

### 3. Configure API

Set permissions for public access as described above.

### 4. Deploy Strapi

Recommended options:
- **Strapi Cloud** - Official hosting
- **Render** - Free tier available
- **Railway** - Easy deployment
- **DigitalOcean** - Self-hosted option

### 5. Update Frontend

Replace static content with dynamic data from Strapi using the `StrapiAPI` service.

## Migration from Static Content

The current website has static content that should be migrated to Strapi:

1. **Projects:** 4 featured projects (Nexus Finance, Solara Health, Vertex Studio, Echo Commerce)
2. **Services:** 4 services (Webflow Development, Interactions & Animations, CMS & Dynamic Content, SEO & Performance)
3. **Testimonials:** 4 testimonials with duplicates for marquee effect
4. **Contact Form:** Fields for name, email, project type, message

## Fallback Strategy

If Strapi is unavailable, the website should display fallback static content. The JavaScript API includes error handling to gracefully degrade to static data.

## Next Steps

- [ ] Set up Strapi project
- [ ] Create content types
- [ ] Add initial content
- [ ] Configure API permissions
- [ ] Deploy Strapi backend
- [ ] Update frontend to use dynamic data
- [ ] Set up form notifications
