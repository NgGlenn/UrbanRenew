<template>
    <div style="padding-bottom: 10px">
        <div class="jobID">
            <b> Request ID: </b> {{id}}
        </div>

        <div class="jobRequest">
            <div class="row">
                <div class="col-lg-6 col-sm-12"> <b>Contractor:</b> {{contractor}} </div>
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
                <div> <b>Quoted Price:</b> {{quotedPrice}} </div>
                <div> <b>Contractor's comments:</b> {{comments}} </div>
                <div style="margin-top: 15px;">
                    <a :href="paymentLink" target="_blank">
                        <button style="margin-inline: 20px;" v-on:click="Accept"> Accept </button>
                    </a>
                    <a href="#" target="_blank">
                        <button style="margin-inline: 20px;" v-on:click="Decline"> Decline </button>
                    </a>
                </div>
            </div>

        </div>          
    </div>
</template>

<script>
export default{
    props: [ 'id', 'contractor', 'status', 'desc', 
            'startDate', 'endDate', 'budget', 
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

        Accept(){
            // Add the job to dashboard & payment
        },

        Decline(){
            // Inform contractor
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
        paymentLink(){
            return "@/views/userProfile"; // Payment page
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