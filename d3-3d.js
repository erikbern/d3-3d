function rot(as) {
    var m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    for (var i = 0; i < 3; i++) {
	var j = (i+1)%3, k = (i+2)%3;
	var c = Math.cos(as[i]), s = Math.sin(as[i]);
	var n = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	n[i][i] = 1;
	n[j][j] = c;
	n[j][k] = -s;
	n[k][j] = s;
	n[k][k] = c;
	var o = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	for (var p = 0; p < 3; p++)
	    for (var q = 0; q < 3; q++)
		for (var r = 0; r < 3; r++)
		    o[p][r] += m[p][q] * n[q][r];
	m = o;
    }
    return m;
}

var a = 0, b = 0, c = 0;
var points = [];
var xyz = [];

function render() {
    // console.log('render!');
    a += 0.001;
    b += 0.002;
    c += 0.003;

    m = rot([a, b, c]);

    for (var i = 0; i < points.length; i++) {
	var corners = [];
	for (var j = 0; j < 8; j++) {
	    var p = (j>>2), q = (j>>1)&1, r = j&1;
	    p = p*0.1; q = q*0.1; r = r*0.1;
	    var x = m[0][0] * (xyz[i][0]+p) + m[0][1] * (xyz[i][1]+q) + m[0][2] * (xyz[i][2]+r);
	    var y = m[1][0] * (xyz[i][0]+p) + m[1][1] * (xyz[i][1]+q) + m[1][2] * (xyz[i][2]+r);
	    var z = m[2][0] * (xyz[i][0]+p) + m[2][1] * (xyz[i][1]+q) + m[2][2] * (xyz[i][2]+r);
	    var depth = 1.0;
	    x *= depth / (z + depth);
	    y *= depth / (z + depth);
	    corners.push([(x + 0.5) * 1000, (y + 0.5) * 1000]);
	}
	hull = d3.geom.hull(corners);

	points[i].datum(hull).attr("d", function(d) { return "M" + d.join("L") + "Z"; });
    }
}

function do3d(elmId) {
    // Make an SVG Container
    var svgContainer = d3.select("body").append("svg")
	.attr("width", 10000)
	.attr("height", 10000);


    for (var i = 0; i < 100; i++) {
	var p = svgContainer.append('path').attr('fill', 'black').attr('stroke-width', '1px');
	points.push(p);
	xyz.push([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
    }

    setInterval(render, 3);
}
