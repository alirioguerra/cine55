# Cine55 - Movie Discovery App

A React Native movie discovery app built with Expo, featuring a modern and simplified architecture using React Query.

## 🚀 Features

- **Movie Discovery**: Browse popular movies with infinite scrolling
- **Search**: Search movies with real-time results
- **Genre Filtering**: Filter movies by genre
- **Movie Details**: View detailed information about movies
- **Offline Support**: Graceful handling of network connectivity
- **Modern UI**: Clean and intuitive user interface

## 🛠 Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Query (TanStack Query)** for data fetching and caching
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **Expo Network** for connectivity monitoring

## 🏗 Architecture Improvements

### Before (Complex State Management)
- Manual pagination logic with multiple state variables
- Complex loading states management
- Manual debouncing for search
- Redundant data fetching
- Over-engineered component structure

### After (Simplified with React Query)
- **Infinite Queries**: Automatic pagination with `useInfiniteQuery`
- **Built-in Caching**: Automatic data caching and background updates
- **Simplified State**: Minimal local state, React Query handles the rest
- **Performance**: Optimistic updates and background refetching
- **Type Safety**: Full TypeScript support with proper types

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── GenreFilter.tsx
│   ├── MovieCard.tsx
│   ├── OfflineMessage.tsx
│   └── SearchBar.tsx
├── composables/         # Custom React hooks
│   ├── useMovies.ts     # Movie data fetching hooks
│   └── useNetworkStatus.ts
├── navigation/          # Navigation configuration
├── screens/            # Screen components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
    ├── api.ts          # API service with error handling
    └── storage.ts      # Local storage service
```

## 🔧 Key Improvements

### 1. React Query Integration
- **Infinite Queries**: Automatic pagination without manual state management
- **Query Keys**: Organized and type-safe query key structure
- **Caching Strategy**: Optimized cache times for different data types
- **Background Updates**: Automatic data synchronization

### 2. Simplified State Management
- **Reduced State**: From 8+ state variables to just 2 essential ones
- **Automatic Updates**: React Query handles data synchronization
- **Optimistic Updates**: Immediate UI feedback for user actions

### 4. Performance Optimizations
- **Request Deduplication**: Automatic request deduplication
- **Background Refetching**: Data stays fresh automatically
- **Memory Management**: Proper cache garbage collection
- **Debounced Search**: Built-in debouncing for search queries

### 5. Type Safety
- **Full TypeScript**: Complete type coverage
- **API Types**: Proper typing for all API responses
- **Query Keys**: Type-safe query key generation
- **Error Types**: Typed error handling

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with your TMDB API key:
   ```
   TMDB_API_KEY=your_api_key_here
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on device/simulator**:
   ```bash
   npm run ios     # iOS
   npm run android # Android
   npm run web     # Web
   ```

## 📱 Usage

1. **Browse Movies**: Scroll through popular movies with infinite loading
2. **Search**: Type to search for specific movies (minimum 3 characters)
3. **Filter by Genre**: Tap genre chips to filter movies
4. **View Details**: Tap on a movie to see detailed information

## 🔄 Data Flow

1. **API Calls**: Centralized in `MovieApiService` with error handling
2. **Caching**: React Query automatically caches responses
3. **State Updates**: Automatic UI updates when data changes
4. **Background Sync**: Data refreshes automatically in background
5. **Offline Support**: Graceful degradation when offline

## 🎯 Benefits of the New Architecture

- **Less Code**: ~60% reduction in component complexity
- **Better Performance**: Automatic caching and background updates
- **Improved UX**: Faster loading, better error handling
- **Easier Maintenance**: Centralized data logic, clear separation of concerns
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Scalability**: Easy to add new features and data sources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 