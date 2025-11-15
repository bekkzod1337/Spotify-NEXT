import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Missing Spotify credentials' }, { status: 500 });
    }

    // 1. Token olish
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('Token error:', errText);
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Top tracks olish (Global Top 50 playlist)
    const playlistId = '37i9dQZEVXbMDoHDwVN2tF';
    const tracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!tracksRes.ok) {
      const errText = await tracksRes.text();
      console.error('Tracks error:', errText);
      return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
    }

    const tracksData = await tracksRes.json();

    // 3. Faqat preview_url mavjud tracklarni filter qilish va formatlash
    const formatted =
      tracksData?.items
        ?.map((item: any) => item.track)
        .filter((t: any) => t && t.preview_url)
        .map((t: any) => ({
          id: t.id,
          title: t.name,
          artist: t.artists.map((a: any) => a.name).join(', '),
          src: t.preview_url,
          cover: t.album.images[0]?.url || '',
        })) || [];

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
