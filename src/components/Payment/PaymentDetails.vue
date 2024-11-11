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
                    <em>Project Cost hellow:</em>
                    <span class="price">SGD {{ projectCost }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                    <em>Administration Fee:</em>
                    <span class="price">SGD {{ administrationFee }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                    <em>Platform Fee:</em>
                    <span class="price">SGD {{ platformFee }}</span>
                </div>
                <hr />
                <div class="d-flex justify-content-between mb-1">
                    <strong>Total Fees:</strong>
                    <span class="price font-weight-bold">
                        <strong>SGD {{ totalFees }}</strong>
                    </span>
                </div>
            </div>
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
        projectCost() {
            return this.formatPrice(this.project.price);
        },
        administrationFee() {
            return this.formatPrice(this.project.price * 0.0010);
        },
        platformFee() {
            return this.formatPrice(this.project.price * 0.0025);
        },
        totalFees() {
            return this.formatPrice((this.project.price * 0.0025) + (this.project.price * 0.0010) + this.project.price);
        },
        formatPrice(amount) {
            return amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    }
};
</script>

<style scoped>
.payment-details {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
}

.contractor-logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 15px;
}

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

.fees-container {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;
}

.project-info:hover,
.contractor-info:hover {
    background-color: #f9f9f9;
    border-radius: 5px;
}

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

.fees-container .d-flex .price {
    text-align: right;
    width: 100px;
    
}
</style>