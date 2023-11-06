import Fastify, { FastifyRequest } from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifyMongo from "@fastify/mongodb";
import path from "path";
import QRCode from "qrcode";
import ip from "ip";
import qrRoutes from "./routes/qr";
import { addQrCodeInDatabase } from "./controllers/qr";

const CONNECT_MONGO = process.env.CONNECT_MONGO === "1";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyView, {
  engine: {
    ejs: require("ejs"),
  },
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

if (CONNECT_MONGO) {
  const MONGO_URI = process.env.MONGO_URI;
  fastify.register(fastifyMongo, {
    forceClose: true,
    url: MONGO_URI,
  });
}

type QrRequest = FastifyRequest<{
  Querystring: { text: string };
}>;

fastify.register(qrRoutes);

fastify.get("/", async (req: QrRequest, reply) => {
  if (!req.query.text) {
    return reply.view("/templates/index.ejs", { qrDataURL: null });
  }

  // TODO: Add a controller to send this url to the qr generator with a unique-id
  // The text corresponding to the unique-id will be stored in the database which can be used to
  // Whenever the url endpoint is hit the data regarding the stored qr will be updated
  //

  let qrText = `http://${ip.address()}:${PORT}/qr-scanned?text=${
    req.query.text
  }`;

  if (CONNECT_MONGO) {
    const qrCollection = fastify.mongo.db?.collection("qr");
    if (qrCollection) {
      const doc = await addQrCodeInDatabase(qrCollection, {
        text: req.query.text,
        times_scanned: 0,
      });

      qrText += `&?qr-id=${doc.value?._id}`;
    }
  }

  const qrDataURL = await QRCode.toDataURL(qrText).catch((err) =>
    console.error(err)
  );

  return reply.view("/templates/index.ejs", { qrDataURL });
});

// INFO: Logging
// server.log.info('Incoming request at /')

const PORT = 8080;

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: ip.address() });
    console.log(`Server running on: ${ip.address()}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
