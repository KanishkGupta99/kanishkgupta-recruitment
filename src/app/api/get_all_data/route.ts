import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const encodedToken = searchParams.get('encodedToken') || '';

  let decodedToken = '';
  try {
    decodedToken = atob(encodedToken);
  } catch {
    return NextResponse.json({ error: 'Invalid share token' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${process.env.BASE_URL}/share`, {
      params: { shareToken: decodedToken },
    });
    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data?.error || 'Failed to fetch shared data' },
      { status: err.response?.status || 500 }
    );
  }
}
