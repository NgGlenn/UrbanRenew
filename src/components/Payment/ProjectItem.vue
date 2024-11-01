<template>
    <div class="row project-item align-items-center mb-4 p-3 border rounded shadow-sm">
        <div class="col-sm-2 auto">
            <img src="../icons/moodeng.png" alt="Contractor Logo" class="contractor-logo">
        </div>
        <div class="col-sm-6">
            <h5 class="mb-1">{{ project.id }}</h5>
            <p class="mb-1"><strong>Contractor:</strong> {{ project.contractorName }}</p>
            <p class="mb-1"><strong>Price:</strong> ${{ project.price}}</p>
        </div>
        <div class="col-sm-4 text-md-end">
            <button v-if="project.paidstatus === 'pending'" type="button" class="btn btn-primary" @click="goToPaymentPage">
                Make Payment
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProjectItem",
    props: {
        project: {
            type: Object,
            required: true,
        },
    },
    methods: {
        goToPaymentPage() {
            //console.log("Project object:", this.project);
            const queryParams = new URLSearchParams({
                jobID: this.project.id,
            }).toString();

            this.$router.push(`/payment2?${queryParams}`);
        },
    },
};
</script>

<style scoped>
.project-item {
    transition: all 0.3s ease;
    background-color: white;
}

.project-item:hover {
    background-color: #f8f9fa;
}

.contractor-logo {
    width: 60px; /* Adjust size */
    height: 60px;
    border-radius: 50%; /* Circle shape */
    object-fit: cover; /* Ensures the image fits well */
}
</style>