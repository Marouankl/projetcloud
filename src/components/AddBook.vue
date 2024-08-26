<template>
  <div class="container">
    <!-- Header -->
    <header>
      <div class="wrapper">
        <img class="logo" src="https://s3-book-images.s3.amazonaws.com/logo.jpg" alt="Logo" />
        <nav>
          <RouterLink to="/home">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/books">Affiche livre</RouterLink>
          <RouterLink to="/contact">Contact</RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <div class="form-container">
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Define reactive variables
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

  // Validate form fields
  if (!title.value || !description.value || !price.value || !author.value || !image_url.value) {
    isError.value = true;
    message.value = 'All fields are required';
    return;
  }

  // Prepare book data
  const bookData = {
    title: title.value,
    description: description.value,
    price: price.value,
    author: author.value,
    image_url: image_url.value,
  };

  try {
    // Make API request to add book
    const response = await axios.post(
      'https://8sddxq83tf.execute-api.us-east-1.amazonaws.com/prod/books',
      bookData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // On success, display success message and set response data
    message.value = 'Book added successfully!';
    responseData.value = response.data;

    // Reset form fields
    title.value = '';
    description.value = '';
    price.value = 0;
    author.value = '';
    image_url.value = '';

    // Redirect to /books page
    router.push('/books');
  } catch (error) {
    // On error, display error message and log error details
    isError.value = true;
    message.value = 'Error adding book';
    console.error('Error adding book:', error);
  }
};
</script>

<style scoped>
/* Style for the header */
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

/* Style for the main container */
.container {
  background-image: url('https://s3-book-images.s3.us-east-1.amazonaws.com/ajoutelivre.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding-top: 80px; /* Adjust padding to avoid overlap with fixed header */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Style for the form container */
.form-container {
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background for readability */
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Style for form elements */
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
