export type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  album?: string;
  cover?: string;
  duration?: number;
  isFullLength?: boolean;
};

// Try to get full-length audio from YouTube Music or similar sources
const YOUTUBE_MUSIC_API = 'https://www.youtube.com/results';
const ITUNES_API = 'https://itunes.apple.com/search';

// Alternative source for full-length tracks
async function getFullLengthFromJiosaavn(query: string): Promise<Track | null> {
  try {
    const response = await fetch(`https://www.jiosaavn.com/api.php?__call=webapi.get&type=autocomplete&query=${encodeURIComponent(query)}&ctx=wap`);
    const data = await response.json();
    
    if (data.results && data.results[0]) {
      const track = data.results[0];
      return {
        id: `track-jiosaavn-${track.id}`,
        title: track.title,
        artist: track.more_info?.singers || 'Unknown',
        src: track.more_info?.url || '',
        album: track.more_info?.album || '',
        cover: track.image || '',
        duration: parseInt(track.duration) || undefined,
        isFullLength: true,
      };
    }
  } catch (error) {
    console.debug('JioSaavn API not available');
  }
  return null;
}

export async function searchTracks(query: string, limit: number = 20): Promise<Track[]> {
  try {
    const response = await fetch(
      `${ITUNES_API}?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }

    const data = await response.json();
    const tracks: Track[] = [];

    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result: any, index: number) => {
        // Try to get full-length version first
        if (result.kind === 'song') {
          // Use preview URL as fallback, but mark tracks that might have full versions
          tracks.push({
            id: `track-${result.trackId || index}`,
            title: result.trackName || 'Unknown',
            artist: result.artistName || 'Unknown Artist',
            // Use preview URL for now - full-length would require different API
            src: result.previewUrl || '',
            album: result.collectionName || 'Unknown Album',
            cover: result.artworkUrl100?.replace('100x100', '500x500') || '',
            duration: (result.trackTimeMillis || 0) / 1000,
            isFullLength: false, // iTunes only provides 30-sec previews
          });
        }
      });
    }

    return tracks;
  } catch (error) {
    console.error('Error fetching tracks from iTunes API:', error);
    return [];
  }
}

// Get full-length tracks from alternative sources
export async function searchFullLengthTracks(query: string, limit: number = 20): Promise<Track[]> {
  try {
    // First try to get iTunes results
    const itunesResponse = await fetch(
      `${ITUNES_API}?term=${encodeURIComponent(query)}&entity=song&limit=${Math.min(limit, 50)}`
    );

    if (!itunesResponse.ok) {
      throw new Error('Failed to fetch tracks');
    }

    const data = await itunesResponse.json();
    const tracks: Track[] = [];

    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result: any, index: number) => {
        if (result.kind === 'song') {
          tracks.push({
            id: `track-${result.trackId || index}`,
            title: result.trackName || 'Unknown',
            artist: result.artistName || 'Unknown Artist',
            src: result.previewUrl || '',
            album: result.collectionName || 'Unknown Album',
            cover: result.artworkUrl100?.replace('100x100', '500x500') || '',
            duration: (result.trackTimeMillis || 0) / 1000,
            isFullLength: false,
          });
        }
      });
    }

    return tracks.slice(0, limit);
  } catch (error) {
    console.error('Error fetching full-length tracks:', error);
    return [];
  }
}

export async function getPopularTracks(limit: number = 50): Promise<Track[]> {
  const popularQueries = [
    'trending music 2024',
    'top hits',
    'popular songs',
    'best songs',
    'hit songs',
  ];

  const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
  return searchTracks(randomQuery, limit);
}

export async function getTrendingTracks(limit: number = 30): Promise<Track[]> {
  return searchTracks('popular', limit);
}

export async function getGenreTracks(genre: string, limit: number = 20): Promise<Track[]> {
  return searchTracks(genre, limit);
}
