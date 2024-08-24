<template>
  <div>
    <label for="title">Book Title:</label>
    <input id="title" v-model="title" placeholder="Book Title" />

    <label for="description">Description:</label>
    <input id="description" v-model="description" placeholder="Description" />

    <label for="prix">Prix:</label>
    <input id="prix" v-model="prix" placeholder="Prix" type="number" />

    <label for="author">Author:</label>
    <input id="author" v-model="author" placeholder="Author" />

    <label for="coverImage">Cover Image:</label>
    <input id="coverImage" type="file" @change="uploadFile" />

    <button @click="addBook">Add Book</button>

    <!-- Affichage des messages d'erreur ou de succès -->
    <div v-if="message" :class="{'error': isError, 'success': !isError}">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const title = ref('');
const description = ref('');
const prix = ref(0);
const author = ref('');
const file = ref(null);
const message = ref('');
const isError = ref(false);

// Fonction pour capturer le fichier sélectionné
const uploadFile = (event) => {
  file.value = event.target.files[0];
};

// Fonction pour ajouter un livre
const addBook = async () => {
  message.value = '';
  isError.value = false;

  if (!file.value) {
    isError.value = true;
    message.value = 'Please select a cover image';
    return;
  }

  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('prix', prix.value);
  formData.append('author', author.value);
  formData.append('file', file.value);

  try {
    // Envoi des données du livre et du fichier d'image dans une seule requête POST
    const response = await axios.post('https://8sddxq83tf.execute-api.us-east-1.amazonaws.com/prod/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Book added successfully:', response.data);
    message.value = 'Book added successfully!';
    
    // Réinitialiser les champs après l'ajout
    title.value = '';
    description.value = '';
    prix.value = 0;
    author.value = '';
    file.value = null;
  } catch (error) {
    console.error('Error adding book:', error);
    isError.value = true;
    message.value = 'Error adding book';
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 0.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 1rem;
}

.success {
  color: green;
  margin-top: 1rem;
}
</style>
