const mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI;

//Conexión a mongodb
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

process.on("uncaughtException", () => {
  mongoose.connection.disconnect();
});
