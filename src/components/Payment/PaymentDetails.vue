<template>
    <div class="payment-details">
        <div v-if="project">
            <div class="row align-items-center mb-3">
                <div class="col-auto">
                    <img src="../icons/moodeng.png" alt="Contractor Logo" class="contractor-logo">
                </div>
                <div class="col">
                    <div class="project-info mb-2">
                        <h5 class="project-name">{{ project.projectName }}</h5>
                    </div>
                    <div class="contractor-info">
                        <p class="mb-1"><strong>Contractor:</strong></p>
                        <span class="contractor-name">{{ project.contractorName }}</span>
                    </div>
                </div>
            </div>
            <div class="fees-container">
                <div class="d-flex justify-content-between mb-1">
                    <em>Project Cost:</em>
                    <span>SGD {{ project.price.toLocaleString() }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                    <em>Administration Fee:</em>
                    <span>SGD {{ (project.price * 0.0010).toLocaleString() }}</span> <!-- Example calculation -->
                </div>
                <div class="d-flex justify-content-between mb-1">
                    <em>Platform Fee:</em>
                    <span>SGD {{ (project.price * 0.0025).toLocaleString() }}</span> <!-- Example calculation -->
                </div>
                <hr />
                <div class="d-flex justify-content-between mb-1">
                    <strong>Total Fees:</strong>
                    <span class="font-weight-bold"><strong>SGD {{ ((project.price * 0.0025) + (project.price * 0.0010) +
                        project.price).toLocaleString() }}</strong></span>
                </div>
            </div>
            <!--                 
                <h2>Project: {{ project.projectName }}</h2>
                <p><strong>Contractor:</strong> {{ project.contractorName }}</p>
                <p><strong>Price:</strong> ${{ formattedPrice }}</p> -->
        </div>


        <div v-else>
            <p>Loading project details...</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        project: {
            type: Object,
            required: true,
        },
    },
    computed: {
        formattedPrice() {
            return this.project ? parseFloat(this.project.price).toLocaleString() : '';
        },
    },
};
</script>

<style scoped>
/* Payment Details Container */
.payment-details {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
}

/* Contractor Logo Styling */
.contractor-logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 15px;
}

/* Project and Contractor Info Styling */
.project-info,
.contractor-info {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
}

.project-name {
    font-weight: bold;
    color: #769FCD;
}

.contractor-name {
    font-weight: 500;
    color: #555;
}

/* Fees Container */
.fees-container {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;
}

/* Hover Effects for Interactive Elements */
.project-info:hover,
.contractor-info:hover {
    background-color: #f9f9f9;
    border-radius: 5px;
}

/* Consistent Typography */
h5,
p {
    margin: 0;
}

h5 {
    font-size: 1.5rem;
    color: #769FCD;
    margin-bottom: 10px;
}

p {
    font-size: 1rem;
    color: #555;
    max-width: 900px;
    margin: 0 auto 15px;
}
</style>