# Music API Integration - Update

## Overview
The application has been successfully updated to use **iTunes Search API** instead of local manifest files. This provides access to millions of high-quality music tracks without requiring authentication.

## What Changed

### 1. **New Services Created**
- `app/services/musicApi.ts` - Main music service with functions for searching and fetching tracks
- `app/services/musicApiConfig.ts` - API configuration and documentation

### 2. **New API Endpoint**
- `app/api/search/route.ts` - Server-side search endpoint (optional, for future optimization)

### 3. **Updated Pages**
All pages now use the iTunes API instead of local manifest files:
- ✅ `app/page.tsx` (Home) - Shows popular music
- ✅ `app/search/page.tsx` (Search) - Real-time search from iTunes
- ✅ `app/artist/[artist]/page.tsx` (Artist Page) - Dynamic artist searches
- ✅ `app/library/page.tsx` - Works with favorite tracks
- ✅ `app/liked/page.tsx` - Displays liked/favorited tracks

## API Details

### Provider: Apple iTunes Search API
- **URL**: `https://itunes.apple.com/search`
- **Authentication**: None required ✅
- **Rate Limit**: No strict limits
- **Quality**: High
- **Features**:
  - Search tracks, artists, albums
  - 30-second preview audio
  - High-quality cover art (500x500px)
  - Full metadata (title, artist, album, duration)

## Track Data Structure

```typescript
type Track = {
  id: string;           // Unique identifier
  title: string;        // Song title
  artist?: string;      // Artist name
  src: string;          // Preview audio URL (30 seconds)
  album?: string;       // Album name
  cover?: string;       // Cover art URL
  duration?: number;    // Duration in seconds
};
```

## Usage Examples

### Search for Tracks
```typescript
import { searchTracks } from '@/app/services/musicApi';

const tracks = await searchTracks('Beatles', 20);
```

### Get Popular Tracks
```typescript
import { getPopularTracks } from '@/app/services/musicApi';

const popular = await getPopularTracks(50);
```

### Get Tracks by Genre
```typescript
import { getGenreTracks } from '@/app/services/musicApi';

const rock = await getGenreTracks('rock', 25);
```

## Benefits

✅ **No Authentication Required** - Simple API with no login needed
✅ **High Quality** - Good data quality with cover art and metadata
✅ **Millions of Tracks** - Access to iTunes catalog
✅ **Preview Audio** - 30-second preview clips for each track
✅ **No Local Storage Needed** - Dynamic, always up-to-date content
✅ **Fast Search** - Real-time search results with debouncing

## How It Works

1. User searches for a track → Request sent to iTunes API
2. API returns matching songs with:
   - Track information (title, artist, album)
   - Preview audio URL
   - Cover art (500x500px)
   - Duration and other metadata
3. Tracks displayed in UI
4. User can play preview, favorite, or add to playlists
5. Favorites are stored locally in browser

## Performance Optimizations

- **Search Debouncing**: 500ms delay on search to reduce API calls
- **Response Filtering**: Only returns songs with preview URLs available
- **Image Optimization**: Cover art automatically resized to 500x500px
- **Caching**: Browser cache handles repeat requests

## Local Fallback

The original `public/musics/manifest.json` can still be used as a fallback if needed. Simply uncomment the local fetch in any page.

## Limitations

⚠️ Audio is limited to 30-second preview clips (iTunes restriction)
⚠️ No full-length streaming (would require Spotify Web API or similar)
⚠️ Some indie/underground artists may not be available
⚠️ Geographic availability depends on iTunes availability

## Future Improvements

1. Add Spotify Web API integration for full streaming (requires auth)
2. Implement track caching for faster searches
3. Add genre/mood categorization
4. Implement user history tracking
5. Add recommendation engine
6. Integrate with YouTube Music API as additional source

## Support

All pages now seamlessly work with the new API. The music player, search, library, and artist pages all fetch from iTunes instead of local files.
