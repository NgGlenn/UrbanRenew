<template>
    <div class="payment-details">
      <h1>Payment Details</h1>
      <div>
        <h2>Project: {{ projectName }}</h2>
        <p><strong>Contractor:</strong> {{ contractorName }}</p>
        <p><strong>Price:</strong> ${{ formattedPrice }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['projectName', 'contractorName', 'price'],
    computed: {
      formattedPrice() {
        return parseFloat(this.price).toLocaleString();
      }
    }
  };
  </script>
  
  <style scoped>
  .payment-details {
    flex: 1;
    padding: 20px;
  }


  </style>