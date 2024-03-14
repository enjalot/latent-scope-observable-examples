---
title: Plot Issues & PRs
---

<style>
</style>

<h1>Latent Scope: Plot Issues & Pull Requests</h1>
<h2><a href="https://osf.io/mrghc/?view_only">Source data</a>. Generated with <a href="https://github.com/enjalot/latent-scope">Latent Scope</a></h2>

<div style="border: 1px solid gray;">
  ${resize((width) => scatter(data.toArray(), { 
    canvas, 
    width, 
    height: 500, 
    color: (d) => d.cluster 
    //color: (d) => d.raw_cluster
  }))}
</div>

<div>
  ${data.toArray().length} points. 
  ${display(selected.length)} points ${selected.length == 1 ? "hovered" : "selected"}. ${!selected.length ? "Hold shift + drag to select multiple points.":""}
  <div style="display:inline-block">
    ${
        selected.length > 1 ? Inputs.button("Deselect", {
          value: null, 
          reduce: () => canvas.scatter.select([])
        }) : ""
    }
  </div>
  ${selected.length == 1 ? Inputs.table([tableData[selected[0]]], { 
      columns: [
        "title", "body",
        "state",
        "created_at",
        "closed_at",
        "label", 
        "cluster"
      ],
      width: {
        "title": 250,
        "state": 40,
        "label": 250,
        "cluster": 40
      },
      rows: 1 
    }) : htl.html`<div style="height:43px"></div>`
  }
  
</div>

<div>
${table}
</div>


```js
const selected = view(canvas)
```

```js
// TODO: this recreates the canvas
const canvas = document.createElement("canvas")
canvas.value = []
```

```js
const table = Inputs.table(tableData, { 
      columns: [
        "title", "body",
        "state",
        "created_at",
        "closed_at",
        "label", 
        "cluster"
      ],
      width: {
        "title": 250,
        "state": 40,
        "label": 250,
        "cluster": 40
      },
      rows: 25
    })
```

```js
const chosen = view(table)
```
```js
// indices of the rows selected from the table so we can highlight them on the map
let indices = []
if(!selected.length && (chosen.length < tableData.length)) {
  indices = chosen.map(c => tableData.indexOf(c))
}
```

```js
// highlight and zoom to points chosen on the table
if(indices.length && canvas.scatter) {
  canvas.scatter.select(indices, { preventEvent: true })
  // canvas.scatter.zoomToPoints(indices, { padding: 0.1  })
} else {
  // can't undo it because this updates everytime scatter zooms for some reason
  // canvas.scatter.zoomToOrigin()
}
```

```js
let tableData = data.toArray()
if(selected.length > 1) {
  tableData = []
  const da = data.toArray()
  selected.forEach(i => tableData.push(da[i]))
}
```

```js
import * as duckdb from "npm:@duckdb/duckdb-wasm";
```
```js
const db = DuckDBClient.of({
  input: FileAttachment("data/plot-issues/input.parquet"),
  scope: FileAttachment("data/plot-issues/scopes-001.parquet")
});
```


```js
// const rows = db.sql`SELECT * FROM input`
// const scope = db.sql`SELECT * FROM scope`
const data = db.sql`
  WITH input_with_row_number AS (
    SELECT *, ROW_NUMBER() OVER () AS rn FROM input
  ),
  scope_with_row_number AS (
    SELECT *, ROW_NUMBER() OVER () AS rn FROM scope
  )
  SELECT input_with_row_number.*, scope_with_row_number.*
  FROM input_with_row_number
  JOIN scope_with_row_number ON input_with_row_number.rn = scope_with_row_number.rn
`
```

```js
import {scatter} from "./components/scatter.js";
```

