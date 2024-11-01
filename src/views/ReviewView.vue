<template>
  <NavBar></NavBar>
  <div class="review-summary-container">
    <div class="review-card">
      <h1>Thank you for your review!</h1>
      
      <!-- Display the overall average rating -->
      <div class="average-rating">
        <h2>Overall Rating: {{ overallRating }}/5</h2>
      </div>
      
      <!-- Button to go back to homepage -->
      <button @click="goToHome">Back to Homepage</button>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
export default {
  components: {
    NavBar
  },
  data() {
    return {
      averageRating: null
    };
  },
  created() {
    // Get the average rating from query parameters
    this.averageRating = this.$route.query.averageRating || 'N/A';
  },
  computed: {
    overallRating() {
      return this.averageRating;
    }
  },
  methods: {
    goToHome() {
      // Redirect to home.vue
      this.$router.push({ name: 'home' });
    }
  }
};
</script>

<style scoped>
.review-summary-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f4f6;
}

.review-card {
  max-width: 400px;
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 1.5rem;
  color: #4A4A4A;
  margin-bottom: 20px;
}

.average-rating h2 {
  font-size: 2rem;
  color: #6A42C7;
  margin-bottom: 20px;
}



button:hover {
  background-color: #5734a5;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .review-card {
    padding: 15px;
  }

  h1 {
    font-size: 1.3rem;
  }

  .average-rating h2 {
    font-size: 1.8rem;
  }

  button {
    padding: 8px 15px;
  }
}
</style>
  