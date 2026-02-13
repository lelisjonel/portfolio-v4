/**
 * Strapi Setup Script
 * 
 * This script automates the creation of content types for the portfolio website.
 * 
 * Usage:
 * 1. First, create a new Strapi project:
 *    npx create-strapi-app@latest strapi-backend --quickstart
 *    cd strapi-backend
 *    npm run develop
 * 
 * 2. Create an admin user when prompted.
 * 
 * 3. Run this script to create content types programmatically:
 *    node setup-strapi.js
 * 
 * Note: For production use, you should create content types manually in the Strapi Admin
 * panel, or use the Strapi CLI for type generation.
 */

const fs = require('fs');
const path = require('path');

const CONTENT_TYPES_DIR = './src/api';

const contentTypes = {
    project: {
        schema: {
            kind: 'collectionType',
            collectionName: 'projects',
            info: { singularName: 'project', pluralName: 'projects', displayName: 'Project', description: '' },
            options: { draftAndPublish: true },
            pluginOptions: {},
            attributes: {
                title: { type: 'string', required: true },
                slug: { type: 'uid', targetField: 'title', required: true },
                description: { type: 'text' },
                thumbnail: { type: 'media', allowedTypes: ['images'], multiple: false },
                category: { type: 'string' },
                client: { type: 'string' },
                websiteUrl: { type: 'string' },
                featured: { type: 'boolean', default: false },
                order: { type: 'integer', default: 0 }
            }
        }
    },
    service: {
        schema: {
            kind: 'collectionType',
            collectionName: 'services',
            info: { singularName: 'service', pluralName: 'services', displayName: 'Service', description: '' },
            options: { draftAndPublish: true },
            pluginOptions: {},
            attributes: {
                title: { type: 'string', required: true },
                slug: { type: 'uid', targetField: 'title', required: true },
                shortDescription: { type: 'string' },
                description: { type: 'text' },
                icon: { type: 'media', allowedTypes: ['images'], multiple: false },
                order: { type: 'integer', default: 0 },
                isActive: { type: 'boolean', default: true }
            }
        }
    },
    testimonial: {
        schema: {
            kind: 'collectionType',
            collectionName: 'testimonials',
            info: { singularName: 'testimonial', pluralName: 'testimonials', displayName: 'Testimonial', description: '' },
            options: { draftAndPublish: true },
            pluginOptions: {},
            attributes: {
                name: { type: 'string', required: true },
                role: { type: 'string' },
                company: { type: 'string' },
                quote: { type: 'text', required: true },
                avatar: { type: 'media', allowedTypes: ['images'], multiple: false },
                featured: { type: 'boolean', default: false },
                order: { type: 'integer', default: 0 }
            }
        }
    },
    contactInquiry: {
        schema: {
            kind: 'collectionType',
            collectionName: 'contact_inquiries',
            info: { singularName: 'contact-inquiry', pluralName: 'contact-inquiries', displayName: 'Contact Inquiry', description: '' },
            options: { draftAndPublish: false },
            pluginOptions: {},
            attributes: {
                name: { type: 'string', required: true },
                email: { type: 'email', required: true },
                projectType: { type: 'enumeration', enum: ['webflow-dev', 'interactions', 'cms', 'seo', 'other'], default: 'other' },
                message: { type: 'text', required: true },
                status: { type: 'enumeration', enum: ['new', 'read', 'responded', 'closed'], default: 'new' },
                source: { type: 'string' }
            }
        }
    },
    siteSetting: {
        schema: {
            kind: 'singleType',
            collectionName: 'site_settings',
            info: { singularName: 'site-setting', pluralName: 'site-settings', displayName: 'Site Setting', description: '' },
            options: { draftAndPublish: true },
            pluginOptions: {},
            attributes: {
                siteName: { type: 'string', default: 'Jonel Lelis Portfolio' },
                siteDescription: { type: 'text' },
                logo: { type: 'media', allowedTypes: ['images'], multiple: false },
                socialLinks: { type: 'json' },
                contactEmail: { type: 'email' }
            }
        }
    }
};

async function createContentTypes() {
    console.log('🚀 Creating Strapi content types...\n');

    for (const [name, config] of Object.entries(contentTypes)) {
        const dir = path.join(CONTENT_TYPES_DIR, name);
        const schemaPath = path.join(dir, 'content-types', name, 'schema.json');

        console.log(`Creating ${name}...`);

        // Create directory structure
        const schemaDir = path.dirname(schemaPath);
        if (!fs.existsSync(schemaDir)) {
            fs.mkdirSync(schemaDir, { recursive: true });
        }

        // Write schema.json
        fs.writeFileSync(schemaPath, JSON.stringify(config.schema, null, 2));
        console.log(`  ✓ Created ${schemaPath}`);
    }

    console.log('\n✅ Content types created successfully!');
    console.log('\nNext steps:');
    console.log('1. Restart your Strapi development server');
    console.log('2. Go to Content-Type Builder to verify the types were created');
    console.log('3. Configure API permissions (Settings > Users & Permissions > Roles > Public)');
    console.log('4. Start adding content!\n');
}

// Run if executed directly
if (require.main === module) {
    createContentTypes().catch(console.error);
}

module.exports = { contentTypes, createContentTypes };
