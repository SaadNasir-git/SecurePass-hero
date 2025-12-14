import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const DB_NAME = "passop";
const COLLECTION_NAME = "passwords";

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();
        const { userId } = await auth();
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id), userId });

        return NextResponse.json({
            message: 'Password has been deleted successfully'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: 'An unexpected error has been occurred'
        }, { status: 500 })
    }
}