import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Movie } from './movie';

export type RootStackParamList = {
  Home: undefined;
  MovieDetails: { movie: Movie };
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type MovieDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;

export type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>; 