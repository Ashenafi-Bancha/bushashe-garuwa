# Bushaashe Garuwa — original photos

Put the **full-size original photos** here, in the folder for the part of the website they belong to.
These are the master copies. The website uses smaller web copies that are made automatically.

| Folder | What goes here | Used on |
|---|---|---|
| `grounds/` | Landscape, gardens, lawns, gate, buildings from outside | Home, About, Discover, banners |
| `cultural-houses/` | Traditional Wolaita houses — outside and inside | Heritage |
| `trees-plants/` | Heritage trees, ensete, plants | Heritage |
| `animals/` | Animals on the site | Heritage |
| `artifacts/` | Tools, crafts, ceremonial objects | Heritage |
| `clothing/` | Traditional clothing and accessories | Heritage |
| `music-dance/` | Musicians, instruments, dance | Heritage, Experiences |
| `food/` | Dishes, coffee ceremony, cooking | Dine, Experiences |
| `rooms/` | Guesthouse rooms and bathrooms | Stay |
| `restaurant-bar/` | Dining area, bar, drinks | Dine |
| `people/` | Elders, storytellers, family, staff | About, oral history |
| `library/` | Books, archive, reading room | Library |
| `brand/` | Logo master file (the site uses a small copy in `src/assets/brand/`) | Header, footer |
| `events/<event-name>/` | One sub-folder per event, e.g. `events/gifaataa/` | Events, gallery |

## Adding photos

1. Copy the photos into the right folder. Any name is fine; clear names help, e.g. `coffee-ceremony-1.jpg`.
2. In the project folder, run:
   ```
   pnpm photos
   ```
   This creates web-ready copies in `src/assets/photos/<same folder>/`: turned the right way up, resized
   to at most 1920 px, compressed to a few hundred KB, with location data removed.
3. Register the new photo in `src/assets/photos.ts` and add its description in the language files
   (see the steps at the top of `photos.ts`), or ask for help placing it on the right page.

Tips:
- Landscape (wide) photos work best for page banners; square or portrait photos suit cards.
- Formats: JPG, PNG or WEBP. iPhone HEIC photos must be exported as JPG first.
- Only put photos here that the client has approved for the public website.
