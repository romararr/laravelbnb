<template>
  <div>
    <success v-if="success">You've left a review! Thanks!</success>
    <fatal-error v-if="error"></fatal-error>
    <div v-if="!success && !error">
      <div class="row">
        <div :class="setColumn ? 'col-md-4' : 'd-none'">
          <div class="card">
            <div class="card-body">
              <div v-if="loading">Loading...</div>
              <div v-if="hasBooking">
                <p>
                  Stayed at
                  <router-link
                    :to="{
                      name: 'bookable',
                      params: {
                        id: booking.bookable.bookable_id,
                      },
                    }"
                    >{{ booking.bookable.title }}</router-link
                  >
                </p>
                <p>From {{ booking.from }} to {{ booking.to }}</p>
              </div>
            </div>
          </div>
        </div>
        <div :class="setColumn ? 'col-md-8' : 'col-md-12'">
          <div v-if="loading">Loading Review...</div>
          <div v-else>
            <div v-if="alreadyReviewed">
              <h3>You've already give a review!</h3>
            </div>
            <div v-else>
              <div class="form-group">
                <label class="text-muted">Select the star rating</label>
                <star-rating
                  class="fa-2x"
                  v-model="review.rating"
                ></star-rating>
              </div>
              <div class="form-group">
                <label for="content" class="text-muted"
                  >Tell me your experience</label
                >
                <textarea
                  name="content"
                  class="form-control"
                  cols="30"
                  rows="10"
                  v-model="review.content"
                  :class="[{ 'is-invalid': errorFor('content') }]"
                ></textarea>
                <v-error :errors="errorFor('content')"></v-error>
              </div>

              <button
                class="btn btn-primary btn-block"
                :disabled="sending"
                @click.prevent="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { is404, is422 } from "../shared/utils/response";
import validateError from "../shared/mixins/error";

export default {
  mixins: [validateError],
  data() {
    return {
      loading: false,
      review: {
        id: null,
        rating: 5,
        content: null,
      },
      existReview: null,
      booking: null,
      error: false,
      sending: false,
      success: false,
    };
  },
  async created() {
    this.review.id = this.$route.params.id;

    this.errors = null;
    this.loading = true;

    // If review exists
    try {
      this.existReview = (
        await axios.get(`/api/reviews/${this.review.id}`)
      ).data.data;
    } catch (err) {
      if (is404(err)) {
        // Fetch booking by review key
        try {
          this.booking = (
            await axios.get(`/api/booking-by-review/${this.review.id}`)
          ).data.data;
        } catch (err) {
          this.error = !is404(err);
        }
      } else {
        this.error = true;
      }
    }

    this.loading = false;
  },
  computed: {
    alreadyReviewed() {
      return this.hasReview || !this.booking;
    },
    hasReview() {
      return this.existReview != null;
    },
    hasBooking() {
      return this.booking != null;
    },
    setColumn() {
      return this.loading || !this.alreadyReviewed;
    },
  },
  methods: {
    // Store review
    submit() {
      this.sending = true;
      this.errors = null;
      this.success = false;

      axios
        .post(`/api/reviews`, this.review)
        .then((result) => {
          this.success = 201 == result.status;
        })
        .catch((err) => {
          if (is422(err)) {
            const errors = err.response.data.errors;

            if (errors["content"] && _.size(errors) == 1) {
              this.errors = errors;
              return;
            }
          }

          this.error = true;
        })
        .then(() => (this.sending = false));
    },
  },
};
</script>