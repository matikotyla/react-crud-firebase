const validator = require("validator");

module.exports.isValidMovie = (movie) => {
    let errors = {};

    // Movie title validation
    if (movie.title === undefined || validator.default.isEmpty(movie.title)) {
        errors.title = "Movie title cannot be empty";
    } else if (
        !validator.default.isLength(movie.title, {
            min: 2,
            max: 30,
        })
    ) {
        errors.title = "Movie title is not in range [2, 30]";
    }

    // Movie year validation
    if (movie.year === undefined || validator.default.isEmpty(movie.year)) {
        errors.year = "Movie year cannot be empty";
    } else if (
        !validator.default.isInt(movie.year, {
            min: 1900,
            max: 2020,
        })
    ) {
        errors.year = "Movie year is not a valid year";
    }

    // Movie genre validation
    if (movie.genre === undefined || validator.default.isEmpty(movie.genre)) {
        errors.genre = "Movie genre cannot be empty";
    } else if (
        !validator.default.isIn(movie.genre, [
            "drama",
            "thriller",
            "fantasy",
            "crime",
        ])
    ) {
        errors.genre = "Movie genre is not valid";
    }

    // Movie rating validation
    if (movie.rating === undefined || validator.default.isEmpty(movie.rating)) {
        errors.rating = "Movie rating cannot be empty";
    } else if (
        !validator.default.isFloat(movie.rating, {
            min: 0.0,
            max: 10.0,
        })
    ) {
        errors.rating = "Movie rating is not valid";
    }

    return errors;
};
