import { NextRequest, NextResponse } from 'next/server';

/**
 * YouTube Music API Proxy
 * Fetches audio streams from YouTube for full-length songs
 */

// Using a public YouTube search API
const YOUTUBE_SEARCH_API = 'https://www.youtube.com/results';

/**
 * Search for videos on YouTube using invidious API (privacy-friendly YouTube alternative)
 * or YouTube Data API v3
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '20';

  try {
    if (action === 'search') {
      if (!query) {
        return NextResponse.json({ error: 'Query required' }, { status: 400 });
      }

      // Try multiple Invidious instances
      const invidInstances = [
        'https://invidious.io',
        'https://yewtu.be',
        'https://inv.nadeko.net',
        'https://invidious.namazso.eu',
      ];

      let videos = null;
      let lastError = null;

      for (const instance of invidInstances) {
        try {
          const invidUrl = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&limit=${limit}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(invidUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            videos = await response.json();
            break;
          }
        } catch (err: unknown) {
          lastError = err instanceof Error ? err.message : String(err);
          continue;
        }
      }

      if (!videos) {
        throw new Error(`All Invidious instances failed. Last error: ${lastError || 'Unknown'}`);
      }

      const results = [];

      // Convert invidious results to our format
      if (Array.isArray(videos)) {
        for (const video of videos) {
          if (video.type === 'video' && video.videoId && video.title) {
            results.push({
              id: `youtube-${video.videoId}`,
              title: video.title,
              artist: video.author || 'YouTube',
              videoId: video.videoId,
              duration: video.lengthSeconds,
              thumbnail: video.videoThumbnails?.[2]?.url || video.videoThumbnails?.[0]?.url,
            });
          }
        }
      }

      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('YouTube proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to search YouTube', results: [] },
      { status: 500 }
    );
  }
}
