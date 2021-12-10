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
      <availability :bookable-id="this.$route.params.id"></availability>
    </div>
  </div>
</template>

<script>
import Availability from "./Availability.vue";
import ReviewList from "./ReviewList.vue";

export default {
  components: {
    Availability,
    ReviewList
  },
  data() {
    return {
      bookable: null,
      loading: false,
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
};
</script>