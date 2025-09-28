"use client";
import {
  useGetMoviesQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} from "@/services/api";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/features/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import Image from "next/image";
import MovieModal, { MovieFormData } from "./components/MovieModal";
import "./movies.css";
import "@/styles/theme.css";

type Movie = {
  id: string;
  title: string;
  publishingYear: number;
  poster: string;
};

export default function MoviesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: moviesData = [],
    error,
    isLoading,
  } = useGetMoviesQuery(undefined, { skip: !mounted });
  const [createMovie, { isLoading: isCreating }] = useCreateMovieMutation();
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const showEmptyState = false;

  // Map API response (publishing_year) -> UI shape (publishingYear)
  const movies: Movie[] = showEmptyState
    ? []
    : (moviesData as any[]).map((m) => ({
        id: String(m.id),
        title: m.title,
        publishingYear: m.publishing_year ?? m.publishingYear,
        poster: m.poster ?? "",
      }));

  const itemsPerPage = 4;
  const totalPages = Math.ceil(movies?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = movies?.slice(startIndex, startIndex + itemsPerPage);

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
    router.push("/login");
  };

  const handleAddMovie = () => {
    setIsAddModalOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsEditModalOpen(true);
  };

  const handleAddMovieSubmit = async (movieData: MovieFormData) => {
    console.log(movieData);
    try {
      // Poster upload handling is not implemented; send basic fields
      await createMovie({
        title: movieData.title,
        publishingYear: movieData.publishing_year,
        ...(typeof movieData.poster === "string" && movieData.poster
          ? { poster: movieData.poster }
          : {}),
      }).unwrap();
      setIsAddModalOpen(false);
    } catch (e) {
      console.error("Failed to create movie", e);
    }
  };

  const handleEditMovieSubmit = async (movieData: MovieFormData) => {
    if (!selectedMovie) return;
    try {
      await updateMovie({
        id: selectedMovie.id,
        data: {
          title: movieData.title,
          publishing_year: movieData.publishing_year,
          ...(typeof movieData.poster === "string" && movieData.poster
            ? { poster: movieData.poster }
            : {}),
        },
      }).unwrap();
      setIsEditModalOpen(false);
      setSelectedMovie(null);
    } catch (e) {
      console.error("Failed to update movie", e);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      await deleteMovie(id).unwrap();
      if (selectedMovie?.id === id) {
        setIsEditModalOpen(false);
        setSelectedMovie(null);
      }
    } catch (e) {
      console.error("Failed to delete movie", e);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="movies-container">
        <div className="empty-state">
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-container">
        <div className="empty-state">
          <h1>Failed to load movies </h1>
        </div>
      </div>
    );
  }

  // Empty state
  if (movies.length === 0) {
    return (
      <div className="movies-container">
        <div className="empty-state">
          <h1>Your movie list is empty</h1>
          <button className="add-movie-btn" onClick={handleAddMovie}>
            Add a new movie
          </button>
        </div>

        {/* Wave effect at the bottom */}
        <div className="wave-container">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>

        {/* Add Movie Modal */}
        <MovieModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddMovieSubmit}
          mode="add"
        />
      </div>
    );
  }

  // Movies grid layout
  return (
    <div className="movies-container">
      <div className="movies-header">
        <h1 className="movies-title">
          My movies
          <span className="add-icon" onClick={handleAddMovie}>
            ⊕
          </span>
        </h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout <span>↗</span>
        </button>
      </div>

      <div className="movies-grid">
        {currentMovies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => handleEditMovie(movie)}
          >
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMovie(movie.id);
              }}
              title="Delete"
            >
              ×
            </button>
            <div className="movie-poster-container">
              {
                <Image
                  src={"/public /movie-poster.png"}
                  alt={movie.title}
                  width={220}
                  height={300}
                  className="movie-poster"
                />
              }
            </div>
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-year">{movie.publishingYear}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-number ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Wave effect at the bottom */}
      <div className="wave-container">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>

      {/* Add Movie Modal */}
      <MovieModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMovieSubmit}
        mode="add"
      />

      {/* Edit Movie Modal */}
      {selectedMovie && (
        <MovieModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMovie(null);
          }}
          onSubmit={handleEditMovieSubmit}
          initialData={{
            id: selectedMovie.id,
            title: selectedMovie.title,
            publishing_year: selectedMovie.publishingYear,
            poster: selectedMovie.poster,
          }}
          mode="edit"
        />
      )}
    </div>
  );
}
