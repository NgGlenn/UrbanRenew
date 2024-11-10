<template>
    <div class="review-container">
        <div class="profile-section">
            <div class="row"></div>
            <img :src="profilePictureUrl" alt="Profile Picture" class="profile-image-review" />
            <div class="profile-info">
                <div class="customer-name">
                    <h6>{{firstName + ' ' + lastName}}</h6>
                </div>
                <span class="metric-number">Overall Rating</span><br />
                <div class="metric-stars rating">
                    <span v-for="star in 5" :key="star" class="star"
                        :class="{ filled: star <= review.averageRating }">★</span>
                </div>
                <span class="metric-number">{{ review.averageRating }}/5</span>
                <div class="review-date">{{ review.createdAt.toDate().toLocaleString() }}</div>
            </div>
        </div>

        <div class="metrics-container">
            <div class="metric-item">
                <span class="metric-label">Quality of Work</span>
                <div class="metric-value">
                    <div class="metric-stars">
                        <span v-for="star in 5" :key="star" class="star"
                            :class="{ filled: star <= review.qualityOfWork }">★</span>
                    </div>
                    <span class="metric-number">{{ review.qualityOfWork }}/5</span>
                </div>
            </div>

            <div class="metric-item">
                <span class="metric-label">Timeliness</span>
                <div class="metric-value">
                    <div class="metric-stars">
                        <span v-for="star in 5" :key="star" class="star"
                            :class="{ filled: star <= review.timeliness }">★</span>
                    </div>
                    <span class="metric-number">{{ review.timeliness }}/5</span>
                </div>
            </div>

            <div class="metric-item">
                <span class="metric-label">Budget Adherence</span>
                <div class="metric-value">
                    <div class="metric-stars">
                        <span v-for="star in 5" :key="star" class="star" :class="{
                            filled: star <= review.budgetAdherence,
                        }">★</span>
                    </div>
                    <span class="metric-number">{{ review.budgetAdherence }}/5</span>
                </div>
            </div>

            <div class="metric-item">
                <span class="metric-label">Problem Resolution</span>
                <div class="metric-value">
                    <div class="metric-stars">
                        <span v-for="star in 5" :key="star" class="star" :class="{
                            filled: star <= review.problemResolution,
                        }">★</span>
                    </div>
                    <span class="metric-number">{{ review.problemResolution }}/5</span>
                </div>
            </div>

            <div class="metric-item">
                <span class="metric-label">Communication</span>
                <div class="metric-value">
                    <div class="metric-stars">
                        <span v-for="star in 5" :key="star" class="star"
                            :class="{ filled: star <= review.communication }">★</span>
                    </div>
                    <span class="metric-number">{{ review.communication }}/5</span>
                </div>
            </div>

        </div>
        <div class="review-comment" v-if="review.comment">
            <p>{{ review.comment }}</p>
        </div>
        <div class="review-comment no-comment" v-else="review.comment">
            <p>No comment provided.</p>
        </div>
    </div>

</template>

<script>
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { useCollection } from 'vuefire';
import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';
import defaultProfileIcon from "@/assets/defaultProfileIcon.jpg";

export default {
    name: 'Review',
    props: {
        review: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            userData: null,
            profilePictureUrl: defaultProfileIcon,
            firstName: "Anonymous",
            lastName:""
        };
    },
    method: {
        seeReview() {
            console.log(review);
            // console.log(this.review.customerID)
        },
    },
    async created() {
        if (this.review.customerID) {
            try {
                const user = doc(db, "users", this.review.customerID);
                const userDoc = await getDoc(user);
                if (userDoc.exists()) {
                    this.userData = userDoc.data();
                    this.firstName = this.userData.firstName || "Anonymous"; 
                    this.lastName = this.userData.lastName[0] + "."
                    this.profilePictureUrl = this.userData.imageUrl || defaultProfileIcon;
                } else {
                    console.error("No user found for customerID:", this.review.customerID);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }

        }
    }
}
</script>

<style scoped>
.rating {
    margin-top: 0.25rem;
}

.review-date {
    color: #64748b;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.metrics-container {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 15px;
    margin: 1rem 0;
    width: 100%;
    display: block;
}

@media (max-width: 576px) {
    .metrics-container {
        padding: 0.3em;
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }
}

.metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;
    width: 100%;
}

.metric-label {
    color: #4b5563;
    font-size: 0.875rem;
    flex-grow: 1;
}

.metric-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.metric-stars {
    display: inline-flex;
    gap: 0.25rem;
}

.metric-number {
    font-weight: 500;
    color: #2d3748;
}

.star {
    color: #cbd5e0;
    font-size: 1.1rem;
}

.star.filled {
    color: #fbbf24;
}

.review-comment {
    color: #1a202c;
    line-height: 1.6;
    margin-top: 1rem;
}

.customer-name {
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    font-size: 1.1rem;
}

.profile-image-review {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f8f9fa;
}

.profile-section {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
}

.review-container {
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
}

.no-comment {
    text-align: left;
    color: #64748b;
    font-style: italic;

}
</style>
