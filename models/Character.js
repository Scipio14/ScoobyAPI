const { Schema, model } = require("mongoose");

const characterSchema = new Schema({
  name: String,
  imgURL: String,
  description: String,
});

characterSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Character = new model("Character", characterSchema);

module.exports = Character;
