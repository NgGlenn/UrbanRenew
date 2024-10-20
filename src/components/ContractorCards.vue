<template>
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="card">
            <div class="card-header">
                <img v-bind:src="img" style="width: 100%;">
                <h4 class="name"> {{name}} </h4>
                <p> Rating: {{rating}} / 5.0 </p>
            </div>
            <div class="card-body">
                <p> Company: {{company}} </p>
                <p> Service offered: {{serviceOffered}} </p>
                <p v-if="stylesOffered.length!=0"> Style(s): <span v-for="style of stylesOffered"> {{style}} &nbsp</span> </p>
            </div>
            <div class="card-footer">
                <a v-bind:href="profileLink" target="_blank"><button style="padding-inline: 50px;"> View Profile </button></a>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    props: [ 'img', 'name', 'company', 'rating', 'serviceOffered', 'stylesOffered', 'profileLink' ],
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
                    img: "../assets/UrbanRenew.png"
                }
            }, // data
            
            methods: {
                methodName() {
                    
                }
            }, // methods
            
        
    }
</script>