import React, { memo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MoviesListProps {
  movies: Movie[];
  isLoading: boolean;
  loadingMore: boolean;
  hasMorePages: boolean;
  searchQuery: string;
  isInitialLoad?: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  onMoviePress: (movie: Movie) => void;
}

const MoviesListComponent: React.FC<MoviesListProps> = ({
  movies,
  isLoading,
  loadingMore,
  hasMorePages,
  searchQuery,
  isInitialLoad = false,
  onLoadMore,
  onRefresh,
  onMoviePress,
}) => {
  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={onMoviePress} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
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
            {isInitialLoad ? 'Carregando filmes...' : 'Carregando...'}
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
    <FlatList
      data={movies}
      keyExtractor={(item) => `${item.id}-${item.title}`}
      renderItem={renderMovie}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
    />
  );
};

export const MoviesList = memo(MoviesListComponent);

const styles = StyleSheet.create({
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