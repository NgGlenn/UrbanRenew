<template>
    <div class="page-container" v-if="loading==false">
      <Navbar></Navbar>
          
      <div id="app" class=" review-container">
      <div class="row">
        <div id="form" class="col-md-12 col-lg-12 col-sm-12">
            <h1>New Job Request</h1>
              <label class="metric-label">Contractor's Name:</label>
              <input type="text" v-model="contractorName" disabled>

              <label class="metric-label">Job Type:</label>
              <select v-model="jobType">
                <option v-for="service of services"> {{ service }} </option>
              </select>

              <label class="metric-label">Description:</label>
              <textarea v-model="desc" placeholder="Scope of work, materials involved, etc..." 
                wrap="soft"></textarea>

              <div class="row">
                <div class="col-md-6 col-12" style="padding-right: 30px">
                    <label class="metric-label"> Expected Start Date: </label> 
                    <input v-model="startDate" type="date">
                </div>

                <div class="col-md-6 col-12" style="padding-left: 30px">
                    <label class="metric-label"> Expected Completion Date: </label>
                    <input v-model="endDate" type="date">
                </div>
              </div>
              
              <label class="metric-label"> Budget: </label>
              <input v-model="budget" type="number" style="width: 200px;">
  
              <button @click="createRequest">Submit Request</button>
      </div>
      </div>
      </div>
    </div>
  
  
  </template>
    
    <script>
    import Navbar from '@/components/NavBar.vue';
    import { ref, watch } from 'vue'
    import { useCollection, useDocument } from 'vuefire';
    import { doc, getDoc, getDocs, addDoc } from "firebase/firestore";
    import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';
    import { db } from '../firebase.js';
    import { getAuth } from "firebase/auth";

    export default {
      components: {
        Navbar,
      },

      /*setup(){
        const contractors = useCollection(collection(db, 'contractors'));
        var services = ref([]); // Make services reactive

        // Watch for changes in contractors and update services once contractors has data
        watch(contractors, (newContractors) => {
        if (newContractors && newContractors.length) {
            services.value = getServices(newContractors);
        }
        });

        const getServices = (contractors) => {
            const results = [];
            for (let contractor of contractors) {
                if (contractor.services) {
                results.push(...contractor.services);
                }
            }
            return results;
        };

        return {contractors, services}
    },*/

    async created() {
        this.projectID = await this.getProjectID(); // Resolve and assign projectID after retrieval
        this.username = await this.getUsername();
        this.getServices();
    },

      data() {
        return {
            userID: this.getUserID(),
            contractor_id: this.$route.params.contractor_id,
            contractorName: '',
            projectID: null,
            services: [],
            jobType: '',
            desc: '',
            budget: null,
            startDate: null,
            endDate: null,
            loading: true
        };
      },

      methods: {
        getUserID(){
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
            const uid = user.uid;  // Retrieve the user's ID
            //console.log("User ID:", uid);
            return uid;
            } else {
            console.log("No user is signed in.");
            }
        },

        async getServices(){
            try {
                //console.log(this.contractor_id)
                // Create a reference to the document
                const docRef = doc(db, "contractors", this.contractor_id);
                const docSnap = await getDoc(docRef);

                // Check if the document exists
                if (docSnap.exists()) {
                // Assign the document data to a variable
                console.log(docSnap.data().services)
                this.services = docSnap.data().services;
                } else {
                console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        },

        async getProjectID(){
            const ProjectsCollection = collection(db, "projects");

            const ProjectsQuery = query(
                ProjectsCollection,
                where("customerId", "==", this.getUserID()),
                //where("location", "==", "bishan")
            );

            const ProjectsSnapshot = await getDocs(ProjectsQuery);
            if (!ProjectsSnapshot.empty){
                const Project = ProjectsSnapshot.docs[0];
                console.log(Project.id)
            return Project.id;
            }
        },

        async getUsername() {
            // Reference to the user document
            const userDocRef = doc(db, 'users', this.getUserID());

            // Fetch the document data once
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                const username = `${data.firstName || ''} ${data.lastName || ''}`;
                //console.log(username);
                return username;
            } else {
                console.log('No such document!');
                return null;
            }
        },

        async initPage(){
            // Get Contractors
            const contractors = doc(db, "contractors", this.contractor_id); 
            const docSnap = await getDoc(contractors);

            // Check if the document exists
            if (docSnap.exists()) {
            // Assign the document data to a variable
            let details = docSnap.data();
            this.loading = false;
            this.contractorName = details.firstName + " " + details.lastName;
            } else {
            console.log("No such document");
            }
        },
        
        async createRequest() {
            try {
                const docRef = await addDoc(collection(db, "jobRequests"), {
                    projectId: this.projectID,
                    contractorId: this.contractor_id,
                    contractorName: this.contractorName,
                    customerId: this.userID,
                    customerName: this.username,
                    budget: this.budget,
                    jobType: this.jobType,
                    jobDetails: this.desc,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    status: "Pending",
                    quoteReceived: false,
                    createdAt: new Date(),
                    });
                    //console.log("Document written with ID: ", docRef.id);
                    this.$router.push({ path: `/jobRequest` });
                } catch (e) {
                    console.error("Error adding document: ", e);
                    alert("Submission Unsuccessful");
                }
            }
      },

      mounted(){
        this.initPage();
      }
    };
    </script>
    
    <style scoped>
          .page-container {
            background-color: #ffd580;
            padding: 50px;
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
          }
          
          .review-container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              max-width: 400px;
            
              margin: 40px auto;
          
          }
          #form{
            background-color: white;
            border-radius: 10px;
            padding:2%;
            width: 80%;
            margin-left: 10%;
            margin-right: 10%;
            margin-top: 10%;
            margin-bottom: 10%;
          }
          .review-container h1 {
              font-size: 30px;
              font-weight: 700;
              color: #333;
              text-align: center;
              margin-bottom: 40px;
          }
  
          button {
              background-color: #6A42C7;
              color: white;
              border: none;
              padding: 15px;
              border-radius: 30px;
              font-size: 18px;
              font-weight: 600;
              cursor: pointer;
              transition: background-color 0.3s ease;
              width: 100%;
              text-align: center;
              height:50px;
          }
  
          button:hover {
              background-color: #5333a0;
          }
  
          .star-rating {
              display: flex;
              flex-direction: row;
              align-items: center;
              background-color: #f5f5f5;
              padding: 10px 20px;
              border-radius: 30px;
              margin-bottom: 20px;
          }
  
          .star {
              font-size: 35px;
              color: #ccc;
              cursor: pointer;
              transition: color 0.3s;
          }
  
          .star.hovered, .star.selected {
              color: #f9bf29;
          }
  
          .rating-description {
              margin-left: 15px;
              font-size: 16px;
              font-weight: 600;
              color: #333;
          }
  
          .metric-description {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
          }
  
          .review-summary {
              background-color: #f7f7f7;
              padding: 20px;
              border-radius: 8px;
              margin-top: 30px;
              border: 1px solid #e6e6e6;
          }
  
          .review-summary h2 {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 20px;
          }
  
          .review-summary p {
              font-size: 16px;
              margin-bottom: 10px;
          }
  
          label {
              font-weight: 600;
              margin-bottom: 10px;
              display: block;
              color: #333;
              font-size: 18px;
            
          }
  
          input, select, textarea {
              width: 100%;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
              margin-bottom: 30px;
              font-size: 16px;
          }
  
          textarea {
              height: 120px;
          }
  
          .metric-label {
              font-size: 20px;
              font-weight: 700;
              color: #333;
              margin-bottom: 5px;
          }
  
          .metric-description {
              margin-bottom: 15px;
              font-size: 14px;
              color: #666;
          }
  
          .rating-description {
              font-size: 16px;
              font-weight: 600;
              margin-left: 20px;
              color: #333;
          }
          .metric-description{
              font-style: italic;
          }
          ::placeholder{
              font-style: italic;
          }
    
    </style>
    