<template>
  <div class="zxc zxc-library-list" data-busy>
    <div class="header">
      <h1>{{ $t("Library search") }}</h1>

      <form @submit="onSubmit">
        <input type="hidden" name="id" :value="form.library"/>
        <input type="hidden" name="city" :value="form.city"/>
        <input type="hidden" name="type" :value="form.type"/>
        <input type="hidden" name="branch_type" :value="form.branch_type"/>

        <div class="input-group">
          <input type="search" class="form-control form-control-lg" name="q" :placeholder="$t('Search by name or municipality') " v-model="form.q"/>
          <div class="input-group-append">
            <div class="throbber"></div>
            <button type="submit" class="btn btn-primary">
              <font-awesome-icon :icon="faSearch"/>
            </button>
          </div>
        </div>
      </form>
    </div>

    <ol v-if="result.length" class="list-unstyled row">
      <li v-for="library of result" class="col-md-2">
        <div class="library-card">
          <div class="icon">
            <img v-if="library.cover" :src="library.cover.files.small" alt=""/>
          </div>
          <div class="info">
            <a :href="`${$t('base_url')}/${library.slug}`" @click="onClickLibrary" :data-id="library.id">{{ library.name }}</a>
            <p v-if="library.address">
              {{ library.address.street }},
              {{ library.address.area || library.address.city }}
            </p>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
  import Library from "../entity/library";
  import Collection from "../utils/collection";
  import apiCall from "../utils/api-call";

  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";

  export default {
    props: ["lang", "form"],
    components: { FontAwesomeIcon },
    data: () => ({
      result: [],
      faSearch
    }),
    computed: {
      busy: {
        get: function() {
          return this.$el.hasAttribute("data-busy");
        },
        set: function(state) {
          if (this.$el) {
            if (state) {
              this.$el.setAttribute("data-busy", "");
            } else {
              this.$el.removeAttribute("data-busy");
            }
          }
        }
      }
    },
    mounted(...foo) {
      this.submit();
    },
    methods: {
      onSubmit: function(event) {
        event.preventDefault();
        this.submit();
      },
      onClickLibrary: function(event) {
        event.preventDefault();
        this.$router.push({name: "library", params: {id: event.target.dataset.id}});
      },
      submit: async function() {
        this.busy = true;

        let query = {
          sort: "name",
          with: "pictures schedules",
          "period.start": "0d",
          "period.end": "1d",
        };

        Object.assign(query, this.form);

        let response = await apiCall("/library", this.lang, query);

        this.result = [...new Collection(Library, response.data.items)];
        this.busy = false;
      }
    },
  };
</script>

<style lang="scss">
  @import "../../scss/variables";

  .zxc-library-list {
    // Negative margins cause the iframe sandbox to show a scroll bar.
    overflow-x: hidden;

    input[type="search"] {
      flex-grow: 1;
    }

    .throbber {
      width: 2rem;
      background-color: blue;
      margin-left: -2rem - spacing(2);
      margin-right: spacing(2);
      display: none;
    }

    .search-results {
      margin-left: -1 * spacing(1);
      margin-right: -1 * spacing(1);
    }

    .library-card {
      height: 4rem;
      border: 1px solid #ccc;
      display: flex;
      overflow: hidden;
      // margin: spacing(1);
      margin-bottom: $grid-gutter-width / 2;

      .icon {
        width: 100px;
        flex: 0 0 100px;
        background-color: #eee;
        flex-direction: column;
        display: flex;
        overflow: hidden;

        .icon-bg {
        }

        img {
          width: calc(100% + 40px);
          height: auto;
        }
      }

      .info {
        padding-left: spacing(2);
        padding-right: spacing(2);
        flex: 1 0 100%;

        a {
          // font-size: larger;
          line-height: 2.5;
        }
      }
    }
  }

  .zxc-library-list[data-busy] {
    .throbber {
      display: unset;
    }
  }
</style>
