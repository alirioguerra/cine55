import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { MovieApiService } from '../utils/api';
import { ApiResponse, Movie } from '../types/movie';

export const movieKeys = {
  all: ['movies'] as const,
  popular: () => [...movieKeys.all, 'popular'] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  byGenre: (genreId: number) => [...movieKeys.all, 'genre', genreId] as const,
  details: (movieId: number) => [...movieKeys.all, 'details', movieId] as const,
  genres: () => [...movieKeys.all, 'genres'] as const,
};

const infiniteQueryConfig = {
  getNextPageParam: (lastPage: ApiResponse<Movie>) => 
    lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  initialPageParam: 1,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
};

const queryConfig = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
};

export const usePopularMovies = () => {
  return useInfiniteQuery<ApiResponse<Movie>>({
    queryKey: movieKeys.popular(),
    queryFn: ({ pageParam }) => MovieApiService.getPopularMovies(pageParam as number),
    ...infiniteQueryConfig,
  });
};

export const useSearchMovies = (query: string) => {
  return useInfiniteQuery<ApiResponse<Movie>>({
    queryKey: movieKeys.search(query),
    queryFn: ({ pageParam }) => MovieApiService.searchMovies(query, pageParam as number),
    ...infiniteQueryConfig,
    staleTime: 2 * 60 * 1000,
    enabled: query.trim().length > 2,
  });
};

export const useMoviesByGenre = (genreId: number | null) => {
  return useInfiniteQuery<ApiResponse<Movie>>({
    queryKey: movieKeys.byGenre(genreId!),
    queryFn: ({ pageParam }) => MovieApiService.getMoviesByGenre(genreId!, pageParam as number),
    ...infiniteQueryConfig,
    enabled: genreId !== null,
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.details(movieId),
    queryFn: () => MovieApiService.getMovieDetails(movieId),
    ...queryConfig,
  });
};

export const useGenres = () => {
  return useQuery({
    queryKey: movieKeys.genres(),
    queryFn: () => MovieApiService.getGenres(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}; 