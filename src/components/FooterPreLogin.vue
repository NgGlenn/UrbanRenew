<template>
  <!-- Start Header/Navigation -->

  <!-- Footer Section -->
  <footer class="footer-section">
    <div class="container">
      <div class="row g-5">
        <!-- Text Section -->
        <div class="col-lg-6">
          <div class="mb-4 footer-logo-wrap text-center text-lg-start">
            <a href="#" class="footer-logo">
              <img src="../assets/UrbanRenew.png" width="200px" alt="UrbanRenew Footer Logo" />
            </a>
          </div>
          <h3>Your Trusted Renovation Partner</h3>
          <p class="mb-4">
            At UrbanRenew, we simplify your home renovation journey by connecting you with reliable, experienced contractors tailored to your specific needs. Whether you're dreaming of a modern kitchen, a cozy living space, or a full home makeover, our mission is to make your vision come to life with quality craftsmanship and seamless project management.
          </p>
        </div>

        <!-- Map Section -->
        <div class="col-lg-6">
          <h5><i class="fas fa-map-marker-alt"></i> Office Location</h5>
          <!-- Map div -->
          <div id="map" style="height: 400px; width: 100%;"></div>

          <!-- Dummy Contact Details -->
          <div class="contact-details mt-4">
            <h5><i class="fas fa-address-book"></i> Contact Us</h5>
            <p><i class="fas fa-envelope"></i> Email: info@urbanrenew.com</p>
            <p><i class="fas fa-phone"></i> Phone: (123) 456-7890</p>
            <p><i class="fas fa-map-marker-alt"></i> Address: 123 Urban St, Renovation City, UR 12345</p>
          </div>
        </div>
      </div>

      <div class="border-top copyright mt-5">
        <div class="row pt-4">
          <div class="col-lg-12">
            <p class="mb-2 text-center text-lg-start">
              Copyright &copy; <span>{{ currentYear }}</span>. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <!-- End Footer Section -->
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      mapCenter: { lat: 37.4220656, lng: -122.0840897 }, // Googleplex coordinates
      mapZoom: 10
    };
  },
  mounted() {
    this.loadGoogleMapsScript();
  },
  methods: {
    loadGoogleMapsScript() {
      // Check if the script is already added
      if (!document.getElementById("google-maps-script")) {
        // Create a new script tag
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;

        // Append the script to the head
        document.head.appendChild(script);

        // Attach the callback function to the window object
        window.initMap = this.initMap;
      } else {
        // If script already exists, just initialize the map
        this.initMap();
      }
    },
    initMap() {
      // Create the map once the script has loaded
      const mapOptions = {
        center: this.mapCenter,
        zoom: this.mapZoom,
      };
      new google.maps.Map(document.getElementById("map"), mapOptions);
    }
  }
};
</script>

<style scoped>

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");


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
</style>
