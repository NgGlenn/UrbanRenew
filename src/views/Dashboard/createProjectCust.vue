<script setup>
    import LogedInLayout from '@/components/logedInLayout.vue';
    import {ref} from 'vue';

    const location = ref()
    const description = ref()
    const projectStyle = ref([])


</script>

<template>
    <LogedInLayout>
        <div class="container-fluid">
            <form>
                <div class="mb-3 row">
                    <h1><strong>New Project</strong></h1>
                </div>
                <div class="mb-5 row">
                    <label for="projLocation" class="col-sm-2 col-form-label py-auto">Location</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="location" v-model="location">
                    </div>
                </div>
                <div class="mb-5 row">
                    <label for="projDescription" class="col-sm-2 col-form-label py-auto">Description</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="projDescription" v-model="description">
                    </div>
                </div>
                <div class="mb-5 row">
                    <label for="projExpStartDate" class="col-sm-2 col-form-label py-auto">Expected Start Date</label>
                    <div class="col-md-4 col-10">
                        <input type="date" class="form-control" id="projExpStartDate">
                    </div>

                    <label for="projExpEndDate" class="col-sm-2 col-form-label py-auto">Expected Completion Date</label>
                    <div class="col-md-4 col-10">
                        <input type="date" class="form-control" id="projExpEndDate">
                    </div>
                </div>
                <div class="mb-5 row">
                    <div class="col-2 col-form-label py-auto">
                        Preferred Design Style 
                    </div>
                    <div class="col-10">
                        <select class="form-select" id="projectStyle" aria-label="Example select with button addon" v-model="projectStyle">
                            <option value="modern" selected>Modern</option>
                            <option value="heritage">Heritage</option>
                            <option value="simple">Simple</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>
                </div>
                <div class="mb-5 row">
                    <div class="col-2 col-form-label py-auto">Photo(s)</div>
                    <div class="col-5">

                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-lg d-flex justify-content-end" style="color: white; background-color: #769FCD;">Next</button>
            </form>
        </div>
    </LogedInLayout>
</template>

<style scoped>
    .container-fluid {
        height: 100%;
        padding: 50px;
    }
</style>