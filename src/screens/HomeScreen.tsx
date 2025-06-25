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
import { ThemeToggle } from '../components/ThemeToggle';
import { useNetworkStatus } from '../composables';
import { usePopularMovies, useSearchMovies, useMoviesByGenre, useGenres } from '../composables';
import { useTheme } from '../composables';

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const isConnected = useNetworkStatus();
  const theme = useTheme();

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
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={[styles.loadingMoreText, { color: theme.colors.text }]}>
          Carregando mais...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            {searchQuery ? 'Buscando filmes...' : 'Carregando filmes...'}
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Erro ao carregar filmes. Tente novamente.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          {searchQuery ? 'Nenhum filme encontrado para sua busca.' : 'Nenhum filme disponível.'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <OfflineMessage visible={!isConnected} />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>Cine55</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Descubra os melhores filmes
            </Text>
          </View>
          <ThemeToggle />
        </View>
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
            tintColor={theme.colors.primary}
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
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
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
    textAlign: 'center',
  },
}); 