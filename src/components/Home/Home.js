import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import "./Home.css";

function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(-1);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "https://europe-west1-crud-4e1a7.cloudfunctions.net/api/movies",
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers":
                            "Origin, X-Requested-With, Content-Type, Accept",
                    },
                }
            );
            setMovies(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch data when component is mounted
    useEffect(() => {
        fetchData();
    }, []);

    const onDeleteMovieClick = async (id, idx) => {
        if (loading !== -1) return;

        setLoading(idx);

        try {
            const response = await axios.delete(
                `https://europe-west1-crud-4e1a7.cloudfunctions.net/api/movies/${id}`
            );
            setLoading(-1);
            setMovies(movies.filter((movie, i) => i !== idx));
        } catch (err) {
            console.error(err);
            setLoading(-1);
        }
    };

    return (
        <div className="home">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movies.map((row, idx) => (
                            <TableRow key={row.id}>
                                <TableCell>#{idx + 1}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.year}</TableCell>
                                <TableCell>{row.genre}</TableCell>
                                <TableCell>{row.rating}</TableCell>
                                <TableCell style={{ width: "200px" }}>
                                    <div className="actions">
                                        <Link
                                            style={{ textDecoration: "none" }}
                                            to={{
                                                pathname: `/edit/${row.id}`,
                                                movie: row,
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<CreateIcon />}
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<DeleteIcon />}
                                            onClick={() =>
                                                onDeleteMovieClick(row.id, idx)
                                            }
                                            disabled={
                                                loading === idx ? true : false
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Link style={{ textDecoration: "none" }} to="/add">
                <Button
                    className="add-button"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Add
                </Button>
            </Link>
        </div>
    );
}

export default Home;
