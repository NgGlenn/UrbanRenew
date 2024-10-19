<!-- Remove setup if you are using options API. options API is the style we are learning in school -->
<script>
import LogedInLayout from '@/components/LogedInLayout.vue';
import NavBar from '@/components/NavBar.vue';
export default {
  data() {
    return {
      passwordVisible: false, // State to track password visibility
    };
  },
  methods: {
    togglePasswordVisibility() {
      // Get the password input and eye icon elements
      const passwordInput = document.getElementById('password');
      const eyeIcon = document.getElementById('eye-icon');

      // Toggle the password field type
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
      }
    },
    },
   components: {
    LogedInLayout, // Register the NavBar component
  },
};
</script>

<template> 
<LogedInLayout>    
  <div class="container-fluid p-0">


      <div class="row g-0">
        <div class="col-lg-6 col-12 login-container">
          <div class="login-form">
            <h2 class="mb-4 text-center">Login</h2>

            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <div class="input-group">
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Enter your password"
                  required
                />
                <span
                  class="input-group-text show-password"
                  @click="togglePasswordVisibility()"
                >
                  <i class="fa-solid fa-eye" id="eye-icon"></i>
                </span>
              </div>
            </div>

            <div class="d-grid mb-2">
              <button class="btn login-btn" type="button">Login</button>
            </div>

            <div class="d-grid mb-3">
              <button class="btn google-login" type="button">
                <i class="fa-brands fa-google"></i>&nbsp;Sign in with Google
              </button>
            </div>

            <a href="#" class="reset-link">Forgot your password?</a>

            <div class="text-center mt-4 account-creation-link">
              <p>Don't have an account yet?</p>
              <a href="/register">Click here to create one</a>
            </div>
          </div>
        </div>

        <div
          id="carouselExample"
          class="carousel slide col-lg-6 col-12 carousel-container"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            <div class="carousel-item active position-relative">
              <img
                src="../assets/login1.jpg"
                class="d-block w-100"
                alt="Slide 1"
              />
              <div class="carousel-caption">
                <h3>Welcome Back!</h3>
                <p style="font-size: 22px">
                  No account? <br />
                  <span><a href="/register">Click here to create</a></span>
                </p>
              </div>
            </div>
            <div class="carousel-item position-relative">
              <img
                src="../assets/login2.jpg"
                class="d-block w-100"
                alt="Slide 2"
              />
              <div class="carousel-caption">
                <h3>Login to continue your journey</h3>
                <p style="font-size: 22px">
                  No account? <br />
                  <span><a href="/register">Click here to create</a></span>
                </p>
              </div>
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
</LogedInLayout>
</template>

<style scoped>
body {
     background-color: #F7FBFC;
     height: 100vh;
     margin: 0;
 }

 .carousel-item img {
     height: 100vh;
     object-fit: cover;
 }

 .login-container {
     display: flex;
     align-items: center;
     justify-content: center;
     height: 100vh;
     position: relative;
     z-index: 1000;
     /* Ensure the login form stays above the carousel */
 }

 .login-form {
     padding: 40px;
     background-color: rgba(255, 255, 255, 0.85);
     /* Semi-transparent for better visibility */
     border-radius: 15px;
     box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
     width: 100%;
     max-width: 500px;
 }

 .form-label {
     font-weight: bold;
 }

 .form-control {
     border-radius: 5px;
 }

 .login-btn {
     background-color: #007bff;
     color: #fff;
     border-radius: 5px;
     margin-bottom: 10px;
     border: none;
 }

 .login-btn:hover {
     background-color: #0056b3;
     color: #fff;
 }

 .google-login {
     background-color: #ffffff;
     color: #4285f4;
     border: 2px solid #4285f4;
     border-radius: 5px;
     display: flex;
     align-items: center;
     justify-content: center;
 }

 .google-login:hover {
     background-color: #f1f3f4;
     color: #4285f4;
 }

 .google-login img {
     height: 20px;
     margin-right: 8px;
 }

 .reset-link {
     display: block;
     margin-top: 15px;
     text-align: right;
 }

 .carousel-container {
     padding: 0;
     position: relative;
 }

 .carousel-item img {
     width: 100%;
 }

 .carousel-caption {
     position: absolute;
     bottom: 60px;
     /* Adjust lower the text */
     left: 50%;
     transform: translateX(-50%);
     text-align: center;
     color: #fff;
     background-color: rgba(0, 0, 0, 0.3);
     padding: 10px;
     border-radius: 5px;
 }

 .carousel-caption p {
     font-size: 1rem;
     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
     color: #fff;
     line-height: 1;
 }

 .carousel-caption a {
     font-size: 1rem;
     color: #fff;
     text-decoration: underline;
 }

 .carousel-caption a:hover {
     color: #fff;
     text-decoration: underline;
 }

 /*mobile and tablet view */
 @media (max-width: 768px) {
     .login-container {
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
         z-index: 1000;
         padding: 20px;
     }

     .login-form {
         background-color: rgba(255, 255, 255, 0.9);
     }

     .carousel-control-prev,
     .carousel-control-next {
         display: none;
     }
 }

 @media (min-width: 769px) {
     .carousel-caption {
         bottom: 50px;
     }
 }

 @media (max-width: 991px) {
     .carousel-container {
         display: none;
     }

     .account-creation-link {
         display: block;
     }
 }

 @media (min-width: 992px) {
     .account-creation-link {
         display: none;
     }
 }

 .account-creation-link p {
     margin-bottom: 5px;
 }

 .account-creation-link a {
     margin-top: 0;
 }

 .show-password {
     cursor: pointer;
 }
</style>

