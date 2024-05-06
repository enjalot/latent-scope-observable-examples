---
title: GitHub Issues & PRs
---

<style>
</style>

<h1>Latent Scope: Plot Issues & Pull Requests</h1>
<h2><a href="https://osf.io/mrghc/?view_only">Source data</a>. Generated with <a href="https://github.com/enjalot/latent-scope">Latent Scope</a></h2>


```js
Plot.plot({
        marks: [
          Plot.hull(hulls.flatMap(d => d), {
            x: "x",
            y: "y",
            z: "cluster",
            fill: "lightgray",
            fillOpacity: 0.1,
            stroke: "lightgray",
            curve: "catmull-rom",
          }),
          Plot.dot(da, {
            x: "x",
            y: "y",
            r: 2,
            fill: "cluster",
            title: d => `${d["type"]} ${d["state"]}
${d["title"]}]

${d["body"]}`,
            tip: true
          }),
        ],
        width: 500,
        height: 500,
        margin: 30,
        color: { scheme: "cool" },
        y: { axis: null},
        x: { axis: null },
      })
```


```js
const selcluster = view(Inputs.select(scope.cluster_labels_lookup, { value: d => d.cluster, format: x => x.cluster + ": " + x.label, label: "Cluster:"}))
```
<div>
  ${clusterCard(selcluster.cluster, {
    description: "", 
    plot: Plot.plot({
        marks: [
          Plot.barX(da, Plot.groupY({x: "count"}, {
            filter: d => d.cluster == selcluster.cluster,
            y: "type",
            x: "count",
            fill: "state",
            tip: true
          }))
        ],
        marginLeft: 80,
        marginBottom: 30,
        width: 300,
        height: 300,
        y: { label: null },
        x: { label: null },
        style: { "background-color": "white" }
      }),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>


```js
// ----------------------------------------------------------
```


```js
const tableConfig = { 
  columns: [
    "text",
    "state",
    "type",
  ],
  width: {
    "text": "60%"
  },
  sort: "state",
  reverse: true,
  rows: 15
}
```


```js
const map = view(canvas)
```

```js
const tip = tooltip({})
```

```js
let hp = da[map.hovered[0]]
 ```

```js
if(hp) {
  // display the tooltip
  // console.log("p, sel", p, selected)
  tip.show(hp, map, md.unsafe(`
  <i>Cluster ${hp["cluster"]}: ${hp["label"]}</i>
  <br/>
  <span>state: ${hp["state"]}
  <span>type: ${hp["type"]}
  <br/>
  ${hp["text"]}
  `))
} else {
  tip.hide()
}
```

```js
const canvas = document.createElement("canvas")
```

```js
let tableData = []
if(map.selected.length > 0) {
  // tableData = []
  map.selected.forEach(i => tableData.push(da[i]))
}
```

```js
// calculate the hull points
const hulls = scope.cluster_labels_lookup.map(c => {
  return c.hull.map(idx => da.find(d => d.index === idx))
})
```


```js
const db = DuckDBClient.of({
  scope: FileAttachment("data/plot-issues/scopes-001-input.parquet")
});
```

```js
const scope = FileAttachment("data/plot-issues/scopes-001.json").json()
```

```js
// const rows = db.sql`SELECT * FROM input`
const data = db.sql`SELECT * FROM scope`
```
```js
const da = data.toArray().map(d => d.toJSON())
```
```js
console.log("data!", da)
console.log("scope!", scope)
console.log("hulls!", hulls)
```

```js
import {scatter} from "./components/scatter.js";
import {hull} from "./components/hull.js";
import {tooltip} from "./components/tooltip.js";
import {clusterCard} from "./components/clusterCard.js";

import markdownit from "markdown-it";
// import matter from "npm:gray-matter";
```
```js
const Markdown = new markdownit({html: true});

const md = {
  unsafe(string) {
    const template = document.createElement("template");
    template.innerHTML = Markdown.render(string);
    return template.content.cloneNode(true);
  }
};
```

```js
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
```