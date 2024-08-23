import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Books from '../components/Books.vue'
import BooksDetail from '../components/BooksDetail.vue'
import signIn from '../components/signIn.vue'
import signUp from '../components/signUp.vue'
import AddBook from '../components/AddBook.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signin',
      component: signIn
    },
    {
      path: '/signup',
      name: 'signup',
      component: signUp
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    { path: '/books', 
      component: Books
      
     },
     { path: '/books/:book_id', 
      name: 'BookDetail', 
      component: BooksDetail
  

      },
      { path: '/addbooks', 
       name: 'AddBook', 
       component: AddBook
   
 
       }
    
  ]
})



export default router
