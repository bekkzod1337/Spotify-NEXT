import { NextRequest, NextResponse } from 'next/server';

/**
 * API proxy for Deezer - routes requests through server to bypass CORS
 */

const DEEZER_API = 'https://api.deezer.com';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '50';
  const artistId = searchParams.get('artistId');
  const artistName = searchParams.get('artist');

  try {
    let url = '';

    switch (action) {
      case 'search':
        if (!query) {
          return NextResponse.json({ error: 'Query required' }, { status: 400 });
        }
        url = `${DEEZER_API}/search/track?q=${encodeURIComponent(query)}&limit=${limit}`;
        break;

      case 'trending':
        url = `${DEEZER_API}/chart/0/tracks?limit=${limit}`;
        break;

      case 'artist':
        if (!artistName) {
          return NextResponse.json({ error: 'Artist name required' }, { status: 400 });
        }
        // First get artist ID
        const artistSearchUrl = `${DEEZER_API}/search/artist?q=${encodeURIComponent(artistName)}&limit=1`;
        const artistSearchRes = await fetch(artistSearchUrl);
        const artistSearchData = await artistSearchRes.json();

        if (!artistSearchData.data || artistSearchData.data.length === 0) {
          return NextResponse.json({ data: [] });
        }

        const foundArtistId = artistSearchData.data[0].id;
        url = `${DEEZER_API}/artist/${foundArtistId}/top?limit=${limit}`;
        break;

      case 'artist-direct':
        if (!artistId) {
          return NextResponse.json({ error: 'Artist ID required' }, { status: 400 });
        }
        url = `${DEEZER_API}/artist/${artistId}/top?limit=${limit}`;
        break;

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Deezer proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Deezer', data: [] },
      { status: 500 }
    );
  }
}
