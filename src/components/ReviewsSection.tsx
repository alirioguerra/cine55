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
import { useTheme } from '../composables';

interface ReviewsSectionProps {
  movieId: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ movieId }) => {
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const theme = useTheme();

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
              color={star <= rating ? '#FFD700' : theme.colors.textTertiary}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View>
      <View style={[
        styles.reviewSection,
        { backgroundColor: theme.colors.surface }
      ]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Sua Avaliação</Text>
        
        <View style={styles.ratingSection}>
          <Text style={[styles.ratingLabel, { color: theme.colors.text }]}>Nota:</Text>
          {renderStars(userRating, true, handleRatingPress)}
          <Text style={[styles.ratingValue, { color: theme.colors.text }]}>{userRating}/10</Text>
        </View>

        <TextInput
          style={[
            styles.commentInput,
            {
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.surfaceVariant,
            }
          ]}
          placeholder="Escreva seu comentário..."
          placeholderTextColor={theme.colors.textTertiary}
          value={userComment}
          onChangeText={setUserComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: submitting ? theme.colors.textTertiary : theme.colors.primary }
          ]}
          onPress={handleSubmitReview}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
          )}
        </TouchableOpacity>
      </View>

      {userReviews.length > 0 && (
        <View style={styles.communityReviews}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Avaliações da Comunidade</Text>
          {userReviews.map((review) => (
            <View key={review.id} style={[
              styles.reviewItem,
              { backgroundColor: theme.colors.surface }
            ]}>
              <View style={styles.reviewHeader}>
                {renderStars(review.rating)}
                <Text style={[styles.reviewDate, { color: theme.colors.textSecondary }]}>
                  {review.createdAt instanceof Date 
                    ? review.createdAt.toLocaleDateString('pt-BR')
                    : new Date(review.createdAt).toLocaleDateString('pt-BR')
                  }
                </Text>
              </View>
              <Text style={[styles.reviewComment, { color: theme.colors.text }]}>{review.comment}</Text>
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
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
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
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  communityReviews: {
    marginBottom: 24,
  },
  reviewItem: {
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
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 