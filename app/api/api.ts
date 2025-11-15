// api.ts
type SpotifyArtist = {
  name: string;
};

type SpotifyAlbumImage = {
  url: string;
  height: number;
  width: number;
};

type SpotifyTrack = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    images: SpotifyAlbumImage[];
  };
  preview_url: string ;
};

const token = 'BQBjRdo-KsZikkiJYmlTWTsjHBV6CIVGMdi3ppvHX_qYzk9tGiSB_WXbSigWFkOB0pTozkOv5pkqTIpKSfDbBQfN0UuIVqL-ooWfv6BwKM35GpNx1Nlpl9oxf9aNYLQDXN4QFLLRKpp4qtnVw7AQ8xCfPrwZBTlXZli3eIExc1aVPb4TdRd8pJ439BaM_AG2Ukr-msXEkm2jloxh9a0YkP4sFWjpFzk8ytKrdrmGKFE9jO7Ue1oLE9P9slvpENc0KukrQPegWUKJFT8s6QLU17pN5TczR3-MK7tgN1pJzUH4-2oj_IMQ5cR9UoikAr4-pCCI';

async function fetchWebApi<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    method,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status}`);
  }

  return res.json();
}

export async function getTopTracks(): Promise<SpotifyTrack[]> {
  const data = await fetchWebApi<{ items: SpotifyTrack[] }>(
    'v1/me/top/tracks?time_range=long_term&limit=50',
    'GET'
  );
  return data.items;
}

// Misol ishlatish
(async () => {
  try {
    const topTracks = await getTopTracks();
    console.log(
      topTracks.map(
        ({ name, artists }) => `${name} by ${artists.map(artist => artist.name).join(', ')}`
      )
    );
  } catch (err) {
    console.error(err);
  }
})();

