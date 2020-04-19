const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://crud-4e1a7.firebaseio.com",
});

const db = admin.firestore();

const app = require("express")();
const cors = require("cors");

// Functions to validate data
const { isValidMovie } = require("./validator");

// Cross origin resource sharing
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000", "http://your-production-website.com"],
    })
);

app.get("/", (req, res) => {
    return res.json("Hello!");
});

// Fetch all movies from the database
app.get("/movies", (req, res) => {
    db.collection("movies")
        .get()
        .then((query) => {
            let movies = [];
            query.forEach((doc) => {
                movies.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            return res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
});

// Fetch one movie from the database with the given id
app.get("/movies/:id", (req, res) => {
    db.collection("movies")
        .doc(req.params.id)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(200).json({
                    id: doc.id,
                    ...doc.data(),
                });
            } else {
                return res.status(400).json({ error: "Movie not found" });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
});

// Add new movie to the database
app.post("/movies", (req, res) => {
    // Initialize new movie object
    const movie = {
        title: req.body.title,
        year: req.body.year,
        genre: req.body.genre,
        rating: req.body.rating,
    };

    // Validate the movie data
    const errors = isValidMovie(movie);
    if (Object.keys(errors).length !== 0) {
        return res.status(400).json(errors);
    }

    // If movie is valid then add this to the database
    db.collection("movies")
        .add(movie)
        .then((doc) => {
            return res.status(200).json({
                id: doc.id,
                ...movie,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
});

// Update movie in the databas
app.put("/movies/:id", (req, res) => {
    // Initialize new movie object
    const movie = {
        title: req.body.title,
        year: req.body.year,
        genre: req.body.genre,
        rating: req.body.rating,
    };

    // Validate the movie data
    const errors = isValidMovie(movie);
    if (Object.keys(errors).length !== 0) {
        return res.status(400).json(errors);
    }

    // Check if movie with given id exists
    db.collection("movies")
        .doc(req.params.id)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return doc.ref.update({
                    ...movie,
                });
            } else {
                return res.status(400).json({ error: "Movie not found" });
            }
        })
        .then(() => {
            return res.status(200).json({
                id: req.params.id,
                ...movie,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
});

// Delete the movie with the given in
app.delete("/movies/:id", (req, res) => {
    // Check if the movie with given id exists
    db.collection("movies")
        .doc(req.params.id)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return doc.ref.delete();
            } else {
                return res.status(400).json({ error: "Movie not found" });
            }
        })
        .then(() => {
            return res.status(200).json({
                id: req.params.id,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "Movie not found" });
        });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
