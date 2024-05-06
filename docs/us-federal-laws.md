---
toc: false
---


# 50k U.S. Federal Laws 
[Source data](https://osf.io/mrghc/?view_only) from [Data is Plural 2024.02.28 edition](https://www.data-is-plural.com/archive/2024-02-28-edition/)

<div>
${isMobileDevice ? Plot.plot({
        marks: [
          Plot.hull(hulls.flatMap(d => d), {
            x: "x",
            y: "y",
            z: "cluster",
            fill: "cluster",
            fillOpacity: 0.5,
            stroke: "lightgray",
            curve: "catmull-rom",
          }),
        ],
        width: 500,
        height: 500,
        margin: 20,
        color: { scheme: "cool" },
        y: { axis: null},
        x: { axis: null },
      })
      :  "" }

<div>
<div class="regl-container" style="border: 1px solid gray; position:relative; height: 500px;"">
  <div>
      ${resize((width) => scatter(data.toArray(), { 
        canvas, 
        width, 
        height: 500, 
        pointSize: 2,
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
          "Title",
          "date_of_passage",
          "label",
        ],
        sort: "date_of_passage",
        width: {
          "Title": "80%"
        },
        rows: 15
      })}
</div>
</div>

My favorite clusters

<div>
  ${clusterCard(10, {
    description: "Poor Sally McGee! And why was the pleasure-yacht named 'Fearless' in the first place? If you had a typo in your boat name in 1872 you had to get Congress to help you fix it: 'To change the name of the schooner La Pette to La Petite.'", 
    plot: dateBars(10),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>

<div>
  ${clusterCard(59, {
    description: "", 
    plot: dateBars(10),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>

Most boring cluster
<div>
  ${clusterCard(15, {
    description: "", 
    plot: dateBars(15),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>



```js
const selcluster = view(Inputs.select(scope.cluster_labels_lookup, { value: d => d.cluster, format: x => x.cluster + ": " + x.label, label: "Cluster:"}))
```
<div>
  ${clusterCard(selcluster.cluster, {
    description: "", 
    plot: dateBars(selcluster.cluster),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>



```js
const bridgeClusters = [72, 73, 74, 75, 76, 77, 79, 80,81, 83, 85, 88, 89, 90, 91, 92, 93, 97, 98]
```
<div>
${clusterListCard(bridgeClusters, {
    heading: "Bridge Building",
    plot: dateBars(bridgeClusters),
    tableConfig, 
    da, 
    scope, 
    hulls 
})}
</div>

```js
const dcClusters = [123, 106, 107, 109, 110, 111, 112, 114, 116, 118, 119]
```
<div>
${clusterListCard(dcClusters, {
    heading: "Washington D.C.",
    plot: dateBars(dcClusters),
    tableConfig, 
    da, 
    scope, 
    hulls 
})}
</div>

```js
const naClusters = [105, 127, 141, 146,  178, 183, 190, 204, 205, 210, 211]
```
<div>
${clusterListCard(naClusters, {
    heading: "Native American",
    plot: dateBars(naClusters),
    tableConfig, 
    da, 
    scope, 
    hulls 
})}
</div>



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
  <span>${hp["date_of_passage"]}
  <br/>
  ${hp["Title"]}
  `))
} else {
  tip.hide()
}
```

```js
const tableConfig = { 
  columns: [
    "Title",
    "date_of_passage",
  ],
  width: {
    "Title": "80%"
  },
  sort: "date_of_passage",
  reverse: false,
  rows: 15
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
function dateBars(cluster) {
  let filter = d => d.cluster == cluster
  if (Array.isArray(cluster)) {
    filter = d => cluster.indexOf(d.cluster) >= 0
  }
  return Plot.plot({
    marks: [
      Plot.barX(da, Plot.binY({x: "count"}, {
        filter,
        y: d => new Date(d["date_of_passage"]).getFullYear(),
        x: "count",
      }))
    ],
    marginLeft: 80,
    marginBottom: 30,
    width: 300,
    height: 300,
    y: { label: null, tickFormat: x => Math.floor(x).toString() },
    x: { label: null },
    style: { "background-color": "white" }
  })
}
```


```js
const db = DuckDBClient.of({
  scope: FileAttachment("data/us-federal-laws/scopes-001-input.parquet")
});
```

```js
const scope = FileAttachment("data/us-federal-laws/scopes-001.json").json()
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
import {clusterListCard} from "./components/clusterListCard.js";

import markdownit from "markdown-it";
import { select } from 'npm:d3-selection';
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
```js
if(isMobileDevice) {
  select(".regl-container").style("display", "none")
}
```