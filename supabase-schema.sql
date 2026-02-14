-- =============================================
-- Supabase Schema for Portfolio v4
-- Run this in the Supabase SQL Editor
-- =============================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT '',
    client TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    company TEXT DEFAULT '',
    quote TEXT NOT NULL,
    featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project_type TEXT DEFAULT 'other',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Projects: public read, authenticated write
CREATE POLICY "Allow public read on projects"
    ON projects FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on projects"
    ON projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on projects"
    ON projects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on projects"
    ON projects FOR DELETE
    TO authenticated
    USING (true);

-- Testimonials: public read, authenticated write
CREATE POLICY "Allow public read on testimonials"
    ON testimonials FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on testimonials"
    ON testimonials FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on testimonials"
    ON testimonials FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on testimonials"
    ON testimonials FOR DELETE
    TO authenticated
    USING (true);

-- Contact Inquiries: public insert (for the contact form), authenticated read/update/delete
CREATE POLICY "Allow public insert on contact_inquiries"
    ON contact_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read on contact_inquiries"
    ON contact_inquiries FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated update on contact_inquiries"
    ON contact_inquiries FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on contact_inquiries"
    ON contact_inquiries FOR DELETE
    TO authenticated
    USING (true);

-- =============================================
-- Seed Data (Optional — sample content)
-- =============================================

INSERT INTO projects (title, slug, category, client, thumbnail_url, featured) VALUES
    ('Nexus Finance', 'nexus-finance', 'Fintech', 'Nexus Inc.', '', true),
    ('Solara Health', 'solara-health', 'Healthcare', 'Solara Corp.', '', true),
    ('Vertex Studio', 'vertex-studio', 'Creative Agency', 'Vertex LLC', '', true),
    ('Echo Commerce', 'echo-commerce', 'E-commerce', 'Echo Ltd.', '', true);

INSERT INTO testimonials (name, role, company, quote, featured) VALUES
    ('Sarah Chen', 'CEO', 'Nexus Finance', 'Jonel transformed our outdated site into a conversion machine. The animations alone increased our engagement by 40%.', true),
    ('Marcus Webb', 'Founder', 'Vertex Studio', 'Best Webflow developer I''ve worked with. Fast, detail-oriented, and the final product always exceeds expectations.', true),
    ('Dr. Lisa Park', 'Director', 'Solara Health', 'The CMS structure Jonel built lets our team update content effortlessly. It''s exactly what we needed to scale.', true),
    ('James Okafor', 'Co-founder', 'Echo Commerce', 'Working with Jonel felt like having a creative partner, not just a developer. Highly recommend.', true);
