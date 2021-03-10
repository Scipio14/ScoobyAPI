// const http = require("http");
require("dotenv").config();
require("./mongo");

const express = require("express");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const app = express();
const cors = require("cors");
const Character = require("./models/Character");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

app.use(cors());
app.use(express.json());

Sentry.init({
  dsn:
    "https://e0b25334ade3401abaee3c0096351665@o547728.ingest.sentry.io/5670352",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to the Scooby Doo API</h1>
    <p>If you want to access the data on the Scooby Doo API, please procede to the /api/scoobygang route</p>
    `
  );
});

app.get("/api/scoobygang", (req, res) => {
  Character.find({}).then((characters) => {
    res.status(200).json(characters);
  });
});

app.get("/api/scoobygang/:id", (req, res, next) => {
  const { id } = req.params;

  Character.findById(id)
    .then((character) => {
      if (character) {
        res.json(character);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });

  //
});

// app.delete("/api/scoobygang/:id", (req, res, next) => {
//   const { id } = req.params;
//   Character.findByIdAndDelete(id)
//     .then((result) => {
//       res.status(204).end();
//     })
//     .catch((err) => next(err));
// });

// app.post("/api/scoobygang", (req, res) => {
//   const character = req.body;
//   if (!character || !character.name || !character.description) {
//     return res.status(400).json({ error: "Missing field" });
//   }

//   const newCharacter = new Character({
//     name: character.name,
//     imgURL: character.imgURL,
//     description: character.description,
//   });

//   newCharacter.save().then((savedCharacter) => {
//     res.json(savedCharacter);
//   });
// });

/****** Middlewares ***** */
//Middleware del error 404
app.use(notFound);

//Middleware the Sentry
app.use(Sentry.Handlers.errorHandler());

//Middleware en caso de que el id sea incorrecto
app.use(handleErrors);
/**** End of Middlewares **** */

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
