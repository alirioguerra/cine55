import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreenNavigationProp } from '../types/navigation';
import { Movie } from '../types/movie';
import { MovieCard } from '../components/MovieCard';
import { SearchBar } from '../components/SearchBar';
import { GenreFilter } from '../components/GenreFilter';
import { OfflineMessage } from '../components/OfflineMessage';
import { useNetworkStatus } from '../composables/useNetworkStatus';
import { usePopularMovies, useSearchMovies, useMoviesByGenre, useGenres } from '../composables/useMovies';

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isConnected = useNetworkStatus();

  // React Query hooks
  const { data: genresData } = useGenres();
  const { data: popularData, isLoading: popularLoading, refetch: refetchPopular } = usePopularMovies(currentPage);
  const { data: searchData, isLoading: searchLoading } = useSearchMovies(searchQuery, currentPage);
  const { data: genreData, isLoading: genreLoading, refetch: refetchGenre } = useMoviesByGenre(selectedGenre, currentPage);

  // Determinar qual dados usar
  const getCurrentData = () => {
    if (searchQuery.trim()) {
      return searchData;
    } else if (selectedGenre) {
      return genreData;
    } else {
      return popularData;
    }
  };

  const getCurrentLoading = () => {
    if (searchQuery.trim()) {
      return searchLoading;
    } else if (selectedGenre) {
      return genreLoading;
    } else {
      return popularLoading;
    }
  };

  const currentData = getCurrentData();
  const isLoading = getCurrentLoading();

  // Atualizar filmes quando dados chegarem
  useEffect(() => {
    if (currentData) {
      if (currentPage === 1) {
        setAllMovies(currentData.results);
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
  }, [currentData, currentPage]);

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
    // Resetar lista apenas quando a busca mudar completamente
    setAllMovies([]);
    setCurrentPage(1);
    setHasMorePages(true);
  }, []);

  const handleGenreSelect = useCallback((genreId: number | null) => {
    setSelectedGenre(genreId);
  }, []);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const handleLoadMore = () => {
    if (hasMorePages && !loadingMore && !isLoading) {
      setLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleRefresh = async () => {
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
  };

  if (isLoading && currentPage === 1) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </SafeAreaView>
    );
  }

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
        onValueChange={setSearchQuery}
      />
      <GenreFilter
        genres={genresData?.genres || []}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
      />

      <FlatList
        data={allMovies}
        keyExtractor={(item) => `${item.id}-${item.title}`}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={handleMoviePress} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
        ListFooterComponent={() => 
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingMoreText}>Carregando mais...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={() => 
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhum filme encontrado para sua busca.' : 'Nenhum filme disponível.'}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#14171F',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
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
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
}); 