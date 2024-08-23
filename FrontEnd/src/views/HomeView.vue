<script setup>

</script>

<template>
   <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/services">Services</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </nav>
    </div>
  </header>
  <div class="home">
    <h1>Bienvenue sur la page d'accueil</h1>
    <p>{{ message }}</p>
    <router-link to="/addbooks">Ajouter livre</router-link>
    <router-link to="/books">Livres</router-link>
  </div>

 
</template>
<style scoped>
header {

  color: #fff;
  padding: 1rem;
  top: 1px;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
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

@media (min-width: 1024px) {
  header {
    padding: 1rem 2rem;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }

  nav {
    gap: 2rem;
  }

  nav a {
    padding: 0.5rem 1.5rem;
  }
}
</style>
