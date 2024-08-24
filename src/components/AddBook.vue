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

const uploadFile = (event) => {
  file.value = event.target.files[0];
};

const uploadToS3 = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('https://8sddxq83tf.execute-api.us-east-1.amazonaws.com/prod/books/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.fileName; // Assumes the API returns the file name
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const addBook = async () => {
  if (file.value) {
    try {
      const fileName = await uploadToS3(file.value);

      const book = {
        title: title.value,
        description: description.value,
        prix: parseFloat(prix.value),
        author: author.value,
        coverImage: fileName,
      };

      const response = await axios.post('https://8sddxq83tf.execute-api.us-east-1.amazonaws.com/prod/books', book, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Book added successfully:', response.data);
      // Réinitialiser les champs après l'ajout
      title.value = '';
      description.value = '';
      prix.value = 0;
      author.value = '';
      file.value = null;
    } catch (error) {
      console.error('Error adding book:', error);
    }
  } else {
    console.error('No file selected');
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
</style>
