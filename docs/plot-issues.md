---
title: GitHub Issues & PRs
---

<style>
</style>

<h1>Latent Scope: Plot Issues & Pull Requests</h1>
<h2><a href="https://osf.io/mrghc/?view_only">Source data</a>. Generated with <a href="https://github.com/enjalot/latent-scope">Latent Scope</a></h2>

<div style="border: 1px solid gray; position:relative; height: 500px;">
  <div>
      ${resize((width) => scatter(data.toArray(), { 
        canvas, 
        width, 
        height: 500, 
        pointSize: 5,
        color: (d) => d.cluster 
    }))}
  </div>
  <div style="position:absolute;top:0;pointer-events:none;">
      ${hull(hulls, { 
        width: map.width,
        height: map.height,
        xd: map.xd,
        yd: map.yd
      })
      }
  </div>
  <div style="position:absolute;top:0;pointer-events:none;">
      ${hp ? hull([hulls[hp.cluster]], { 
        fill: "rgba(20,20,20,0.25)",
        width: map.width,
        height: map.height,
        xd: map.xd,
        yd: map.yd
      }) : "" }
  </div>

  ${tip}

</div>

<div class="red">
${isMobileDevice ? "Warning: regl-scatter does not play well on mobile. Please keep scrolling to see the analysis. Interacting with the map should be done on a desktop." : ""}
</div>


<div>
  ${data.toArray().length} points. 
  ${map.selected.length} points selected. <i>${!map.selected.length ? "Hold shift + drag to select multiple points.":""}</i>
  <div style="display:inline-block">
    ${
        map.selected.length ? Inputs.button("Deselect", {
          value: null, 
          reduce: () => canvas.scatter.select([])
        }) : ""
    }
  </div>
</div>
<br/>
<div class="static-table">
  ${Inputs.table(tableData, { 
        columns: [
          "text",
          "state",
          "type",
        ],
        width: {
          "text": "40%"
        },
        rows: 15
      })}
</div>

```js
const selcluster = view(Inputs.select(scope.cluster_labels_lookup, { value: d => d.cluster, format: x => x.cluster + ": " + x.label, label: "Cluster:"}))
```
<div>
  ${clusterCard(selcluster.cluster, "", tableConfig, da, scope)}
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
  tip.show(hp, map, `
  <i>Cluster ${hp["cluster"]}: ${hp["label"]}</i>
  <br/>
  <span>state: ${hp["state"]}
  <span>type: ${hp["type"]}
  <br/>
  ${hp["text"]}
  `)
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
```

```js
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
```