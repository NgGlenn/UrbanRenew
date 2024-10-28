
<template>
    <LogedInLayout>
        <div id="main" class="main-body">

            <!-- Search bar -->
            <div id="search">
                    <a href="#" class="icon" v-bind:id="filter_state" v-on:click="toggleFilter(filter_state)">
                        <img src="../assets/filter.png" style="width: 75%; margin: auto;">
                    </a>

                    <input type="text" v-model="key" placeholder="Search for a specific contractor or company" id="searchbar"> 

                    <button id="search-button" @click="Search(key)">
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
                    <div class="col-12 col-sm-6 col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <img src="../assets/UrbanRenew.png" style="width: 100%;">
                                <h4 class="name"> Contractor 1 </h4>
                                <p> Rating: <span class="rating"> 4.9 / 5.0 </span> </p>
                            </div>
                            <div class="card-body">
                                <p> Company: <span class="company"> ABC </span> </p>
                                <p> Service offered: <span class="service"> Cosmetic Works </span> </p>
                                <p> Style(s): <span class="styles"> Modern, Vintage </span> </p>
                            </div>
                            <div class="card-footer">
                                <a href="#"><button style="padding-inline: 50px;"> View Profile </button></a>
                            </div>
                        </div>
                    </div>

                    <ContractorCards 
                    v-for="contractor of contractorsDisplay"
                    :image="processImage(contractor.image)"
                    :name="contractor.name"
                    :company="contractor.company"
                    :rating="contractor.rating"
                    :service-offered="contractor.serviceOffered"
                    :styles-offered="contractor.stylesOffered"
                    :profile-link="contractor.profileLink">
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
    import { useCollection } from 'vuefire';
    import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';

    export default{
        data() {
                return {
                    contractors: this.getContractorDetails(), //array of JSON
                    contractorsDisplay: this.getContractorDetails(),
                    services: this.getServices(),
                    styles: this.getStyles(),
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

                getContractorDetails(){ // returns array of contractor JSON from database
                    return [
                        //Contractor 2 details
                        {
                            'image': 'login1.jpg', //must be declared from root directory
                            'name': 'Contractor 2',
                            'company': 'A&A',
                            'rating': '4.9',
                            'serviceOffered': "Additions & Alterations",
                            'stylesOffered': ["Modern", "Eclectric"],
                            'profileLink': 'https://www.facebook.com'
                        },

                        //Contractor 3 details
                        {
                            'image': '',
                            'name': 'Contractor 3',
                            'company': 'XYZ',
                            'rating': '4.7',
                            'serviceOffered': "Flooring Works",
                            'stylesOffered': [],
                            'profileLink': 'https://www.google.com'
                        },
                    ]
                },

                getServices(){
                    let contractors = this.getContractorDetails();
                    let results = []
                    for (let contractor of contractors){
                        if (results.indexOf(contractor.serviceOffered) == -1){
                            results.push(contractor.serviceOffered);
                        }
                        /*if (contractor.stylesOffered != []){
                            for (style of contractor.stylesOffered){
                                if (this.styles.indexOf(style) == -1){
                                    this.styles.push(style)
                                }
                            }
                        }*/
                    }
                    return results;
                },

                getStyles(){
                    let contractors = this.getContractorDetails();
                    let results = [];
                    for (let contractor of contractors){
                        console.log(contractor.stylesOffered)
                        if (contractor.stylesOffered != []){
                            for (let style of contractor.stylesOffered){
                                if (results.indexOf(style) == -1){
                                    results.push(style)
                                }
                            }
                        }
                    }
                    return results;
                },

                processImage(image) {
                    //file path must be from root directory
                    if (image === '') {
                        return "/src/assets/UrbanRenew.png";
                    } else {
                        //adjust to wherever the images will be stored
                        return "/src/assets/" + image; 
                    }
                },


                addFilter(event){
                    console.log(event.target)
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
                    key = key.toLowerCase()
                    let contractors = this.contractors;
                    let results = [];
                    let filters = this.filters;
                    for (let contractor of contractors){
                        if ( contractor.name.toLowerCase().search(key) != -1 || contractor.company.toLowerCase().search(key) != -1){
                            if (filters == []){
                                for (filter of filters){
                                    if (contractor.stylesOffered.indexOf(filter) != -1 || contractor.serviceOffered == filter){
                                        results.push(contractor);
                                    }
                                }
                            }
                            else{
                                results.push(contractor)
                            }    
                        }
                    }
                    this.contractorsDisplay = results;
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