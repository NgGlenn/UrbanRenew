<template>
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="card">
            <div class="card-header p-10" style="text-align: center;">
                <img :src="displayImage" style="width: 100%; margin-bottom: 15px; max-width: 300px; max-height: 250px;">
                <h4 style="font-weight: bold;"> {{firstName}}  {{ lastName }} </h4>
                <p> Rating: {{rating.toFixed(1)}} / 5.0 </p>
            </div>
            <div class="card-body">
                <p> Company: <span style="font-style: italic;"> {{company}} </span> </p>
                <p> Service offered: <span style="font-style: italic;"> {{servicesOffered.join(", ")}} </span> </p>
                <p v-if="stylesOffered!=null"> Style(s): <span style="font-style: italic;"> {{stylesOffered.join(", ")}} </span> </p>
            </div>
            <div class="card-footer" style="text-align: center;">
                <button @click="redirect" style="padding-inline: 50px;"> View Profile </button>
            </div>
        </div>
    </div>
</template>

<script>
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


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
                    displayImage: ""
                }
            }, // data
            
            methods: {
                redirect() {
                    this.$emit('redirect', this.id); // Emit the contractor ID when the button is clicked
                },

                async processImage(image) {
                    const storage = getStorage()
                    if (image == null) {
                        image = "default_image.jpg";
                        const fileRef = storageRef(storage, 'images/' + image);
                        // Get the file's download URL
                        this.displayImage = await getDownloadURL(fileRef);
                    }
                    else{
                        return image;
                    }
                },
            }, // methods

            mounted(){
                this.processImage(this.image);
            }
        
    }
</script>

<style scoped>
    .card{
        margin-top: 10px;
        margin-bottom: 10px;
        min-height: 560px;
    }
</style>