// const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let characters = [
  {
    id: 1,
    name: "Scooby Doo",
    imgURL: "https://www.scoob.movie/assets/images/home/char-08.png",
    description:
      "Our favorite Great Danes that loves to solve misteries and eat food. He  ends up catching the bad guys",
  },
  {
    id: 2,
    name: "Shaggy Rogers",
    imgURL:
      "https://vignette.wikia.nocookie.net/scoobydoosa/images/5/5b/Shaggy_character.png/revision/latest/top-crop/width/360/height/450?cb=20121128224852&path-prefix=es",
    description:
      "He is the best friend of Scooby Doo, and companion of adventures",
  },
  {
    id: 3,
    name: "Daphne Blake",
    imgURL:
      "https://vignette.wikia.nocookie.net/scoobydoosa/images/e/e5/Daph.png/revision/latest/top-crop/width/360/height/450?cb=20121128230259&path-prefix=es",
    description:
      "a.k.a. Danger Prone Daphne is the rich member of the gang and rides with them in search of misteries to solve. She always ends up captured or lost. She is Fred's girlfriend",
  },
  {
    id: 4,
    name: "Fred Jones",
    imgURL:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Fred_Jones.png/150px-Fred_Jones.png",
    description: "The leader of the gang. He drives the Mistery Machine",
  },
];

app.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to the Scooby Doo API</h1>
    <p>If you want to access the data on the Scooby Doo API, please procede to the /api/scoobygang route</p>
    `
  );
});

app.get("/api/scoobygang", (req, res) => {
  res.status(200).json(characters);
});

app.get("/api/scoobygang/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log({ id });
  const character = characters.find((character) => character.id === id);
  if (character) {
    res.status(200).json(character);
  } else {
    res.status(404).end();
  }
});
app.delete("/api/scoobygang/:id", (req, res) => {
  const id = Number(req.params.id);
  characters = characters.filter((character) => character.id !== id);
  res.status(204).end();
});

app.post("/api/scoobygang", (req, res) => {
  const character = req.body;
  if (!character || !character.name || !character.description) {
    return res.status(400).json({ error: "Missing field" });
  }
  const ids = characters.map((character) => character.id);
  const maxId = Math.max(...ids);
  const newCharacter = {
    id: maxId + 1,
    name: character.name,
    imgURL: character.imgURL,
    description: character.description,
  };

  characters = [...characters, newCharacter];
  res.status(201).json(newCharacter);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
