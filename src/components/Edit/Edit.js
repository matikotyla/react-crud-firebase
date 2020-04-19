import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import "./Edit.css";

function Edit(props) {
    const [title, setTitle] = useState(props.location.movie.title);
    const [year, setYear] = useState(props.location.movie.year);
    const [genre, setGenre] = useState(props.location.movie.genre);
    const [rating, setRating] = useState(props.location.movie.rating);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const onFormSubmit = async (e) => {
        if (loading === true) return;

        e.preventDefault();

        setLoading(true);

        const data = {
            title,
            year,
            genre,
            rating,
        };

        try {
            const response = await axios.put(
                `https://europe-west1-crud-4e1a7.cloudfunctions.net/api/movies/${props.match.params.id}`,
                data
            );
            setLoading(false);
            props.history.push("/");
        } catch (err) {
            console.error(err.response);
            setLoading(false);
            setErrors(err.response.data);
        }
    };

    return (
        <div className="edit">
            <h1 className="edit-header">Edit</h1>
            <form onSubmit={onFormSubmit} className="edit-form">
                <div className="title-input">
                    <TextField
                        fullWidth
                        error={errors.hasOwnProperty("title") ? true : false}
                        label="Title"
                        value={title}
                        type="text"
                        placeholder="Movie title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <p className="title-input-error-text">{errors.title}</p>
                </div>
                <div className="year-input">
                    <TextField
                        fullWidth
                        error={errors.hasOwnProperty("year") ? true : false}
                        label="Year"
                        value={year}
                        type="number"
                        placeholder="Movie year"
                        onChange={(e) => setYear(e.target.value)}
                    />
                    <p className="year-input-error-text">{errors.year}</p>
                </div>
                <div className="genre-input">
                    <FormControl
                        error={errors.hasOwnProperty("genre") ? true : false}
                        fullWidth
                    >
                        <InputLabel id="demo-simple-select-label">
                            Genre
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <MenuItem value={"drama"}>Drama</MenuItem>
                            <MenuItem value={"thriller"}>Thriller</MenuItem>
                            <MenuItem value={"fantasy"}>Fantasy</MenuItem>
                            <MenuItem value={"crime"}>Crime</MenuItem>
                        </Select>
                    </FormControl>
                    <p className="genre-input-error-text">{errors.genre}</p>
                </div>
                <div className="rating-input">
                    <TextField
                        inputProps={{ step: "0.1" }}
                        fullWidth
                        error={errors.hasOwnProperty("rating") ? true : false}
                        label="Rating"
                        value={rating}
                        type="number"
                        placeholder="Movie rating"
                        onChange={(e) => setRating(e.target.value)}
                    />
                    <p className="rating-input-error-text">{errors.rating}</p>
                </div>
                <div className="add-form-buttons">
                    <Button
                        disabled={loading}
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Edit
                        {loading && (
                            <CircularProgress
                                style={{ position: "absolute" }}
                                color="inherit"
                                size={24}
                            />
                        )}
                    </Button>
                    <Link style={{ textDecoration: "none" }} to="/">
                        <Button variant="contained" color="secondary">
                            Back
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Edit;
