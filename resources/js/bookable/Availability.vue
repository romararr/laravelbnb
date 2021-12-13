<template>
  <div class="mt-3 mt-md-0">
    <h6 class="text-uppercase text-secondary font-weight-bolder">
      Check Availability
      <transition name="fade">
        <span v-if="noAvailability" class="text-danger">(NOT AVAILABLE)</span>
        <span v-if="hasAvailability" class="text-success">(AVAILABLE)</span>
      </transition>
    </h6>

    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="from">From</label>
        <input
          type="text"
          name="from"
          id="from"
          class="form-control form-control-sm"
          placeholder="Start Date"
          v-model="from"
          @keyup.enter="check"
          :class="[{ 'is-invalid': errorFor('from') }]"
        />
        <v-error :errors="errorFor('from')"></v-error>
      </div>
      <div class="form-group col-md-6">
        <label for="to">To</label>
        <input
          type="text"
          name="to"
          id="to"
          class="form-control form-control-sm"
          placeholder="End Date"
          v-model="to"
          @keyup.enter="check"
          :class="[{ 'is-invalid': errorFor('to') }]"
        />
        <v-error :errors="errorFor('to')"></v-error>
      </div>
    </div>

    <button
      class="btn btn-primary btn-block"
      @click="check"
      :disabled="loading"
    >
      <span v-if="!loading">Check!</span>
      <span v-if="loading">
        <i class="fas fa-circle-notch fa-spin"></i> Checking...
      </span>
    </button>
  </div>
</template>

<style scoped>
label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: gray;
  font-weight: bolder;
}
</style>

<script>
import { is422, is404 } from "../shared/utils/response";
import validateError from "../shared/mixins/error";

export default {
  mixins: [validateError],
  props: {
    bookableId: [String, Number],
  },
  data() {
    return {
      from: this.$store.state.lastSearch.from,
      to: this.$store.state.lastSearch.to,
      loading: false,
      status: null,
    };
  },
  methods: {
    async check() {
      this.loading = true;
      this.errors = null;

      this.$store.dispatch("setLastSearch", {
        from: this.from,
        to: this.to,
      });

      try {
        this.status = (
          await axios.get(
            `/api/bookables/${this.bookableId}/availability?from=${this.from}&to=${this.to}`
          )
        ).status;

        this.$emit("availability", this.hasAvailability);
      } catch (err) {
        if (is422(err)) {
          this.errors = err.response.data.errors;
        }

        this.status = err.response.status;
        this.$emit("availability", this.hasAvailability);
      }

      this.loading = false;
    },
  },
  computed: {
    hasError() {
      return 422 == this.status && this.errors != null;
    },
    hasAvailability() {
      return 200 == this.status;
    },
    noAvailability() {
      return 404 == this.status;
    },
  },
};
</script>