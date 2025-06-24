import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Genre } from '../types/movie';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

const GenreFilterComponent: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenre,
  onGenreSelect,
}) => {
  const handleGenreSelect = useCallback((genreId: number | null) => {
    onGenreSelect(genreId);
  }, [onGenreSelect]);

  const renderGenreButton = useCallback((genre: Genre | null) => {
    const genreId = genre?.id ?? null;
    const genreName = genre?.name ?? 'Todos';
    const isSelected = selectedGenre === genreId;

    return (
      <TouchableOpacity
        key={genreId ?? 'all'}
        style={[
          styles.genreButton,
          isSelected && styles.selectedGenre,
        ]}
        onPress={() => handleGenreSelect(genreId)}
      >
        <Text
          style={[
            styles.genreText,
            isSelected && styles.selectedGenreText,
          ]}
        >
          {genreName}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedGenre, handleGenreSelect]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gêneros</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderGenreButton(null)}
        {genres.map((genre) => renderGenreButton(genre))}
      </ScrollView>
    </View>
  );
};

export const GenreFilter = memo(GenreFilterComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  selectedGenre: {
    backgroundColor: '#2D2D35',
  },
  genreText: {
    fontSize: 14,
    color: '#fff',
  },
  selectedGenreText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 