import React, { useState, memo, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../composables';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Buscar filmes...',
  value,
  onValueChange
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const theme = useTheme();

  const query = value !== undefined ? value : internalQuery;
  const setQuery = onValueChange || setInternalQuery;

  const handleSubmit = useCallback(() => {
    onSearch(query);
  }, [onSearch, query]);

  const clearSearch = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [setQuery, onSearch]);

  const handleTextChange = useCallback((text: string) => {
    setQuery(text);
  }, [setQuery]);

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={theme.colors.textSecondary} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text }
          ]}
          value={query}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const SearchBar = memo(SearchBarComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
}); 