<script>
import { RouterLink } from 'vue-router';
import NavBarPreLogin from '@/components/NavBarPreLogin.vue';
import FooterPreLogin from '@/components/FooterPreLogin.vue';

export default {
  data() {
    return {
      // State to track password visibility
    };
  },
  methods: {},
  components: {
    NavBarPreLogin,
    FooterPreLogin
  }
};
</script>

<template>


  <NavBarPreLogin></NavBarPreLogin>

<div id="top-carousel" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="../assets/login1.jpg" class="d-block w-100" alt="First Slide">
      <div class="carousel-caption d-none d-md-block">
        <h3>Transform Your Space</h3>
        <p>Let us turn your culinary dreams into reality!</p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="../assets/login2.jpg" class="d-block w-100" alt="Second Slide">
      <div class="carousel-caption d-none d-md-block">
        <h3>Comfort Redefined</h3>
        <p>Create inviting living spaces tailored to your lifestyle.</p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="../assets/login3.jpg" class="d-block w-100" alt="Third Slide">
      <div class="carousel-caption d-none d-md-block">
        <h3>Complete Home Makeovers</h3>
        <p>From concept to completion, our skilled contractors are dedicated to making your entire home renovation stress-free.</p>
      </div>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#top-carousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#top-carousel" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
  
  <!-- About Section -->
  <div class="about-section">
    <div class="container">
      <h1>About UrbanRenew</h1>
      <p>At UrbanRenew, we simplify your home renovation journey by connecting you with reliable, experienced contractors tailored to your specific needs. Whether you're dreaming of a modern kitchen, a cozy living space, or a full home makeover, our mission is to make your vision come to life with quality craftsmanship and seamless project management.</p>
      <p>We pride ourselves on delivering exceptional services to help turn your house into the home of your dreams. With over a decade of experience in the industry, our team is committed to providing personalized solutions, ensuring transparency, reliability, and satisfaction throughout the renovation process.</p>
    </div>
  </div>

  <!-- Services Section -->
  <div class="services-section">
    <div class="container">
      <h2>Our Services</h2>
      <div class="row">
        <div class="col-md-4">
          <div class="service-box">
            <h3>Modern Kitchen Design</h3>
            <p>Transform your kitchen into a sleek, modern space with high-quality materials and top-tier craftsmanship.</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="service-box">
            <h3>Cozy Living Spaces</h3>
            <p>Create a warm and inviting atmosphere in your living room with our customized renovation solutions.</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="service-box">
            <h3>Full Home Makeovers</h3>
            <p>From top to bottom, let us handle your complete home renovation with professional management and skilled contractors.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Testimonials Section -->
  <div class="testimonials-section">
    <div class="container">
      <h2>What Our Clients Say</h2>
      <div id="testimonial-carousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="testimonial-box">
              <img src="../assets/home_testi1.jpg" class="rounded-circle mb-3" alt="John Doe">
              <p>"UrbanRenew transformed my kitchen into a modern masterpiece. Their contractors were professional, and the project was completed on time!"</p>
              <h5> - John Doe.</h5>
            </div>
          </div>
          <div class="carousel-item">
            <div class="testimonial-box">
              <img src="../assets/home_testi2.jpg" class="rounded-circle mb-3" alt="Mark L.">
              <p>"I absolutely love my new living room. The design process was smooth, and the final result exceeded my expectations."</p>
              <h5>- Nicole Smith.</h5>
            </div>
          </div>
          <div class="carousel-item">
            <div class="testimonial-box">
              <img src="../assets/home_testi3.jpg" class="rounded-circle mb-3" alt="Susan R.">
              <p>"Thanks to UrbanRenew, my full home renovation was stress-free and well-managed. Highly recommend their services!"</p>
              <h5>- Susan Lim.</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FooterPreLogin></FooterPreLogin>
</template>

<style scoped>

/* About Section */
.about-section {
  padding: 60px 0;
  text-align: center;
  background-color: #ffffff;
  border-bottom: 1px solid #ccc; /* Grey line */
}

/* Services Section */
.services-section {
  padding: 50px 0;
  text-align: center;
  border-bottom: 1px solid #ccc; /* Grey line */
}

/* Testimonials Section */
.testimonials-section {
  margin: 60px 0;
  background-color: #f1f1f1;
  padding: 50px;
  text-align: center;
  border-bottom: 1px solid #ccc; /* Grey line */
}
.about-section h1 {
  font-size: 2.8rem; /* Same font size for consistency */
  color: #769FCD; /* Match the service section header color */
  margin-bottom: 20px; /* Spacing between header and paragraph */
}

.about-section p {
  font-size: 1.25rem; /* Maintain consistent font size */
  color: #555; /* Text color */
  max-width: 900px; /* Width of the text block */
  margin: 0 auto 40px; /* Center alignment with spacing below */
}
.services-section {
  padding: 50px 0;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 50%, #769FCD 50%);
}


.carousel-caption {
  position: absolute;
  bottom: 20px; /* Adjust this as needed */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white; /* Change this if necessary */
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  padding: 10px;
  border-radius: 5px;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent white */
  border-radius: 50%;
}

.carousel-control-prev-icon:hover,
.carousel-control-next-icon:hover {
  background-color: rgba(255, 255, 255, 0.8); /* Slightly less transparent on hover */
}

  /* Services Section */
  .services-section {
    padding: 50px 0;
    text-align: center;
  }

  .services-section h2 {
    font-size: 2.4rem;
    margin-bottom: 30px;
    color: #769FCD;
  }

  .service-box {
    background-color: #fff;
    border: 1px solid #eee;
    padding: 25px;
    border-radius: 8px;
    transition: transform 0.3s;
    margin-bottom: 20px;
  }

  .service-box:hover {
    transform: translateY(-10px);
    border-color: #769FCD;
  }

  .service-box h3 {
    font-size: 1.8rem;
    color: #769FCD;
    margin-bottom: 15px;
  }

  .service-box p {
    color: #555;
  }

  /* Testimonials Section */
  .testimonials-section {
    margin: 0px;
    background-color: #ffffff;
    padding: 50px;
    text-align: center;
    border-radius: 5px;
  }

  .testimonials-section h2 {
    font-size: 2.4rem;
    margin-bottom: 30px;
    color: #769FCD;
  }

  .testimonial-box {
    text-align: center;
    padding: 30px;
  }

  .testimonial-box img {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }

  .testimonial-box p {
    font-style: italic;
    font-size: 1.25rem;
    color: #333;
  }

  .testimonial-box h5 {
    margin-top: 15px;
    font-weight: bold;
    color: #555;
  }

  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    background-color: #333;
    border-radius: 50%;
  }
</style>
