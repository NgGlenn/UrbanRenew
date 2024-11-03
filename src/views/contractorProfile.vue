<script>
import LogedInLayout from "@/components/LogedInLayout.vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import defaultProfileIcon from "@/assets/defaultProfileIcon.jpg"; //to display default picture if no profile picture set
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  data() {
    return {
      userName: "",
      userEmail: "",
      defaultImage: "",
      companyName: "",
      servicesOffered: [], // Store services as an array
      newServiceItem: "",
      address: "",
      postalCode: "",
      phone: "",
      certificatesAndAwards: [],
      newCertItem: "",
      showEditProfileModal: false,
      showUpdatePasswordModal: false,
      cancelPasswordModal: false,
      updateFirstName: "",
      updateLastName: "",
      updatedEmail: "",
      tempEmail: "",
      newPassword: "",
      confirmPassword: "",
      updatedServicesOffered: [],
      updatedCertificatesAndAwards: [],
      showEditImageModal: false,
      selectedImage: null,
      imageUrl: "",
      cropper: null,
      profilePictureUrl: "",
      loading: true,
      reviews: [],
      averageRating: 0,
      userId: "", // user ID of the logged-in user
      defaultProfileIcon: "../assets/default_profile.png",
      currentPage: 1,
      perPage: 1,
    };
  },

  methods: {
    addCertItem() {
      if (this.newCertItem.trim()) {
        this.updatedCertificatesAndAwards.push(this.newCertItem.trim());
        this.newCertItem = "";
      }
    },

    deleteCertItem(index) {
      this.updatedCertificatesAndAwards.splice(index, 1);
    },
    addServiceItem() {
      if (this.newServiceItem.trim()) {
        this.updatedServicesOffered.push(this.newServiceItem.trim());
        this.newServiceItem = "";
      }
    },

    deleteServiceItem(index) {
      this.updatedServicesOffered.splice(index, 1);
    },
    openEditProfileModal() {
      const names = this.userName.split(/\s+/).filter(Boolean);
      this.updateFirstName =
        names.length > 1 ? names.slice(0, -1).join(" ") : names[0];
      this.updateLastName = names.length > 1 ? names[names.length - 1] : "";
      this.updatedCompanyName = this.companyName;
      this.updatedServicesOffered = [...this.servicesOffered];
      this.updatedCertificatesAndAwards = [...this.certificatesAndAwards];
      this.updatedAddress = this.address || "";
      this.updatedPostalCode = this.postalCode || "";
      this.updatedPhone = this.phone || "";
      this.showEditProfileModal = true;
    },
    saveProfile: async function () {
      this.userName = `${this.updateFirstName} ${this.updateLastName}`;
      this.companyName = this.updatedCompanyName;
      this.servicesOffered = [...this.updatedServicesOffered];
      this.certificatesAndAwards = [...this.updatedCertificatesAndAwards];
      this.address = this.updatedAddress;
      this.postalCode = this.updatedPostalCode;
      this.phone = this.updatedPhone;
      this.showEditProfileModal = false;

      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const contractorDocRef = doc(db, "contractors", user.uid);

        try {
          await updateDoc(userDocRef, {
            firstName: this.updateFirstName,
            lastName: this.updateLastName,
            email: this.userEmail,
          });

          await updateDoc(contractorDocRef, {
            firstName: this.updateFirstName,
            lastName: this.updateLastName,
            companyName: this.updatedCompanyName,
            phoneNumber: this.updatedPhone,
            postalCode: this.updatedPostalCode,
            services: this.servicesOffered,
            certsAndAwards: this.certificatesAndAwards,
            storeAddress: this.updatedAddress,
          });

          alert("Profile updated successfully.");
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("Failed to update profile. Please try again.");
        }
      } else {
        console.error("User not authenticated. Cannot update profile.");
      }
    },
    openUpdatePasswordModal() {
      this.showUpdatePasswordModal = true;
    },
    async updatePassword() {
      this.passwordError = "";

      if (this.newPassword !== this.confirmPassword) {
        this.passwordError = "Passwords do not match.";
        return;
      }
      if (this.newPassword.length < 6) {
        this.passwordError = "Password must be at least 6 characters long.";
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) {
          this.passwordError = "User not authenticated. Please log in again.";
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          this.currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, this.newPassword);

        alert("Password updated successfully.");
        this.currentPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.showUpdatePasswordModal = false;
      } catch (error) {
        console.error("Error updating password:", error);
        this.passwordError = error.message;
      }
    },
    handleCancel() {
      this.showUpdatePasswordModal = false;
    },
    openEditImageModal() {
      this.showEditImageModal = true;
    },
    closeEditImageModal() {
      this.showEditImageModal = false;
      this.imageUrl = null;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      console.log("Selected file:", file);
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imageUrl = e.target.result;
          console.log("Image URL:", this.imageUrl);
          this.$nextTick(() => {
            this.initializeCropper();
          });
        };

        reader.readAsDataURL(file);
      }
    },
    initializeCropper() {
      if (this.$refs.imageToCrop) {
        this.cropper = new Cropper(this.$refs.imageToCrop, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
        });
      }
    },
    async saveCroppedImage() {
      if (this.cropper) {
        this.cropper.getCroppedCanvas().toBlob(async (blob) => {
          if (blob) {
            const croppedImageURL = URL.createObjectURL(blob);
            this.imageUrl = croppedImageURL;

            const storage = getStorage();
            const storageRef = ref(storage, `images/${Date.now()}.png`);

            try {
              const uploadTask = await uploadBytes(storageRef, blob);
              const downloadURL = await getDownloadURL(uploadTask.ref);
              console.log("File available at", downloadURL);

              await this.saveImageUrlToFirestore(downloadURL);

              this.closeEditImageModal();

              URL.revokeObjectURL(croppedImageURL);
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          } else {
            console.error("Blob is null or undefined.");
          }
        });
      }
    },
    async saveImageUrlToFirestore(downloadURL) {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);

      try {
        await setDoc(userDocRef, { imageUrl: downloadURL }, { merge: true });
        alert("Image successfully updated");
        console.log("Image URL successfully saved to Firestore.");
        window.location.reload();
      } catch (error) {
        console.error("Error saving image URL to Firestore:", error);
      }
    },
    loadGoogleMapsScript() {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined") {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLEMAPS_API_KEY
        }`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },

    async loadMap(postalCode) {
      try {
        // Load Google Maps Script
        await this.loadGoogleMapsScript();

        // Now that Google Maps is loaded, create the map
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: postalCode }, (results, status) => {
          if (status === "OK" && results[0]) {
            const mapOptions = {
              center: results[0].geometry.location,
              zoom: 15,
            };
            const map = new google.maps.Map(
              document.getElementById("map"),
              mapOptions
            );

            // Create the marker
            const marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
            });

            // Define custom HTML for the InfoWindow with a card design
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
                        ${this.companyName}
                    </div>
                `;

            // Create and open the InfoWindow with the styled content
            const infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent,
            });
            infoWindow.open(map, marker);

            // Optional: Keep the InfoWindow open when clicking on the marker
            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });
          } else {
            console.error("Geocode was not successful: " + status);
          }
        });
      } catch (error) {
        console.error("Failed to load Google Maps script:", error);
      }
    },
    async loadReviewsWithIndex() {
      try {
        this.isLoadingReviews = true;
        const reviewsCollection = collection(db, "reviews");
        const q = query(
          reviewsCollection,
          where("contractorID", "==", this.userId),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        this.reviews = [];

        const customerPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const reviewData = docSnapshot.data();
          const customerDocRef = doc(db, "users", reviewData.customerID);

          try {
            const customerDoc = await getDoc(customerDocRef);

            if (customerDoc.exists()) {
              const customerData = customerDoc.data();
              return {
                id: docSnapshot.id,
                contractorID: reviewData.contractorID,
                customerName: `${customerData.firstName} ${customerData.lastName}`,
                customerImage: customerData.imageUrl || this.defaultProfileIcon,
                createdAt: reviewData.createdAt.toDate().toLocaleString(),
                averageRating: parseFloat(reviewData.averageRating),
                qualityOfWork: reviewData.qualityOfWork,
                timeliness: reviewData.timeliness,
                budgetAdherence: reviewData.budgetAdherence,
                communication: reviewData.communication,
                comment: reviewData.comment || "No comment provided.",
              };
            }
          } catch (error) {
            console.error("Error fetching customer data:", error);
            return null;
          }
        });

        const results = await Promise.all(customerPromises);
        this.reviews = results.filter((review) => review !== null);
      } catch (error) {
        if (error.code === "failed-precondition") {
          // If index doesn't exist, fall back to alternative method
          console.log("Index not found, falling back to alternative method");
          await this.loadReviewsWithoutIndex();
        } else {
          console.error("Error loading reviews:", error);
        }
      } finally {
        this.isLoadingReviews = false;
      }
    },

    // Option 2: Alternative method without requiring index
    async loadReviewsWithoutIndex() {
      try {
        this.isLoadingReviews = true;
        const reviewsCollection = collection(db, "reviews");
        const q = query(
          reviewsCollection,
          where("contractorID", "==", this.userId)
        );

        const querySnapshot = await getDocs(q);
        this.reviews = [];

        const customerPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const reviewData = docSnapshot.data();
          const customerDocRef = doc(db, "users", reviewData.customerID);

          try {
            const customerDoc = await getDoc(customerDocRef);

            if (customerDoc.exists()) {
              const customerData = customerDoc.data();
              return {
                id: docSnapshot.id,
                contractorID: reviewData.contractorID,
                customerName: `${customerData.firstName} ${customerData.lastName}`,
                customerImage: customerData.imageUrl || this.defaultProfileIcon,
                createdAt: reviewData.createdAt.toDate().toLocaleString(),
                averageRating: parseFloat(reviewData.averageRating),
                qualityOfWork: reviewData.qualityOfWork,
                timeliness: reviewData.timeliness,
                budgetAdherence: reviewData.budgetAdherence,
                communication: reviewData.communication,
                problemResolution: reviewData.problemResolution,
                comment: reviewData.comment || "No comment provided.",
              };
            }
          } catch (error) {
            console.error("Error fetching customer data:", error);
            return null;
          }
        });

        const results = await Promise.all(customerPromises);
        this.reviews = results
          .filter((review) => review !== null)
          // Sort in memory instead of in query
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        this.isLoadingReviews = false;
      }
    },

    // Use this method to load reviews
    async loadReviews() {
      try {
        await this.loadReviewsWithIndex();
      } catch (error) {
        console.error("Error in loadReviews:", error);
      }
    },
    changePage(page) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  },
  },
  computed: {
    storeLocation() {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        this.postalCode
      )}`;
    },
 totalPages() {
      return Math.ceil(this.reviews.length / this.perPage);
    },
    
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.reviews.slice(start, end);
    },
    
    // Add this computed property to handle which page numbers to display
    displayedPages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const displayed = this.displayedPagesCount;
      
      let start = Math.max(1, current - Math.floor(displayed / 2));
      let end = Math.min(total, start + displayed - 1);
      
      // Adjust start if we're near the end
      if (end === total) {
        start = Math.max(1, end - displayed + 1);
      }
      
      // Generate array of page numbers
      return Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );
    }
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        this.userId = user.uid; // Store logged-in user ID
        await this.loadReviews();

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.userName = `${userData.firstName} ${userData.lastName}`;
          this.userEmail = userData.email;
          this.profilePictureUrl = userData.imageUrl || defaultProfileIcon;

          if (userData.role === "contractor") {
            const contractorDoc = doc(db, "contractors", user.uid);
            const contractorSnap = await getDoc(contractorDoc);

            if (contractorSnap.exists()) {
              const contractorData = contractorSnap.data();
              this.companyName = contractorData.companyName || "N/A";
              this.phone = contractorData.phoneNumber || "N/A";
              this.postalCode = contractorData.postalCode || "N/A";
              this.address = contractorData.storeAddress || "N/A";
              this.servicesOffered = contractorData.services?.length
                ? contractorData.services
                : ["None"];
              this.certificatesAndAwards = contractorData.certsAndAwards?.length
                ? contractorData.certsAndAwards
                : ["None"];
              await this.loadMap(this.postalCode);
            } else {
              console.error("No contractor document for user ID:", user.uid);
            }
          } else {
            this.$router.push("/customerProfile");
          }
          this.loading = false;
        } else {
          console.error("No user document for user ID:", user.uid);
        }
      } else {
        console.log("User not logged in. Redirecting to login page.");
        this.$router.push("/login");
      }
    });
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
      <div class="container mt-5">
        <div class="row">
          <!-- Left Column -->
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="text-center mb-3">
                <div
                  class="profile-image-container"
                  @click="openEditImageModal"
                >
                  <img
                    :src="profilePictureUrl"
                    alt="User Profile"
                    class="rounded-circle profile-image mb-3"
                  />
                  <span class="edit-icon">
                    <i class="fas fa-edit"></i>
                  </span>
                  <span class="hover-text">Edit Profile</span>
                </div>
                <h5 class="card-title">
                  <i class="fas fa-user-circle"></i> {{ userName }}
                </h5>
                <p class="card-text">
                  <i class="fas fa-envelope icon"></i>{{ userEmail }}
                </p>
                <div class="button-container">
                  <button
                    class="btn btn-primary me-2"
                    @click="openEditProfileModal"
                  >
                    Edit Profile
                  </button>
                  <button
                    class="btn btn-secondary"
                    @click="openUpdatePasswordModal"
                  >
                    Update Password
                  </button>
                </div>
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

                <p class="text-muted">{{ companyName }}</p>

                <h6>Services Offered:</h6>
                <!-- Services Offered Section -->
                <ul class="list-unstyled">
                  <li
                    v-for="(service, index) in servicesOffered"
                    :key="index"
                    class="text-muted"
                  >
                    <i class="fas fa-check-circle"></i> {{ service }}
                  </li>
                </ul>

                <h6>Store Location:</h6>
                <!-- Store Location Section -->
                <p class="text-muted">{{ address }}, S{{ postalCode }}</p>
                <a
                  :href="storeLocation"
                  target="_blank"
                  class="text-primary hover-text-decoration-underline"
                >
                  <i class="fas fa-map-marker-alt"></i> View on Google Maps
                </a>
                <div id="map" style="height: 400px; width: 100%"></div>
                <hr />

                <h5 class="mt-4">
                  <i class="fas fa-address-card"></i> Contact Info
                </h5>

                <h6 class="">
                  <i class="fas fa-phone-alt"></i> Phone: {{ phone }}
                </h6>

                <h6 class="">
                  <i class="fas fa-envelope"></i> Email: {{ userEmail }}
                </h6>

                <hr />

                <h5 class="mt-4">
                  <i class="fas fa-trophy"></i> Certificates & Awards
                </h5>
                <!-- Certificates & Awards Section Title -->

                <ul class="list-unstyled">
                  <li
                    v-for="(award, index) in certificatesAndAwards"
                    :key="index"
                    class="text-muted"
                  >
                    <i class="fas fa-award"></i> {{ award }}
                  </li>
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
                <!-- Loading State -->
     

                <!-- No Reviews State -->
                <div v-if="reviews.length === 0" class="no-reviews">
                  No reviews yet.
                </div>

                <!-- Reviews List -->
                <div v-else>
                  <div
                    v-for="review in paginatedReviews"
                    :key="review.id"
                    class="review-item"
                  >
                    <div class="profile-section">
                      <img
                        :src="review.customerImage || defaultProfileIcon"
                        alt="Profile Picture"
                        class="profile-image-review"
                      />
                      <div class="profile-info">
                        <h6 class="customer-name">{{ review.customerName }}</h6>
                        <span class="metric-number">Overall Rating</span><br />
                        <div class="metric-stars">
                          <span
                            v-for="star in 5"
                            :key="star"
                            class="star"
                            :class="{ filled: star <= review.averageRating }"
                            >★</span
                          >
                        </div>
                        <span class="metric-number"
                          >{{ review.averageRating }}/5</span
                        >
                        <div class="review-date">{{ review.createdAt }}</div>
                      </div>
                    </div>

                    <div class="metrics-container">
                      <div class="metric-item">
                        <span class="metric-label">Quality of Work</span>
                        <div class="metric-value">
                          <div class="metric-stars">
                            <span
                              v-for="star in 5"
                              :key="star"
                              class="star"
                              :class="{ filled: star <= review.qualityOfWork }"
                              >★</span
                            >
                          </div>
                          <span class="metric-number"
                            >{{ review.qualityOfWork }}/5</span
                          >
                        </div>
                      </div>

                      <div class="metric-item">
                        <span class="metric-label">Timeliness</span>
                        <div class="metric-value">
                          <div class="metric-stars">
                            <span
                              v-for="star in 5"
                              :key="star"
                              class="star"
                              :class="{ filled: star <= review.timeliness }"
                              >★</span
                            >
                          </div>
                          <span class="metric-number"
                            >{{ review.timeliness }}/5</span
                          >
                        </div>
                      </div>

                      <div class="metric-item">
                        <span class="metric-label">Budget Adherence</span>
                        <div class="metric-value">
                          <div class="metric-stars">
                            <span
                              v-for="star in 5"
                              :key="star"
                              class="star"
                              :class="{
                                filled: star <= review.budgetAdherence,
                              }"
                              >★</span
                            >
                          </div>
                          <span class="metric-number"
                            >{{ review.budgetAdherence }}/5</span
                          >
                        </div>
                      </div>

                      <div class="metric-item">
                        <span class="metric-label">Problem Resolution</span>
                        <div class="metric-value">
                          <div class="metric-stars">
                            <span
                              v-for="star in 5"
                              :key="star"
                              class="star"
                              :class="{
                                filled: star <= review.problemResolution,
                              }"
                              >★</span
                            >
                          </div>
                          <span class="metric-number"
                            >{{ review.problemResolution }}/5</span
                          >
                        </div>
                      </div>

                      <div class="metric-item">
                        <span class="metric-label">Communication</span>
                        <div class="metric-value">
                          <div class="metric-stars">
                            <span
                              v-for="star in 5"
                              :key="star"
                              class="star"
                              :class="{ filled: star <= review.communication }"
                              >★</span
                            >
                          </div>
                          <span class="metric-number"
                            >{{ review.communication }}/5</span
                          >
                        </div>
                      </div>
                    </div>

                    <p class="review-comment">{{ review.comment }}</p>
                  </div>

                  <!-- Pagination -->
                  <div class="pagination-container" v-if="totalPages > 1">
                    <button
                      class="pagination-button"
                      @click="changePage(currentPage - 1)"
                      :disabled="currentPage === 1"
                    >
                      Previous
                    </button>&nbsp;

                    <button
                      v-for="page in displayedPages"
                      :key="page"
                      class="pagination-button"
                      :class="{ active: page === currentPage }"
                      @click="changePage(page)"
                    >
                      {{ page }}
                    </button>

                    <button
                      class="pagination-button"
                      @click="changePage(currentPage + 1)"
                      :disabled="currentPage === totalPages"
                    >
                      Next
                    </button>
                    <br><br>
                    <span class="pagination-info">
                      Page {{ currentPage }} of {{ totalPages }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div v-if="showEditProfileModal" class="modal-overlay">
        <div class="modal-content">
          <h5>Edit Profile</h5>
          <input
            type="text"
            v-model="updateFirstName"
            class="form-control mb-2"
            placeholder="First Name"
          />
          <input
            type="text"
            v-model="updateLastName"
            class="form-control mb-2"
            placeholder="Last Name"
          />
          <input
            type="text"
            v-model="updatedCompanyName"
            class="form-control mb-2"
            placeholder="Company Name"
          />

          <input
            type="text"
            v-model="updatedAddress"
            class="form-control mb-2"
            placeholder="Full Address"
          />
          <input
            type="text"
            v-model="updatedPostalCode"
            class="form-control mb-2"
            placeholder="Postal Code"
          />
          <input
            type="text"
            v-model="updatedPhone"
            class="form-control mb-2"
            placeholder="Phone"
          />
          <hr />
          <h6>Services</h6>
          <div id="itemList">
            <div
              class="item"
              v-for="(service, index) in updatedServicesOffered"
              :key="index"
            >
              {{ service }}
              <span class="remove" @click="deleteServiceItem(index)">X</span>
            </div>
          </div>

          <div class="input-group">
            <input
              type="text"
              id="newItem"
              class="form-control mb-2"
              v-model="newServiceItem"
              placeholder="Add service/certificate"
            />
            <button
              class="buttonEditProfile"
              @click="addServiceItem"
              id="addServiceItem"
            >
              Add
            </button>
          </div>
          <hr />
          <h6>Certificates & Awards</h6>
          <div id="itemList">
            <div
              class="item"
              v-for="(award, index) in updatedCertificatesAndAwards"
              :key="index"
            >
              {{ award }}
              <span class="remove" @click="deleteCertItem(index)">X</span>
            </div>
          </div>

          <div class="input-group">
            <input
              type="text"
              id="newItem"
              class="form-control mb-2"
              v-model="newCertItem"
              placeholder="Add service/certificate"
            />
            <button
              class="buttonEditProfile"
              @click="addCertItem"
              id="addCertItem"
            >
              Add
            </button>
          </div>
          <hr />
          <button class="btn btn-primary" @click="saveProfile">Save</button>
          <button
            class="btn btn-secondary"
            @click="showEditProfileModal = false"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Update Password Modal -->
      <div v-if="showUpdatePasswordModal" class="modal-overlay">
        <div class="modal-content">
          <h5>Update Password</h5>
          <input
            type="password"
            v-model="currentPassword"
            class="form-control mb-2"
            placeholder="Current Password"
          />
          <input
            type="password"
            v-model="newPassword"
            class="form-control mb-2"
            placeholder="New Password"
          />
          <input
            type="password"
            v-model="confirmPassword"
            class="form-control mb-2"
            placeholder="Confirm Password"
          />

          <div v-if="passwordError" class="alert alert-danger mt-2">
            {{ passwordError }}
          </div>
          <button class="btn btn-primary" @click="updatePassword">
            Update
          </button>
          <button class="btn btn-secondary" @click="handleCancel">
            Cancel
          </button>
        </div>
      </div>

      <div v-if="showEditImageModal" class="modal-overlay">
        <div class="modal-content">
          <h5>Upload and Crop Image</h5>

          <input
            type="file"
            ref="fileInput"
            @change="handleImageUpload"
            class="form-control mb-2"
            accept=".jpg,.jpeg,.png"
          />

          <div v-if="imageUrl" class="image-crop-container">
            <img
              ref="imageToCrop"
              :src="imageUrl"
              alt="Base64 Image"
              class="selected-image-preview"
            />
          </div>

          <button class="btn btn-primary" @click="saveCroppedImage">
            Save
          </button>
          <button class="btn btn-secondary" @click="closeEditImageModal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </LogedInLayout>
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
  max-height: 100vh; /* Adjust based on your design */
  overflow-y: auto; /* Enable vertical scrolling */
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  width: 400px;
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

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}
.remove {
  cursor: pointer;
  color: red;
  font-weight: bold;
}
.input-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.profile-image-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.profile-image {
  border-radius: 50%;
  transition: filter 0.3s ease; /* Smooth transition for darkening */
}

.profile-image-container:hover .profile-image {
  filter: brightness(0.7); /* Darkens the image on hover */
}

.hover-text {
  position: absolute;
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Offset to truly center */
  color: white; /* Text color */
  font-size: 16px; /* Adjust as needed */
  opacity: 0; /* Initially hidden */
  transition: opacity 0.3s ease; /* Smooth transition for text appearance */
}

.profile-image-container:hover .hover-text {
  opacity: 1; /* Show text on hover */
}

.edit-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: white;
  border-radius: 50%;
  padding: 5px;
  color: #007bff;
  font-size: 1.2em;
}

.image-crop-container {
  max-width: 100%;
  max-height: 300px;
  overflow: hidden;
}

.selected-image-preview {
  width: 100%;
}

.marker-label {
  background-color: rgba(255, 255, 255, 0.8); /* Background for readability */
  padding: 4px 8px;
  border-radius: 4px; /* Rounded corners */
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3); /* Soft shadow */
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6); /* Light text shadow */
  font-family: "Arial", sans-serif; /* Custom font */
  font-size: 14px;
}

.review-card .card-body {
  padding: 1.5rem;
}

.review-item {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.review-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.profile-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.profile-image-review {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f8f9fa;
}

.profile-info {
  flex-grow: 1;
}

.customer-name {
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  font-size: 1.1rem;
}

.rating {
  margin-top: 0.25rem;
}

.star {
  color: #cbd5e0;
  font-size: 1.1rem;
}

.star.filled {
  color: #fbbf24;
}

.review-date {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.metrics-container {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-label {
  color: #4b5563;
  font-size: 0.875rem;
}

.metric-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metric-stars {
  display: inline-flex;
  gap: 0.25rem;
}

.metric-number {
  font-weight: 500;
  color: #2d3748;
}

.review-comment {
  color: #1a202c;
  line-height: 1.6;
  margin-top: 1rem;
}

.no-reviews {
  text-align: center;
  color: #64748b;
  padding: 2rem;
  font-style: italic;
}

</style>
