<template>
  <div class="signin-container">
    <h2>Connexion</h2>
    <form @submit.prevent="handleSignIn">
      <div class="form-group">
        <label for="username">E-mail d'utilisateur</label>
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
import { useRouter } from 'vue-router';

const form = ref({
  username: '',
  password: ''
});

const error = ref(null);
const router = useRouter();

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
  margin: 0 auto;
  padding: 2rem;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  top: 50%;
  transform: translateY(50%);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
}

.signup-link {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.signup-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .signin-container {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  button {
    font-size: 0.875rem;
  }

  .signup-link {
    font-size: 0.875rem;
  }
}
</style>
