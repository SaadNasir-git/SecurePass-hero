"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

const IV_LENGTH = 16; // For AES, this is always 16
const DB_NAME = "passop";
const COLLECTION_NAME = "passwords";

async function encrypt(text, key) {
  if (!key) {
   return; 
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

async function decrypt(text, key) {
  if (!key) return

  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export async function savepassword(object, key) {
  const userId = object.userId;
  if (userId) {
    object = await getEncrypted(object, key);
    object = {
      userId,
      ...object,
    };
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).insertOne(object);
  }
}

async function getEncrypted(object, key) {
  object.site = await encrypt(object.site, key);
  object.username = await encrypt(object.username, key);
  object.password = await encrypt(object.password, key);
  return object;
}

async function findpassword(userId) {
  if (userId) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    let item = await db.collection(COLLECTION_NAME).findOne({ userId: userId });
    if (item) {
      return {
        id: item.id,
        site: item.site,
        username: item.username,
        password: item.password,
      };
    }
    return;
  }
}

export async function findpasswords(userId, key) {
  if (userId) {
    const client = await clientPromise;
    const Valid = await isValid(userId, key);
    if (Valid) {
      const db = client.db(DB_NAME);
      let data = await db
        .collection(COLLECTION_NAME)
        .find({ userId: userId })
        .toArray();

      data = await getpure(data, key);

      return data.map((item) => ({
        id: item.id,
        site: item.site,
        username: item.username,
        password: item.password,
      }));
    } else {
      return [];
    }
  }
}

export async function deletepassword(id) {
  if (id) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
  }
}

export async function handleUpdate(id, object, key) {
  if (id && key && object) {
    const client = await clientPromise;
    const update = await getEncrypted(object, key);
    const db = client.db(DB_NAME);
    await db
      .collection(COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: update });
  }
}

export async function handlePasswordChange(oldPassord, newPassword, userId) {
  if (oldPassord && newPassword && userId) {
    let data = await findpasswords(userId, oldPassord);
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const object = {
          site: element.site,
          username: element.username,
          password: element.password,
        };
        await handleUpdate(element.id, object, newPassword);
      }
    }
  }
}

async function getpure(data, key) {
  if (key) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const id = element._id.toString();
      const site = await decrypt(element.site, key);
      const username = await decrypt(element.username, key);
      const password = await decrypt(element.password, key);
      data[index] = { id, site, username, password };
    }
    return data;
  }
}

export async function isValid(userId, key) {
  const data = await findpassword(userId);
  if (data) {
    const response = await decrypt_check(data.username, key);
    return response;
  } else {
    return true;
  }
}

async function decrypt_check(text, key) {
  try {
    if (!key) return;
    const parts = text.split(":");
    const iv = Buffer.from(parts.shift(), "hex");
    const encryptedText = Buffer.from(parts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key, "hex"),
      iv
    );

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return true;
  } catch (error) {
    return false;
  }
}

export async function DeleteAll(userId) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  await db.collection(COLLECTION_NAME).deleteMany({ userId });
}
