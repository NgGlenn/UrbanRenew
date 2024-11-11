<template>
    <LogedInLayout>
        <div id="main" class="main-body">

            <!-- Search bar -->
            <div id="search">
                <a href="#" class="icon" v-bind:id="filter_state" v-on:click="toggleFilter(filter_state)">
                    <img src="../assets/filter.png" style="width: 75%; margin: auto;">
                </a>

                <input type="text" v-model="search_key" placeholder="Search for a specific contractor or company"
                    id="searchbar">

                <button class="btn" id="search-button" @click="Search(search_key)">
                    Search
                </button>
            </div>

            <!-- Filter menu -->
            <div id="filters-section" v-if="filter_state == 'filter-on'">
                <p style="text-align: left; font-weight: bold;"> Select filter(s): </p>
                <p>
                    Service(s): <button class="filter" v-for="service of services" @click="addFilter($event)">
                        {{ service }} </button>
                </p>
            </div>

            <!-- Placeholder cards -->
            <div id="contractors-section">
                <div class="row">
                    <ContractorCards v-for="contractor of contractorsDisplay" :key="contractor.id" :id="contractor.id"
                        :image="contractor.portfolioImages" :first-name="contractor.firstName"
                        :last-name="contractor.lastName" :company="contractor.companyName"
                        :services-offered="contractor.services" @redirect="viewProfile">
                    </ContractorCards>
                </div>
            </div>

        </div>
    </LogedInLayout>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import LogedInLayout from '@/components/logedInLayout.vue';
import ContractorCards from '@/components/ContractorCards.vue';
import { ref, watch } from 'vue'
import { useCollection } from 'vuefire';
import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase.js'

export default {
    setup() {
        const contractors = useCollection(collection(db, 'contractors'));
        var contractorsDisplay = useCollection(collection(db, 'contractors'));
        var services = ref([]); // Make services reactive

        // Watch for changes in contractors and update services once contractors has data
        watch(contractors, (newContractors) => {
            if (newContractors && newContractors.length) {
                services.value = getServices(newContractors);
            }
        });

        const getServices = (contractors) => {
            const results = [];
            for (let contractor of contractors) {
                for (let service of contractor.services) {
                    //console.log(service)
                    if (results.indexOf(service) == -1 && service != "None") {
                        results.push(service);
                    }
                }
            }
            return results;
        };

        return { contractors, contractorsDisplay, services }
    },

    data() {
        return {
            search_key: "",
            filter_state: "filter-off",
            filters: []
        }
    },

    methods: {
        toggleFilter(filter_state) {
            if (filter_state == "filter-off") {
                this.filter_state = "filter-on";
            }
            else {
                this.filter_state = "filter-off";
            }
        },

        addFilter(event) {
            let btn = event.target
            let filterName = btn.textContent
            if (btn.className == "filter") {
                btn.className = "filter selected";
                this.filters.push(filterName);
            }
            else {
                btn.className = "filter";
                let index = this.filters.indexOf(filterName);
                this.filters.splice(index, 1);
            }
            //console.log(this.filters);
        },

        Search(key) {
            //console.log(key);
            key = key.toLowerCase()
            let contractors = this.contractors;
            let results = [];
            let filters = this.filters;
            for (let contractor of contractors) {
                let name = contractor.firstName + " " + contractor.lastName;
                if (name.toLowerCase().search(key) != -1 || contractor.companyName.toLowerCase().search(key) != -1) {
                    if (filters.length != 0) {
                        for (let filter of filters) {
                            // Check if any selected service is provided
                            if (contractor.services.indexOf(filter) != -1) {
                                results.push(contractor);
                            }
                        }
                    }
                    else {
                        // Append all results without further checks
                        results.push(contractor)
                    }
                }
            }
            this.contractorsDisplay = results;
        },

        viewProfile(id) {
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
.main-body {
    padding: 30px;
}

.icon {
    width: 35px;
    height: 40px;
    display: inline-flex;
    text-align: center;
    vertical-align: middle;
    margin-inline: 0px;
}

#filter-off {
    background-color: white;
}

#filter-on {
    background-color: #ebebeb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#searchbar {
    flex: 1;
    /* Take up any available space */
    margin-inline: 10px;
    height: 35px;
    margin-bottom: 5px;
}

#search {
    display: flex;
    /* Flexbox for layout */
    justify-content: space-between;
    /* Distribute the items evenly */
    width: 100%;
}

#filters-section {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: left;
    max-width: 100%;
    margin: auto;
}

.filter {
    background-color: white;
    color: black;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    padding-inline: 15px;
    margin-inline: 2px;
}

.selected {
    background-color: #769FCD;
    color: white;
}

#contractors-section {
    margin-top: 10px;
    padding: 10px;
}

.card {
    margin-top: 10px;
    margin-bottom: 10px;
}

.card-header,
.card-footer {
    text-align: center;
}

.card-body {
    padding-inline: 25px;
}

.card-footer {
    padding-top: 15px;
    padding-bottom: 15px;
}

.name {
    text-align: center;
    font-weight: bold;
}

span {
    font-style: italic;
}

.btn {
    background-color: #769FCD;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>