<script>
import LogedInLayout from "@/components/LogedInLayout.vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
      loading: true, // Set loading to true initially
    };
  },

  methods: {
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
    saveProfile() {
      this.userName = this.updatedName;
      this.userBio = this.tempBio;
      this.showEditProfileModal = false;
    },
    openUpdatePasswordModal() {
      this.showUpdatePasswordModal = true;
    },
    updatePassword() {
      if (this.newPassword === this.confirmPassword) {
        this.showUpdatePasswordModal = false;
      } else {
        alert("Passwords do not match.");
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
          this.loading = false;
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
                <img
                  src="https://via.placeholder.com/150"
                  alt="User Profile"
                  class="rounded-circle profile-image mb-3"
                />
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
