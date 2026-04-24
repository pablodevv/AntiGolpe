
/*
  # Create brand_pages table for programmatic SEO

  1. New Tables
    - `brand_pages`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL slug like "amazon.com" or "paypal"
      - `brand` (text) - Display name of the brand/domain
      - `domain` (text) - The domain being analyzed
      - `seo_title` (text) - SEO-optimized title
      - `seo_h1` (text) - SEO-optimized H1
      - `seo_description` (text) - SEO meta description
      - `status` (text) - safe/suspicious/danger
      - `trust_score` (integer) - 0-100 trust score
      - `verification_data` (jsonb) - Full verification result from API
      - `ai_content` (jsonb) - AI-generated content (FAQ, analysis, etc.)
      - `schema_data` (jsonb) - Structured data for the page
      - `is_indexed` (boolean) - Whether Google indexing was requested
      - `indexed_at` (timestamptz) - When indexing was requested
      - `created_at` (timestamptz) - When the page was created
      - `updated_at` (timestamptz) - Last update

  2. Security
    - Enable RLS on `brand_pages` table
    - Public can read published pages
    - Only service role can insert/update (via edge functions)

  3. Indexes
    - Unique index on slug
    - Index on domain for lookups
*/

CREATE TABLE IF NOT EXISTS brand_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  brand text NOT NULL,
  domain text NOT NULL DEFAULT '',
  seo_title text NOT NULL,
  seo_h1 text NOT NULL,
  seo_description text NOT NULL,
  status text NOT NULL DEFAULT 'suspicious',
  trust_score integer NOT NULL DEFAULT 50,
  verification_data jsonb DEFAULT '{}',
  ai_content jsonb DEFAULT '{}',
  schema_data jsonb DEFAULT '{}',
  is_indexed boolean DEFAULT false,
  indexed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE brand_pages ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view published brand pages)
CREATE POLICY "Public can read brand pages"
  ON brand_pages FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can insert
CREATE POLICY "Service role can insert brand pages"
  ON brand_pages FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only service role can update
CREATE POLICY "Service role can update brand pages"
  ON brand_pages FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_brand_pages_slug ON brand_pages (slug);
CREATE INDEX IF NOT EXISTS idx_brand_pages_domain ON brand_pages (domain);
CREATE INDEX IF NOT EXISTS idx_brand_pages_created ON brand_pages (created_at DESC);
