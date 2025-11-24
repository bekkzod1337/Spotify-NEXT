/**
 * Music API Configuration
 * 
 * This project uses the iTunes Search API (no authentication required)
 * to fetch high-quality music tracks with cover art and preview audio.
 * 
 * API Details:
 * - Provider: Apple iTunes
 * - Endpoint: https://itunes.apple.com/search
 * - Authentication: None required
 * - Rate Limit: Generous (no strict limits documented)
 * - Audio: 30-second preview clips
 * - Cover Art: High quality (500x500px)
 * 
 * Implementation Files:
 * - /app/services/musicApi.ts - Client-side music service
 * - /app/api/search/route.ts - Server-side search API endpoint
 * 
 * Features:
 * ✅ Search for tracks by title, artist, or album
 * ✅ Get popular/trending tracks
 * ✅ Get tracks by genre
 * ✅ High-quality cover art (500x500px)
 * ✅ 30-second preview audio clips
 * ✅ Full track metadata (title, artist, album, duration)
 * 
 * Usage Examples:
 * 
 * // Search for tracks
 * const tracks = await searchTracks('Beatles', 20);
 * 
 * // Get popular tracks
 * const popular = await getPopularTracks(50);
 * 
 * // Get trending tracks
 * const trending = await getTrendingTracks(30);
 * 
 * // Get tracks by genre
 * const rock = await getGenreTracks('rock', 25);
 * 
 * API Response Format (Track):
 * {
 *   id: string;                    // Unique track identifier
 *   title: string;                 // Song title
 *   artist?: string;               // Artist name
 *   src: string;                   // Preview audio URL
 *   album?: string;                // Album name
 *   cover?: string;                // Cover art URL (500x500px)
 *   duration?: number;             // Duration in seconds
 * }
 * 
 * Integration Points:
 * - Home page (/app/page.tsx)
 * - Search page (/app/search/page.tsx)
 * - Artist page (/app/artist/[artist]/page.tsx)
 * - Library page (/app/library/page.tsx)
 * - Liked songs page (/app/liked/page.tsx)
 * 
 * Notes:
 * - All tracks are automatically filtered to include only songs with preview URLs
 * - Cover art URLs are optimized to 500x500px for better quality
 * - API calls are debounced on the search page (500ms delay)
 * - No authentication or API keys required
 */

export const MUSIC_API_CONFIG = {
  provider: 'iTunes Search',
  baseUrl: 'https://itunes.apple.com/search',
  features: {
    requiresAuth: false,
    supportsPreview: true,
    supportsCoverArt: true,
    maxResults: 200,
  },
  limits: {
    defaultLimit: 50,
    searchDebounceMs: 500,
    previewDuration: 30, // seconds
  },
};
