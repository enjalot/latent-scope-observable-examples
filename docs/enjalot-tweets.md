---
title: enjalot's tweets
---

# enjalot's tweets
## Looking in the mirror of ${max(da, d => d.year) - min(da, d => d.year)} years and 10,965 tweets.

Oh god this could get embarrassing. 
The problem with powerful visualization tools is that they will show you things whether you wanted to see them or not. 
For most of my career I've used Twitter mainly in a professional capacity, but as we will see my younger self was sometimes a bit flippant.

Social media is of course a place where we run into unmanageable amounts of unstructured text data. 
As we've seen in the [Datavis Survey](datavis-survey) and [GitHub Issues](plot-issues) analyses, we can use Latent Scope to pull some structure out of the text and combine it with whatever interesting metadata we already have.

I don't expect you to care, let alone read, all of my tweets, so this time we'll jump straight into the map and start exploring clusters. 
Hopefully displaying my shame will serve as an example of the kinds of insights one might gain from clustering and visualizing their own textual data.

If you still want to analyze your own tweets by the end of this, you can follow the instructions in [this notebook](https://observablehq.com/@observablehq/save-and-analyze-your-twitter-archive) to download and then process your tweets into a format that matches this analysis.

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

Each of the dots in the above map is a tweet, and all those tweets went through the 4 step process in Latent scope:  
1. Embed - run each piece of text through an embedding model
2. Project - run the high-dimensional embeddings through UMAP
3. Cluster - run the 2-dimensional UMAP coordinates through HDBSCAN
4. Label - ask an LLM to create a label by summarizing a list of text taken from each cluster

So at the end of this process we have ${clusterTableData.length} clusters carving up our ${da.length} tweets. 
Every row of our input data is annotated with a cluster index and label:


<div class="card">
${Inputs.table(da, {...tableConfig, columns: [
    "cluster",
    "label",
    "full_text",
    "favorite_count",
    "retweet_count",
    "tweet_id"
  ],
  width: {
    ...tableConfig.width,
    full_text: "40%",
    tweet_id: 70,
    cluster: 50,
    label: 200
  }
})}
</div>

${clusterTableData.length} clusters is better than 10,000 but it's still quite a lot. 
Let's use some common metrics to explore our clusters, namely likes and rewteets.

_Click on the radio button on the left of each cluster to select it and see the details in the card below_

```js
const clusterTableData = scope.cluster_labels_lookup.map(c => {
  let dc = da.filter(d => d.cluster == c.cluster)
  return {
    cluster: c.cluster,
    label: c.label,
    count: dc.length,
    favorites: sum(dc, d => d.favorite_count),
    retweets: sum(dc, d => d.retweet_count),
    min_date: min(dc, d => d.created_at),
    max_date: max(dc, d => d.created_at),
  }
})
const selclusterTable = view(Inputs.table(clusterTableData, {
  format: {
    "favorites": sparkbar(max(clusterTableData, d => d.favorites), "lightblue"),
    "retweets": sparkbar(max(clusterTableData, d => d.retweets), "orange"),
  },
  width: {
    "cluster": 50,
    "label": "20%"
  },
  sort: "favorites",
  reverse: true,
  multiple: false,
  value: clusterTableData[62]
}))
```

<div>
  ${clusterCard(selclusterTable.cluster, {
    description: "", 
    plot: barPlot(selclusterTable.cluster),
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
    "favorite_count",
    "retweet_count",
    "tweet_id",
  ],
  header: {
    "tweet_id": "link"
  },
  format: {
    "tweet_id": x => htl.html`<a target=_blank href="https://twitter.com/i/web/status/${x}">tweet</a>`
  },
  width: {
    "full_text": "60%",
    "favorite_count": 50,
    "retweet_count": 50,
    "tweet_id": 60
  },
  sort: "favorite_count",
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
function sparkbar(max, color) {
  return x => htl.html`<div style="
    background: ${color};
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en")}`
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
const data = db.sql`SELECT *,id::string AS tweet_id FROM scope`
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
import { min, max, sum } from "npm:d3-array"
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