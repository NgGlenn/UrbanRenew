<template>
    <div>
      <NavBar />
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-12">
            <PaymentDetails :projectName="projectName" :contractorName="contractorName" :price="price" />
          </div>
          <div class="col-md-6 col-12">
            <PaymentForm :projectName="projectName" :contractorName="contractorName" :price="price" />
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import NavBar from '@/components/NavBar.vue';
import PaymentDetails from '@/components/Payment/PaymentDetails.vue';
import PaymentForm from '@/components/Payment/PaymentForm.vue';

export default {
    components: {
        NavBar,
        PaymentDetails,
        PaymentForm

    },
    data() {
        return {
            selectedButton: 'pending',
            renoPaymentItems: [
                {
                    projectID: 1234,
                    projectName: 'Hacking of Wall',
                    contractorName: 'Adrian Tok & Co.',
                    price: 100000,
                    status: 'pending',
                },
                {
                    projectID: 1299,
                    projectName: 'Kitchen Reno',
                    contractorName: 'Shaunbrina Carpentry',
                    price: 167880,
                    status: 'held',
                },
                {
                    projectID: 4569,
                    projectName: 'Toilet Plumbing',
                    contractorName: "Joel's Toilets",
                    price: 25000,
                    status: 'pending',
                },
                {
                    projectID: 8970,
                    projectName: 'Cabinet in Master Bedroom',
                    contractorName: 'Moses & Bed',
                    price: 1000,
                    status: 'released',
                },
                {
                    projectID: 8930,
                    projectName: 'Windows for Bedroom',
                    contractorName: "Glenn's Windows and Doors",
                    price: 156700,
                    status: 'held',
                },
            ],
        };
    },
    computed: {

    },
    methods: {

    },
}

</script>



<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: auto;
}
</style>
