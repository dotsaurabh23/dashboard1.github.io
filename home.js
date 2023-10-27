const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width1 = 400 - margin.left - margin.right;
const height1 = 300 - margin.top - margin.bottom;

// Create SVG container
const svg2 = d3
  .select("#chart")
  .append("svg")
  .attr("width", width1 + margin.left + margin.right)
  .attr("height", height1 + margin.top + margin.bottom);

// Load CSV data and create the bar chart
d3.csv("data.csv").then((data) => {
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.Month))
    // .domain(data.map(d => d.Indent_No))
    .range([margin.left, width1 + margin.left])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.value)])
    // .domain([0, d3.max(data, d => +d.Company_Name)])
    .nice()
    .range([height1 + margin.top, margin.top]);

  svg2
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.Month))
    .attr("y", (d) => y(+d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height1 + margin.top - y(+d.value))
    .attr("fill", "#f9b234"); // You can change the fill color here

  // Create x-axis
  svg2
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height1 + margin.top})`)
    .call(d3.axisBottom(x));

  // Create y-axis
  svg2
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y));
});

// Create SVG container
const svg3 = d3
  .select("#chart1")
  .append("svg")
  .attr("width", width1 + margin.left + margin.right)
  .attr("height", height1 + margin.top + margin.bottom);

// Load CSV data and create the bar chart
d3.csv("data.csv").then((data) => {
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.Month))
    // .domain(data.map(d => d.Indent_No))
    .range([margin.left, width1 + margin.left])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.value)])
    // .domain([0, d3.max(data, d => +d.Company_Name)])
    .nice()
    .range([height1 + margin.top, margin.top]);

  svg1
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.Month))
    .attr("y", (d) => y(+d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height1 + margin.top - y(+d.value))
    .attr("fill", "#3ecd5e"); // You can change the fill color here

  // Create x-axis
  svg1
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height1 + margin.top})`)
    .call(d3.axisBottom(x));

  // Create y-axis
  svg1
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y));
});

// pie chart
var svg = d3.select("#chart2")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = 450,
    height = 250,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
	// .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); // color change from here

function randomData (){
	var labels = color.domain();
	return labels.map(function(label){
		return { label: label, value: Math.random() }
	});
}

change(randomData());

d3.csv("data.csv", function(data) {
      data.forEach(function(d) { 
        d.value = +d.value;
      });
      change(data);
    });

function change(data) {
	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice		
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};			
		});
	
	polyline.exit()
		.remove();
};

