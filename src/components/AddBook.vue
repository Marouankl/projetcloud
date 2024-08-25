<template>
  <div>
    <!-- Title for adding a new book -->
    <h1>Ajouter un nouveau livre</h1>

    <form @submit.prevent="addBook">
      <label for="title">Book Title:</label>
      <input id="title" v-model="title" placeholder="Book Title" required />

      <label for="description">Description:</label>
      <input id="description" v-model="description" placeholder="Description" required />

      <label for="price">Price:</label>
      <input id="price" v-model.number="price" placeholder="Price" type="number" required />

      <label for="author">Author:</label>
      <input id="author" v-model="author" placeholder="Author" required />

      <label for="image_url">Cover Image URL:</label>
      <input id="image_url" v-model="image_url" placeholder="Image URL" required />

      <button type="submit">Add Book</button>
    </form>

    <div v-if="message" :class="{ error: isError, success: !isError }">
      {{ message }}
    </div>

    <div v-if="responseData">
      <h3>Response Data:</h3>
      <pre>{{ responseData }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const title = ref('');
const description = ref('');
const price = ref(0);
const author = ref('');
const image_url = ref('');
const message = ref('');
const isError = ref(false);
const responseData = ref(null);

const router = useRouter();

const addBook = async () => {
  message.value = '';
  isError.value = false;
  responseData.value = null;

  if (!title.value || !description.value || !price.value || !author.value || !image_url.value) {
    isError.value = true;
    message.value = 'All fields are required';
    return;
  }

  const bookData = {
    title: title.value,
    description: description.value,
    price: price.value,
    author: author.value,
    image_url: image_url.value,
  };

  try {
    const response = await axios.post(
      'https://8sddxq83tf.execute-api.us-east-1.amazonaws.com/prod/books',
      bookData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    message.value = 'Book added successfully!';
    responseData.value = response.data;

    // Reset form fields
    title.value = '';
    description.value = '';
    price.value = 0;
    author.value = '';
    image_url.value = '';

    // Redirect to /books
    router.push('/books');
  } catch (error) {
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
<!-- 
 <template>
  <div>
    <form @submit.prevent="addBook">
      <label for="title">Book Title:</label>
      <input id="title" v-model="newBook.title" placeholder="Book Title" />

      <label for="description">Description:</label>
      <input id="description" v-model="newBook.description" placeholder="Description" />

      <label for="price">Price:</label>
      <input id="price" v-model="newBook.price" placeholder="Price" type="number" />

      <label for="author">Author:</label>
      <input id="author" v-model="newBook.author" placeholder="Author" />

      <label for="image_url">Cover Image URL:</label>
      <input id="image_url" v-model="newBook.image_url" placeholder="Image URL" />

      <button type="submit">Add Book</button>
    </form>

   
   <div v-if="message" :class="{ error: isError, success: !isError }">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Reactive state for the new book
const newBook = ref({
  title: '',
  price: '',
  description: '',
  author: '',
  image_url: ''
});
const message = ref('');
const isError = ref(false);

const addBook = async () => {
  message.value = '';
  isError.value = false;

  if (!newBook.value.title || !newBook.value.description || !newBook.value.price || !newBook.value.author || !newBook.value.image_url) {
    isError.value = true;
    message.value = 'Tous les champs sont requis';
    return;
  }

  try {
    const response = await axios.post(
      'https://8sddxq83tf.execute-api.us-east-1.amazonaws.com/prod/books',
      newBook.value,
    );

    console.log('Livre ajouté avec succès :', response.data);
    message.value = 'Livre ajouté avec succès !';

    // Réinitialiser les champs du formulaire
    newBook.value = {
      title: '',
      description: '',
      price: '',
      author: '',
      image_url: ''
    };
  } catch (error) {
    console.error('Erreur lors de l\'ajout du livre :', error.response ? error.response.data : error.message);
    isError.value = true;
    message.value = error.response ? `Erreur lors de l'ajout du livre : ${error.response.status} - ${error.response.data}` : `Erreur lors de l'ajout du livre : ${error.message}`;
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
</style>  -->
