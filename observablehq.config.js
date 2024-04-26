// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Latent Scope",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Guides",
      pages: [
        {name: "Install & Configure", path: "/install-and-config"},
        {name: "Your First Scope", path: "/your-first-scope"},
        {name: "Exporting data", path: "/exporting-data"},
        // {name: "Cluster Sculpting", path: "/cluster-sculpting"},
      ]
    },
    { 
      name: "Example Analysis", pages: [
        {name: "GitHub Issues & PRs", path: "/plot-issues"},
        {name: "US Federal Laws", path: "/us-federal-laws"},
      ]
    }
  ],

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
  // search: true, // activate search
};
