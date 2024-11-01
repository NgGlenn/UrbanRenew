<script>
import LogedInLayout from "@/components/LogedInLayout.vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { useCollection } from 'vuefire';
import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';


export default {
  data() {
    return {
      id: this.$route.params.id,
      details: null,
      reviews: null,
      loading: true
    };
  },

  methods: {

    async initPage(id) {
      try {
        // Get Contractors
        const contractors = doc(db, "contractors", id); 
        const docSnap = await getDoc(contractors);

        // Check if the document exists
        if (docSnap.exists()) {
          // Assign the document data to a variable
          this.details = docSnap.data();
          this.loading = false;
        } else {
          console.log("No such document");
        }

        // Get Reviews
        const reviews = collection(db, "reviews");
        const q = query(reviews, where("contractorName", "==", this.details.firstName + " " + this.details.lastName));

        // Execute query
        const querySnapshot = await getDocs(q);
        const results = [];
        
        querySnapshot.forEach((doc) => {
          results.push(doc.data()); // Collect data and ID for each document
        });

        this.reviews = results;
      } 
      catch (error) {
        console.error("Error fetching document:", error);
      }
    },

    createRequest(id){
      this.$router.push({ path: `/jobRequest/newRequest/${id}` });
      this.$emit(this.createRequest, id);
    }
  },

  computed: {
    storeLocation(){
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.details.storeAddress)}`
    }
  },

 mounted() {
  this.initPage(this.id);

    /*onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.userName = `${userData.firstName} ${userData.lastName}`;
          this.userEmail = userData.email;

          // Fetch contractor data based on user ID (assuming the doc ID is the same as user ID)
          const contractorDoc = doc(db, "contractors", user.uid);
          const contractorSnap = await getDoc(contractorDoc);

          if (contractorSnap.exists()) {
            const contractorData = contractorSnap.data();
            this.companyName = contractorData.companyName || "N/A";
            this.storeLocation = contractorData.storeLocation || "N/A";
            this.phone = contractorData.phone || "N/A";
            this.award1 = contractorData.awards ? contractorData.awards[0] : "N/A";
            this.award2 = contractorData.awards ? contractorData.awards[1] : "N/A";
          } else {
            console.error("No contractor document for user ID:", user.uid);
          }

          this.loading = false;
        } else {
          console.error("No user document for user ID:", user.uid);
        }
      } else {
        console.log("User not logged in. Redirecting to login page.");
        this.$router.push("/login");
      }
    });*/
  },
  components: {
    LogedInLayout,
  },
};
</script>

<template>
  <LogedInLayout>
    <div v-if="loading"></div>
    <div v-else>
      {{ console.log(JSON.stringify(reviews)) }}
      <div class="container mt-5">
        <div class="row">
          <!-- Left Column -->
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="text-center mb-3">
                <img
                  src="https://via.placeholder.com/150"
                  alt="User Profile"
                  class="rounded-circle profile-image mb-3"
                />
                <h5 class="card-title">
                  <i class="fas fa-user-circle"></i> {{ details.firstName}} {{ details.lastName }}
                </h5>
                <button @click="createRequest(id)" style="margin: 5px;"> Send Job Request </button>
              </div>
            </div>
            <div class="card mb-4">
              <div class="card-header">Company Information</div>
              <div class="card-body">
                <h5 class="card-title">
                  <i class="fas fa-info-circle"></i> About
                </h5>
                <!-- About Section Title -->

                <h6 class="">Company Name:</h6>
                <!-- Company Name -->
                <p>{{ details.companyName }}</p>

                <h6>Services Offered:</h6>
                <!-- Services Offered Section -->
                <ul class="list-unstyled">
                  <li v-for="service of details.services"> {{ service }} </li>
                </ul>

                <p v-if="details.styles!=null">
                  <h6>Styles:</h6>
                  <!-- Services Offered Section -->
                  {{ details.styles.join(', ') }}
                </p>
                

                <h6>Store Location:</h6>
                <!-- Store Location Section -->
                {{ details.storeAddress }} <br>
                <a
                  :href="storeLocation"
                  target="_blank"
                  class="text-primary hover-text-decoration-underline"
                >
                  <i class="fas fa-map-marker-alt"></i> View on Google Maps
                </a>

                <hr />


                <h5 class="mt-4">
                  <i class="fas fa-address-card"></i> Contact Info
                </h5>

                <h6 class=""><i class="fas fa-phone-alt"></i> Phone: {{ details.phoneNumber }}</h6>

                <h6 class=""><i class="fas fa-envelope"></i> Email: {{ details.businessEmail }}</h6>  

                <hr />
      

                <h5 class="mt-4">
                  <i class="fas fa-trophy"></i> Certificates & Awards
                </h5>
                <!-- Certificates & Awards Section Title -->
                <ul class="list-unstyled">
                  <li v-for="award of details.Awards"> <i class="fas fa-award"></i> {{ award }} </li>
                </ul>
              </div>
            </div>

          </div>

          <!-- Right Column -->
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-header">Past Renovation Projects</div>
              <div class="card-body">
                <div class="transaction-item">
                  <p class="bio-placeholder">No past projects available.</p>
                </div>
              </div>
            </div>
            <div class="card mb-4 review-card">
              <div class="card-header">Reviews</div>
              <div class="card-body">
                <p v-if="reviews.length==0" class="bio-placeholder"> No reviews yet. </p>
                <div v-else class="review-item mb-4 border-bottom pb-3" v-for="review of reviews">
                  <div class="d-flex align-items-center">
                    <img
                      src="../assets/home_testi3.jpg"
                      alt="John Doe"
                      class="rounded-circle me-2"
                      style="width: 50px; height: 50px"
                    />
                    <!-- Increased image size -->
                    <div class="flex-grow-1">
                      <h6 class="mb-0 text-muted"> 
                        <span v-if="review.reviewerName"> {{ review.reviewerName }} </span> 
                        <span v-else> Anonymous </span>
                      </h6>
                      <!-- Changed to h6 for smaller text -->
                      <div class="rating">
                        <span class="text-warning">&#9733;</span>
                        <span class="text-warning">&#9733;</span>
                        <span class="text-warning">&#9733;</span>
                        <span class="text-warning">&#9733;</span>
                        <span class="text-muted">&#9733;</span>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 small text-muted"> 
                    Quality of work: {{ review.qualityOfWork }} / 5 <br>
                    Communication: {{ review.communication }} / 5 <br>
                    Budget Adherence: {{ review.budgetAdherence }} / 5 <br>
                    Problem Resolution: {{ review.problemResolution }} / 5
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </LogedInLayout>
  <!-- <div v-else class="loading-spinner">Please Login to account...</div> -->
</template>

<style scoped>
body {
  background-color: #f7fbfc;
}
.card {
  background-color: #ffffff;
  border: none;
  margin-bottom: 30px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.bio-placeholder {
  color: #6c757d;
}
.review-card {
  background-color: #ffffff;
}
.profile-image {
  width: 150px;
  height: 150px;
  border: 3px solid #769fcd;
}
.button-container {
  margin-top: 10px;
}
.container {
  margin-top: 50px;
}
.card-header {
  background-color: #769fcd;
  color: white;
  font-weight: bold;
}
h6 {
  font-weight: bold;
}
.text-center {
  padding-top: 30px;
}
.btn-primary {
  background-color: #007bff;
  border: none;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-secondary {
  background-color: #6c757d;
  border: none;
}
.btn-secondary:hover {
  background-color: #5a6268;
}
.icon {
  font-size: 18px;
  margin-right: 8px;
}
.transaction-item {
  margin-bottom: 15px;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  width: 300px;
  text-align: center;
}
.modal-content h5 {
  color: #769fcd;
  margin-bottom: 15px;
}
.modal-content .btn {
  width: 100%;
  margin-bottom: 10px;
}
</style>
