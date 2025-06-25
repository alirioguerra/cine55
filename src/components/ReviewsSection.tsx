import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserReview } from '../types/movie';
import { useReviewsStore } from '../store/reviewsStore';

interface ReviewsSectionProps {
  movieId: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ movieId }) => {
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { reviews, addReview, getReviewsByMovieId } = useReviewsStore();
  const userReviews = getReviewsByMovieId(movieId);

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
        movieId: movieId,
        rating: userRating,
        comment: userComment.trim(),
        createdAt: new Date(),
      };

      addReview(newReview);
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

  return (
    <View>
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
  );
};

const styles = StyleSheet.create({
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