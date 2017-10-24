function draw(mouse=[0,0]) {
    var canvas = document.getElementById("canvas");

    let w = 800;
    let h = 600;

    canvas.width = w*2;
    canvas.height = h*2;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    var ctx = canvas.getContext("2d");
    ctx.scale(2,2);

    var width = canvas.width/2;
    var height = canvas.height/2;

    var range_neuron_size = document.getElementById("neuron_size");
    var range_input = document.getElementById("in");
    var range_hidden = document.getElementById("hidden");
    var range_output = document.getElementById("out");
    var range_layers = document.getElementById("layers");

    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    ctx.fillRect(0, 0, width, height);

    //ctx.beginPath();
    //ctx.rect(2, 2, width-4, height-4);
    //ctx.stroke();

    var neuron_size = Number(range_neuron_size.value);
    var input = Number(range_input.value);
    var hidden = Number(range_hidden.value);
    var output = Number(range_output.value);
    var num_layers = Number(range_layers.value) - 1;

    var padding = 10;
    var lpadding = height/5;

    var layers;
    if (num_layers == 0) {
        layers = [input, output];
    } else {
        layers = [input];
        for (let i = 0; i < num_layers; i++) {
            layers.push(hidden);
        }
        layers.push(output);
    }

    var network_height = layers.length * (neuron_size + lpadding);

    var hcl = -1;
    var hci = -1;

    var hovered = false;
    var neuron_size_2 = neuron_size/2;

    for (var l = 0; l < layers.length; l++) {
        for (var i = 0; i < layers[l]; i++) {
            var pos = neuron_position(l, i);
            ctx.strokeStyle = "#000000";
            if (hcl == -1 && hci == -1 && dist(pos, mouse) < neuron_size_2) {
                hcl = l;
                hci = i;
                hovered = true;
                ctx.strokeStyle = "#ff0000";
            }
        }
    }

    for (var l = 0; l < layers.length-1; l++) {

        var link_i = -1;
        var link_j = -1;

        var next_l = l + 1;
        for (var i = 0; i < layers[l]; i++) {

            for (var j = 0; j < layers[next_l]; j++) {
                var pos_i = neuron_position(l, i);
                var pos_j = neuron_position(next_l, j);
                
                ctx.strokeStyle = "#000000";
                if (!hovered) {
                    var dist_i = dist(pos_i, mouse);
                    var dist_j = dist(pos_j, mouse);
                    
                    var dist_ij = dist(pos_i, pos_j);
                    
                    if (dist_i + dist_j < dist_ij + .05) {
                        hovered = true;
                        link_i = i;
                        link_j = j;
                        ctx.strokeStyle = "#ff0000";
                    }
                }

                ctx.beginPath();
                ctx.moveTo(pos_i[0], pos_i[1]);
                ctx.lineTo(pos_j[0], pos_j[1]);
                ctx.stroke();
            }
        }
        
        var mat_y = (neuron_position(l, 0)[1] + neuron_position(next_l, 0)[1])/2;
        m = zeros(layers[next_l], layers[l]);
        let m_size = draw_mat(ctx, 600, mat_y, m, link_j, link_i);

        draw_mat(ctx, 600 + m_size[0]/2 + 40, mat_y, zeros(layers[l], 1));
    }

    ctx.fillStyle = "#ffffff";
    for (var l = 0; l < layers.length; l++) {
        for (var i = 0; i < layers[l]; i++) {
            var pos = neuron_position(l, i);
            ctx.strokeStyle = "#000000";
            if (hcl == l && hci == i) {
                ctx.strokeStyle = "#ff0000";
            }

            draw_circle(ctx, pos[0], pos[1], neuron_size/2);
        }
    }
}

function dist(a, b) {
    return ((a[0]-b[0])**2 + (a[1]-b[1])**2)**(1/2);
}

function neuron_position(layer, index) {
    var canvas = document.getElementById("canvas");
    var width = canvas.width/2 - 200;
    var height = canvas.height/2;

    var range_neuron_size = document.getElementById("neuron_size");
    var range_input = document.getElementById("in");
    var range_hidden = document.getElementById("hidden");
    var range_output = document.getElementById("out");
    var range_layers = document.getElementById("layers");

    var neuron_size = Number(range_neuron_size.value);
    var input = Number(range_input.value);
    var hidden = Number(range_hidden.value);
    var output = Number(range_output.value);
    var num_layers = Number(range_layers.value) - 1;

    var cx = width/2;
    var cy = height/2;

    var padding = 40;
    var lpadding = height/8;

    var layers = [input];
    for (let i = 0; i < num_layers; i++) {
        layers.push(hidden);
    }
    layers.push(output);

    var network_height = (layers.length-1) * (neuron_size + lpadding);
    var layer_width = (layers[layer]-1) * (neuron_size + padding);

    var x = cx - layer_width/2 + index * (neuron_size + padding);
    var y = cy + network_height/2 - layer * (neuron_size + lpadding);

    return [x, y];
}

function draw_mat(ctx, x, y, m, si=-1, sj=-1) {

    let r = m.length;
    let c = m[0].length;

    let pad = 14;
    let width = c * pad;
    let height = r * pad;

    let cx = x - width/2;
    let cy = y - height/2;

    ctx.strokeStyle = "#000000";

    ctx.beginPath();
    ctx.moveTo(x - width/2, y - height/2);
    ctx.lineTo(x - width/2 - 4, y - height/2);
    ctx.lineTo(x - width/2 - 4, y + height/2);
    ctx.lineTo(x - width/2, y + height/2);

    ctx.moveTo(x + width/2, y - height/2);
    ctx.lineTo(x + width/2 + 4, y - height/2);
    ctx.lineTo(x + width/2 + 4, y + height/2);
    ctx.lineTo(x + width/2, y + height/2);
    ctx.stroke();

    ctx.textBaseline = "top";
    ctx.fillStyle = "#000000";
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            let t = m[i][j];
            ctx.fillStyle = "#000000";
            if (i == si && j == sj) {
                ctx.fillStyle = "#ff0000";
            }
            ctx.fillText(t, 4 + cx + j*pad, cy + i*pad);
        }
    }

    return [width, height];
}

function zeros(r, c) {
    var m = [];
    for (let i = 0; i < r; i++) {
        let row = [];
        for (let j = 0; j < c; j++) {
            row.push(0);
        }
        m.push(row);
    }
    return m;
}

function draw_circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}

function main() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.textAlign = "center";

    draw();

    var range_neuron_size = document.getElementById("neuron_size");
    var range_input = document.getElementById("in");
    var range_hidden = document.getElementById("hidden");
    var range_output = document.getElementById("out");
    var range_layers = document.getElementById("layers");
    var rect = canvas.getBoundingClientRect();

    document.onmousemove = function(evt) {
        let mouse = [evt.clientX-rect.left, evt.clientY-rect.top];
        draw(mouse);
    };

    range_neuron_size.oninput = function(){
        draw();
    };

    range_input.oninput = function(){
        draw();
    };

    range_hidden.oninput = function(){
        draw();
    };

    range_output.oninput = function(){
        draw();
    };

    range_layers.oninput = function(){
        draw();
    };
}

window.onload = main;