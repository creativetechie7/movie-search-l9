/* ======================================================
    Lab 9 - MoviePage.jsx starter
====================================================== */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import Poster from "../components/Poster";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function MoviePage({ loggedInUser, setLoggedInUser }) {
    const [searchTerm, setSearchTerm] = useState("batman");
    const [movies, setMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies("batman");
        fetchWatchlist();
    }, []);

    async function fetchMovies(query) {
        try {
            setIsLoading(true);
            setError("");

            const url =
                `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                setMovies(data.Search);
            } else {
                setMovies([]);
                setError(data.Error || "No movies found.");
            }
        } catch (err) {
            setMovies([]);
            setError("Failed to fetch movies.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleSearch(newSearchTerm) {
        setSearchTerm(newSearchTerm);
        fetchMovies(newSearchTerm);
    }

    async function fetchWatchlist() {
        // TODO 21: 
        // Send GET /api/watchlist with credentials: "include". 
        // If response.ok is true, save the returned array in watchlist state.
        try {
            const response = await fetch("http://localhost:3001/api/watchlist", {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setWatchlist(data);
            }
        } catch {
            setError("Could not load your watchlist.");
        }
    }

    async function handleLogout() {
        // TODO 22: 
        // Send POST /api/logout with credentials: "include". 
        // If successful: 
        // 1. setLoggedInUser(null) 
        // 2. setWatchlist([]) 
        // 3. navigate("/")
        try {
            const response = await fetch("http://localhost:3001/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setLoggedInUser(null);
                setWatchlist([]);
                navigate("/");
            }
        } catch {
            setError("Could not log out. Is the server running?");
        }
    }

    async function addToWatchlist(movie) {
        // TODO 23: 
        // Send POST /api/watchlist with JSON movie data. 
        // Include headers and credentials: "include". 
        // After a successful response, call fetchWatchlist() again.
        try {
            const response = await fetch("http://localhost:3001/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(movie),
            });

            if (response.ok) {
                setError("");
                await fetchWatchlist();
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch {
            setError("Could not add the movie. Is the server running?");
        }
    }

    async function removeFromWatchlist(imdbID) {
        // TODO 24: 
        // Send DELETE /api/watchlist/:imdbID with credentials: "include".
        // After a successful response, call fetchWatchlist() again.
        try {
            const response = await fetch(
                `http://localhost:3001/api/watchlist/${encodeURIComponent(imdbID)}`,
                {
                    method: "DELETE",
                    credentials: "include",
                },
            );

            if (response.ok) {
                setError("");
                await fetchWatchlist();
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch {
            setError("Could not remove the movie. Is the server running?");
        }
    }

    return (
        <main className="moviePage">
            {/* Skip link: hidden until focused with Tab. Lets keyboard users jump past
                the search results (one button per movie) straight to the watchlist. */}
            <a className="skipLink" href="#watchlist">
                Skip to your watchlist
            </a>

            <header className="topBar">
                <div>
                    <h1>Welcome, {loggedInUser}!</h1>
                    <p>Search OMDb and save movies to your personal watchlist.</p>
                    <p>Current search: {searchTerm}</p>
                </div>
                <button className="dangerButton" onClick={handleLogout}>Logout</button>
            </header>

            <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

            {isLoading && <p>Loading movies...</p>}
            {error && <p className="message">{error}</p>}

            <MovieGrid movies={movies} onAdd={addToWatchlist} />

            {/* tabIndex={-1} lets the skip link move keyboard focus here
                (a section is not normally focusable). */}
            <section id="watchlist" className="card watchlistSection" tabIndex={-1}>
                <h2>Your Watchlist ({watchlist.length})</h2>
                {watchlist.length === 0 ? (
                    <p>No saved movies yet.</p>
                ) : (
                    <ul className="watchlistGrid">
                        {watchlist.map((movie) => (
                            <li key={movie.imdbID} className="watchlistCard">
                                <Poster movie={movie} />
                                <h3>{movie.Title}</h3>
                                <p>{movie.Year}</p>
                                <button
                                    className="dangerButton"
                                    onClick={() => removeFromWatchlist(movie.imdbID)}
                                    aria-label={`Remove ${movie.Title} from watchlist`}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}