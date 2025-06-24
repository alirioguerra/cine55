import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MovieDetailsScreenNavigationProp, MovieDetailsScreenRouteProp } from '../types/navigation';
import { UserReview } from '../types/movie';
import { MovieApiService } from '../utils/api';
import { StorageService } from '../utils/storage';
import { useMovieDetails } from '../composables/useMovies';

interface MovieDetailsScreenProps {
  navigation: MovieDetailsScreenNavigationProp;
  route: MovieDetailsScreenRouteProp;
}

export const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({ navigation, route }) => {
  const { movie: initialMovie } = route.params;
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: movieDetails, isLoading } = useMovieDetails(initialMovie.id);

  useEffect(() => {
    loadUserReviews();
  }, []);

  const loadUserReviews = async () => {
    try {
      const reviews = await StorageService.getReviewsByMovieId(initialMovie.id);
      setUserReviews(reviews);
    } catch (error) {
      console.error('Error loading user reviews:', String(error));
    }
  };

  const handleRatingPress = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      Alert.alert('Erro', 'Por favor, selecione uma nota antes de enviar.');
      return;
    }

    if (!userComment.trim()) {
      Alert.alert('Erro', 'Por favor, escreva um comentário antes de enviar.');
      return;
    }

    setSubmitting(true);
    try {
      const newReview: UserReview = {
        id: Date.now().toString(),
        movieId: initialMovie.id,
        rating: userRating,
        comment: userComment.trim(),
        createdAt: new Date(),
      };

      await StorageService.saveReview(newReview);
      setUserReviews(prev => [newReview, ...prev]);
      setUserRating(0);
      setUserComment('');
      Alert.alert('Sucesso', 'Sua avaliação foi salva!');
    } catch (error) {
      console.error('Error saving review:', String(error));
      Alert.alert('Erro', 'Não foi possível salvar sua avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onPress?: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => interactive && onPress?.(star)}
            disabled={!interactive}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={20}
              color={star <= rating ? '#FFD700' : '#ccc'}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          <View style={styles.backdropOverlay} />
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Image
              source={{ uri: MovieApiService.getPosterUrl(movie.poster_path) }}
              style={styles.poster}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <Text style={styles.year}>
                {new Date(movie.release_date).getFullYear()}
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {movie.vote_average.toFixed(1)}</Text>
                <Text style={styles.voteCount}>({movie.vote_count} votos)</Text>
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
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Sua Avaliação</Text>
            
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Nota:</Text>
              {renderStars(userRating, true, handleRatingPress)}
              <Text style={styles.ratingValue}>{userRating}/10</Text>
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Escreva seu comentário..."
              value={userComment}
              onChangeText={setUserComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
              )}
            </TouchableOpacity>
          </View>

          {userReviews.length > 0 && (
            <View style={styles.communityReviews}>
              <Text style={styles.sectionTitle}>Avaliações da Comunidade</Text>
              {userReviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    {renderStars(review.rating)}
                    <Text style={styles.reviewDate}>
                      {review.createdAt.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  voteCount: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
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
  reviewSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#2D2D35',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#fff',
    marginRight: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  star: {
    marginRight: 2,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#2D2D35',
    marginBottom: 16,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  communityReviews: {
    marginBottom: 24,
  },
  reviewItem: {
    backgroundColor: '#2D2D35',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#fff',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#fff',
  },
}); 