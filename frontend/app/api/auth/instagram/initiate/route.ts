import { NextApiRequest, NextApiResponse } from 'next';
import { redirect } from 'next/navigation';

export async function GET(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!appId || !redirectUri) {
    console.log('META_APP_ID or META_REDIRECT_URI is missing in environment variables.');
    return res.status(500).json({ error: 'Missing META_APP_ID or META_REDIRECT_URI in .env.local' });
  }

  const scopes = [
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_comments',
    'pages_show_list',
    'pages_read_engagement',
  ].join(',');

  const authUrl = `https://www.instagram.com/v24.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`;
  redirect(authUrl);
}
