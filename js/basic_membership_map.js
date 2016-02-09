var width = 800,
    height = 600,
    legendRectSize = 18,
    legendSpacing = 4;

var projection = d3.geo.mercator()
    .center([24, 52])
    .scale(500)
    .rotate([15, 0])
    .translate([width / 2, height / 2]);


var tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip")
    .style("opacity", 0);
    //.style("z-index", "10")
    //.style("visibility", "hidden")
    //.text("a simple tooltip");

var color = d3.scale.ordinal()
    .domain(["", "EEA/Other", "EU Non-SSM", "SSM"])
    .range(["#fff", "#c6dbef", "#6baed6", "#3182bd"]);

var path = d3.geo.path()
    .projection(projection);

var svgMap = d3.select("#basic_map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    //.on("mouseover", function(){return tooltip.style("visibility", "visible");})
    //.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    //.on("mouseout", function(){return tooltip.style("visibility", "hidden");});


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

        var subunits = topojson.feature(europe, europe.objects.subunits);

        // create a lookup object for adding banking union members data to each country
        var lookup = {};
        for (var i = 0, len = Membership.length; i < len; i++) {
          lookup[Membership[i].id] = Membership[i];
        };

        svgMap.append("path")
            .datum(subunits)
            .attr("d", path);

        svgMap.selectAll(".subunit")
            .data(topojson.feature(europe, europe.objects.subunits).features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) {
                return color(rateById[d.id]);
            })
            .on("mouseover", function(d) {
                console.log(lookup[d.id])
                tooltip.transition()
                  .duration(100)
                  .style("opacity", .9);
                tooltip.html(lookup[d.id].country)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY) + "px")
                  ;
              });
            
    });
});
