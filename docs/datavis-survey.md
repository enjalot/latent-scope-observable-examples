---
title: Datavis Survey Analysis
---

<h1>Survey Analysis Example</h1>
<!-- <h2><a href="https://gist.github.com/curran/003cca0643e9947162359268821415f5">Source data</a>. Generated with <a href="https://github.com/enjalot/latent-scope">Latent Scope</a></h2> -->

A common source of valuable unstructured text data is the free response questions often asked in surveys. This data is of course difficult to work with, as typical techniques for finding insights in surveys focus on structured data like the answers to multiple choice questions.

The data used to setup [your first scope](your-first-scope) is in fact the 765 responses to the question:
_"What do you think people you work with just don't get about the data visualization work that you do?"_

Let's take a look at how Latent Scope can help us pull out some insight from those responses by examining the clusters it's identified. Note that this page is using the exported scope from the [your first scope](your-first-scope) guide, and much of this analysis could be done within the tool.

Before we get to the fun visualizations, let's take a look at the input data. The data is an extract of the [full survey](https://gist.github.com/curran/003cca0643e9947162359268821415f5), where the answer to the question is stored in `DataVizNotUnderstood`, and we also have multiple-choice answer of the respondant's `Role` along with how many years of data visualization experience they have in `YearsDataVizExperience`:

<div class="static-table">
  ${Inputs.table(da, { 
        columns: [
          "DataVizNotUnderstood",
          "Role",
          "YearsDataVizExperience",
        ],
        width: {
          "DataVizNotUnderstood": "50%",
          "YearsDataVizExperience": "100px"
        },
        rows:10 
      })}
</div>

As you can see, it's not very straightforward to pick out patterns just by scrolling through the text, so let's take a look at what Latent Scope gave us:


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
          "DataVizNotUnderstood",
          "Role",
          "YearsDataVizExperience",
          "label", 
        ],
        width: {
          "DataVizNotUnderstood": "40%",
        },
        rows: 15
      })}
</div>

The map is created by going through the 4 step process in Latent scope:  
1. Embed - run each piece of text through an embedding model
2. Project - run the high-dimensional embeddings through UMAP
3. Cluster - run the 2-dimensional UMAP coordinates through HDBSCAN
4. Label - ask an LLM to create a label by summarizing a list of text taken from each cluster

What the process gives us is a workable categorization of the text data based on the patterns captured by the embedding model and the labeling of the LLM.
Of course these automated steps are never perfect, so Latent Scope is designed to both let you tweak the parameters of each step as well as manually re-categorize data once the process is finished. For more details see the [explore and curate guide](explore-and-curate).

Let's take a closer look at some of the clusters we got, starting with my favorite (because it's so true!) 
<div>
  ${clusterCard(27, "These responses confirm a long-standing belief I've personally held: that cleaning and preparing data is a huge part of data visualization work. This principle is part of the motivation for building Latent Scope, a robust process for adding structure to data so it becomes possible to visualize!", da, scope)}
</div>

As I mentioned, the process isn't perfect, and here we see a cluster that could have easily been combined with Cluster 27:

<div>
  ${clusterCard(28, "These responses all seem like they would fit just as well in cluster 27.", da, scope)}
</div>

In fact, I did use the explore tool to combine a couple of clusters into this one:

<div>
  ${clusterCard(3, "Data viz takes time!", da, scope)}
</div>

And we can see that how much time it takes to make data visualizations is a common response, there is this other large cluster:
<div>
  ${clusterCard(14, "Notice the conspicious lack of the word 'viz' in these responses. Otherwise they would fit well in Cluster 3.", da, scope)}
</div>

As you can see, the embeddings (and UMAP, and clustering) may separate text based on different concepts. The last two clusters are conceptually very similar with the main difference being that most people used the word "viz" in one cluster and not in the other. I find it quite amazing that this level of separation is possible, but it may sometimes not be what you want to separate.

The theme of time and effort is expressed further in other clusters:
<div>
  ${clusterCard(20, "Again, these responses could be reasonably combined with Cluster 3 or 14, but as the label implies there is the added idea of complexity, details and intention added to many responses.", da, scope)}
</div>
<div>
  ${clusterCard(21, "Here is more time, but now we also have a lot more 'effort' mixed in.", da, scope)}
</div>
<div>
  ${clusterCard(11, "Speaking of effort, these responses are all about effort and don't mention time explicitly.", da, scope)}
</div>

Whew! Data visualization certainly takes a lot of time and effort! There are many more clusters to explore (${scope.cluster_labels_lookup.length} in fact), instead of listing them all out let's end with a little interactive choice:
```js
const selcluster = view(Inputs.select(scope.cluster_labels_lookup, { value: d => d.cluster, format: x => x.cluster + ": " + x.label, label: "Cluster:"}))
```
<div>
  ${clusterCard(selcluster.cluster, "", da, scope)}
</div>

What are you waiting for? Try [Latent Scope](https://github.com/enjalot/latent-scope) out on your own data!

```js
// -------------------------------------------------
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
  <span>Role: ${hp["Role"]}
  <br/>
  ${hp["DataVizNotUnderstood"]}
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
  scope: FileAttachment("data/datavis-survey/scopes-001-input.parquet")
});
```

```js
const scope = FileAttachment("data/datavis-survey/scopes-001.json").json()
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