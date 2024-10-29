<template>
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="card">
            <div class="card-header p-10" style="text-align: center;">
                <img :src="image" style="width: 100%; margin-bottom: 15px; max-width: 300px; max-height: 250px;">
                <h4 style="font-weight: bold;"> {{firstName}}  {{ lastName }} </h4>
                <p> Rating: {{rating.toFixed(1)}} / 5.0 </p>
            </div>
            <div class="card-body">
                <p> Company: {{company}} </p>
                <p> Service offered: {{servicesOffered.join(", ")}} </p>
                <p v-if="stylesOffered!=null"> Style(s): {{stylesOffered.join(", ")}} </p>
            </div>
            <div class="card-footer" style="text-align: center;">
                <button @click="redirect" style="padding-inline: 50px;"> View Profile </button>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    props: [ 'id', 'image', 'firstName', 'lastName', 'company', 'rating', 'servicesOffered', 'stylesOffered' ],
            // props: {
            //     img: string, 
            //     name: string, 
            //     company: string,
            //     rating: float,
            //     service: string,
            //     styles: array
            // }, // props
            
            data() {
                return {
                    // key: value
                }
            }, // data
            
            methods: {
                redirect() {
                    this.$emit('redirect', this.id); // Emit the contractor ID when the button is clicked
                }
            }, // methods
            
        
    }
</script>

<style scoped>

</style>