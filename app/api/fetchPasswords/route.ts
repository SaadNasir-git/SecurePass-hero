import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";
import { password as pass } from "@/lib/password";

const DB_NAME = "passop";
const COLLECTION_NAME = "passwords";

export async function POST(request: NextRequest) {
    let isCorrect = true;
    try {
        const { password } = await request.json();
        const { userId } = await auth();

        if (!password || !userId) {
            return NextResponse.json({
                message: 'Password is required',
                success: false
            }, { status: 400 })
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME)
        const passwords = await db
            .collection(COLLECTION_NAME)
            .find({ userId })
            .toArray()

        const decryptedPasswords: data[] = []

        for (let index = 0; index < passwords.length; index++) {
            const element = passwords[index];
            const id = element._id.toString();
            const site = pass.decrypt(element.site, password);
            const username = pass.decrypt(element.username, password);
            const key = pass.decrypt(element.password, password);
            if (!key.isValid) {
                isCorrect = false
                break;
            } else {
                decryptedPasswords.push({ id, site: site.result, username: username.result, password: key.result });
            }
        }

        return NextResponse.json({
            passwords: decryptedPasswords,
            isValid: isCorrect
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            passwords: [],
            isValid: isCorrect,
        }, { status: 500 })
    }
}