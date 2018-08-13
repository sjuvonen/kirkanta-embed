import Vue from "vue";
import Router from "vue-router";
import LibraryList from "./components/LibraryList.vue";
import LibraryInfo from "./components/LibraryInfo.vue";

import routerConfig from "./init.router";

Vue.use(Router);

class Search extends Vue {
  constructor(container, params) {
    let search = {
      q: params.q,
      id: params.library,
      city: params.city,
      consortium: params.consortium,
      type: params.type,
      branch_type: params.branch_type,
    };

    let router = new Router(Object.assign(routerConfig, {
      routes: [
        {
          path: "/",
          name: "search",
          component: LibraryList,
          props: (route) => ({
            form: search,
            lang: params.lang,
          })
        },
        {
          path: "/:library",
          name: "library",
          component: LibraryInfo,
          props: (route) => ({
            library: route.params.library,
            lang: params.lang,
            tabbed: params.tabbed,
            embedded: true,
          }),
          children: [
            {
              path: "contact",
              name: "contact",
            },
            {
              path: "services",
              name: "services",
            }
          ]
        },
      ]
    }));

    super({
      el: container,
      template: '<router-view @return-to-main="returnToSearch"/>',
      router,
      methods: {
        returnToSearch() {
          this.$router.push({name: "search"});
        }
      }
    });

    // router.push({name: "library", params: {id: 84787, lang: "fi"}});
  }
}

window["kirjastot.fi.search"] = Search;
