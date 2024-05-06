import { create } from 'npm:d3-selection'
import { scaleLinear } from 'npm:d3-scale'


export function tooltip({
} = {}) {
  const tooltip = create("div")
    .attr("class", "tooltip")

  function show(p, map, html) {
    if (html instanceof DocumentFragment) {
      tooltip.html("")
      tooltip.node().appendChild(html);
    } else {
      tooltip.html(html);
    }
    tooltip.style("display", "block")
    let x = scaleLinear().domain(map.xd).range([0, map.width])
    let y = scaleLinear().domain(map.yd).range([map.height, 0])
    tooltip.style("left", `${x(p.x) + 10}px`)
    tooltip.style("top", `${y(p.y)}px`)
  }
  function hide() {
    tooltip.style("display", "none")
  }

  return Object.assign(tooltip.node(), {
    show,
    hide
  })
}

