import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreenNavigationProp } from '../types/navigation';
import { Movie } from '../types/movie';
import { SearchBar } from '../components/SearchBar';
import { GenreFilter } from '../components/GenreFilter';
import { OfflineMessage } from '../components/OfflineMessage';
import { MovieCard } from '../components/MovieCard';
import { useNetworkStatus } from '../composables/useNetworkStatus';
import { usePopularMovies, useSearchMovies, useMoviesByGenre, useGenres } from '../composables/useMovies';

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const isConnected = useNetworkStatus();

  const { data: genresData } = useGenres();
  const popularMovies = usePopularMovies();
  const searchMovies = useSearchMovies(searchQuery);
  const genreMovies = useMoviesByGenre(selectedGenre);

  const currentQuery = useMemo(() => {
    if (searchQuery.trim().length > 2) return searchMovies;
    if (selectedGenre) return genreMovies;
    return popularMovies;
  }, [searchQuery, selectedGenre, searchMovies, genreMovies, popularMovies]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isError } = currentQuery;
  
  const movies = useMemo(() => {
    return data?.pages?.flatMap(page => page.results) || [];
  }, [data?.pages]);

  const genres = useMemo(() => genresData?.genres || [], [genresData?.genres]);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={handleMoviePress} />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingMoreText}>Carregando mais...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {searchQuery ? 'Buscando filmes...' : 'Carregando filmes...'}
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Erro ao carregar filmes. Tente novamente.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery ? 'Nenhum filme encontrado para sua busca.' : 'Nenhum filme disponível.'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <OfflineMessage visible={!isConnected} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Cine55</Text>
        <Text style={styles.subtitle}>Descubra os melhores filmes</Text>
      </View>

      <SearchBar 
        onSearch={setSearchQuery}
        value={searchQuery}
        onValueChange={setSearchQuery}
      />

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreSelect={setSelectedGenre}
      />

      <FlatList
        key={`${searchQuery ? 'search' : 'default'}-${selectedGenre || 'all'}`}
        data={movies}
        keyExtractor={(item) => `${item.id}-${item.title}`}
        renderItem={renderMovie}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading && !isFetchingNextPage} 
            onRefresh={refetch}
            tintColor="#007AFF"
          />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
}); 