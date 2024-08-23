<template>
  <div class="signup-container">
    <h2>Inscription</h2>
    <form @submit.prevent="handleSignUp">
      <div class="form-group">
        <label for="username">Nom d'utilisateur</label>
        <input v-model="form.username" type="text" id="username" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="form.email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="phone_number">Numéro de téléphone</label>
        <input v-model="form.phone_number" type="tel" id="phone_number" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input v-model="form.password" type="password" id="password" required />
      </div>
      <button type="submit">S'inscrire</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p class="signin-link">Déjà un compte ? <router-link to="/signin">Connectez-vous</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importez useRouter
import userPool from './auth';

// Format a phone number to E.164 format
const formatPhoneNumber = (phone_number) => {
  // Remove any non-numeric characters
  const cleaned = ('' + phone_number).replace(/\D/g, '');
  // Assuming the phone number is in the US and starts with country code
  return `+1${cleaned}`;
};

const form = ref({
  username: '',
  email: '',
  phone_number: '',
  password: ''
});

const error = ref(null);
const router = useRouter(); // Utilisez useRouter

const handleSignUp = async () => {
  const { username, email, phone_number, password } = form.value;

  const formattedPhoneNumber = formatPhoneNumber(phone_number);

  const attributeList = [
    {
      Name: 'email',
      Value: email
    },
    {
      Name: 'phone_number',
      Value: formattedPhoneNumber
    }
  ];

  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) {
      error.value = 'Erreur d\'inscription: ' + err.message;
      console.error('error signing up:', err);
      return;
    }
    console.log('Sign up successful:', result);
    router.push('/'); // Redirection vers la page de connexion après une inscription réussie
  });
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  color: black;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  color: black;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  color: black;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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

p.error-message {
  color: red;
  text-align: center;
  margin-top: 1rem;
}

.signin-link {
  text-align: center;
  margin-top: 1rem;
  color: black;
}

.signin-link a {
  color: #007bff;
  text-decoration: none;
}

.signin-link a:hover {
  text-decoration: underline;
}
</style>
