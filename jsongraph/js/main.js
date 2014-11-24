

//init graph renderer and attach it to the particle system
//The .init method will be called once before the first pass through the draw loop. 
//Then the .redraw method will be called each time the screen needs to be re-plotted. 

var renderer = function (canvas) {
    var canvas = $(canvas).get(0);
    var ctx = canvas.getContext("2d");
    var particleSystem;
    var swatch = ['snow', '#ffd147','#55ed5a', 'yellow', 'coral', 'lightblue'];
    var hovering = [];

    function getNodeColor(i, swatch) {
        if (i < 0) {
            return swatch[0]
        }
        if (i > swatch.length - 1) {
            return getNodeColor(i - swatch.length, swatch);
            //return swatch[swatch.length - 1]
        } else {
            return swatch[i]
        }
    }

    var that = {
        init: function (system) {
            //console.log("The hell are you looking at?!");
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
            //console.log("Redrawing");

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

                if (hovering[0] && node == hovering[0].node) {
                    //console.log(hovering[0])
                }
                //draw labels
                if (node.data['@meta@'].hasOwnProperty('isLabel') && node.data['@meta@'].isLabel) {
                    var w = node.data['@meta@'].radius;
                    ctx.beginPath();
                    ctx.fillStyle = 'pink';//getNodeColor(node.data['@meta@'].level, swatch);
                    ctx.strokeStyle = 'pink';
                    //ctx.fillRect(pt.x - w / 2, pt.y - w / 2, w, w);
                    var width = ctx.measureText(node.data['@meta@'].displayName).width + 8;
                    var x = pt.x - width / 2;
                    var h = 20;
                    var y = pt.y - h * 0.7;
                    drawRoundedRectangle(ctx, x, y, width, h, 8);
                    ctx.fill();

                }

                else {

                    // draw a circle centered at pt
                    var w = node.data['@meta@'].radius;
                    //ctx.fillStyle = (node.data.alone) ? "orange" : "black"
                    //ctx.fillRect(pt.x - w / 2, pt.y - w / 2, w, w)
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, w, 0, 2 * Math.PI, false);
                    ctx.fillStyle = getNodeColor(node.data['@meta@'].level, swatch);
                    ctx.fill();

                    if (node.data['@meta@'].type == 'object') {
                        ctx.lineWidth = 4
                        ctx.strokeStyle = getNodeColor(node.data['@meta@'].level + 1, swatch);
                        ctx.stroke();
                        ctx.lineWidth = 1
                    }
                }
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
            var dblclicked = null;

            // set up a handler object that will initially listen for mousedowns then
            // for moves and mouseups while dragging
            var handler = {
                clicked: function (e) {
                    var pos = $(canvas).offset();
                    _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)
                    dragged = particleSystem.nearest(_mouseP);

                    if (dragged && dragged.node !== null) {
                        if (dragged.distance < dragged.node.data['@meta@'].radius) {
                            if (!dragged.node.data['@meta@'].isLabel) {
                                // while we're dragging, don't let physics move the node
                                dragged.node.fixed = true
                                displayInfo(dragged.node);
                            }
                        }
                    }

                    $(canvas).unbind('mousemove', handler.moved);
                    $(canvas).bind('mousemove', handler.dragged)
                    $(window).bind('mouseup', handler.dropped)
                    //console.log(dragged.node);

                    return false
                },
                dblclick: function (e) {
                    var pos = $(canvas).offset();
                    _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)
                    dblclicked = particleSystem.nearest(_mouseP);

                    //temp fix for root collapse then expand bug
                    //if (dblclicked.node.data['@meta@'].path != 'root') {
                    if (dblclicked && dblclicked.node !== null) {
                        if (dblclicked.distance < dblclicked.node.data['@meta@'].radius) {
                            if (!dblclicked.node.data['@meta@'].isLabel) {
                                toggleExpand(dblclicked.node);
                            }
                        }
                    }                //}
                }
                ,
                dragged: function (e) {
                    var pos = $(canvas).offset();
                    var s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)

                    if (dragged && dragged.node !== null) {
                        if (dragged.distance < dragged.node.data['@meta@'].radius) {

                            var p = particleSystem.fromScreen(s)
                            dragged.node.p = p
                        }
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
                    //if (!nearest) return false
                    if (!nearest || !nearest.node) return false

                    if (nearest.node.data.shape != 'dot') {
                        selected = (nearest.distance < nearest.node.data['@meta@'].radius) ? nearest : null
                        if (selected && !selected.node.data['@meta@'].isLabel) {
                            hovering = [{ node: selected.node, mousePos: _mouseP }];

                            //TODO: add tooltip here


                            //clear selection and remove displayed values


                            //console.log("hovering...");
                            //for (var i in hovering) {
                            //    //if (hovering[i] != selected.node)
                            //    //destroyLabel(hovering[i]);
                            //}
                            //hovering = [];

                            //if (hovering.indexOf(selected.node) > -1) {
                            //    //same node hovered
                            //} else {
                            //    //createLabel(selected.node)
                            //    hovering = [{ node: selected.node, mousePos: _mouseP }];
                            //}

                            //must add nodes to force redraw

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
                hoverEnter: function () {
                    //TODO: display label on hover

                },
                hoverLeave: function () {

                }
            }

            // start listening
            $(canvas).mousedown(handler.clicked);
            $(canvas).mousemove(handler.moved);
            $(canvas).dblclick(handler.dblclick)
            $(canvas).hover(handler.hoverEnter, handler.hoverLeave)

        },
        unbind: function () {
            $(canvas).unbind();
        }

    }
    return that
}


function drawJson(data) {

    //events are bound twice on drawing a new json
    if (typeof (sys) != 'undefined') {
        sys.renderer.unbind();;
    }

    var sysParams = {
        friction: .5,
        stiffness: 1000,
        repulsion: 20,
        gravity: true, // use center-gravity to make the graph settle nicely (ymmv)
    };
    sys = null;
    sys = arbor.ParticleSystem(300, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
    sys.renderer = renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...
    jsonDepth = 0;
    createNode('root', { original: data }, null, 0, Number.POSITIVE_INFINITY);

}

function createNode(name, obj, parent, level, maxLevel) {
    if (!parent) {
        // init root node
        obj['@meta@'] = {
            path: name,
            displayName: 'root'
        }
    }
    else {
        var appendingName = getPathAppendix(name);
        obj['@meta@'] = {
            path: parent['@meta@'].path + appendingName,
            displayName: name
        }
    }



    obj['@meta@'].level = level;
    obj['@meta@'].type = typeof (obj.original);
    obj['@meta@'].radius = 40 - (level * 4)
    obj['@meta@'].radius = obj['@meta@'].radius > 5 ? obj['@meta@'].radius : 5;

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
    if (typeof (obj.original) == 'object' && level < maxLevel) {
        for (var prop in obj.original) {
            var newName = getPropertyName(prop)

            createNode(newName, { original: obj.original[prop] }, obj, level + 1, maxLevel);
            obj['@meta@'].isExpanded = true;
            //sys.addNode(prop, { value: data[prop] });
        }
        //sys.addEdge('root', prop)
    }

    //to set max json depth
    if (maxLevel == Number.POSITIVE_INFINITY)//when drawing entire json only
    {
        jsonDepth = level > jsonDepth ? level : jsonDepth;
    }
}

function createLabel(parentNode) {

    if (parentNode.data['@meta@'].hasLabel) return;

    //if (typeof (parentNode.data.original) == "object") {

    //    var name = parentNode.data['@meta@'].type;
    //} else {
    //    var name = parentNode.data.original;

    //}
    var name = getDisplayType(parentNode);

    var obj = {
    }
    obj['@meta@'] = {
        path: parentNode.data['@meta@'].path + "#label",
        displayName: name,
        isLabel: true,
    }
    obj['@meta@'].radius = parentNode.data['@meta@'].radius;

    //add current node with its data
    sys.addNode(obj['@meta@'].path, obj);
    //add edge to parentNode node
    var edgeParams = {
        length: 0.05
    }

    sys.addEdge(obj['@meta@'].path, parentNode.data['@meta@'].path, edgeParams)

    parentNode.data['@meta@'].hasLabel = true;
}

function destroyLabel(parentNode) {
    if (parentNode.data['@meta@'].hasLabel) {
        sys.pruneNode(parentNode.data['@meta@'].path + "#label")
    }
    parentNode.data['@meta@'].hasLabel = false;
}


function toggleExpand(node) {
    if (node.data['@meta@'].isExpanded == true) {
        collapseNode(node);
    } else {
        expandNode(node);
    }
}

function collapseNode(node) {
    if (!node.data['@meta@'].isExpanded) return false;
    if (node.data['@meta@'].type == 'object') {
        for (var prop in node.data.original) {

            var newName = getPropertyName(prop);
            var appendingName = getPathAppendix(newName);

            //collapse nested nodes
            if (typeof (node.data.original[prop]) == 'object') {
                var nestedNode = sys.getNode(node.data['@meta@'].path + appendingName);
                if (nestedNode.data['@meta@'].isExpanded) {
                    collapseNode(nestedNode);

                }
            }

            //prune each child node
            //temp fix for expanding root
            if (node.data['@meta@'].path != 'root') {

                sys.pruneNode(node.data['@meta@'].path + appendingName);
            }
        }
    }
    //temp fix for expanding root
    if (node.data['@meta@'].path != 'root') {

        node.data['@meta@'].isExpanded = false
    }
}

function expandNode(node) {
    if (node.data['@meta@'].isExpanded) return false;

    if (node.data['@meta@'].type == 'object') {
        for (var prop in node.data.original) {
            var newName = getPropertyName(prop);
            createNode(newName, { original: node.data.original[prop] }, node.data, node.data['@meta@'].level + 1, node.data['@meta@'].level + 1);
        }
    }
    node.data['@meta@'].isExpanded = true;
}

function getPropertyName(prop) {
    var newName;
    //if prop is not an indexer
    if (isNaN(prop)) {
        newName = prop;
    } else {
        newName = '[' + prop + ']';
    }
    return newName;
}

function getPathAppendix(name) {
    return name[0] == '[' ? name : '.' + name;

}

function drawTillDepth(node, depth) {
    if (depth < 1) {
        depth = 1;
    }
    //start with root node if no args
    if (!node) {
        node = sys.getNode('root');
    }

    //sanity check
    if (!node) {
        return;
    }

    //check if children should be drawn
    if (node.data['@meta@'].level + 1 < depth) {
        //expand all children and loop on them (granted to be drawn in previous recursive call)
        for (var prop in node.data.original) {
            var newName = getPropertyName(prop);
            var appendingName = getPathAppendix(newName);

            if (typeof (node.data.original[prop]) == 'object') {
                var nestedNode = sys.getNode(node.data['@meta@'].path + appendingName);
                //sanity check
                if (nestedNode) {
                    expandNode(nestedNode);

                    //recursive call
                    drawTillDepth(nestedNode, depth);
                }
            }
        }

    } else
        //level+1=depth
    {
        //collapse all child nodes
        for (var prop in node.data.original) {
            var newName = getPropertyName(prop);
            var appendingName = getPathAppendix(newName);

            if (typeof (node.data.original[prop]) == 'object') {
                var nestedNode = sys.getNode(node.data['@meta@'].path + appendingName);
                //sanity check
                if (nestedNode) {
                    collapseNode(nestedNode);
                }
            }
        }
    }

}

function drawRoundedRectangle(ctx, x, y, w, h, r) {


    //// Set rectangle and corner values
    //var x = 50;
    //var y = 50;
    //var w = 100;
    //var h = 100;
    //var r = 20;

    // Set faux rounded corners
    ctx.lineJoin = "round";
    ctx.lineWidth = r;

    // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
    ctx.strokeRect(x + (r / 2), y + (r / 2), w - r, h - r);
    ctx.fillRect(x + (r / 2), y + (r / 2), w - r, h - r);

}

function getDisplayType(node) {

    //to print array and object nicely
    if (typeof (node.data.original) == 'object') {
        if (node.data.original[0] && node.data.original.length)//array
        {
            value = 'Array[' + node.data.original.length + ']';
        }
        else {
            //just object
            value = '{Object}';
        }

    } else {
        value = node.data.original;
    }
    return value;
}