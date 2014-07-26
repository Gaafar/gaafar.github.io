function draw() {
    //console.log($("#jsonInput").val());
    drawJson(JSON.parse($("#jsonInput").val()));


    $('#pageTabs a[href="#graphView"]').tab('show') // Select tab by name
    //$("#jsonInput").val();
}


function displayInfo(node) {
    //$('#nodePath').text(node.data['@meta@'].path + ' = ' + node.data.original);
    //$('#nodeValue').text(node.data['@meta@'].path + ' = ' + node.data.original);

    $('#nodePath').text(node.data['@meta@'].path.toString());

    var value;
    //to print array and object nicely
    if (typeof (node.data.original) == 'object')
    {
        if (node.data.original[0] && node.data.original.length)//array
        {
            value = 'Array[' + node.data.original.length+ ']';
        }
        else {
            //just object
            value = '{Object}';
        }

    } else {
        value = node.data.original.toString();
    }

    $('#nodeValue').text(value);

    //if (!$('#copyButtons').is(":visible")) {

    //    $('#copyButtons').show();
    //}
}

function copyPath() {

}

function copyValue() {

}

$(document).ready(function () {
    $('#info').tooltip({ html: true, title: 'Version 1.0<br><br>Developed by Mostafa Gaafar<br><br>Graph by arbor.js' })
    $('#help').tooltip({ html: true, title: 'Paste JSON and press "Draw"<br><br>Click a node to see its path & value<br><br>Double click to expand/collapse' })
    $('.popover-dismiss').popover({
        trigger: 'focus'
    })

    $("#btnDraw").click(draw);
    //$("#copyPath").click(copyPath);
    //$("#copyValue").click(copyValue);

    var temp = '{"_id": "53d1cef83b04edda916d716f","index": 0,"guid": "fe1f0100-5689-4a22-9940-4bdbd5af55dc","isActive": false,"balance": "$1,095.73","picture": "http://placehold.it/32x32","age": 21,"eyeColor": "blue","name": "Concepcion Tyson","gender": "female","company": "QUARMONY","email": "concepciontyson@quarmony.com"}';

    var temp2 = '[{"_id": "53d2a283b9e8b9ed7956f7ea", "index": 0, "guid": "83a03010-3e8b-480e-a351-ae394caf8f2c", "isActive": true, "balance": "$3,838.97", "picture": "http://placehold.it/32x32", "age": 27, "eyeColor": "green", "name": "Rosella Mckinney", "gender": "female", "company": "STOCKPOST", "email": "rosellamckinney@stockpost.com", "list":[  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com"  ],  "obj": {"email": "rosellamckinney@stockpost.com",   "phone": "45272752"}}]'

    var instructions = {
        hi: "this is the coolest way to view a JSON!",
        start: { step1: "click on the JSON tab on top", step2: "Paste your JSON", step3: "Click Draw" },
        view: { value: "click to see node path & value", collapse: "double click to expand/collapse nodes with a stroke" },
        credits: { developer: "Mostafa Gaafar", graph: "arbor.js", ui: "Bootstrap + Get Shit Done" },
        notes:["works best for smaller JSON","send bug reports & requests to @iga3far"]
    };
    var insJson = JSON.stringify(instructions);

    var googleJson = {
        "markers": [
            {
                "point": "new GLatLng(40.266044,-74.718479)",
                "homeTeam": "Lawrence Library",
                "awayTeam": "LUGip",
                "markerImage": "images/red.png",
                "information": "Linux users group meets second Wednesday of each month.",
                "fixture": "Wednesday 7pm",
                "capacity": "",
                "previousScore": ""
            },
            {
                "point": "new GLatLng(40.211600,-74.695702)",
                "homeTeam": "Hamilton Library",
                "awayTeam": "LUGip HW SIG",
                "markerImage": "images/white.png",
                "information": "Linux users can meet the first Tuesday of the month to work out harward and configuration issues.",
                "fixture": "Tuesday 7pm",
                "capacity": "",
                "tv": ""
            },
            {
                "point": "new GLatLng(40.294535,-74.682012)",
                "homeTeam": "Applebees",
                "awayTeam": "After LUPip Mtg Spot",
                "markerImage": "images/newcastle.png",
                "information": "Some of us go there after the main LUGip meeting, drink brews, and talk.",
                "fixture": "Wednesday whenever",
                "capacity": "2 to 4 pints",
                "tv": ""
            }
        ]
    }

    $("#jsonInput").val(JSON.stringify(googleJson));
    draw();
});