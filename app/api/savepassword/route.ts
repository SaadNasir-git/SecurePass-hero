import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { password as pass } from "@/lib/password";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "passop";
const COLLECTION_NAME = "passwords";

export async function POST(request: NextRequest) {
    try {
        const { username, siteUrl, password, key } = await request.json();
        const { userId } = await auth();

        if (!username || !siteUrl || !password || !key || !userId) {
            return NextResponse.json({
                message: 'Data is required',
                success: false
            }, { status: 400 })
        }

        const encryptedPassword = pass.encrypt(password, key);
        const enusername = pass.encrypt(username, key);
        const ensiteUrl = pass.encrypt(siteUrl, key)

        const client = await clientPromise;
        const result = await client.db(DB_NAME).collection(COLLECTION_NAME).insertOne({ userId, username: enusername, siteUrl: ensiteUrl, password: encryptedPassword })

        return NextResponse.json({
            message: 'Your password has been saved successfully',
            id: result.insertedId,
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: 'Unexpected error detected',
            success: false
        }, { status: 500 })
    }
}