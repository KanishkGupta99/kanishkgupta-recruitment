import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request:NextRequest) {
    try {
        const cookieStore = await cookies();
        let accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;
        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let response;
        try {
            response = await axios.post(`${process.env.BASE_URL}/share`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } catch (error: any) {
            if ((error.response?.status === 401 || error.response?.status === 403) && refreshToken) {
                const refreshRes = await fetch(`${request.nextUrl.origin}/api/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const refreshData = await refreshRes.json();
                if (refreshRes.ok && refreshData.accessToken) {
                    accessToken = refreshData.accessToken;
                    response = await axios.post(`${process.env.BASE_URL}/share`, {}, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                } else {
                    return NextResponse.json({ error: 'Session expired. Please login again.' }, { status: 401 });
                }
            } else {
                throw error;
            }
        }

        const { shareToken } = response.data;
        return NextResponse.json({ shareToken });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 400 });
    }
}