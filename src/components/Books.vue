
<template>
  <div>
    <RouterLink to="/home" class="home-link">Home</RouterLink>
    <h2>Liste des Livres</h2>
    <div v-if="books.length > 0" class="books-container">
      <div v-for="book in books" :key="book.id" class="book-card">
        <img :src="book.image_url" :alt="book.title" class="book-cover" />
        <div class="book-details">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-price">Prix: {{ book.price }} €</p>
      
          <p class="book-discription">Description: {{ book.description }}</p>
          <p class="book-author">Auteur livre: {{ book.author }}</p>
        </div>
      </div>
    </div>
    <p v-else-if="loading">Chargement...</p>
    <p v-else>Aucun livre trouvé.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const books = ref([]);
const loading = ref(false);

const fetchBooks = async () => {
  loading.value = true;
  try {
    // Requête GET vers votre API
    const response = await axios.get('https://8sddxq83tf.execute-api.us-east-1.amazonaws.com/prod/books');
    
    // Traiter la réponse et mettre à jour les données des livres
    const booksData = response.data;
    
    books.value = booksData.map(book => ({
      ...book,
      image_url: book.image_url // Assurez-vous que l'URL de l'image est correctement définie
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBooks();
});
</script>
<style scoped>
  /* Style du lien Home */
  .home-link {
    display: inline-block;
    margin-bottom: 20px;
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
  }

  .home-link:hover {
    text-decoration: underline;
  }

  /* Conteneur principal des livres */
  .books-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  /* Carte du livre */
  .book-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #000; /* Bordure noire */
    border-radius: 8px;
    padding: 15px;
    max-width: 250px;
    background-color: #fff;
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
    color: #007bff; /* Couleur bleue pour le titre */
  }

  .book-price {
    margin: 5px 0;
    font-size: 0.9rem;
    color: #ff0000; /* Couleur rouge pour le prix */
  }

  .book-author {
    margin: 5px 0;
    font-size: 0.9rem;
    color: black;
  }
  .book-discription{
    margin: 5px 0;
    font-size: 0.9rem;
    color: black;
  }
</style>
