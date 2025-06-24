import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserReview } from '../types/movie';

const REVIEWS_KEY = '@cine55_reviews';

export class StorageService {
  static async saveReview(review: UserReview): Promise<void> {
    try {
      const existingReviews = await this.getReviews();
      const updatedReviews = [...existingReviews, review];
      await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
    } catch (error) {
      console.error('Error saving review:', error);
      throw error;
    }
  }

  static async getReviews(): Promise<UserReview[]> {
    try {
      const reviewsJson = await AsyncStorage.getItem(REVIEWS_KEY);
      if (!reviewsJson) return [];
      
      const reviews = JSON.parse(reviewsJson);
      return reviews.map((review: any) => ({
        ...review,
        createdAt: new Date(review.createdAt)
      }));
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  }

  static async getReviewsByMovieId(movieId: number): Promise<UserReview[]> {
    const allReviews = await this.getReviews();
    return allReviews.filter(review => review.movieId === movieId);
  }

  static async deleteReview(reviewId: string): Promise<void> {
    try {
      const existingReviews = await this.getReviews();
      const updatedReviews = existingReviews.filter(review => review.id !== reviewId);
      await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
} 