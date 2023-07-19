import { FastifyInstance, FastifyRequest } from "fastify";
import { FastifyRouteConfig } from "fastify/types/route";
import { addQrCodeInDatabase, updateQrCodeScannedAmount } from "../controllers/qr";

type QrRequest = FastifyRequest<{
  Querystring: { text: string, "qr-id"?: string };
}>;

const qrRoutes = async (
  server: FastifyInstance,
  _options: FastifyRouteConfig,
) => {
  server.get("/test-db", async function (_, reply) {
    const db = this.mongo.db;
    console.log(db);
    reply.send({ db: !!db });
  });

  server.get("/qr", async function (_, reply) {
    const qrCollection = server.mongo.db?.collection("qr");
    const qrs = qrCollection?.find();
    reply.send({
      qr: qrs?.toArray(),
    });
  });

  server.post("/add-qr", async function (req: QrRequest, reply) {
    const qrCollection = server.mongo.db?.collection("qr");
    if (!req.query.text) {
      return reply.send({ error: "No text input" });
    }

    if (!qrCollection) {
      return reply.send({ error: "Unable to get the collection" });
    }

    addQrCodeInDatabase(qrCollection, {
      text: req.query.text,
      times_scanned: 0,
    });
  });

  server.get('/qr-scanned', async function (req: QrRequest, reply) {
    const qrCollection = server.mongo.db?.collection("qr");
    const text = req.query.text
    const qrId = req.query["qr-id"]

    if (!qrCollection) {
      return reply.send({ error: "Unable to get the collection" });
    }

    const doc = await updateQrCodeScannedAmount(qrCollection, qrId, text)
    console.log(doc)
    return reply.view("/templates/qr-scanned.ejs", { text })
  })
};

export default qrRoutes;
