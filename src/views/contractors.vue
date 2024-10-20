
<template>
    <LogedInLayout>
        <div id="main" class="main-body">

            <!-- Search bar -->
            <div id="search">
                    <a href="#" class="icon" v-bind:id="filter_state" v-on:click="toggleFilter(filter_state)">
                        <img src="../img/filter.png" style="width: 75%; margin: auto;">
                    </a>

                    <input type="text" placeholder="Search for a specific contractor or company" id="searchbar"> 

                    <button id="search-button">
                        Search
                    </button>
            </div>

            <!-- Filter menu -->
            <div id="filters-section" v-if="filter_state == 'filter-on'">
                <p style="text-align: center; font-weight: bold;"> Select filter(s): </p>
                <p>
                    Service(s): <button class="filter" v-for="service of services" v-on:click="addFilter(service)"> {{service}} </button>
                </p>

                <p>
                    Cosmetic style(s): <button class="filter" v-for="style of styles" v-on:click="addFilter(style)"> {{style}} </button>
                </p>
            </div>

            <!-- Placeholder cards -->
            <div id="contractors-section">
                <div class="row">
                    <div class="col-12 col-sm-6 col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <img v-bind:src="defaultImage" style="width: 100%;">
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
                    v-for="contractor of contractors"
                    v-bind:name="contractor.name"
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

    export default{
        data() {
                return {
                    services: ["Cosmetic Works", "Electrical Works", "Plumbing Works"],
                    styles: ["Vintage", "Modern", "Eclectric"],
                    filter_state: "filter-off",
                    contractors: this.getContractorDetails() //array of JSON
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
                            'name': 'Contractor 2',
                            'company': 'A&A',
                            'rating': '4.9',
                            'serviceOffered': "Additions & Alterations",
                            'stylesOffered': ["Modern", "Eclectric"],
                            'profileLink': 'https://www.facebook.com'
                        },

                        //Contractor 3 details
                        {
                            'name': 'Contractor 3',
                            'company': 'XYZ',
                            'rating': '4.7',
                            'serviceOffered': "Flooring Works",
                            'stylesOffered': [],
                            'profileLink': 'https://www.google.com'
                        },
                    ]
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