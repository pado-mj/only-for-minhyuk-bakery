# Only For Minhyuk Bakery v0.1

Vercel + Supabase starter implementation.

## Supabase
1. Create a project.
2. SQL Editor: run `supabase/schema.sql`.
3. Storage: create a **public** bucket named `cakes`.
4. Do not expose the service role key in client code.

## Vercel
Set environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Then import this folder/repository into Vercel and deploy.

## Local
Install Vercel CLI and run `vercel dev` after adding `.env.local` with the two variables.

## Current v0.1 status
- Mobile-only shell
- Birthday Table with NEW / MOST VIEWED / RANDOM
- Cake/background color editor
- Placeholder decoration objects
- Classic + number candle prototype
- Letter/final review
- Server-side submission
- Supabase persistence + Storage
- Public cake detail/share link
- Save image / copy link
- Nov 3 KST candle interaction

## Before public launch
- Replace emoji placeholders with the approved vintage PNG/WebP asset set.
- Implement touch object transform handles (move/scale/rotate/z-order) and undo/redo.
- Add country predefined selector + KO/EN/JA localization.
- Add rate limiting + Turnstile/CAPTCHA.
- Replace view increment with an atomic RPC + duplicate-view token/cookie.
- Add operator moderation workflow.
- QA Safari iOS / Chrome Android.

## v0.2 editor update
- `/style-test.html`: actual visual asset style-test sheet
- `/assets/style-test-concept.png`: generated visual direction board
- `/assets/*.svg`: production-replaceable transparent vector asset set
- Touch/pointer drag selection on the 1080×1080 editor canvas
- Scale / rotate / delete / duplicate / front / back controls
- Undo / redo / reset
- Preset + custom topper
- Classic / heart / dog / number candles with limits
- User PNG/JPG/WebP/HEIC/HEIF import (max 30MB); source is kept browser-local and is not included in submitted cake JSON. HEIC/HEIF decoding depends on browser support; unsupported files receive a conversion 안내.

The included SVGs are the first usable asset set, not a claim that the visual library is final. Replace or expand individual files under `/assets` without changing editor logic as long as filenames/asset IDs are preserved.
