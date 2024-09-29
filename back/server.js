const express = require("express");
const cors = require("cors");
const movies = require("./api/moviesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/movies", movies);

/** All non-included routes */
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;
