

//init graph renderer and attach it to the particle system
//The .init method will be called once before the first pass through the draw loop. 
//Then the .redraw method will be called each time the screen needs to be re-plotted. 

var renderer = function (canvas) {
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem;
    var swatch = ['orangered', 'orange', 'yellow', 'lightgreen', 'lightblue'];

    function getNodeColor(i, swatch) {
        if (i < 0) {
            return swatch[0]
        }
        if (i > swatch.length - 1) {
            //return getNodeColor(i - swatch.length, swatch);
            return swatch[swatch.length - 1]
        } else {
            return swatch[i]
        }
    }

    var that = {
        init: function (system) {
            console.log("Initializing");
            //
            // the particle system will call the init function once, right before the
            // first frame is to be drawn. it's a good place to set up the canvas and
            // to pass the canvas size to the particle system
            //
            // save a reference to the particle system for use in the .redraw() loop
            particleSystem = system

            // inform the system of the screen dimensions so it can map coords for us.
            // if the canvas is ever resized, screenSize should be called again with
            // the new dimensions
            particleSystem.screenSize(canvas.width, canvas.height)
            particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side

            // set up some event handlers to allow for node-dragging
            that.initMouseHandling()
        },

        redraw: function () {
            console.log("Redrawing");

            // 
            // redraw will be called repeatedly during the run whenever the node positions
            // change. the new positions for the nodes can be accessed by looking at the
            // .p attribute of a given node. however the p.x & p.y values are in the coordinates
            // of the particle system rather than the screen. you can either map them to
            // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
            // which allow you to step through the actual node objects but also pass an
            // x,y point in the screen's coordinate system
            // 
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particleSystem.eachEdge(function (edge, pt1, pt2) {
                // edge: {source:Node, target:Node, length:#, data:{}}
                // pt1:  {x:#, y:#}  source position in screen coords
                // pt2:  {x:#, y:#}  target position in screen coords

                // draw a line from pt1 to pt2
                ctx.strokeStyle = "rgba(0,0,0, .333)"
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(pt1.x, pt1.y)
                ctx.lineTo(pt2.x, pt2.y)
                ctx.stroke()
            })

            particleSystem.eachNode(function (node, pt) {
                // node: {mass:#, p:{x,y}, name:"", data:{}}
                // pt:   {x:#, y:#}  node position in screen coords

                // draw a rectangle centered at pt
                var w = 20
                ctx.fillStyle = (node.data.alone) ? "orange" : "black"
                //ctx.fillRect(pt.x - w / 2, pt.y - w / 2, w, w)
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, w, 0, 2 * Math.PI, false);
                ctx.fillStyle = getNodeColor(node.data['@meta@'].level, swatch);
                ctx.fill();

                ctx.fillStyle = "gray";
                ctx.font = "14px Arial";
                //console.log((ctx.measureText(node.name)));
                ctx.fillText(node.data['@meta@'].displayName, (pt.x - (ctx.measureText(node.data['@meta@'].displayName).width / 2)), (pt.y));
            })
        },

        initMouseHandling: function () {
            // no-nonsense drag and drop (thanks springy.js)
            var dragged = null;
            var nearest = null;

            // set up a handler object that will initially listen for mousedowns then
            // for moves and mouseups while dragging
            var handler = {
                clicked: function (e) {
                    var pos = $(canvas).offset();
                    _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)
                    dragged = particleSystem.nearest(_mouseP);

                    if (dragged && dragged.node !== null) {
                        // while we're dragging, don't let physics move the node
                        dragged.node.fixed = true
                    }

                    $(canvas).unbind('mousemove', handler.moved);
                    $(canvas).bind('mousemove', handler.dragged)
                    $(window).bind('mouseup', handler.dropped)
                    displayInfo(dragged.node);
                    console.log(dragged.node.data);


                    return false
                },
                dragged: function (e) {
                    var pos = $(canvas).offset();
                    var s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)

                    if (dragged && dragged.node !== null) {
                        var p = particleSystem.fromScreen(s)
                        dragged.node.p = p
                    }

                    return false
                },

                dropped: function (e) {
                    if (dragged === null || dragged.node === undefined) return
                    if (dragged.node !== null) dragged.node.fixed = false
                    dragged.node.tempMass = 1000
                    dragged = null
                    $(canvas).unbind('mousemove', handler.dragged)
                    $(window).unbind('mouseup', handler.dropped)
                    $(canvas).bind('mousemove', handler.moved);
                    _mouseP = null
                    return false
                },
                moved: function (e) {
                    //console.log(e);
                    var pos = $(canvas).offset();
                    _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)
                    nearest = particleSystem.nearest(_mouseP);

                    if (!nearest.node) return false

                    if (nearest.node.data.shape != 'dot') {
                        selected = (nearest.distance < 30) ? nearest : null
                        if (selected) {
                            //console.log(selected.node.data);
                            //dom.addClass('linkable')
                            //window.status = selected.node.data.link.replace(/^\//, "http://" + window.location.host + "/").replace(/^#/, '')
                        }
                        else {
                            //dom.removeClass('linkable')
                            window.status = ''
                        }
                    } else if ($.inArray(nearest.node.name, ['arbor.js', 'code', 'docs', 'demos']) >= 0) {
                        if (nearest.node.name != _section) {
                            _section = nearest.node.name
                            that.switchSection(_section)
                        }
                        //dom.removeClass('linkable')
                        window.status = ''
                    }

                    return false
                },
            }

            // start listening
            $(canvas).mousedown(handler.clicked);
            $(canvas).mousemove(handler.moved);

        },

    }
    return that
}

$(document).ready(function () {

    // add some nodes to the graph and watch it go...
    //sys.addEdge('a','b')
    //sys.addEdge('a','c')
    //sys.addEdge('a','d')
    //sys.addEdge('a','e')
    //sys.addNode('f', {alone:true, mass:.25})

    // or, equivalently:
    //
    // sys.graft({
    //   nodes:{
    //     f:{alone:true, mass:.25}
    //   }, 
    //   edges:{
    //     a:{ b:{},
    //         c:{},
    //         d:{},
    //         e:{}
    //     }
    //   }
    // })
    //console.log(sys);
    //drawJson(data);

});

var staticData = {
    "_id": "53d1cef83b04edda916d716f",
    "index": 0,
    "guid": "fe1f0100-5689-4a22-9940-4bdbd5af55dc",
    "isActive": false,
    "balance": "$1,095.73",
    "picture": "http://placehold.it/32x32",
    "age": 21,
    "eyeColor": "blue",
    "name": "Concepcion Tyson",
    "gender": "female",
    "company": "QUARMONY",
    "email": "concepciontyson@quarmony.com"
};

function drawJson(data) {
    var sysParams = {
        friction: .5,
        stiffness: 1000,
        repulsion: 20,
        gravity: true, // use center-gravity to make the graph settle nicely (ymmv)
    };
    sys = arbor.ParticleSystem(300, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
    sys.renderer = renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

    createNode('root', { original: data }, null, 0);

}

function createNode(name, obj, parent, level) {
    if (!parent) {
        // init root node
        obj['@meta@'] = {
            path: name,
            displayName: 'root'
        }
    }
    else {
        var appendingName = name[0] == '[' ? name : '.' + name;
        obj['@meta@'] = {
            path: parent['@meta@'].path + appendingName,
            displayName: name
        }
    }

    obj['@meta@'].level = level;
    obj['@meta@'].type = typeof (obj.original);

    //add current node with its data
    sys.addNode(obj['@meta@'].path, obj);
    //add edge to parent node
    if (parent) {
        var edgeParams = {
            length: 0.5
        }

        sys.addEdge(obj['@meta@'].path, parent['@meta@'].path, edgeParams)
    }

    //add child nodes for arrays and objects only
    if (typeof (obj.original) == 'object') {

        for (var prop in obj.original) {
            var newName;

            //if prop is not an indexer
            if (isNaN(prop)) {
                newName = prop;
            } else {
                newName = '[' + prop + ']';
            }
            createNode(newName, { original: obj.original[prop] }, obj, level + 1);

            //sys.addNode(prop, { value: data[prop] });
        }
        //sys.addEdge('root', prop)
    }
}

