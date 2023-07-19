import { mongodb, ObjectId } from "@fastify/mongodb";
import { QRModel } from "../model/qr";

export async function addQrCodeInDatabase(
  qrCollection: mongodb.Collection,
  qr: QRModel,
) {
  const doc = await qrCollection.findOneAndUpdate(
    {
      text: qr.text,
    },
    { "$set": qr },
    {
      upsert: true,
    },
  );
  return doc;
}

export async function updateQrCodeScannedAmount(
  qrCollection: mongodb.Collection,
  id?: string,
  text?: string,
) {
  const filter: { [key: string]: any } = {};
  if (id) {
    filter["_id"] = new ObjectId(id);
  } else if (text) {
    filter["text"] = text;
  }

  const doc = await qrCollection.findOneAndUpdate(
    filter,
    {
      "$inc": {
        times_scanned: 1,
      },
    },
  );

  return doc;
}
