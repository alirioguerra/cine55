import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserReview } from '../types/movie';

interface ReviewsState {
  reviews: UserReview[];
  addReview: (review: UserReview) => void;
  deleteReview: (reviewId: string) => void;
  getReviewsByMovieId: (movieId: number) => UserReview[];
  clearAllReviews: () => void;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],
      
      addReview: (review: UserReview) => {
        set((state) => ({
          reviews: [...state.reviews, review]
        }));
      },
      
      deleteReview: (reviewId: string) => {
        set((state) => ({
          reviews: state.reviews.filter(review => review.id !== reviewId)
        }));
      },
      
      getReviewsByMovieId: (movieId: number) => {
        const { reviews } = get();
        return reviews.filter(review => review.movieId === movieId);
      },
      
      clearAllReviews: () => {
        set({ reviews: [] });
      },
    }),
    {
      name: 'cine55-reviews-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ reviews: state.reviews }),
    }
  )
); 