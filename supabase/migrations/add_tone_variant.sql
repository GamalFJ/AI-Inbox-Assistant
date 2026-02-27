-- Migration: Add tone_variant column to drafts table
-- Run this in the Supabase SQL Editor

ALTER TABLE drafts
ADD COLUMN IF NOT EXISTS tone_variant TEXT CHECK (tone_variant IN ('formal', 'casual', 'short'));

-- Optional: set existing drafts to 'formal' as a default
UPDATE drafts SET tone_variant = 'formal' WHERE tone_variant IS NULL;
