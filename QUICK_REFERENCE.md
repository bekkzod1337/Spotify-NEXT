# Quick Reference - iTunes API Integration

## 🎯 One-Minute Overview

Your app now pulls music from **iTunes** instead of local files.
- ✅ No authentication needed
- ✅ Millions of tracks available
- ✅ 30-second preview audio
- ✅ High-quality cover art

## 📱 API Endpoints

### Search Tracks
```bash
GET https://itunes.apple.com/search?term=song+name&entity=song&limit=50
```

### Response Example
```json
{
  "results": [
    {
      "trackId": 123456,
      "trackName": "Song Title",
      "artistName": "Artist Name",
      "collectionName": "Album Name",
      "artworkUrl100": "https://...",
      "previewUrl": "https://...",
      "trackTimeMillis": 225000
    }
  ]
}
```

## 💻 Code Examples

### Import the service
```typescript
import { searchTracks, getPopularTracks, getTrendingTracks, getGenreTracks } from '@/app/services/musicApi';
```

### Search for songs
```typescript
const tracks = await searchTracks('Adele', 20);
```

### Get popular music
```typescript
const trending = await getPopularTracks(50);
```

### Search by genre
```typescript
const jazz = await getGenreTracks('jazz', 30);
```

## 🔄 Data Flow

```
User Search Input
       ↓
searchTracks() function
       ↓
iTunes API (https://itunes.apple.com/search)
       ↓
Parse response
       ↓
Filter songs with preview URLs
       ↓
Return Track[] array
       ↓
Display in UI with cover art + audio
```

## 📦 Track Object

```typescript
{
  id: "track-123456",              // Unique ID
  title: "Song Title",              // Song name
  artist: "Artist Name",            // Artist
  src: "https://audio-url...",     // 30-sec preview
  album: "Album Name",              // Album
  cover: "https://image-url...",   // 500x500px art
  duration: 225                     // Seconds
}
```

## 🔍 Search Implementation

### In any component:
```typescript
import { searchTracks } from '@/app/services/musicApi';

export default function MyComponent() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    const tracks = await searchTracks(query, 50);
    setResults(tracks);
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {results.map(track => (
        <div key={track.id}>
          <img src={track.cover} alt={track.title} />
          <h3>{track.title}</h3>
          <p>{track.artist}</p>
          <audio src={track.src} controls />
        </div>
      ))}
    </div>
  );
}
```

## ⚙️ Configuration

All configuration is in `/app/services/musicApiConfig.ts`:
- API base URL
- Default limits
- Debounce timing
- Feature flags

## 🚀 Performance Tips

1. **Use Debouncing** - Avoid too many API calls
   ```typescript
   const [searchTimeout, setSearchTimeout] = useState(null);
   
   const handleSearch = (query) => {
     clearTimeout(searchTimeout);
     setSearchTimeout(setTimeout(() => {
       searchTracks(query);
     }, 500));
   };
   ```

2. **Limit Results** - Don't fetch too many
   ```typescript
   const tracks = await searchTracks('query', 50); // 50 is reasonable
   ```

3. **Cache Results** - Store searches locally
   ```typescript
   const [cache, setCache] = useState({});
   if (cache[query]) return cache[query];
   ```

## 🔗 API Limits

- Max 200 results per request
- No rate limiting (generous)
- No authentication required
- Preview clips are 30 seconds max

## ❌ Common Mistakes

1. ❌ Not filtering for `previewUrl` - Some tracks don't have previews
2. ❌ Fetching too many results - 50 is usually enough
3. ❌ Not debouncing search - Will overwhelm the API
4. ❌ Using 100x100 cover art - Use 500x500 instead

## ✅ Best Practices

1. ✅ Always filter out tracks without preview URLs
2. ✅ Resize cover art to 500x500px
3. ✅ Use debouncing for search input
4. ✅ Handle errors gracefully
5. ✅ Show loading states
6. ✅ Cache popular searches

## 🆘 Troubleshooting

### No results returned
```typescript
// Make sure query is not empty
if (!query || query.trim().length === 0) return [];
```

### Audio not playing
```typescript
// Check if previewUrl exists
if (!track.src) {
  console.error('Track has no preview URL');
}
```

### Cover art not showing
```typescript
// Use fallback image
<img src={track.cover || '/fallback-cover.png'} />
```

## 📚 Files to Reference

- **Service:** `/app/services/musicApi.ts`
- **API Route:** `/app/api/search/route.ts`
- **Config:** `/app/services/musicApiConfig.ts`
- **Documentation:** `/API_INTEGRATION.md`
- **Examples:** `/app/page.tsx`, `/app/search/page.tsx`

## 🎯 Integration Checklist

- ✅ Service created (`musicApi.ts`)
- ✅ API route created (`api/search/route.ts`)
- ✅ Home page updated
- ✅ Search page updated
- ✅ Artist page updated
- ✅ No errors or warnings
- ✅ All pages functional

---

**Status:** Ready for Production ✅
