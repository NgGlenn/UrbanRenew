<script>
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
export default {
  name: 'YourComponentName',
  data() {
    return {
      userRole: null, // Variable to store the user role
    };
    },
  mounted() {
    // Check the authentication state when the component mounts
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Adjust the collection and document path as necessary
        if (userDoc.exists()) {
            this.userRole = userDoc.data().role; // Adjust the field name as necessary
          console.log("User role:", this.userRole);
        } else {
          console.error("No such document!");
        }
      }
    });
  },
    computed: {
    profileLink() {
      // Determine which profile link to display based on the user role
      if (this.userRole === 'customer') {
        return { name: 'customerProfile' };
      } else if (this.userRole === 'contractor') {
        return { name: 'contractorProfile' };
      }
      return null; // No link if userRole is neither
    }
  },
  methods: {
    logout(e) {
      e.preventDefault(); 
      auth.signOut().then(() => {
        console.log('User signed out');
        this.$router.push({ name: 'login' });
      }).catch(error => {
        console.error('Error signing out: ', error);
      });
    }
  }
}
</script>

<template>
    <!-- Start Header/Navigation -->
    <!-- removed "fixed-top" from nav's class as it was blocking the header of dashboard -->
    <nav v-if="userRole === 'customer'"
      class="custom-navbar navbar navbar navbar-expand-md navbar-light bg-light"
      style="background: #F7FBFC ;
    padding-top: 20px;
    padding-bottom: 20px;"
      arial-label="Furni navigation bar"
    >
      <div class="container-fluid">
        <router-link class="nav-link" :to="{ name: 'dashboard' }" active-class="active">
            <img src="../assets/UrbanRenew.png" width="80px" alt="" />
        </router-link >

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsFurni"
          aria-controls="navbarsFurni"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsFurni">
          <ul class="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
            <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'paymentOverview' }" active-class="active"><i class="fa-solid fa-dollar"></i> Payment</router-link >
            </li>
            <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'jobRequest' }" active-class="active"><i class="fa-solid fa-handshake-simple"></i> Job Requests</router-link >
            </li>
            <li>
                <router-link class="nav-link" :to="{ name: 'contractors' }" active-class="active"><i class="fa-solid fa-helmet-safety"></i> Contractors</router-link >
            </li>
            <li>
                <router-link class="nav-link" :to="{ name: 'dashboard' }" exact-active-class="active"> <i class="fa-solid fa-chart-gantt"></i> Dashboard</router-link >
            </li>
            <li>
                <router-link class="nav-link" :to="profileLink" active-class="active"> <i class="fa-solid fa-user"></i> Profile</router-link >
            </li>

            <li>
            <a href="#" class="nav-link" id="logout" @click="logout">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <nav v-if="userRole === 'contractor'"
      class="custom-navbar navbar navbar-expand-md navbar-light"
      style="background-color: lightcyan"
      aria-label="Furni navigation bar">
      <div class="container-fluid">
        <router-link class="nav-link" :to="{ name: 'dashboard' }" active-class="active">
            <img src="../assets/UrbanRenew.png" width="80px" alt="" />
        </router-link >

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsFurni"
          aria-controls="navbarsFurni"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsFurni">
          <ul class="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
            <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'paymentOverview' }" active-class="active"><i class="fa-solid fa-dollar"></i> Payment</router-link >
            </li>
            <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'jobRequest' }" active-class="active"><i class="fa-solid fa-handshake-simple"></i> Job Requests</router-link >
            </li>
            <li>
                <router-link class="nav-link" :to="{ name: 'dashboard' }" exact-active-class="active"> <i class="fa-solid fa-chart-gantt"></i> Dashboard</router-link >
            </li>
            <li>
                <router-link class="nav-link" :to="profileLink" active-class="active"> <i class="fa-solid fa-user"></i> Profile</router-link >
            </li>

            <li>
            <a href="#" class="nav-link" id="logout" @click="logout">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
<!-- End Header/Navigation -->
    
</template>

<style scoped>
/* template {
    font-family: 'Roboto', sans-serif;
} */

/* .navbarBorder {
    border: 5px solid #D6E6F2;
    border-radius: 3px;
} */
/*a{
    text-decoration: none;
}

.websiteFont {
  font-size: 30px;
  list-style: none;
  color: black;
}

.buttonFont {
  font-size: 18px;
}

@media (min-width: 2560px){
    .websiteFont{
        font-size: 60px;
        list-style: none;
        color: black;
    }

    .buttonFont {
        font-size: 30px;
    }
}*/

nav {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    line-height: 28px;
    font-size: 14px;
}

a {
    margin-left: 20px;
    margin-right: 20px;
    text-decoration: none;
    transition: .3s all ease;
}


.custom-navbar {
    background: #F7FBFC;
    padding-top: 20px;
    padding-bottom: 20px;
}

.custom-navbar .navbar-brand {
    font-size: 32px;
    font-weight: 600;
}

.custom-navbar .navbar-toggler {
    border-color: transparent;
}

.custom-navbar .navbar-toggler:active,
.custom-navbar .navbar-toggler:focus {
    box-shadow: none;
    outline: none;
}

@media (min-width: 992px) {
    .custom-navbar .custom-navbar-nav li {
        margin-left: 15px;
        margin-right: 15px;
    }
}

.custom-navbar .custom-navbar-nav li a {
    font-weight: 500;
    color: #769FCD !important;
    opacity: .5;
    transition: .3s all ease;
    position: relative;
}

@media (min-width: 768px) {
    .custom-navbar .custom-navbar-nav li a:before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 8px;
        right: 8px;
        background: #f9bf29; /* Gold color for the hover effect */
        height: 5px;
        opacity: 1;
        visibility: visible;
        width: 0;
        transition: .15s all ease-out;
    }
}

.custom-navbar .custom-navbar-nav li a:hover {
    opacity: 1;
}

.custom-navbar .custom-navbar-nav li a:hover:before {
    width: calc(100% - 16px);
}

.custom-navbar .custom-navbar-nav li.active a {
    opacity: 1;
}

.custom-navbar .custom-navbar-nav li.active a:before {
    width: calc(100% - 16px);
}

.footer-section {
    padding: 80px 0;
    background: #ffffff;
}


.footer-section .border-top {
    border-color: #dce5e4;
}

.footer-section .border-top.copyright {
    font-size: 14px !important;
}

.custom-navbar .custom-navbar-nav li a.active {
  color: #f9bf29; /* Gold color for active links */
  font-weight: 600; /* Bold the active link */
  opacity: 1;
}

.custom-navbar .custom-navbar-nav li a.active:before {
  width: calc(100% - 16px);
  background-color: #f9bf29; /* Ensure hover effect color matches */
}

.custom-navbar .custom-navbar-nav li a {
    position: relative;
    display: inline-block;
}

.custom-navbar .custom-navbar-nav li a:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    background: #f9bf29; /* Gold color for the underline */
    height: 5px;
    width: 0;
    transition: width 0.3s ease-out;
}

.custom-navbar .custom-navbar-nav li a:hover:before,
.custom-navbar .custom-navbar-nav li a.active:before {
    width: 100%; /* Underline should match the width of the text */
    background-color: #f9bf29;
}

.custom-navbar .custom-navbar-nav li a.active {
    color: #f9bf29; /* Gold color for active links */
    font-weight: 600; /* Bold the active link */
}

</style>