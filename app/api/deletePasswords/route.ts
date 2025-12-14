import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const DB_NAME = "passop";
const COLLECTION_NAME = "passwords";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection(COLLECTION_NAME).deleteMany({ userId });

        return NextResponse.json({
            message: 'Your Passwords has been successfully deleted'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: 'An unexpected error has been occurred'
        }, { status: 500 })
    }
}