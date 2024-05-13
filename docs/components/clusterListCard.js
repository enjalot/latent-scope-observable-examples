import {html} from "npm:htl";
import * as Inputs from "npm:@observablehq/inputs";
import * as Plot from "npm:@observablehq/plot";

// cluster is the cluster index
export function clusterListCard(clusters, {
  heading,
  description, 
  plot,
  tableConfig, 
  da, 
  scope,
  hulls,
}) {
  const cda = da.filter(d => clusters.indexOf(d.cluster) >= 0)
  const cos = clusters.map(c => scope.cluster_labels_lookup[c])
  return html`<div class="cluster-card grid grid-cols-1">
  <div class="card">
    <h2>${heading}</h2>
    <h3>${cda.length} rows</h3>
    <div class="cluster-content grid grid-cols-3">
      <div class="cluster-plot">
      ${
        Plot.plot({
        marks: [
          Plot.hull(hulls.flatMap(d => d), {
            x: "x",
            y: "y",
            z: "cluster",
            // fill: "cluster",
            fill: "lightgray",
            fillOpacity: 0.1,
            stroke: "lightgray",
            curve: "catmull-rom",
          }),
          Plot.hull(hulls.flatMap(d => d), {
            filter: d => clusters.indexOf(d.cluster) >= 0,
            x: "x",
            y: "y",
            z: "cluster",
            // fill: "cluster",
            fill: "orange",
            fillOpacity: 0.25,
            // stroke: "cluster",
            stroke: "orange",
            curve: "catmull-rom",
          }),
        ],
        width: 300,
        height: 300,
        color: { scheme: "cool" },
        y: { axis: null},
        x: { axis: null },
        tip: {
          format: {
            cluster: true,
            title: true
          }
        }
      })
      }
      </div>
      <div class="cluster-description">
        ${cos.map(c => html`${c.cluster}: ${c.label}<br>`)}
      </div>
      <div class="cluster-diagram">
        ${plot}
      </div>
    </div>
    <div class="static-table">
      ${Inputs.table(cda, tableConfig)}
    </div>
</div>`
}

