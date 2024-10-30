<script>
import LogedInLayout from "@/components/LogedInLayout.vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import defaultProfileIcon from "@/assets/defaultProfileIcon.jpg"; //to display default picture if no profile picture set
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
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
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data based on the userID
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        console.log("Document data:", docSnap.data());

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
              <div class="card-body">
                <div class="transaction-item">
                  <p class="bio-placeholder">No transactions available.</p>
                </div>
              </div>
            </div>
            <div class="card mb-4 preferences-card">
              <div class="card-header">Design Preferences</div>
              <div class="card-body">
                <h6>Style <i class="fas fa-paint-brush icon"></i></h6>
                <select class="form-select mb-3">
                  <option value="minimalistic">Minimalistic</option>
                  <option value="modern">Modern</option>
                  <option value="traditional">Traditional</option>
                </select>
                <h6>Budget Type <i class="fas fa-money-bill-wave icon"></i></h6>
                <select class="form-select mb-3">
                  <option value="premium">Premium</option>
                  <option value="economy">Economy</option>
                </select>
                <button class="btn btn-primary">Update Preferences</button>
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
</style>
