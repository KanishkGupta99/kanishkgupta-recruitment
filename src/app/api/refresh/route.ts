import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
    }

    const response = await axios.post(`${process.env.BASE_URL}/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    if (!accessToken || !newRefreshToken) {
      return NextResponse.json({ error: 'Invalid response from refresh endpoint' }, { status: 400 });
    }

    cookieStore.set('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
    cookieStore.set('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });

    return NextResponse.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
