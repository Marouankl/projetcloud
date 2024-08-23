<template>
  <div>
    <h2>Détails du Livre</h2>
    <div v-if="book">
      <img :src="book.image_url" :alt="book.title" />
      <h3>{{ book.title }}</h3>
      <p>Description: {{ book.description }}</p>
      <p>Prix: {{ book.price }}</p>
      <p>Auteur: {{ book.author }}</p>
      <p>Date de publication: {{ book.publication_date }}</p>
      <p>Domaine: {{ book.domain }}</p>
    </div>
    <p v-else-if="loading">Chargement...</p>
    <p v-else>Livre non trouvé.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const book = ref(null);
const loading = ref(false);
const route = useRoute();

const fetchBookDetails = async (book_id) => {
  loading.value = true;
  try {
    const response = await fetch(`https://nqkghrejc2.execute-api.us-east-1.amazonaws.com/prod/books/${book_id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }
    book.value = await response.json();
  } catch (error) {
    console.error('Error fetching book details:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBookDetails(route.params.book_id);
});
</script>

<style scoped>
div {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

img {
  max-width: 200px;
  margin-bottom: 1rem;
}

h3 {
  margin: 0;
}

p {
  margin: 0.5rem 0;
}
</style>
