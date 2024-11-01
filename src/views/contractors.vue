
<template>
    <LogedInLayout>
        <div id="main" class="main-body">

            <!-- Search bar -->
            <div id="search">
                    <a href="#" class="icon" v-bind:id="filter_state" v-on:click="toggleFilter(filter_state)">
                        <img src="../assets/filter.png" style="width: 75%; margin: auto;">
                    </a>

                    <input type="text" v-model="search_key" placeholder="Search for a specific contractor or company" id="searchbar"> 

                    <button id="search-button" @click="Search(search_key)">
                        Search
                    </button>
            </div>

            <!-- Filter menu -->
            <div id="filters-section" v-if="filter_state == 'filter-on'">
                <p style="text-align: center; font-weight: bold;"> Select filter(s): </p>
                <p>
                    Service(s): <button class="filter" v-for="service of services" @click="addFilter($event)"> {{service}} </button>
                </p>

                <p>
                    Cosmetic style(s): <button class="filter" v-for="style of styles" v-on:click="addFilter($event)"> {{style}} </button>
                </p>
            </div>

            <!-- Placeholder cards -->
            <div id="contractors-section">
                <div class="row">

                    <ContractorCards 
                    v-for="contractor of contractorsDisplay"
                    :id="contractor.id"
                    :image="processImage(contractor.image)"
                    :first-name="contractor.firstName"
                    :last-name="contractor.lastName"
                    :company="contractor.companyName"
                    :rating="contractor.rating"
                    :services-offered="contractor.services"
                    :styles-offered="contractor.styles"
                    @redirect="viewProfile">
                    </ContractorCards>

                </div>
            </div>
            
        </div>
    </LogedInLayout>
</template>

<script>
    import NavBar from '@/components/NavBar.vue';
    import LogedInLayout from '@/components/LogedInLayout.vue';
    import ContractorCards from '@/components/ContractorCards.vue';
    import { ref, watch } from 'vue'
    import { useCollection } from 'vuefire';
    import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';
    import { db } from '../firebase.js'

    export default{
        setup(){
            const contractors = useCollection(collection(db, 'contractors'));
            var contractorsDisplay = useCollection(collection(db, 'contractors'));
            var services = ref([]); // Make services reactive
            var styles = ref([]); // Make styles reactive

            // Watch for changes in contractors and update services & styles once contractors has data
            watch(contractors, (newContractors) => {
            if (newContractors && newContractors.length) {
                services.value = getServices(newContractors);
                styles.value = getStyles(newContractors)
            }
            });

            const getServices = (contractors) => {
                const results = [];
                for (let contractor of contractors) {
                    if (contractor.services) {
                    results.push(...contractor.services);
                    }
                }
                return results;
            };

            const getStyles = (contractors) => {
                const results = [];
                for (let contractor of contractors) {
                    if (contractor.styles) {
                    results.push(...contractor.styles);
                    }
                }
                return results;
            };

            return {contractors, contractorsDisplay, services, styles}
        },

        data() {
                return {
                    search_key: "",
                    filter_state: "filter-off",
                    filters: []
                }
            },

            methods: {
                toggleFilter(filter_state){
                    if (filter_state == "filter-off"){
                        this.filter_state = "filter-on";
                    }
                    else{
                        this.filter_state = "filter-off";
                    }
                },

                processImage(image) {
                    //file path must be from root directory
                    if (image == null) {
                        return "/src/assets/UrbanRenew.png";
                    } else {
                        //adjust to wherever the images will be stored
                        return "/src/assets/" + image; 
                    }
                },


                addFilter(event){
                    let btn = event.target
                    let filterName = btn.textContent
                    if (btn.className == "filter"){
                        btn.className = "filter selected";
                        this.filters.push(filterName);
                    }
                    else{
                        btn.className = "filter";
                        let index = this.filters.indexOf(filterName);
                        this.filters.splice(index, 1);
                    }
                    console.log(this.filters);
                },

                Search(key){
                    //console.log(key);
                    key = key.toLowerCase()
                    let contractors = this.contractors;
                    let results = [];
                    let filters = this.filters;
                    for (let contractor of contractors){
                        let name = contractor.firstName + " " + contractor.lastName;
                        if ( name.toLowerCase().search(key) != -1 || contractor.companyName.toLowerCase().search(key) != -1){
                            if (filters.length != 0){
                                for (let filter of filters){
                                    // Check if any selected service is provided
                                    if (contractor.services.indexOf(filter) != -1){
                                        results.push(contractor);
                                    }
                                    // Check if any selected style is provided
                                    if (contractor.styles){
                                        if (contractor.styles.indexOf(filter) != -1){
                                            results.push(contractor);
                                        }
                                    }
                                }
                            }
                            else{ 
                                // Append all results without further checks
                                results.push(contractor)
                            }    
                        }
                    }
                    this.contractorsDisplay = results;
                },

                viewProfile(id){
                    this.$router.push({ path: `/contractors/${id}` });
                }
            },

            components: {
                NavBar,
                LogedInLayout,
                ContractorCards,
            }
    }
</script>

<style scoped>
        .main-body{
            padding: 30px;
        }

        .icon{
            width: 35px;
            height: 40px;
            display: inline-flex;
            text-align: center;
            vertical-align: middle;
            margin-inline: 0px;
        }

        #filter-off{
            background-color: white;
        }

        #filter-on{
            background-color: lightgray;
        }

        #searchbar{
            flex: 1;                /* Take up any available space */
            margin-inline: 10px;
            height: 35px;
            margin-bottom: 5px;
        }

        #search{
            display: flex;                  /* Flexbox for layout */
            justify-content: space-between; /* Distribute the items evenly */
            width: 100%;
        }

        #filters-section{
            background-color: lightgray;
            padding: 10px;
        }

        .filter{
            background-color: white;
            color: black;
            border-radius: 15px;
            height: 30px;
            font-size: 12px;
            padding-inline: 15px;
            margin-inline: 2px;
        }

        .selected{
            background-color: #769FCD;
            color: white;
        }

        #contractors-section{
            margin-top: 10px;
            padding: 10px;
        }

        .card{
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .card-header, .card-footer{
            text-align: center;
        }

        .card-body{
            padding-inline: 25px;
        }

        .card-footer{
            padding-top: 15px;
            padding-bottom: 15px;
        }

        .name{
            text-align: center;
            font-weight: bold;
        }

        span{
            font-style: italic;
        }
</style>