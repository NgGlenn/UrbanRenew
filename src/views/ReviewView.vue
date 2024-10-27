<template>
    <div class="review-summary-container">
      <h1>Thank you for your review!</h1>
  
      <!-- Display the review summary -->
      <div class="review-summary">
        <h3>Contractor's Name: {{ reviewData.contractorName }}</h3>
        
        <div class="rating-item">
          <p><strong>Quality of Work:</strong> {{ reviewData.qualityOfWork }}/5</p>
        </div>
  
        <div class="rating-item">
          <p><strong>Timeliness:</strong> {{ reviewData.timeliness }}/5</p>
        </div>
  
        <!-- Repeat for all 5 components -->
        <div class="rating-item">
          <p><strong>Communication:</strong> {{ reviewData.communication }}/5</p>
        </div>
  
        <div class="rating-item">
          <p><strong>Problem Resolution:</strong> {{ reviewData.problemResolution }}/5</p>
        </div>
  
        <div class="rating-item">
          <p><strong>Budget Adherence:</strong> {{ reviewData.budgetAdherence }}/5</p>
        </div>
  
        <!-- Display the overall average rating -->
        <h2>Overall Rating: {{ overallRating }}/5</h2>
      </div>
  
      <!-- Button to go back to homepage -->
      <button @click="goToHome">Back to Homepage</button>
    </div>
  </template>
  
  <script>
  
  export default {
    props: {
    reviewData: {
      type: Object,
      //required: true,
      default: () => ({
        contractorName: '',
        qualityOfWork: 0,
        timeliness: 0,
        communication: 0,
        problemResolution: 0,
        budgetAdherence: 0
      })
    }
  },
    computed: {
      overallRating() {
        // Compute the average rating based on 5 rating components
        const ratings = [
          this.reviewData.qualityOfWork,
          this.reviewData.timeliness,
          this.reviewData.communication,
          this.reviewData.problemResolution,
          this.reviewData.budgetAdherence
        ];
        const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
        return (totalRating / ratings.length).toFixed(1); // Calculate and round to one decimal place
      }
    },

    methods: {
      goToHome() {
        // Redirect to home.vue
        this.$router.push({ name: 'home' });
      }
    },
   
  };
  </script>
  
  <style>
  .review-summary-container {
    text-align: center;
    padding: 20px;
  }
  
  .rating-item {
    margin: 10px 0;
  }
  
  button {
            background-color: #6A42C7;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 10%;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 100%;
            text-align: center;
            height:auto;
        }
  </style>
  