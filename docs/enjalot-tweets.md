---
title: enjalot's tweets
---

<style>
</style>

# enjalot's tweets
## Looking in the mirror of 10,000 tweets

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
            r: 1,
            fill: "cluster",
            title: d => `${d["cluster"]}: ${d["label"]} 
${d["type"]} ${d["created_at"]}

${d["full_text"]}`,
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
    plot: barPlot(selcluster.cluster, { field: "year"}),
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
    "full_text",
    "created_at",
    "type",
  ],
  width: {
    "full_text": "60%"
  },
  sort: "created_at",
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
function barPlot(cluster, {
  field = "type",
  width = 300,
  height = 300,
} = {}) {
  return Plot.plot({
        marks: [
          Plot.barX(da, Plot.groupY({x: "count"}, {
            filter: d => d.cluster == cluster,
            y: field,
            x: "count",
            // fill: "state",
            tip: true,
            // order: ["open", "closed"]
          }))
        ],
        marginLeft: 80,
        marginBottom: 30,
        width,
        height,
        y: { label: null, tickFormat: x => x.toString() },
        x: { label: null, grid: true },
        style: { "background-color": "#f0f0f0" }
      })
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
  scope: FileAttachment("data/enjalot-tweets/scopes-001-input.parquet")
});
```

```js
const scope = FileAttachment("data/enjalot-tweets/scopes-001.json").json()
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