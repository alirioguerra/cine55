import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Genre } from '../types/movie';
import { useTheme } from '../composables';

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
  const theme = useTheme();

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
          {
            backgroundColor: isSelected ? theme.colors.primary : 'transparent',
            borderColor: theme.colors.border,
          },
          isSelected && styles.selectedGenre,
        ]}
        onPress={() => handleGenreSelect(genreId)}
      >
        <Text
          style={[
            styles.genreText,
            {
              color: isSelected ? '#FFFFFF' : theme.colors.text,
            },
            isSelected && styles.selectedGenreText,
          ]}
        >
          {genreName}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedGenre, handleGenreSelect, theme]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Gêneros</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
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
    borderWidth: 1,
  },
  selectedGenre: {
    backgroundColor: '#2D2D35',
  },
  genreText: {
    fontSize: 14,
  },
  selectedGenreText: {
    fontWeight: '600',
  },
}); 