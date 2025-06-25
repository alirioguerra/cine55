import React, { memo, useCallback } from 'react';
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
import { useTheme } from '../composables';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const MovieCardComponent: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const theme = useTheme();
  const posterUrl = movie.poster_path 
    ? MovieApiService.getPosterUrl(movie.poster_path, 'w342')
    : null;

  const handlePress = useCallback(() => {
    onPress(movie);
  }, [onPress, movie]);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[
          styles.noPoster,
          { backgroundColor: theme.colors.surfaceVariant }
        ]}>
          <Text style={[styles.noPosterText, { color: theme.colors.textSecondary }]}>
            Sem imagem
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const MovieCard = memo(MovieCardComponent);

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 