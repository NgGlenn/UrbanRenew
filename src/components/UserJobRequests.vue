<template>
    <div style="padding-bottom: 10px">
        <div class="jobID">
            <b> Request ID: </b> {{id}}
        </div>

        <div class="jobRequest">
            <b> Project ID: </b> {{ projectId }}
            <div class="row">
                <div class="col-lg-6 col-sm-12"> <b>Contractor:</b> {{contractorName}} </div>
                <div class="col-lg-6 col-sm-12"> <b>Status:</b> {{status}} </div>
            </div> 
            <a class="icon" href="#" v-on:click="toggleExpansion">
                <img v-if="expanded" src="/src/assets/minimize.png" style="width: 100%">
                <img v-else src="/src/assets/expand.png" style="width: 100%">
            </a> 
              
            <div v-if="expanded">
                <br>
                <div> <b> Description: </b> {{ desc }} </div>
                <div> <b> Budget: </b> ${{ budget }} </div>
                <div class="row">
                    <div class="col-lg-6 col-sm-12"> <b>Expected Start Date:</b> {{startDate}} </div>
                    <div class="col-lg-6 col-sm-12"> <b>Expected Completion Date:</b> {{endDate}} </div>
                </div>
            </div>
            
            <div v-if="quoteReceived">
                <br>
                <div> <b>Quoted Price:</b> ${{quotedPrice}} </div>
                <div> <b>Contractor's comments:</b> {{comments}} </div>
                <div style="margin-top: 15px;">
                    <a :href="paymentLink">
                        <button style="margin-inline: 20px;" @click="Accept"> Accept </button>
                    </a>
                    <a href="#">
                        <button style="margin-inline: 20px;" @click="Decline"> Decline </button>
                    </a>
                </div>
            </div>

        </div>          
    </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, getDoc, getDocs, updateDoc, addDoc, collection } from "firebase/firestore";

export default{
    props: [ 'id', 'projectId', 'contractorId', 'contractorName', 
            'customerId', 'customerName', 'status', 'jobType',
            'desc', 'startDate', 'endDate', 'budget', 
            'quoteReceived', 'quotedPrice', 'comments' ],
            // props: {
            //     prop1: String, 
            //     prop2: Number, 
            // }, // props
            
    data() {
        return {
            // key: value
            expanded: false,
        }
    }, // data
            
    methods: {
        toggleExpansion() {
            if (this.expanded == false){
                this.expanded = true;
            }
            else{
              this.expanded = false;
            }
        },

        async Accept(){
            // Add the job to dashboard & payment
            // Update job request
            const jobRequestRef = doc(db, 'jobRequests', this.id); 
            const jobRequestDoc = await getDoc(jobRequestRef);

            try {
                updateDoc(jobRequestRef, {
                    status: "Accepted",
                    quoteReceived: false
                });
            } catch (error) {
                console.error('Error submitting quotation:', error);
                alert('Something went wrong. Please try again.');
            }

            // Create job
            try {
                const docRef = addDoc(collection(db, "jobs"), {
                    projectId: this.projectId,
                    requestId: jobRequestDoc.id,
                    contractorId: this.contractorId,
                    contractorName: this.contractorName,
                    company: "",
                    customerId: this.customerId,
                    customerName: this.customerName,
                    price: this.quotedPrice,
                    remainingBalance: this.quotedPrice,
                    paidstatus: "pending",
                    jobName: this.jobType + " by " + this.contractorName,
                    description: this.desc,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    status: "Pending",
                    createdAt: new Date(),
                    });
                    //console.log("Document written with ID: ", docRef.id);
                    this.$router.push({path: '/dashboard'});
                } catch (e) {
                    console.error("Error adding document: ", e);
                    alert('Something went wrong. Please try again.');
                }
        },

        async Decline(){
            // Reference to the specific job request document
            const jobRequestRef = doc(db, 'jobRequests', this.id); 

            try {
                updateDoc(jobRequestRef, {
                    status: "Declined",
                    quoteReceived: false
                });
                alert('You have declined this job request. Please refresh the page.');
            } catch (error) {
                console.error('Error submitting quotation:', error);
                alert('Something went wrong. Please try again.');
            }
        }
    }, // methods

    computed: {
        paymentLink(){
            return "#"; // Payment page
        }
    }
}
</script>

<style scoped>
    .jobID{
        min-width: 70px;
        display: inline-block;
        margin-left: 5px;
      }

      .jobRequest{
        background-color: lightgrey;
        border: 2px solid gray;
        padding: 10px;
        position: relative;;
        margin: 5px;
      }

      .icon{
        position: absolute;
        right: 10px;
        top: 10px;
      }
</style>