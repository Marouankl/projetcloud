<template>
  <div>
    <header>
      <div class="wrapper">
        <img class="logo" src="https://s3-book-images.s3.amazonaws.com/logo.jpg" alt="Logo" />
        <nav>
          <RouterLink to="/home">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/services">Services</RouterLink>
          <RouterLink to="/addbooks">Ajouter un livre</RouterLink>
          <RouterLink to="/contact">Contact</RouterLink>
        </nav>
      </div>
    </header>

    <div class="content">
      <h2 class="title">Liste des Livres</h2>
      <div v-if="books.length > 0" class="books-container">
        <!-- Utilisation des groupes de livres -->
        <div v-for="(bookGroup, groupIndex) in bookGroups" :key="groupIndex" class="book-row">
          <div v-for="book in bookGroup" :key="book.id" class="book-card">
            <img :src="book.image_url" :alt="book.title" class="book-cover" />
            <div class="book-details">
              <h3 class="book-title">{{ book.title }}</h3>
              <h2 class="book-author">Auteur livre: {{ book.author }}</h2>
              <p class="book-discription">Description: {{ book.description }}</p>
              <p class="book-price">Prix: {{ book.price }} €</p>
            </div>
          </div>
        </div>
      </div>
      <p v-else-if="loading">Chargement...</p>
      <p v-else>Aucun livre trouvé.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const books = ref([]);
const loading = ref(false);

const fetchBooks = async () => {
  loading.value = true;
  try {
    const response = await axios.get('https://bayiajcksa.execute-api.us-east-1.amazonaws.com/prod/books');
    const booksData = response.data;
    books.value = booksData.map(book => ({
      ...book,
      image_url: book.image_url
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
  } finally {
    loading.value = false;
  }
};

// Fonction pour regrouper les livres par groupes de quatre
const bookGroups = computed(() => {
  const groups = [];
  for (let i = 0; i < books.value.length; i += 4) {
    groups.push(books.value.slice(i, i + 4));
  }
  return groups;
});

onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
/* Style de la barre de navigation */
header {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  height: 50px;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s;
}

nav a.router-link-exact-active {
  background-color: #444;
  border-radius: 4px;
}

nav a:hover {
  background-color: #555;
}

/* Style pour le conteneur principal */
.content {
  padding-top: 100px; /* Espace entre le header et le contenu */
  text-align: center; /* Centrer le texte du contenu principal */
  background-image: url('https://s3-book-images.s3.us-east-1.amazonaws.com/bib.jpg'); /* Image de fond */
  background-size: cover; /* Couvrir tout l'arrière-plan */
  background-position: center; /* Centrer l'image de fond */
  background-repeat: no-repeat; /* Ne pas répéter l'image */
  min-height: 100vh; /* S'assurer que le conteneur couvre toute la hauteur de la vue */
}

/* Style pour le titre centré */
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #fff; /* Couleur du texte pour contraster avec l'image de fond */
}

/* Conteneur principal des livres */
.books-container {
  display: flex;
  flex-direction: column; /* Aligner les groupes de livres verticalement */
  gap: 20px;
  margin-top: 20px; /* Ajuster le margin-top si nécessaire */
}

/* Groupe de livres (ligne) */
.book-row {
  display: flex;
  justify-content: center; /* Centrer les cartes de livres horizontalement */
  gap: 20px;
}

/* Carte du livre */
.book-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 15px;
  max-width: 250px;
  background-color: rgba(255, 255, 255, 0.9); /* Légère transparence pour voir l'image de fond à travers */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.book-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Image du livre */
.book-cover {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 10px;
}

/* Détails du livre */
.book-details {
  text-align: center;
}

.book-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
}

.book-price {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #ff0000;
}

.book-author, .book-discription {
  margin: 5px 0;
  font-size: 0.9rem;
  color: black;
}

@media (min-width: 1024px) {
  header {
    padding: 1rem 2rem;
  }

  nav {
    gap: 2rem;
  }

  nav a {
    padding: 0.5rem 1.5rem;
  }

  .title {
    font-size: 2.5rem; /* Plus grande taille de police pour les écrans plus larges */
  }
}
</style>
