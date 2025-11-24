import { NextRequest, NextResponse } from 'next/server';

/**
 * YouTube Audio Extraction Service
 * Extracts audio streams from YouTube videos using yt-dlp or similar
 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get('videoId');
  const url = searchParams.get('url');

  try {
    if (!videoId && !url) {
      return NextResponse.json({ error: 'videoId or url required' }, { status: 400 });
    }

    const youtubeUrl = url || `https://www.youtube.com/watch?v=${videoId}`;

    // Using piped.kavin.rocks API (privacy-friendly YouTube proxy)
    const pipedUrl = `https://pipedapi.kavin.rocks/streams/${videoId}`;

    const response = await fetch(pipedUrl);

    if (!response.ok) {
      throw new Error('Piped API error');
    }

    const data = await response.json();

    // Extract audio stream (usually the last format with audio-only content)
    let audioStream = null;

    if (data.audioStreams && Array.isArray(data.audioStreams)) {
      // Get the best quality audio stream
      audioStream = data.audioStreams.find((s: any) => s.mimeType?.includes('audio'));
      if (!audioStream) {
        audioStream = data.audioStreams[data.audioStreams.length - 1];
      }
    }

    if (!audioStream || !audioStream.url) {
      return NextResponse.json({ error: 'No audio stream found' }, { status: 404 });
    }

    return NextResponse.json({
      videoId,
      title: data.title,
      duration: data.duration,
      thumbnail: data.thumbnailUrl,
      audioUrl: audioStream.url,
      quality: audioStream.quality || 'unknown',
    });
  } catch (error) {
    console.error('YouTube audio extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract audio from YouTube' },
      { status: 500 }
    );
  }
}
