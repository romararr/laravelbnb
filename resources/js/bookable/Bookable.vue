<template>
  <div class="row">
    <div class="col-md-8">
      <div class="card">
        <div class="card-body">
          <div v-if="!loading">
            <h2>{{ bookable.title }}</h2>
            <hr />
            <article>{{ bookable.description }}</article>
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-body">
          <review-list :bookable-id="this.$route.params.id"></review-list>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <availability
        :bookable-id="this.$route.params.id"
        @availability="checkPrice($event)"
        class="mb-4"
      ></availability>

      <transition name="fade">
        <price-breakdown
          v-if="price"
          :price="price"
          class="mb-4"
        ></price-breakdown>
      </transition>
      <transition name="fade">
        <button
          class="btn btn-outline-secondary btn-block"
          v-if="price"
          @click="addToBasket"
          :disabled="isExistBasket"
        >
          Book Now!
        </button>
      </transition>

      <button
        class="btn btn-outline-secondary btn-block"
        v-if="isExistBasket"
        @click="removeFromBasket"
      >
        Remove From Basket
      </button>

      <div v-if="isExistBasket" class="mt-4 text-muted warning">
        Seems like you've added this book to the basket
      </div>
    </div>
  </div>
</template>

<script>
import Availability from "./Availability.vue";
import ReviewList from "./ReviewList.vue";
import PriceBreakdown from "./PriceBreakdown.vue";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    Availability,
    ReviewList,
    PriceBreakdown,
  },
  data() {
    return {
      bookable: null,
      loading: false,
      price: null,
    };
  },
  created() {
    const id = this.$route.params.id;
    this.loading = true;

    const request = axios
      .get(`/api/bookable/${id}`)
      .then((response) => {
        this.bookable = response.data.data;

        this.loading = false;
      })
      .catch((err) => {
        console.log("ERR GET", err);
      });
  },
  methods: {
    async checkPrice(hasAvailability) {
      if (!hasAvailability) {
        this.price = null;
        return;
      }

      try {
        this.price = (
          await axios.get(
            `/api/bookables/${this.bookable.id}/price?from=${this.lastSearch.from}&to=${this.lastSearch.to}`
          )
        ).data.data;
      } catch (err) {
        this.price = null;
      }
    },
    addToBasket() {
      this.$store.dispatch("addToBasket", {
        bookable: this.bookable,
        price: this.price,
        dates: this.lastSearch,
      });
    },
    removeFromBasket() {
      this.$store.dispatch("removeFromBasket", this.bookable.id);
    },
  },
  computed: {
    ...mapState({
      lastSearch: "lastSearch",
    }),
    isExistBasket() {
      if (this.bookable == null) {
        return false;
      }

      return this.$store.getters.isExistBasket(this.bookable.id);
    },
  },
};
</script>

<style scoped>
.warning {
  font-size: 0.7rem;
}
</style>