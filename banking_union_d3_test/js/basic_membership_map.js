var width = 800,
    height = 600,
    legendRectSize = 18,
    legendSpacing = 4;

var projection = d3.geo.mercator()
    .center([24, 52])
    .scale(700)
    .rotate([15, 0])
    .translate([width / 2, height / 2]);

var color = d3.scale.ordinal()
    .domain(["", "EEA/Other", "EU Non-SSM", "SSM"])
    .range(["#fff", "#c6dbef", "#6baed6", "#3182bd"]);

var path = d3.geo.path()
    .projection(projection);

var svgMap = d3.select("#basic_map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var legend = d3.select('svg')
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize;
        var x = 0;
        var y = i * height;
        return 'translate(' + x + ',' + (y + 500) + ')';
    });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });

d3.json("json/europeClean.json", function(error, europe) {
    d3.csv("csv/BankingUnionMembers.csv", function(error, Membership) {
        var rateById = {};
        Membership.forEach(function(d) {
            rateById[d.id] = d.membership;
        });

        var subunits = topojson.feature(europe,                               europe.objects.subunits);

        svgMap.append("path")
            .datum(subunits)
            .attr("d", path);

        svgMap.selectAll(".subunit")
            .data(topojson.feature(europe, europe.objects.subunits).features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) {
                return color(rateById[d.id]);
            });
    });
});
