import { useQuery } from '@tanstack/react-query';
import { MovieApiService } from '../utils/api';

// Query keys
export const movieKeys = {
  all: ['movies'] as const,
  popular: (page: number) => [...movieKeys.all, 'popular', page] as const,
  search: (query: string, page: number) => [...movieKeys.all, 'search', query, page] as const,
  byGenre: (genreId: number, page: number) => [...movieKeys.all, 'genre', genreId, page] as const,
  details: (movieId: number) => [...movieKeys.all, 'details', movieId] as const,
  genres: () => [...movieKeys.all, 'genres'] as const,
};

// Hook para filmes populares
export const usePopularMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['popularMovies', page],
    queryFn: () => MovieApiService.getPopularMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para busca de filmes
export const useSearchMovies = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ['searchMovies', query, page],
    queryFn: () => MovieApiService.searchMovies(query, page),
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para filmes por gênero
export const useMoviesByGenre = (genreId: number | null, page: number = 1) => {
  return useQuery({
    queryKey: ['moviesByGenre', genreId, page],
    queryFn: () => MovieApiService.getMoviesByGenre(genreId!, page),
    enabled: genreId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para detalhes do filme
export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.details(movieId),
    queryFn: () => MovieApiService.getMovieDetails(movieId),
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook para gêneros
export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => MovieApiService.getGenres(),
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}; 