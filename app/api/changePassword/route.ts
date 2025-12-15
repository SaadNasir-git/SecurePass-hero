import clientPromise from "@/lib/mongodb";
import { password as pass } from "@/lib/password";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const DB_NAME = "passop";
const COLLECTION_NAME = "passwords";

export function getEncrypted(object: data, key: string) {
    object.site = pass.encrypt(object.site, key);
    object.username = pass.encrypt(object.username, key);
    object.password = pass.encrypt(object.password, key);
    return object;
}

export async function POST(request: NextRequest) {
    let isCorrect = true;
    try {
        const { newPassword, oldPassword } = await request.json()
        const { userId } = await auth()

        const client = await clientPromise;
        let data = await client.db(DB_NAME).collection(COLLECTION_NAME).find({ userId }).toArray();

        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const id = element._id.toString();
                const site = pass.decrypt(element.site, oldPassword);
                const username = pass.decrypt(element.username, oldPassword);
                const key = pass.decrypt(element.password, oldPassword);
                if (!key.isValid) {
                    isCorrect = false;
                    return NextResponse.json({
                        message: 'Provided Password is inCorrect',
                        isValid: isCorrect
                    }, { status: 200 })
                    break;
                } else {
                    const data:data = {
                        password:key.result,
                        site:site.result,
                        username:username.result
                    }
                    const update = getEncrypted(data , newPassword)
                    const client = await clientPromise;
                    const db = await client.db(DB_NAME).collection(COLLECTION_NAME)
                    await db.updateOne({ _id: new ObjectId(id) }, { $set: update })
                }
            }
        }

        return NextResponse.json({
            message: 'Your password has been successfully updated',
            isValid: isCorrect
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: 'An unexpected error has been occurred',
            isValid: isCorrect
        }, { status: 500 })
    }
}