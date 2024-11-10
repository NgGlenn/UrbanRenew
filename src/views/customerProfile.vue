<script>
import LogedInLayout from "@/components/logedInLayout.vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import defaultProfileIcon from "@/assets/defaultProfileIcon.jpg"; //to display default picture if no profile picture set
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  data() {
    return {
      userName: "",
      userEmail: "",
      userBio: "No bio available",
      defaultImage: "",
      showEditProfileModal: false,
      showUpdatePasswordModal: false,
      // Temporary fields to store the updated values
      updateFirstName: "",
      updateLastName: "",
      updatedEmail: "",
      tempBio: "",
      tempEmail: "",
      newPassword: "",
      confirmPassword: "",
      showEditImageModal: false,
      selectedImage: null,
      imageUrl: "",
      cropper: null,
      profilePictureUrl: "",
      loading: true, // Set loading to true initially
      reviews: [],
      averageRating: 0,
      userId: "", // user ID of the logged-in user
      defaultProfileIcon: "../assets/default_profile.png",
      currentPage: 1,
      perPage: 1,
      transactions: [],
      isLoading: true,
    };
  },

  methods: {
    togglePasswordVisibility(field) {
      if (field === "currentPassword") {
        this.showCurrentPassword = !this.showCurrentPassword;
      } else if (field === "newPassword") {
        this.showNewPassword = !this.showNewPassword;
      } else if (field === "confirmPassword") {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    },
    openEditProfileModal() {
      const names = this.userName.split(/\s+/).filter(Boolean); // Split the name by spaces and remove any empty strings

      if (names.length > 1) {
        this.updateFirstName = names.slice(0, names.length - 1).join(" "); // Join all but the last name for the first name
        this.updateLastName = names[names.length - 1]; // Last name is the last part
      } else {
        // If there is only one name, treat it as the first name and leave last name empty
        this.updateFirstName = names[0];
        this.updateLastName = "";
      }

      this.tempBio = this.userBio;
      this.showEditProfileModal = true;
    },
    async saveProfile() {
      const user = auth.currentUser;
      if (user) {
        try {
          // Reference to the user's document in Firestore
          const userDocRef = doc(db, "users", user.uid);

          // Update the document in Firestore with new values
          await updateDoc(userDocRef, {
            firstName: this.updateFirstName,
            lastName: this.updateLastName,
            bio: this.tempBio,
          });

          // Update local data to reflect changes immediately
          this.userName = `${this.updateFirstName} ${this.updateLastName}`;
          this.userBio = this.tempBio;

          // Close the modal
          this.showEditProfileModal = false;
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("Failed to update profile. Please try again.");
        }
      }
    },
    openUpdatePasswordModal() {
      this.showUpdatePasswordModal = true;
    },
    async updatePassword() {
      this.passwordError = "";

      // Basic validation
      if (this.newPassword !== this.confirmPassword) {
        this.passwordError = "Passwords do not match.";
        return;
      }
      if (this.newPassword.length < 6) {
        this.passwordError = "Password must be at least 6 characters long.";
        return;
      }

      // Reauthenticate before updating password
      try {
        const user = auth.currentUser;
        if (!user) {
          this.passwordError = "User not authenticated. Please log in again.";
          return;
        }

        // Assuming user’s current email and password are available
        const credential = EmailAuthProvider.credential(
          user.email,
          this.currentPassword // Add a field for the current password if needed
        );
        await reauthenticateWithCredential(user, credential);

        // Update password
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

    openEditImageModal() {
      this.showEditImageModal = true;
    },
    closeEditImageModal() {
      this.showEditImageModal = false;
      this.imageUrl = null; // Reset image URL
      if (this.cropper) {
        this.cropper.destroy(); // Clean up Cropper instance
        this.cropper = null;
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      console.log("Selected file:", file); // Log the selected file
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imageUrl = e.target.result; // Set the data URL
          console.log("Image URL:", this.imageUrl); // Log the data URL
          this.$nextTick(() => {
            this.initializeCropper(); // Ensure DOM is updated before initializing
          });
        };

        reader.readAsDataURL(file); // Read the file as a data URL
      }
    },
    initializeCropper() {
      // Initialize Cropper after the image has fully loaded
      if (this.$refs.imageToCrop) {
        this.cropper = new Cropper(this.$refs.imageToCrop, {
          aspectRatio: 1, // Adjust aspect ratio as needed (1 for square)
          viewMode: 1,
          autoCropArea: 1, // Ensures the entire image area is selectable
        });
      }
    },
    async saveCroppedImage() {
      if (this.cropper) {
        this.cropper.getCroppedCanvas().toBlob(async (blob) => {
          if (blob) {
            // Create a blob URL for the cropped image (optional)
            const croppedImageURL = URL.createObjectURL(blob);
            this.imageUrl = croppedImageURL;

            // Upload the image to Firebase Storage
            const storage = getStorage();
            const storageRef = ref(storage, `images/${Date.now()}.png`); // Use a unique filename

            try {
              // Upload the blob to Firebase Storage
              const uploadTask = await uploadBytes(storageRef, blob);
              const downloadURL = await getDownloadURL(uploadTask.ref);
              console.log("File available at", downloadURL);

              // Save the download URL to Firestore in the existing user document
              await this.saveImageUrlToFirestore(downloadURL);

              // Close the modal after saving
              this.closeEditImageModal();

              // Free the blob URL
              URL.revokeObjectURL(croppedImageURL); // Revoke the blob URL
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
      const userId = auth.currentUser.uid; // Get the current user ID
      const userDocRef = doc(db, "users", userId); // Reference to the user's document in Firestore

      try {
        // Use setDoc with merge: true to add the imageUrl field without overwriting other fields
        await setDoc(userDocRef, { imageUrl: downloadURL }, { merge: true });
        alert("Image successfully updated");
        console.log("Image URL successfully saved to Firestore.");
        window.location.reload(); // This will reload the current page
      } catch (error) {
        console.error("Error saving image URL to Firestore:", error);
      }
    },
    async loadReviewsWithIndex() {
      try {
        this.isLoadingReviews = true;
        const reviewsCollection = collection(db, "reviews");
        // Query reviews where customerID matches the current userId
        const q = query(
          reviewsCollection,
          where("customerID", "==", this.userId),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        this.reviews = [];

        const reviewPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const reviewData = docSnapshot.data();
          const contractorDocRef = doc(db, "users", reviewData.contractorID);

          try {
            const contractorDoc = await getDoc(contractorDocRef);

            if (contractorDoc.exists()) {
              const contractorData = contractorDoc.data();
              return {
                id: docSnapshot.id,
                customerID: reviewData.customerID,
                contractorName: `${contractorData.firstName} ${contractorData.lastName}`,
                contractorImage: contractorData.imageUrl || defaultProfileIcon,
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
            console.error("Error fetching contractor data:", error);
            return null;
          }
        });

        const results = await Promise.all(reviewPromises);
        this.reviews = results.filter((review) => review !== null);
      } catch (error) {
        if (error.code === "failed-precondition") {
          console.log("Index not found, falling back to alternative method");
          await this.loadReviewsWithoutIndex();
        } else {
          console.error("Error loading reviews:", error);
        }
      } finally {
        this.isLoadingReviews = false;
      }
    },

    async loadReviewsWithoutIndex() {
      try {
        this.isLoadingReviews = true;
        const reviewsCollection = collection(db, "reviews");
        // Query reviews where customerID matches the current userId
        const q = query(
          reviewsCollection,
          where("customerID", "==", this.userId)
        );

        const querySnapshot = await getDocs(q);
        this.reviews = [];

        const reviewPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const reviewData = docSnapshot.data();
          const contractorDocRef = doc(db, "users", reviewData.contractorID);

          try {
            const contractorDoc = await getDoc(contractorDocRef);

            if (contractorDoc.exists()) {
              const contractorData = contractorDoc.data();
              return {
                id: docSnapshot.id,
                customerID: reviewData.customerID,
                contractorName: `${contractorData.firstName} ${contractorData.lastName}`,
                contractorImage: contractorData.imageUrl || defaultProfileIcon,
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
            console.error("Error fetching contractor data:", error);
            return null;
          }
        });

        const results = await Promise.all(reviewPromises);
        this.reviews = results
          .filter((review) => review !== null)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        this.isLoadingReviews = false;
      }
    },

    async loadReviews() {
      console.log("Current reviews:", this.reviews);
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

    async loadTransactionHistory() {
      try {
        const paymentsCollection = collection(db, "payments");
        const q = query(
          paymentsCollection,
          where("customerID", "==", this.userId),
          where("paymentStatus", "in", ["paid", "completed"]),
        );

        const querySnapshot = await getDocs(q);
        this.transactions = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            projectname: data.projectname,
            contractorname: data.contractorname,
            amount: data.price,
            paymentMethod: data.paymentMethod,
            paidOn: data.paidOn.toDate().toLocaleString(),
          };
        });
      } catch (error) {
        console.error("Error loading transaction history:", error);
        this.transactions = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
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
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data based on the userID
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        this.userId = user.uid; // Store logged-in user ID
        await this.loadReviews();
        await this.loadTransactionHistory();
        console.log("UserID:", this.userId);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.userName = `${userData.firstName} ${userData.lastName}`;
          this.userEmail = userData.email;
          this.userBio = userData.bio || "No bio available";
          this.profilePictureUrl = userData.imageUrl || defaultProfileIcon;
          this.userRole = userData.role || ""; // Retrieve the user's role
          this.loading = false;
          console.log("Profile Picture URL:", this.profilePictureUrl);
          // Redirect if the user is a contractor
          if (this.userRole === "contractor") {
            this.$router.push("/contractorProfile");
          }
        } else {
          console.error("No such document for user ID:", user.uid);
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
              <div class="card-header">Bio</div>
              <div class="card-body">
                <p class="bio-placeholder">{{ userBio }}</p>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-header">Transaction History</div>

    <div class="card-body card-body-transaction">
    <div v-if="isLoading" class="loading-state">
      <p>Loading transactions...</p>
    </div>
    <div v-else>
      <div v-if="transactions.length === 0" class="empty-state">
        <p>No transactions available.</p>
      </div>
      <div v-else>
        <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
          <div>
            <strong>Project</strong>
            <span class="project-name">{{ transaction.projectname }}</span>
          </div>
          <div>
            <strong>Contractor</strong>
            <span class="contractor-name">{{ transaction.contractorname }}</span>
          </div>
          <div>
            <strong>Amount</strong>
            <span class="amount">${{ transaction.amount.toFixed(2) }}</span>
          </div>
          <!-- <div>
            <strong>Payment Method</strong>
            <span class="payment-method">{{ transaction.paymentMethod }}</span>
          </div> -->
          <div>
            <strong>Date Paid</strong>
            <span class="date">{{ transaction.paidOn }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>



            </div>
            <div class="card mb-4 review-card">
              <div class="card-header">Review History</div>
              <div class="card-body">
                <!-- Loading State -->

                <!-- No Reviews State -->
                <div v-if="reviews.length === 0" class="no-reviews">
                  You have submited no reviews yet.
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
                        :src="review.contractorImage || defaultProfileIcon"
                        alt="Profile Picture"
                        class="profile-image-review"
                      />
                      <div class="profile-info">
                        <h6 class="customer-name">
                          {{ review.contractorName }}
                        </h6>
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

                  <div class="pagination-container" v-if="totalPages > 1">
                    <button
                      class="pagination-button"
                      @click="changePage(currentPage - 1)"
                      :disabled="currentPage === 1"
                    >
                      Previous</button
                    >&nbsp;

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
                    <br /><br />
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
          <textarea
            class="form-control mb-3"
            v-model="tempBio"
            placeholder="Bio"
          ></textarea>
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
          <button
            class="btn btn-secondary"
            @click="showUpdatePasswordModal = false"
          >
            Cancel
          </button>
        </div>
      </div>
      <div v-if="showEditImageModal" class="modal-overlay">
        <div class="modal-content">
          <h5>Upload and Crop Image</h5>

          <!-- File Upload Input -->
          <input
            type="file"
            ref="fileInput"
            @change="handleImageUpload"
            class="form-control mb-2"
            accept=".jpg,.jpeg,.png"
          />
          <!-- Image Preview for Cropping -->
          <div v-if="imageUrl" class="image-crop-container">
            <img
              ref="imageToCrop"
              :src="imageUrl"
              alt="Base64 Image"
              class="selected-image-preview"
            />
          </div>

          <!-- Save and Cancel Buttons -->
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
.preferences-card {
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
  overflow-y: auto;
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
  width: 100%; /* Adjust this as necessary */
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

.card-body-transaction {
  margin-top: 20px;
  max-height: 258px;
  overflow-y: auto;
  padding: 0 20px;
}

.card-body-transaction::-webkit-scrollbar {
  width: 8px;
}

.card-body-transaction::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.card-body-transaction::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.card-body-transaction::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
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
   .transactions-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;

      background: #f8fafc;
      min-height: 100vh;
    }

   

    .transaction-item {
      background: white;
      border-radius: 16px;
      padding: 1rem;
      margin-bottom: 1.25rem;

      transition: all 0.3s ease;
      border: 1px solid rgba(226, 232, 240, 0.8);
      position: relative;
      overflow: hidden;
    }

    .transaction-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: #789ccc;
      border-radius: 4px 0 0 4px;
    }

 

    .transaction-item div {
      margin-bottom: 0.40rem;
      display: grid;
      grid-template-columns: 140px 1fr;
      align-items: center;
    }

    .transaction-item div:last-child {
      margin-bottom: 0;
    }

    .transaction-item strong {
      color: #1e293b;
      font-weight: 500;
      font-size: 1rem;
     
     
    }

    .amount {
      color: #059669;
      font-weight: 600;
      font-size: 1rem;
      background: #ecfdf5;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      display: inline-block;
    }

    .payment-method {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.85rem;
      background: #f1f5f9;
      border-radius: 999px;
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
    }

    .payment-method::before {
      content: '💳';
      margin-right: 0.5rem;
    }

    .date {
      color: #64748b;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .date::before {
      content: '📅';
    }

    .project-name {
      font-weight: 600;
      color: #334155;
      font-size: 1.05rem;
    }

    .contractor-name {
      color: #475569;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .contractor-name::before {
      content: '👤';
    }

    @media (max-width: 640px) {
      .transaction-item div {
        grid-template-columns: 1fr;
        gap: 0.25rem;
      }
      
      .transaction-item {
        padding: 1.25rem;
      }
    }
</style>
