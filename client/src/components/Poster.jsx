/* ======================================================
    Poster.jsx - shared poster image with a fallback
    Used by MovieCard (search results) and the watchlist grid.
====================================================== */

export default function Poster({ movie }) {
    // OMDb sends "N/A" when a movie has no poster image.
    const hasPoster = movie.Poster && movie.Poster !== "N/A";

    if (!hasPoster) {
        // role="img" + aria-label lets screen readers treat this box like an image.
        return (
            <div className="noPoster" role="img" aria-label={`No poster for ${movie.Title}`}>
                No poster
            </div>
        );
    }

    return <img className="poster" src={movie.Poster} alt={`Poster for ${movie.Title}`} />;
}
