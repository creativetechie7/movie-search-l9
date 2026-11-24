/* ======================================================
    Lab 9 - MovieCard.jsx starter
====================================================== */

import Poster from "./Poster";

export default function MovieCard({ movie, onAdd }) {
    return (
        <article className="card movieCard">
            <Poster movie={movie} />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            <button onClick={() => onAdd(movie)}>Add to Watchlist</button>
        </article>
    );
}
