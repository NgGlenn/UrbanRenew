<template>
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="card">
            <div class="card-header p-10" style="text-align: center;">
                <img :src="image" style="width: 100%; margin-bottom: 15px; max-width: 300px; max-height: 250px;">
                <h4 style="font-weight: bold;"> {{firstName}}  {{ lastName }} </h4>
                <p> Rating: {{rating}} / 5.0 </p>
            </div>
            <div class="card-body">
                <p> Company: {{company}} </p>
                <p> Service offered: <span v-for="service of servicesOffered"> {{ service }} </span> </p>
                <p v-if="stylesOffered!=null"> Style(s): <span v-for="style of stylesOffered"> | {{style}} </span> | </p>
            </div>
            <div class="card-footer" style="text-align: center;">
                <a v-bind:href="profileLink" target="_blank"><button style="padding-inline: 50px;"> View Profile </button></a>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    props: [ 'image', 'firstName', 'lastName', 'company', 'rating', 'servicesOffered', 'stylesOffered', 'profileLink' ],
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
                methodName() {
                    
                }
            }, // methods
            
        
    }
</script>

<style scoped>

</style>