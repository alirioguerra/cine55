# Cine55 - App de Filmes e Séries

Um aplicativo React Native/Expo para descobrir e avaliar filmes e séries usando a API do The Movie Database (TMDB).

## 🎬 Funcionalidades

- **Listagem de Filmes**: Grid infinito de filmes populares
- **Tela de Detalhes**: Informações completas do filme com capa, sinopse, gêneros e avaliações
- **Sistema de Avaliação**: Usuário pode dar nota de 0 a 10 e deixar comentários
- **Filtro por Gênero**: Navegação por categorias de filmes
- **Busca por Nome**: Input de busca com debounce de 500ms
- **Navegação Stack**: Fluxo Home → Detalhes → Voltar
- **Status Offline**: Mensagem quando não há conexão com a internet
- **Persistência Local**: Avaliações salvas localmente usando AsyncStorage

## 🚀 Tecnologias Utilizadas

- **React Native** com **Expo**
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **The Movie Database API** para dados de filmes
- **AsyncStorage** para persistência local
- **Expo Network** para verificação de conectividade

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── MovieCard.tsx   # Card de filme
│   ├── SearchBar.tsx   # Barra de busca
│   ├── GenreFilter.tsx # Filtro por gênero
│   └── OfflineMessage.tsx # Mensagem offline
├── screens/            # Telas da aplicação
│   ├── HomeScreen.tsx  # Tela principal
│   └── MovieDetailsScreen.tsx # Tela de detalhes
├── navigation/         # Configuração de navegação
│   └── AppNavigator.tsx
├── types/             # Definições TypeScript
│   ├── movie.ts       # Tipos de filmes
│   └── navigation.ts  # Tipos de navegação
├── utils/             # Utilitários
│   ├── api.ts         # Serviço da API TMDB
│   └── storage.ts     # Serviço de armazenamento
└── composables/       # Hooks customizados
    └── useNetworkStatus.ts # Hook de status da rede
```

## 🛠️ Instalação e Execução

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd cine55
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env
   
   # Edite o arquivo .env e adicione sua chave da API
   TMDB_API_KEY=sua_chave_api_aqui
   ```

4. **Execute o projeto**
   ```bash
   npm start
   ```

5. **Abra no dispositivo/simulador**
   - Use o Expo Go no seu dispositivo móvel
   - Ou pressione `i` para iOS Simulator
   - Ou pressione `a` para Android Emulator

## 🔧 Configuração da API

O projeto usa a API pública do TMDB. Para configurar sua própria chave da API:

1. **Registre-se em [themoviedb.org](https://www.themoviedb.org/settings/api)**
2. **Crie um arquivo `.env` na raiz do projeto**
3. **Adicione sua chave da API:**
   ```
   TMDB_API_KEY=sua_chave_api_aqui
   ```

⚠️ **Importante**: O arquivo `.env` está no `.gitignore` para proteger sua chave da API. Nunca commite este arquivo no repositório.

## 📋 Checklist de Funcionalidades

- [x] Listagem de Filmes e Séries
- [x] Tela de Detalhes com informações completas
- [x] Sistema de Avaliação (0-10 + comentário)
- [x] Filtro por Gênero
- [x] Busca por Nome com debounce
- [x] Navegação com Stack Navigator
- [x] Mensagem de Offline
- [x] Persistência local das avaliações
- [x] Configuração segura de variáveis de ambiente

## 🎨 Design e UX

- Interface moderna e intuitiva
- Cards de filmes com informações essenciais
- Tela de detalhes com header visual atrativo
- Sistema de avaliação com estrelas interativas
- Feedback visual para ações do usuário
- Suporte a modo offline

## 📱 Compatibilidade

- iOS 12.0+
- Android 5.0+
- Expo SDK 53+

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 