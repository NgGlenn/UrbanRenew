<template>
    <div style="padding-bottom: 10px">
        <!--<div class="jobID">
            <h5><b> {{ jobType }} </b></h5>
        </div>-->

        <div class="jobRequest">
            <h5><b> {{ jobType }} </b></h5>
            <div class="row">
                <div class="col-lg-6 col-sm-12"> <b>Customer:</b> {{customerName}} </div>
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

            <div v-if="status=='Pending'">
                <div style="margin-top: 15px;">
                    <a href="#" target="_blank">
                        <button style="margin-inline: 20px;" v-on:click="SendQuotation"> Send Quotation </button>
                    </a>
                    <a href="#">
                        <button style="margin-inline: 20px;" v-on:click="Decline"> Decline </button>
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

        async Decline(){
            // Reference to the specific job request document
            const jobRequestRef = doc(db, 'jobRequests', this.id); 

            try {
                updateDoc(jobRequestRef, {
                    status: "Declined",
                    //quoteReceived: false
                });
                alert('You have declined this job request. Please refresh the page.');
            } catch (error) {
                console.error('Error submitting quotation:', error);
                alert('Something went wrong. Please try again.');
            }
        },

        SendQuotation(){
            // Send quotation to contractor
            const queryParams = new URLSearchParams({
                jobRequestId: this.id,
            }).toString(); 
            this.$router.push({ name: 'sendQuotation', query: { jobRequestId: this.id } });
        },
    }, // methods

    computed: {
        
    }
}
</script>

<style scoped>
    h5{
        font-size: 1.4rem;
        color: #769FCD;
    }

    .jobID{
        min-width: 70px;
        display: inline-block;
        margin-left: 5px;
      }

      .jobRequest{
        padding: 10px;
        position: relative;
        margin: 5px;
        border: 2px solid lightgray;
        border-radius: 10px;
        background-color: white;
        color: #555;
      }

      .icon{
        position: absolute;
        right: 10px;
        top: 10px;
      }
</style>