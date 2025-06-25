import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MovieDetailsScreenNavigationProp, MovieDetailsScreenRouteProp } from '../types/navigation';
import { MovieApiService } from '../utils/api';
import { useMovieDetails } from '../composables/useMovies';
import { ReviewsSection } from '../components/ReviewsSection';

interface MovieDetailsScreenProps {
  navigation: MovieDetailsScreenNavigationProp;
  route: MovieDetailsScreenRouteProp;
}

export const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({ navigation, route }) => {
  const { movie: initialMovie } = route.params;

  const { data: movieDetails, isLoading } = useMovieDetails(initialMovie.id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </SafeAreaView>
    );
  }

  const movie = movieDetails || initialMovie;
  const backdropUrl = MovieApiService.getBackdropUrl(movie.backdrop_path);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          <View style={styles.backdropOverlay} />

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
                <Text style={styles.ratingText}>({movie.vote_count} votos)</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {movieDetails?.genres && (
            <View style={styles.genresContainer}>
              {movieDetails.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {movieDetails?.runtime && (
            <Text style={styles.runtime}>{movieDetails.runtime} min</Text>
          )}

          <Text style={styles.overview}>{movie.overview}</Text>

          {movieDetails?.tagline && (
            <Text style={styles.tagline}>"{movieDetails.tagline}"</Text>
          )}
          
          <ReviewsSection movieId={initialMovie.id} />
        </View>
      </ScrollView>
    </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
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
    color: '#fff',
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
    backgroundColor: '#2D2D35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
    color: '#fff',
  },
  runtime: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
}); 