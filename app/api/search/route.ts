import { NextRequest, NextResponse } from 'next/server';

type SearchTrack = {
  id: string;
  title: string;
  artist: string;
  src: string;
  album: string;
  cover: string;
  duration: number;
};

const ITUNES_API = 'https://itunes.apple.com/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '50';

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${ITUNES_API}?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('iTunes API error');
    }

    const data = await response.json();
    const tracks: SearchTrack[] = [];

    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result: any, index: number) => {
        if (result.kind === 'song' && result.previewUrl) {
          tracks.push({
            id: `track-${result.trackId || index}`,
            title: result.trackName || 'Unknown',
            artist: result.artistName || 'Unknown Artist',
            src: result.previewUrl,
            album: result.collectionName || 'Unknown Album',
            cover: result.artworkUrl100?.replace('100x100', '500x500') || '',
            duration: (result.trackTimeMillis || 0) / 1000,
          });
        }
      });
    }

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error searching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to search tracks', tracks: [] },
      { status: 500 }
    );
  }
}
