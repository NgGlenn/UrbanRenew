<template>
  <div class="page-container">
    <Navbar></Navbar>
        
    <div id="app" class=" review-container">
    <div class="row">
      <div class="col-md-12 col-lg-12 col-sm-12">
        
        
        <form @submit.prevent="submitReview">
          <h1>Review Contractor</h1>
          <div class="image-container">
              <img :src="contractorImageUrl || '../icons/moodeng.png'" alt="User Logo" class="contractor-logo">
            </div>
            <label class="metric-label">Contractor's Name:</label>         
            <input type="text" :value="contractorName" disabled>
            <!-- <input type="text" class="form-control" id="amount" :value="formattedPrice" disabled /> -->
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

        
        
    </div>
    </div>
    </div>
  </div>

</template>
  
<script>
import Navbar from '@/components/NavBar.vue';
import { db, auth } from '../firebase'; 
import { collection, addDoc, getDoc, query, where, doc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import logedInLayout from '@/components/logedInLayout.vue';
export default {
  components: {
    Navbar,
    logedInLayout,
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
      userID: '',
      contractorImageUrl: '',
    };
  },
  async created() {
    // Retrieve contractorID from the query parameters
    const contractorID = this.$route.query.contractorID;
    console.log('Contractor ID from URL:', contractorID);

    if (contractorID) {
      try {
        // Directly reference the document by its ID
        const contractorRef = doc(db, 'contractors', contractorID);
        const contractorDoc = await getDoc(contractorRef);
        const UserDoc = await getDoc(doc(db, "users", contractorID));
        // Check if the document exists, and combine firstName and lastName
        if (contractorDoc.exists() && UserDoc.exists()) {
          this.contractorImageUrl = UserDoc.data().imageUrl; // Store contractor's image URL
          const contractorData = contractorDoc.data();
          console.log('Fetched contractor data:', contractorData);

          // Combine firstName and lastName with a space
          this.contractorName = `${contractorData.firstName} ${contractorData.lastName}`;
        }
         else {
          console.warn('No contractor found with the provided ID.');
        }
      } catch (error) {
        console.error('Error fetching contractor:', error);
      }
    } else {
      console.warn('No contractorID provided in the query parameters.');
    }

    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userID = user.uid; // Store logged-in user ID
      }
    });
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
    computeAverageRating() {
      // Calculate the average rating based on the 5 rating components
      const ratings = [
        this.qualityOfWork,
        this.timeliness,
        this.communication,
        this.problemResolution,
        this.budgetAdherence
      ];
      const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
      return (totalRating / ratings.length).toFixed(1); // Calculate and round to one decimal place
    },
    async submitReview() {
      if (!this.qualityOfWork || !this.timeliness || !this.communication || !this.problemResolution || !this.budgetAdherence) {
        alert('Please fill in all required rating fields.');
        return;
      }
      try {
        const averageRating = this.computeAverageRating();
        // Save the review data to Firestore
        const reviewData = {
          contractorName: this.contractorName,
          qualityOfWork: this.qualityOfWork,
          timeliness: this.timeliness,
          communication: this.communication,
          problemResolution: this.problemResolution,
          budgetAdherence: this.budgetAdherence,
          createdAt: new Date(),
          contractorID: this.$route.query.contractorID,
          averageRating: averageRating,
          customerID: this.userID, // Use this.userID instead of userID
          comment: this.reviewText,
        };

        await addDoc(collection(db, 'reviews'), reviewData);

        this.submitted = true;
        
        // Redirect to Review.vue and pass the review data
        this.$router.push({
          name: 'ReviewView',
          query: { averageRating: averageRating },
        });

      } catch (e) {
        console.error("Error adding document: ", e);
        alert('Error submitting review. Please try again.');
      }
    },
  },
};
</script>

  
  <style scoped>
.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px; /* Space between image and other elements */
}

.contractor-logo {
    width: 100%;
    max-width: 200px; /* Maximum width for larger screens */
    height: auto; /* Maintain aspect ratio */
    border-radius: 50%;
    object-fit: cover;
}
@media (max-width: 768px) {
    .contractor-logo {
        max-width: 150px; /* Adjust max-width for smaller screens */
    }
}

@media (max-width: 576px) {
    .contractor-logo {
        max-width: 120px; /* Further adjust max-width for very small screens */
    }
}
  
        .page-container {
        padding: 50px;
        margin: 0;
        padding: 0;
        font-family: 'Roboto', sans-serif;
        }
        
        .review-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 15% auto;
        
        }
        form{
          background-color: white;
          border-radius: 10px;
          padding:2%;
          margin: 5% auto;
          width: 70%;


        }
        .review-container h1 {
            font-size: 30px;
            font-weight: 700;
            color: #333;
            text-align: center;
            margin-bottom: 40px;
        }

        button{
          margin: auto;
          border-radius: 6px;
          cursor: pointer;
          
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
  