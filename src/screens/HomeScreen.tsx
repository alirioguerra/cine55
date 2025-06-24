import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreenNavigationProp } from '../types/navigation';
import { Movie } from '../types/movie';
import { SearchBar } from '../components/SearchBar';
import { GenreFilter } from '../components/GenreFilter';
import { OfflineMessage } from '../components/OfflineMessage';
import { MoviesList } from '../components/MoviesList';
import { useNetworkStatus } from '../composables/useNetworkStatus';
import { usePopularMovies, useSearchMovies, useMoviesByGenre, useGenres } from '../composables/useMovies';

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isConnected = useNetworkStatus();

  // React Query hooks
  const { data: genresData } = useGenres();
  const { data: popularData, isLoading: popularLoading, refetch: refetchPopular } = usePopularMovies(currentPage);
  const { data: searchData, isLoading: searchLoading } = useSearchMovies(debouncedQuery, currentPage);
  const { data: genreData, isLoading: genreLoading, refetch: refetchGenre } = useMoviesByGenre(selectedGenre, currentPage);

  // Memoized genres array
  const genres = useMemo(() => genresData?.genres || [], [genresData?.genres]);

  // Memoized data and loading states
  const currentData = useMemo(() => {
    if (searchQuery.trim()) {
      return searchData;
    } else if (selectedGenre) {
      return genreData;
    } else {
      return popularData;
    }
  }, [searchQuery, selectedGenre, searchData, genreData, popularData]);

  const isLoading = useMemo(() => {
    if (searchQuery.trim()) {
      return searchLoading;
    } else if (selectedGenre) {
      return genreLoading;
    } else {
      return popularLoading;
    }
  }, [searchQuery, selectedGenre, searchLoading, genreLoading, popularLoading]);

  // Atualizar filmes quando dados chegarem
  useEffect(() => {
    if (currentData) {
      if (currentPage === 1) {
        setAllMovies(currentData.results);
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      } else {
        // Evitar duplicatas ao adicionar novos filmes
        setAllMovies(prev => {
          const existingIds = new Set(prev.map(movie => movie.id));
          const newMovies = currentData.results.filter(movie => !existingIds.has(movie.id));
          return [...prev, ...newMovies];
        });
      }
      setHasMorePages(currentPage < currentData.total_pages);
      setLoadingMore(false);
    }
  }, [currentData, currentPage, isInitialLoad]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    setAllMovies([]);
    setCurrentPage(1);
    setHasMorePages(true);
  }, [debouncedQuery]);  

  // Resetar quando mudar gênero
  useEffect(() => {
    if (selectedGenre !== null) {
      setAllMovies([]);
      setCurrentPage(1);
      setHasMorePages(true);
    }
  }, [selectedGenre]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleGenreSelect = useCallback((genreId: number | null) => {
    setSelectedGenre(genreId);
  }, []);

  const handleMoviePress = useCallback((movie: Movie) => {
    navigation.navigate('MovieDetails', { movie });
  }, [navigation]);

  const handleLoadMore = useCallback(() => {
    if (hasMorePages && !loadingMore && !isLoading) {
      setLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMorePages, loadingMore, isLoading]);

  const handleRefresh = useCallback(async () => {
    setAllMovies([]);
    setCurrentPage(1);
    setHasMorePages(true);
    if (searchQuery.trim()) {
      // Para busca, não há refetch específico
    } else if (selectedGenre) {
      refetchGenre();
    } else {
      refetchPopular();
    }
  }, [searchQuery, selectedGenre, refetchGenre, refetchPopular]);

  return (
    <SafeAreaView style={styles.container}>
      <OfflineMessage visible={!isConnected} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Cine55</Text>
        <Text style={styles.subtitle}>Descubra os melhores filmes</Text>
      </View>

      <SearchBar 
        onSearch={handleSearch}
        value={searchQuery}
        onValueChange={handleSearch}
      />

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
      />

      <MoviesList
        movies={allMovies}
        isLoading={isLoading}
        loadingMore={loadingMore}
        hasMorePages={hasMorePages}
        searchQuery={searchQuery}
        isInitialLoad={isInitialLoad}
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        onMoviePress={handleMoviePress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171F',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
}); 