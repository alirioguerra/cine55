import React from 'react';
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

export const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenre,
  onGenreSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gêneros</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.genreButton,
            selectedGenre === null && styles.selectedGenre,
          ]}
          onPress={() => onGenreSelect(null)}
        >
          <Text
            style={[
              styles.genreText,
              selectedGenre === null && styles.selectedGenreText,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.genreButton,
              selectedGenre === genre.id && styles.selectedGenre,
            ]}
            onPress={() => onGenreSelect(genre.id)}
          >
            <Text
              style={[
                styles.genreText,
                selectedGenre === genre.id && styles.selectedGenreText,
              ]}
            >
              {genre.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

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