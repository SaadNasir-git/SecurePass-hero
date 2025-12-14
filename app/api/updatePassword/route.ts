import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getEncrypted } from "../changePassword/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "passop";
const COLLECTION_NAME = "passwords";

export async function POST(request: NextRequest) {
    try {
        const { object, password } = await request.json()
        const { userId } = await auth();

        if (!object.id || !object.username || !object.siteUrl || !object.password || !userId) {
            return NextResponse.json({
                message: 'Data is required'
            }, { status: 400 })
        }

        const client = await clientPromise;
        const update = getEncrypted(object, password);
        const db = client.db(DB_NAME);
        await db
            .collection(COLLECTION_NAME)
            .updateOne({ _id: new ObjectId(object.id) , userId}, { $set: update });

        return NextResponse.json({
            message: 'You password has been updated successfully'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: 'An unexpected error occurred'
        }, { status: 500 })
    }
}