<template>
  <div class="page-container">
    <Navbar></Navbar>
        
    <div id="app" class=" review-container">
    <div class="row">
      <div class="col-md-12 col-lg-12 col-sm-12">
   
        
        <form @submit.prevent="submitReview">
          <h1>Review Contractor</h1>
            <label class="metric-label">Contractor's Name:</label>
            <input type="text" v-model="contractorName" placeholder="Enter contractor name" required>

            <!-- Star Rating for Quality of Work -->
            <label class="metric-label">Quality of Work</label>
            <p class="metric-description">Quality of the final result of the renovation</p>
            <div class="star-rating">
                <span v-for="star in 5" :key="star" class="star"
                      :class="{ selected: qualityOfWork >= star, hovered: hoverQualityOfWork >= star }"
                      @click="setRating('qualityOfWork', star)"
                      @mouseover="hoverRating('hoverQualityOfWork', star)"
                      @mouseleave="leaveRating('hoverQualityOfWork')">
                    &#9733;
                </span>
                <span class="rating-description">{{ getRatingDescription(qualityOfWork) }}</span>
            </div>

            <!-- Star Rating for Timeliness -->
            <label class="metric-label">Timeliness</label>
            <p class="metric-description">How well the contractors follow given deadlines</p>
            <div class="star-rating">
                <span v-for="star in 5" :key="star" class="star"
                      :class="{ selected: timeliness >= star, hovered: hoverTimeliness >= star }"
                      @click="setRating('timeliness', star)"
                      @mouseover="hoverRating('hoverTimeliness', star)"
                      @mouseleave="leaveRating('hoverTimeliness')">
                    &#9733;
                </span>
                <span class="rating-description">{{ getRatingDescription(timeliness) }}</span>
            </div>

            <!-- Star Rating for Communication -->
            <label class="metric-label">Communication</label>
            <p class="metric-description">How responsive and open are the contractors</p>
            <div class="star-rating">
                <span v-for="star in 5" :key="star" class="star"
                      :class="{ selected: communication >= star, hovered: hoverCommunication >= star }"
                      @click="setRating('communication', star)"
                      @mouseover="hoverRating('hoverCommunication', star)"
                      @mouseleave="leaveRating('hoverCommunication')">
                    &#9733;
                </span>
                <span class="rating-description">{{ getRatingDescription(communication) }}</span>
            </div>

            <!-- Star Rating for Problem Resolution -->
            <label class="metric-label">Problem Resolution</label>
            <p class="metric-description">How well do the contractors deal with issues/problems</p>
            <div class="star-rating">
                <span v-for="star in 5" :key="star" class="star"
                      :class="{ selected: problemResolution >= star, hovered: hoverProblemResolution >= star }"
                      @click="setRating('problemResolution', star)"
                      @mouseover="hoverRating('hoverProblemResolution', star)"
                      @mouseleave="leaveRating('hoverProblemResolution')">
                    &#9733;
                </span>
                <span class="rating-description">{{ getRatingDescription(problemResolution) }}</span>
            </div>

            <!-- Star Rating for Budget Adherence -->
            <label class="metric-label">Budget Adherence</label>
            <p class="metric-description">How well the contractors follow given budgets</p>
            <div class="star-rating">
                <span v-for="star in 5" :key="star" class="star"
                      :class="{ selected: budgetAdherence >= star, hovered: hoverBudgetAdherence >= star }"
                      @click="setRating('budgetAdherence', star)"
                      @mouseover="hoverRating('hoverBudgetAdherence', star)"
                      @mouseleave="leaveRating('hoverBudgetAdherence')">
                    &#9733;
                </span>
                <span class="rating-description">{{ getRatingDescription(budgetAdherence) }}</span>
            </div>

            <label for="reviewText" class="metric-label">Additional Comments</label>
            <textarea v-model="reviewText" placeholder="Write your review here..."></textarea>

            <button type="submit">Submit Review</button>
        </form>

        <!-- Review Summary Section -->
        <div v-if="submitted" class="review-summary">
            <h2>Review Summary</h2>
            <p><strong>Contractor Name:</strong> {{ contractorName }}</p>
            <p><strong>Quality of Work:</strong> {{ qualityOfWork }} / 5</p>
            <p><strong>Timeliness:</strong> {{ timeliness }} / 5</p>
            <p><strong>Communication:</strong> {{ communication }} / 5</p>
            <p><strong>Problem Resolution:</strong> {{ problemResolution }} / 5</p>
            <p><strong>Budget Adherence:</strong> {{ budgetAdherence }} / 5</p>
            <p><strong>Additional Comments:</strong> {{ reviewText }}</p>
        </div>
    </div>
    </div>
    </div>
  </div>


</template>
  
  <script>
  import Navbar from '@/components/NavBar.vue';
  export default {
    components: {
      Navbar,
    },
    data() {
      return {
        contractorName: '',
        qualityOfWork: 0,
        timeliness: 0,
        communication: 0,
        problemResolution: 0,
        budgetAdherence: 0,
        hoverQualityOfWork: 0,
        hoverTimeliness: 0,
        hoverCommunication: 0,
        hoverProblemResolution: 0,
        hoverBudgetAdherence: 0,
        reviewText: '',
        submitted: false,
      };
    },
    methods: {
      setRating(metric, value) {
        this[metric] = value; // Set the rating on click
      },
      hoverRating(hoverMetric, value) {
        this[hoverMetric] = value; // Temporarily highlight stars during hover
      },
      leaveRating(hoverMetric) {
        this[hoverMetric] = 0; // Reset hover state
      },
      getRatingDescription(rating) {
        switch (rating) {
          case 5:
            return 'Excellent';
          case 4:
            return 'Very Good';
          case 3:
            return 'Good';
          case 2:
            return 'Fair';
          case 1:
            return 'Poor';
          default:
            return '';
        }
      },
      submitReview() {
        if (
          this.contractorName &&
          this.qualityOfWork &&
          this.timeliness &&
          this.communication &&
          this.problemResolution &&
          this.budgetAdherence
        ) {
          this.submitted = true;
        } else {
          alert('Please fill out all fields.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
        #app{
          background-color: #ffd580;;
        }
        .page-container {
        background-color: #ffd580;
        padding: 50px;
        margin: 0;
        padding: 0;
        font-family: 'Roboto', sans-serif;
        }
        
        .review-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
          
            margin: 40px auto;
        
        }
        form{
          background-color: white;
          border-radius: 10px;
          padding:2%;
          width: 80%;
          margin-left: 10%;
          margin-right: 10%;
          margin-top: 5%;
          margin-bottom: 5%;

        }
        .review-container h1 {
            font-size: 30px;
            font-weight: 700;
            color: #333;
            text-align: center;
            margin-bottom: 40px;
        }

        button {
            background-color: #6A42C7;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 30px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 100%;
            text-align: center;
            height:50px;
        }

        button:hover {
            background-color: #5333a0;
        }

        .star-rating {
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: #f5f5f5;
            padding: 10px 20px;
            border-radius: 30px;
            margin-bottom: 20px;
        }

        .star {
            font-size: 35px;
            color: #ccc;
            cursor: pointer;
            transition: color 0.3s;
        }

        .star.hovered, .star.selected {
            color: #f9bf29;
        }

        .rating-description {
            margin-left: 15px;
            font-size: 16px;
            font-weight: 600;
            color: #333;
        }

        .metric-description {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }

        .review-summary {
            background-color: #f7f7f7;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            border: 1px solid #e6e6e6;
        }

        .review-summary h2 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
        }

        .review-summary p {
            font-size: 16px;
            margin-bottom: 10px;
        }

        label {
            font-weight: 600;
            margin-bottom: 10px;
            display: block;
            color: #333;
            font-size: 18px;
          
        }

        input, select, textarea {
            width: 100%;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 30px;
            font-size: 16px;
        }

        textarea {
            height: 120px;
        }

        .metric-label {
            font-size: 20px;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
        }

        .metric-description {
            margin-bottom: 15px;
            font-size: 14px;
            color: #666;
        }

        .rating-description {
            font-size: 16px;
            font-weight: 600;
            margin-left: 20px;
            color: #333;
        }
        .metric-description{
            font-style: italic;
        }
        ::placeholder{
            font-style: italic;
        }
  
  </style>
  