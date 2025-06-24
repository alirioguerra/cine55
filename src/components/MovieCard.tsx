import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Movie } from '../types/movie';
import { MovieApiService } from '../utils/api';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const posterUrl = movie.poster_path 
    ? MovieApiService.getPosterUrl(movie.poster_path, 'w342')
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noPoster}>
          <Text style={styles.noPosterText}>Sem imagem</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.5,
    borderRadius: 12,
  },
  noPoster: {
    width: '100%',
    height: cardWidth * 1.5,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
}); 