import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
  
    console.log(username,"  ",password)
    if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
      return NextResponse.json({ error: 'Invalid Admin credentials' }, { status: 401 });
    }
  
    const response = await axios.post(`${process.env.BASE_URL}/login`, {
        username,password
    });
  
    const { accessToken, refreshToken } = response.data;
  
    (await cookies()).set('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
    (await cookies()).set('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
  
    return NextResponse.json({ success: true, redirect: '/admin' });
  } 
  catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
