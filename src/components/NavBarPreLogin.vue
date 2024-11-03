
<template>

  <nav
    class="custom-navbar navbar navbar-expand-md navbar-light bg-light fixed-top"
    aria-label="Furni navigation bar"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img
          src="../assets/UrbanRenew.png"
          width="80px"
          alt="UrbanRenew Logo"
        />
      </a>

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
            <router-link
              class="nav-link"
              :class="{ active: isActive('about') }"
              to="/#about"
              ><i class="fa-solid fa-building"></i> About Us</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: isActive('services') }"
              to="/#services"
              ><i class="fa-solid fa-list-check"></i> Services</router-link
            >
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: isActive('testimonials') }"
              to="/#testimonials"
              ><i class="fa-solid fa-trophy"></i> Testimonials</router-link
            >
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: isActive('contactus') }"
              to="/#contactus"
              ><i class="fa-solid fa-address-book"></i> Contact us</router-link
            >
          </li>
          <li>
            <router-link
              class="nav-link"
              :to="{ name: 'login' }"
              active-class="active"
              ><i class="fa-solid fa-user"></i> Log In</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>

</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      mapCenter: "37.4220656,-122.0840897",
      mapZoom: 10,
    };
  },
  methods: {
    isActive(page) {
      return this.$route.path === "/" && this.$route.hash === `#${page}`;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
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
  transition: 0.3s all ease;
}

.custom-navbar {
  background: #f7fbfc !important;
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
  color: #769fcd !important;
  opacity: 0.5;
  transition: 0.3s all ease;
  position: relative;
}

.custom-navbar .custom-navbar-nav li a:hover {
  opacity: 1;
}

.custom-navbar .custom-navbar-nav li a:hover:before {
  width: calc(100% - 16px);
}

.custom-navbar .custom-navbar-nav li a:before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 8px;
  right: 8px;
  background: #f9bf29;
  height: 5px;
  width: 0;
  transition: 0.15s all ease-out;
}

.custom-navbar .custom-navbar-nav li.active a {
  color: #f9bf29 !important;
  font-weight: 600;
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
