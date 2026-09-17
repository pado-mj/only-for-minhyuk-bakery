# Only For Minhyuk Bakery — v0.4

Birthday cake & letter fan project for Minhyuk.

## v0.4 direction
- Mobile-first vintage bakery / scrapbook editor
- Cake types: Whole / Piece / Cut / 2-Layer
- Unified decoration sticker tray instead of many small categories
- Hand-drawn sticker set: strawberry, rose, ribbon, Maltese, humpback whale, whole cucumber, sunglasses, palette & oil-paint brush, plus selected legacy stickers
- Country stored as ISO 3166-1 alpha-2 code
- Live nickname / letter character counts
- Home navigation with unsaved-work confirmation
- Supabase DB + public `cakes` storage bucket
- Unique `/cake/{public_id}` detail URLs

## Data / deployment
Server environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The browser does not receive the Supabase secret. Cake creation goes through `/api/cakes`.

## Branch
Active redesign work lives on `v0.4`. `main` remains the previous deployed baseline until v0.4 is reviewed.
