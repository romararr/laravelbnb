<template>
  <div>
    <success v-if="success">Thanks For Your Purchase!</success>
    <div class="row" v-else>
      <!-- CHECKOUT -->
      <div class="col-md-8">
        <h6 class="text-uppercase text-secondary font-weight-bolder">
          Checkout Booking
        </h6>
        <div v-if="itemsInBasket">
          <div class="row">
            <div class="col-md-6 form-group">
              <label for="first_name">First Name</label>
              <input
                type="text"
                name="first_name"
                class="form-control"
                v-model="customer.first_name"
                :class="[{ 'is-invalid': errorFor('customer.first_name') }]"
              />
              <v-error :errors="errorFor('customer.first_name')"></v-error>
            </div>
            <div class="col-md-6 form-group">
              <label for="last_name">Last Name</label>
              <input
                type="text"
                name="last_name"
                class="form-control"
                v-model="customer.last_name"
                :class="[{ 'is-invalid': errorFor('customer.last_name') }]"
              />
              <v-error :errors="errorFor('customer.last_name')"></v-error>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 form-group">
              <label for="email">Email</label>
              <input
                type="email"
                name="email"
                class="form-control"
                v-model="customer.email"
                :class="[{ 'is-invalid': errorFor('customer.email') }]"
              />
              <v-error :errors="errorFor('customer.email')"></v-error>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 form-group">
              <label for="street">Street</label>
              <input
                type="text"
                name="street"
                class="form-control"
                v-model="customer.street"
                :class="[{ 'is-invalid': errorFor('customer.street') }]"
              />
              <v-error :errors="errorFor('customer.street')"></v-error>
            </div>
            <div class="col-md-6 form-group">
              <label for="street">City</label>
              <input
                type="text"
                name="city"
                class="form-control"
                v-model="customer.city"
                :class="[{ 'is-invalid': errorFor('customer.city') }]"
              />
              <v-error :errors="errorFor('customer.city')"></v-error>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 form-group">
              <label for="country">Country</label>
              <input
                type="text"
                name="country"
                class="form-control"
                v-model="customer.country"
                :class="[{ 'is-invalid': errorFor('customer.country') }]"
              />
              <v-error :errors="errorFor('customer.country')"></v-error>
            </div>
            <div class="col-md-4 form-group">
              <label for="state">State</label>
              <input
                type="text"
                name="state"
                class="form-control"
                v-model="customer.state"
                :class="[{ 'is-invalid': errorFor('customer.state') }]"
              />
              <v-error :errors="errorFor('customer.state')"></v-error>
            </div>
            <div class="col-md-2 form-group">
              <label for="zip">ZIP Code</label>
              <input
                type="text"
                name="zip"
                class="form-control"
                v-model="customer.zip"
                :class="[{ 'is-invalid': errorFor('customer.zip') }]"
              />
              <v-error :errors="errorFor('customer.zip')"></v-error>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-12 form-group">
              <button
                class="btn btn-lg btn-primary btn-block"
                @click.prevent="book"
              >
                Book Now!
              </button>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="jumbotron jumbotron-fluid text-center text-secondary">
            <h1>No Items Yet</h1>
          </div>
        </div>
      </div>

      <!-- BASKET -->
      <div class="col-md-4">
        <div class="d-flex justify-content-between">
          <h6 class="text-uppercase text-secondary font-weight-bolder">
            Your Cart
          </h6>
          <h6 class="badge badge-secondary">
            <span v-if="itemsInBasket">{{ itemsInBasket }} Items</span>
            <span v-else><i>empty</i></span>
          </h6>
        </div>

        <transition-group name="fade" tag="div">
          <div v-for="item in basket" :key="item.bookable.id">
            <div class="py-2 border-top d-flex justify-content-between">
              <span>
                <router-link
                  :to="{ name: 'bookable', params: { id: item.bookable.id } }"
                  >{{ item.bookable.title }}
                </router-link>
              </span>
              <span class="font-weight-bold">${{ item.price.total }} </span>
            </div>
            <div class="py-2 d-flex justify-content-between">
              <small class="text-secondary"
                >From <b>{{ item.dates.from }} </b>to
                <b>{{ item.dates.to }} </b></small
              >
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="$store.dispatch('removeFromBasket', item.bookable.id)"
                :disabled="loading"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import validateError from "../shared/mixins/error";

export default {
  mixins: [validateError],
  data() {
    return {
      loading: false,
      bookingAttempted: false,
      customer: {
        first_name: null,
        last_name: null,
        email: null,
        street: null,
        city: null,
        country: null,
        state: null,
        zip: null,
      },
    };
  },
  computed: {
    ...mapGetters(["itemsInBasket"]),
    ...mapState({
      basket: (state) => state.basket.items,
    }),
    success() {
      return !this.loading && this.itemsInBasket == 0 && this.bookingAttempted;
    },
  },
  methods: {
    async book() {
      this.loading = true;
      this.errors = false;
      this.bookingAttempted = false;

      try {
        await axios.post(`/api/checkout`, {
          bookings: this.basket.map((item) => ({
            bookable_id: item.bookable.id,
            from: item.dates.from,
            to: item.dates.to,
          })),
          customer: this.customer,
        });

        this.$store.dispatch("clearBasket");
      } catch (err) {
        this.errors = err.response && err.response.data.errors;
      }

      this.loading = false;
      this.bookingAttempted = true;
    },
  },
};
</script>

<style scoped>
h6.badge {
  font-size: 0.7rem;
}

a {
  color: black;
  text-decoration: none;
}
</style>