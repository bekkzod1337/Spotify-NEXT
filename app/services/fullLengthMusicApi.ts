/**
 * Full-Length Music API Service
 * 
 * This service provides full-length music tracks from multiple sources:
 * 1. Deezer API (via /api/deezer proxy) - MP3 previews
 * 2. YouTube (via /api/youtube proxy) - Full-length audio
 * 
 * Sources are queried in parallel and results are combined
 */

export type FullLengthTrack = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  album?: string;
  cover?: string;
  duration?: number;
  source: 'deezer' | 'youtube';
  quality?: 'low' | 'medium' | 'high';
  videoId?: string; // For YouTube videos
};

/**
 * Search Deezer API for tracks with full-length previews
 * Uses server-side proxy to bypass CORS
 */
export async function searchDeezerTracks(query: string, limit: number = 20): Promise<FullLengthTrack[]> {
  try {
    const response = await fetch(
      `/api/deezer?action=search&q=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const tracks: FullLengthTrack[] = [];

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((track: any) => {
        if (track.preview) {
          tracks.push({
            id: `deezer-${track.id}`,
            title: track.title || 'Unknown',
            artist: track.artist?.name || 'Unknown Artist',
            src: track.preview,
            album: track.album?.title || 'Unknown Album',
            cover: track.album?.cover_xl || track.album?.cover_big || track.album?.cover || '',
            duration: track.duration || undefined,
            source: 'deezer',
            quality: 'medium',
          });
        }
      });
    }

    return tracks;
  } catch (error) {
    console.error('Error searching Deezer tracks:', error);
    return [];
  }
}

/**
 * Get trending/popular tracks from Deezer
 * Uses server-side proxy to bypass CORS
 */
export async function getTrendingFullLengthTracks(limit: number = 60): Promise<FullLengthTrack[]> {
  try {
    const response = await fetch(`/api/deezer?action=trending&limit=${limit}`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const tracks: FullLengthTrack[] = [];

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((track: any) => {
        if (track.preview) {
          tracks.push({
            id: `deezer-${track.id}`,
            title: track.title || 'Unknown',
            artist: track.artist?.name || 'Unknown Artist',
            src: track.preview,
            album: track.album?.title || 'Unknown Album',
            cover: track.album?.cover_xl || track.album?.cover_big || track.album?.cover || '',
            duration: track.duration || undefined,
            source: 'deezer',
            quality: 'medium',
          });
        }
      });
    }

    return tracks;
  } catch (error) {
    console.error('Error fetching Deezer trending tracks:', error);
    return [];
  }
}

/**
 * Get artist's tracks from Deezer
 * Uses server-side proxy to bypass CORS
 */
export async function getArtistTracks(artistName: string, limit: number = 20): Promise<FullLengthTrack[]> {
  try {
    const response = await fetch(
      `/api/deezer?action=artist&artist=${encodeURIComponent(artistName)}&limit=${limit}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const tracks: FullLengthTrack[] = [];

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((track: any) => {
        if (track.preview) {
          tracks.push({
            id: `deezer-${track.id}`,
            title: track.title || 'Unknown',
            artist: track.artist?.name || artistName,
            src: track.preview,
            album: track.album?.title || 'Unknown Album',
            cover: track.album?.cover_xl || track.album?.cover_big || track.album?.cover || '',
            duration: track.duration || undefined,
            source: 'deezer',
            quality: 'medium',
          });
        }
      });
    }

    return tracks;
  } catch (error) {
    console.error('Error fetching artist tracks:', error);
    return [];
  }
}
/**
 * Search YouTube for full-length songs
 * Uses Invidious API (free, privacy-friendly YouTube alternative)
 */
export async function searchYouTubeTracks(query: string, limit: number = 20): Promise<FullLengthTrack[]> {
  try {
    const response = await fetch(
      `/api/youtube?action=search&q=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const tracks: FullLengthTrack[] = [];

    if (data.results && Array.isArray(data.results)) {
      for (const video of data.results) {
        if (video.videoId) {
          tracks.push({
            id: `youtube-${video.videoId}`,
            title: video.title || 'Unknown',
            artist: video.artist || 'YouTube',
            videoId: video.videoId,
            src: `https://www.youtube.com/watch?v=${video.videoId}`,
            cover: video.thumbnail || '',
            duration: video.duration || undefined,
            source: 'youtube',
            quality: 'high', // YouTube videos are usually full-length
          });
        }
      }
    }

    return tracks;
  } catch (error) {
    console.error('Error searching YouTube tracks:', error);
    return [];
  }
}

/**
 * Get YouTube audio stream URL for a video
 */
export async function getYouTubeAudioUrl(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/youtube-audio?videoId=${videoId}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.audioUrl || null;
  } catch (error) {
    console.error('Error getting YouTube audio URL:', error);
    return null;
  }
}

/**
 * Search multiple sources and combine results
 * Prioritizes Deezer first (better metadata), then YouTube
 */
export async function searchAllSources(query: string, limit: number = 20): Promise<FullLengthTrack[]> {
  try {
    // Search both sources in parallel
    const [deezerResults, youtubeResults] = await Promise.all([
      searchDeezerTracks(query, Math.ceil(limit / 2)),
      searchYouTubeTracks(query, Math.ceil(limit / 2)),
    ]);

    // Combine and deduplicate results
    const allTracks = [...deezerResults, ...youtubeResults];
    
    // Sort by source preference (Deezer first for better metadata)
    allTracks.sort((a, b) => {
      if (a.source === 'deezer' && b.source !== 'deezer') return -1;
      if (a.source !== 'deezer' && b.source === 'deezer') return 1;
      return 0;
    });

    return allTracks.slice(0, limit);
  } catch (error) {
    console.error('Error searching all sources:', error);
    return [];
  }
}

