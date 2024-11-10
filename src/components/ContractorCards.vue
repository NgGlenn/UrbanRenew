<template>
    <div class="col-12 col-sm-6 col-lg-4">
        <div class="card border rounded shadow-sm">
            <div class="card-header p-10" style="text-align: center;">
                <img :src="displayImage">
                <h4 style="font-weight: bold;"> {{ firstName }} {{ lastName }} </h4>
                <p> Rating: {{ rating.toFixed(1) }} / 5.0 </p>
            </div>
            <div class="card-body">
                <p><b> Company: </b><span style="font-style: italic;"> {{ company }} </span> </p>
                <p><b> Service offered: </b><span style="font-style: italic;"> {{ servicesOffered.join(", ") }} </span>
                </p>
            </div>
            <div class="card-footer" style="text-align: center;">
                <button class="btn btn-primary" @click="redirect" style="padding-inline: 50px;"> View Profile </button>
            </div>
        </div>
    </div>
</template>

<script>
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
    props: ['id', 'image', 'firstName', 'lastName', 'company', 'rating', 'servicesOffered'],

    data() {
        return {
            // key: value
            displayImage: this.processImage(this.image)
        }
    }, // data

    methods: {
        redirect() {
            this.$emit('redirect', this.id); // Emit the contractor ID when the button is clicked
        },

        processImage(image) {
            //console.log(image)
            const storage = getStorage()
            if (image.length != 0) {
                //console.log(image)
                //this.displayImage = image[0];
                return image[0]
            }
            else {
                /*image = "default_image.jpg";
                const fileRef = storageRef(storage, 'images/' + image);
                // Get the file's download URL
                this.displayImage = await getDownloadURL(fileRef);*/
                //this.displayImage = "https://firebasestorage.googleapis.com/v0/b/wad2-urbanrenew.appspot.com/o/images%2Fdefault_image.jpg?alt=media&token=0bb4224d-e465-490c-a908-532f8ca788f0"
                
                // download URL for the default image
                return "https://firebasestorage.googleapis.com/v0/b/wad2-urbanrenew.appspot.com/o/images%2Fdefault_image.jpg?alt=media&token=0bb4224d-e465-490c-a908-532f8ca788f0"
            }
        },
    }, // methods

    mounted() {
        //this.processImage(this.image);
    }
}
</script>

<style scoped>
.card {
    border: 3px solid #769FCD;
    color: #769FCD;
    margin-top: 10px;
    margin-bottom: 10px;
    min-height: 500px;
}

img{
    width: 100%; 
    margin-bottom: 15px; 
    min-height: 230px;
    max-height: 250px;
}

.btn-primary {
    background-color: #769fcd;
    border: none;
}

.btn-primary:hover {
    background-color: #0056b3;
}
</style>