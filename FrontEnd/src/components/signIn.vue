<template>
  <div class="signin-container">
    <h2>Connexion</h2>
    <form @submit.prevent="handleSignIn">
      <div class="form-group">
        <label for="username">Nom d'utilisateur</label>
        <input v-model="form.username" type="text" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input v-model="form.password" type="password" id="password" required />
      </div>
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <!-- Lien vers la page d'inscription -->
    <p class="signup-link">Pas encore de compte ? <router-link to="/signup">Inscrivez-vous</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import userPool from './auth';
import { useRouter } from 'vue-router'; // Importez useRouter

const form = ref({
  username: '',
  password: ''
});

const error = ref(null);
const router = useRouter(); // Utilisez useRouter

const handleSignIn = () => {
  const authenticationDetails = new AuthenticationDetails({
    Username: form.value.username,
    Password: form.value.password,
  });

  const cognitoUser = new CognitoUser({
    Username: form.value.username,
    Pool: userPool
  });

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess(result) {
      console.log('Connexion réussie:', result);
      const accessToken = result.getAccessToken().getJwtToken();
      localStorage.setItem('accessToken', accessToken);
      console.log('Access Token:', accessToken);
      router.push('/home'); // Redirection vers la page d'accueil après une connexion réussie
    },

    onFailure(err) {
      error.value = 'Erreur de connexion: ' + err.message;
      console.error('error signing in:', err);
    }
  });
};
</script>

<style scoped>
.signin-container {
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

.signup-link {
  text-align: center;
  margin-top: 1rem;
  color: black;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
