<template>
  <div class="d-flex text-warning">
    <i
      class="fas fa-star"
      v-for="star in fullStar"
      :key="'full' + star"
      @click="$emit('input', star)"
    ></i>
    <i class="fas fa-star-half-alt" v-if="halfStar"></i>
    <i
      class="far fa-star"
      v-for="star in emptyStar"
      :key="'empty' + star"
      @click="$emit('input', fullStar + star)"
    ></i>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
  },
  computed: {
    halfStar() {
      const fraction = Math.round(
        (this.value - Math.floor(this.value)) * 100
      );

      return fraction > 0 && fraction < 50;
    },
    fullStar() {
      // >= 4.5 == 5 star
      // < 4.5 == 4 and a half star
      return Math.round(this.value);
    },
    emptyStar() {
      return 5 - Math.ceil(this.value);
    },
  },
  created() {},
};
</script>

<style scoped>
i {
  cursor: pointer;
}
</style>