import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MovieDetailsScreenNavigationProp, MovieDetailsScreenRouteProp } from '../types/navigation';
import { MovieApiService } from '../utils/api';
import { useMovieDetails } from '../composables';
import { ReviewsSection } from '../components/ReviewsSection';
import { useTheme } from '../composables';
import { ThemeToggle } from '../components/ThemeToggle';

interface MovieDetailsScreenProps {
  navigation: MovieDetailsScreenNavigationProp;
  route: MovieDetailsScreenRouteProp;
}

export const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({ navigation, route }) => {
  const { movie: initialMovie } = route.params;
  const theme = useTheme();

  const { data: movieDetails, isLoading } = useMovieDetails(initialMovie.id);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Carregando detalhes...</Text>
      </SafeAreaView>
    );
  }

  const movie = movieDetails || initialMovie;
  const backdropUrl = MovieApiService.getBackdropUrl(movie.backdrop_path);

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.backdrop }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.themeToggleContainer}>
            <ThemeToggle />
          </View>
          
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          <View style={[styles.backdropOverlay, { backgroundColor: theme.colors.backdrop }]} />

          <View style={styles.headerContent}>
            <Image
              source={{ uri: MovieApiService.getPosterUrl(movie.poster_path) }}
              style={styles.poster}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <Text style={styles.yearText}>
                {new Date(movie.release_date).getFullYear()}
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {movie.vote_average.toFixed(1)}</Text>
                <Text style={styles.ratingText}> ({movie.vote_count} votos)</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {movieDetails?.genres && (
            <View style={styles.genresContainer}>
              {movieDetails.genres.map((genre) => (
                <View key={genre.id} style={[styles.genreTag, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Text style={[styles.genreText, { color: theme.colors.text }]}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {movieDetails?.runtime && (
            <Text style={[styles.runtime, { color: theme.colors.textSecondary }]}>{movieDetails.runtime} min</Text>
          )}

          <Text style={[styles.overview, { color: theme.colors.text }]}>{movie.overview}</Text>

          {movieDetails?.tagline && (
            <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>"{movieDetails.tagline}"</Text>
          )}
          
          <ReviewsSection movieId={initialMovie.id} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'relative',
    height: 300,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    borderRadius: 20,
    padding: 8,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  yearText: {
    fontSize: 16,
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#fff',
  },
  loadingText: {
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
  },
  runtime: {
    fontSize: 14,
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
}); 