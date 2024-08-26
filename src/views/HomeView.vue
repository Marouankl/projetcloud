<template>
  <div class="home-page">
    <header>
      <div class="wrapper">
        <img class="logo" src="https://s3-book-images.s3.us-east-1.amazonaws.com/logo.jpg" alt="Logo" />
        <nav>
          <RouterLink to="/home">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/services">Services</RouterLink>
          <RouterLink to="/contact">Contact</RouterLink>
          <button class="logout-button" @click="logout">Logout</button> 
        </nav>
      </div>
    </header>
    
    <div class="home-content">
      <h1>Bienvenue à la Bibliothèque Virtuelle</h1>
      <p>{{ message }}</p>
      <router-link class="button" to="/addbooks">Ajouter livre</router-link>
      <router-link class="button" to="/books">Livres</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Bienvenue sur notre plateforme de livres."
    };
  },
  methods: {
    logout() {
      // Remove the token from localStorage
      localStorage.removeItem('token');
      this.$router.push('/'); // Replace '/login' with your desired route
    }
  }
};
</script>

<style scoped>
.home-page {
  background-image: url('https://s3-book-images.s3.us-east-1.amazonaws.com/Box-livre-1.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  color: #fff;
}

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

.logout-button {
  background-color: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #f44336;
  border-radius: 4px;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  padding-top: 100px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.button {
  background-color: #007BFF;
  color: #fff;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0056b3;
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

  h1 {
    font-size: 4rem;
  }

  p {
    font-size: 2rem;
  }
}
</style>
