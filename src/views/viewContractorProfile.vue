<script>
import LogedInLayout from "@/components/logedInLayout.vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { useCollection } from 'vuefire';
import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';
import defaultProfileIcon from "@/assets/defaultProfileIcon.jpg";
import Review from "@/components/Review.vue";

export default {
  data() {
    return {
      id: this.$route.params.id,
      details: null,
      reviews: [],
      portfolioImages: [],
      loading: true,
      profilePictureUrl: '',
      postalCode: '',
      mapLoaded: false,
      error: null,
      mapInitialized: false
    };
  },

  methods: {
    async initPage(id) {
      if (!id) {
        this.error = "No contractor ID provided";
        this.loading = false;
        return;
      }

      try {
        // Get Contractors
        const contractors = doc(db, "contractors", id);
        const docSnap = await getDoc(contractors);

        // Check if the document exists
        if (docSnap.exists()) {
          this.details = docSnap.data();
          this.postalCode = this.details?.postalCode || '';
        } else {
          this.error = "Contractor not found";
          console.log("No such document");
          this.loading = false;
          return;
        }

        // Only proceed with reviews if we have contractor details
        if (this.details?.firstName && this.details?.lastName) {
          // Get Reviews
          const reviews = collection(db, "reviews");
          const q = query(reviews, where("contractorName", "==", 
            `${this.details.firstName} ${this.details.lastName}`));

          // Execute query
          const querySnapshot = await getDocs(q);
          this.reviews = querySnapshot.docs.map(doc => doc.data());
        }

        // Only proceed with user profile if we have business email
        if (this.details?.businessEmail) {
          // Get User Profile
          const users = collection(db, "users");
          const p = query(users, where("email", "==", this.details.businessEmail));

          // Execute user profile query
          const querySnapshot2 = await getDocs(p);
          
          if (!querySnapshot2.empty) {
            const userData = querySnapshot2.docs[0].data();
            this.profilePictureUrl = userData?.imageUrl || defaultProfileIcon;
          } else {
            this.profilePictureUrl = defaultProfileIcon;
          }
        } else {
          this.profilePictureUrl = defaultProfileIcon;
        }

        this.loading = false;

        // Initialize map after data is loaded and component is rendered
        await this.$nextTick();
        if (this.postalCode && !this.mapInitialized) {
          // Add a small delay to ensure DOM is fully ready
          setTimeout(async () => {
            await this.initializeMap();
          }, 100);
        }
      }
      catch (error) {
        console.error("Error fetching document:", error);
        this.error = "Error loading contractor data";
        this.loading = false;
      }
    },

    async initializeMap() {
      const maxAttempts = 5;
      let attempts = 0;

      const tryLoadMap = async () => {
        const mapDiv = document.getElementById("map");
        if (!mapDiv) {
          attempts++;
          if (attempts < maxAttempts) {
            console.log(`Map container not found, attempt ${attempts} of ${maxAttempts}`);
            await new Promise(resolve => setTimeout(resolve, 200));
            return tryLoadMap();
          } else {
            console.error('Failed to find map container after multiple attempts');
            return;
          }
        }

        try {
          await this.loadMap(this.postalCode);
          this.mapInitialized = true;
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      };

      await tryLoadMap();
    },

    async loadMap(postalCode) {
      if (!postalCode) {
        console.error('No postal code provided');
        return;
      }

      try {
        const mapDiv = document.getElementById("map");
        if (!mapDiv) {
          console.error('Map container not found');
          return;
        }

        await this.loadGoogleMapsScript();

        const geocoder = new google.maps.Geocoder();
        
        return new Promise((resolve, reject) => {
          geocoder.geocode({ address: postalCode }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const mapOptions = {
                center: results[0].geometry.location,
                zoom: 15,
              };

              // Check again if map div exists before creating map
              const mapDiv = document.getElementById("map");
              if (!mapDiv) {
                reject(new Error('Map container not found after geocoding'));
                return;
              }

              const map = new google.maps.Map(mapDiv, mapOptions);

              const marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
              });

              const infoWindowContent = `
                <div style="
                    background: #fff;
                    padding: 2px;
                    border-radius: 8px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                ">
                    ${this.details?.companyName || 'Location'}
                </div>
              `;

              const infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent,
              });
              
              infoWindow.open(map, marker);

              marker.addListener("click", () => {
                infoWindow.open(map, marker);
              });

              this.mapLoaded = true;
              resolve();
            } else {
              console.error("Geocode was not successful: " + status);
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });
      } catch (error) {
        console.error("Failed to load map:", error);
      }
    },

    loadGoogleMapsScript() {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined" && google.maps) {
          resolve();
          return;
        }

        const existingScript = document.getElementById('google-maps-script');
        if (existingScript) {
          existingScript.addEventListener('load', resolve);
          return;
        }

        const script = document.createElement("script");
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLEMAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },

    createRequest(id) {
      if (!id) return;
      this.$router.push({ path: `/jobRequest/newRequest/${id}` });
      this.$emit('createRequest', id);
    }
  },

  computed: {
    storeLocation() {
      return this.postalCode ? 
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.postalCode)}` : 
        '#';
    },

    hasReviews() {
      return Array.isArray(this.reviews) && this.reviews.length > 0;
    },

    hasDetails() {
      return this.details !== null;
    }
  },

  async mounted() {
    await this.initPage(this.id);
  },

  components: {
    LogedInLayout,
    Review,
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
                <img :src="profilePictureUrl" alt=" User Profile" class="rounded-circle profile-image mb-3" />
                <h5 class="card-title">
                  <i class="fas fa-user-circle"></i> {{ details.firstName }} {{ details.lastName }}
                </h5>
                <button @click="createRequest(id)" class="btn btn-primary" style="margin: 5px;"> Send Job Request
                </button>
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
                  <li v-for="service of details.services"> <i class="fas fa-check-circle"></i>  {{ service }} </li>
                </ul>

                <h6>Store Location:</h6>
                <!-- Store Location Section -->
                {{ details.storeAddress }} <br>
                <a :href="storeLocation" target="_blank" class="text-primary hover-text-decoration-underline">
                  <i class="fas fa-map-marker-alt"></i> View on Google Maps
                </a>
                <div id="map" style="height: 400px; width: 100%"></div>

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
                  <li v-for="award of details.certsAndAwards"> <i class="fas fa-award"></i> {{ award }} </li>
                </ul>
              </div>
            </div>

          </div>

          <!-- Right Column -->
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-header">Past Renovation Projects</div>
              <div class="card-body">
                <div class="portfolio-images-container">
                  <div v-if="details.portfolioImages.length === 0" class="no-reviews">
                    No photos available.
                  </div>
                  <div v-else>
                    <!-- Bootstrap Carousel -->
                    <div id="portfolioCarousel" class="carousel slide" data-bs-ride="carousel">
                      <!-- Indicators -->
                      <div class="carousel-indicators">
                        <button type="button" data-bs-target="#portfolioCarousel" :data-bs-slide-to="index"
                          :class="{ active: index === 0 }" aria-current="index === 0" aria-label="Slide {{ index + 1 }}"
                          v-for="(imageUrl, index) in details.portfolioImages" :key="index"></button>
                      </div>
                      <!-- Carousel Items -->
                      <div class="carousel-inner">
                        <div class="carousel-item" :class="{ active: index === 0 }"
                          v-for="(imageUrl, index) in details.portfolioImages" :key="index">
                          <img :src="imageUrl" alt="Portfolio Image" class="d-block w-100 portfolio-image"
                            @click="openPreviewModal(imageUrl)" />
                        </div>
                      </div>
                      <button class="carousel-control-prev" type="button" data-bs-target="#portfolioCarousel"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#portfolioCarousel"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mb-4 review-card">
              <div class="card-header">Customer Reviews</div>
              <div class="card-body review-body">
                <div v-if="reviews.length === 0" class="no-reviews">
                  No reviews yet.
                </div>
                <div v-else class="review-item mb-4 pb-3">
                  <div v-for="review in reviews" :key="review.id">
                    <div class="align-items-center">
                      <Review :review="review"/>
                      <hr />
                    </div>
                  </div>
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

.review-body {
  max-height: 500px;
  overflow-y: auto;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}
.review-body::-webkit-scrollbar {
  width: 8px;
}

.review-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.review-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.review-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.review-card .card-body {
  padding: 1rem;
}

.no-reviews {
  text-align: center;
  color: #64748b;
  padding: 2rem;
  font-style: italic;
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
  background-color: #769fcd;
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

.portfolio-images-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 1rem;
}

.portfolio-image-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.portfolio-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.carousel-control-prev,
.carousel-control-next {
  top: 50%;
  transform: translateY(-50%);
}
</style>
