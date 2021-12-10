<template>
  <div>
    <div v-if="loading">Loading data...</div>
    <div v-else>
      <div class="row mb-3" v-for="row in rows" :key="'row' + row">
        <div
          class="col d-flex align-items-stretch"
          v-for="(item, column) in itemInRow(row)"
          :key="'item' + column"
        >
          <bookable-list-item v-bind="item"></bookable-list-item>
        </div>
        <div
          class="col"
          v-for="p in placeholderInRow(row)"
          :key="'placeholder' + p"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import BookableListItem from "./BookableListItem";

export default {
  components: {
    BookableListItem,
  },
  data() {
    return {
      bookables: null,
      loading: false,
      columns: 3,
    };
  },

  computed: {
    rows() {
      return this.bookables == null
        ? 0
        : Math.ceil(this.bookables.length / this.columns);
    },
  },

  methods: {
    itemInRow(row) {
      return this.bookables.slice((row - 1) * this.columns, row * this.columns);
    },

    placeholderInRow(row) {
      return this.columns - this.itemInRow(row).length;
    },
  },

  created() {
    this.loading = true;

    const p = new Promise((resolve, reject) => {});

    const request = axios
      .get("/api/bookable")
      .then((response) => {
        this.bookables = response.data.data;
        this.loading = false;
      })
      .catch((err) => {
        console.log("ERR GET", err);
      });
  },
};
</script>