import { Movie, MovieDetails, Genre, ApiResponse } from '../types/movie';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'fe4cfe1b5d9717e6dabf12a2b1d39630';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export class MovieApiService {
  private static async fetchApi<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}&api_key=${API_KEY}&language=pt-BR`;
    console.log('🌐 API Request:', url);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ API Error:', response.status, response.statusText);
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ API Response:', endpoint, 'Results:', data.results?.length || 'N/A');
      return data;
    } catch (error) {
      console.error('❌ Fetch Error:', error);
      throw error;
    }
  }

  static async getPopularMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetchApi<ApiResponse<Movie>>(`/movie/popular?page=${page}`);
  }

  static async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchApi<MovieDetails>(`/movie/${movieId}?`);
  }

  static async getGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchApi<{ genres: Genre[] }>('/genre/movie/list?');
  }

  static async searchMovies(query: string, page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetchApi<ApiResponse<Movie>>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  static async getMoviesByGenre(genreId: number, page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetchApi<ApiResponse<Movie>>(`/discover/movie?with_genres=${genreId}&page=${page}`);
  }

  static getPosterUrl(posterPath: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!posterPath) return '';
    return `${IMAGE_BASE_URL}/${size}${posterPath}`;
  }

  static getBackdropUrl(backdropPath: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!backdropPath) return '';
    return `${IMAGE_BASE_URL}/${size}${backdropPath}`;
  }
} 