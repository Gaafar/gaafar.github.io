var errorLabel = $('<div class="label label-danger" style="display:inline-block;position:absolute;max-width:230px"><h7 style="text-transform:none!important;text-align:left;white-space: pre-line;"></h7></div>');

function format() {
    var jsonStr = $("#jsonInput").val();
    var res = formatter.formatJson(jsonStr);
    $("#jsonInput").val(res);
}

function isValid() {
    $('.lineno').each(function (item) { $(this).css('background-color', 'white') });
    errorLabel.detach();

    var jsonStr = $("#jsonInput").val();

    try {
        jsonlint.parse(jsonStr)
    } catch (e) {
        //extract error line no
        var errorStr = ('error on line ');
        var ind = e.message.indexOf('error on line ') + errorStr.length;
        if (ind > errorStr.length) {
            //string found
            var trimmed = e.message.slice(ind);

            var ind2 = trimmed.indexOf(':');
            if (ind2 > 0) {
                //form label msg
                var msgLines = e.message.split('\n');
                var charPos = msgLines[2].length - 1
                //var char = msgLines[1][charPos];


                var labelMsg = msgLines[1].slice(0, charPos) + '►' + msgLines[1].slice(charPos)
                    + '\n'
                    + '\n'
                    + msgLines[3];

                var lineNo = parseInt(trimmed.slice(0, ind2));

                //$('.lineno').css('background-color', 'white');

                var lineTag = $('.lineno').eq(lineNo - 1);
                lineTag.css('background-color', '#FF3B30');


                errorLabel.children('h7').eq(0).text(labelMsg);

                lineTag.append(errorLabel);

                var right = ($(window).width() - (lineTag.offset().left + lineTag.outerWidth()));
                errorLabel.css({ right: right, top: lineTag.offset().top + lineTag.outerHeight() });

                //console.log(msgLines[3]);
                //console.log(e.message[3]);
                //debugger
                //show error label
            }
        }
        //console.log(e)
        //console.log(e.message)
        return false;
    }

    //if (!jsonlint.parse(jsonStr)) {
    ////    invalid json, print error msg
    //    console.log("error parsing json");
    //    console.log(JSLINT.errors);
    //    return false;
    //}


    return true
}

function draw() {
    //console.log($("#jsonInput").val());
    format();

    if (!isValid()) {
        return;
    }

    var jsonStr = $("#jsonInput").val();
    drawJson(JSON.parse(jsonStr));


    $("#depthSlider").slider({

        min: 1,
        max: jsonDepth,
        value: jsonDepth,
        orientation: "horizontal",
        range: "min",
        animate: true,
        slide: function (event, ui) {
            $("#depthSliderLabel").text(ui.value);
            drawTillDepth(null, ui.value);
        }

    });
    $("#depthSliderLabel").text($("#depthSlider").slider("value"));

    $('#pageTabs a[href="#graphView"]').tab('show') // Select tab by name
    //$("#jsonInput").val();
}


function displayInfo(node) {
    //$('#nodePath').text(node.data['@meta@'].path + ' = ' + node.data.original);
    //$('#nodeValue').text(node.data['@meta@'].path + ' = ' + node.data.original);

    $('#nodePath').text(node.data['@meta@'].path.toString());

    var value;
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
    $('#info').tooltip({ html: true, title: 'Version 1.1<br><br>Created by Mostafa Gaafar' })
    $('#help').tooltip({ html: true, title: 'Paste JSON and press "Draw"<br><br>Click a node to see its path & value<br><br>Double click to expand/collapse' })
    $('.popover-dismiss').popover({
        trigger: 'focus'
    })


    $('#jsonInput').bind('input propertychange', isValid);



    $("#btnDraw").click(draw);
    $("#btnFormat").click(format);
    //$("#copyPath").click(copyPath);
    //$("#copyValue").click(copyValue);


    $(".linedtextarea").linedtextarea();

    var temp = '{"_id": "53d1cef83b04edda916d716f","index": 0,"guid": "fe1f0100-5689-4a22-9940-4bdbd5af55dc","isActive": false,"balance": "$1,095.73","picture": "http://placehold.it/32x32","age": 21,"eyeColor": "blue","name": "Concepcion Tyson","gender": "female","company": "QUARMONY","email": "concepciontyson@quarmony.com"}';

    var temp2 = '[{"_id": "53d2a283b9e8b9ed7956f7ea", "index": 0, "guid": "83a03010-3e8b-480e-a351-ae394caf8f2c", "isActive": true, "balance": "$3,838.97", "picture": "http://placehold.it/32x32", "age": 27, "eyeColor": "green", "name": "Rosella Mckinney", "gender": "female", "company": "STOCKPOST", "email": "rosellamckinney@stockpost.com", "list":[  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com"  ],  "obj": {"email": "rosellamckinney@stockpost.com",   "phone": "45272752"}}]'

    var instructions = {
        hi: "this is the coolest way to view a JSON!",
        start: { step1: "click on the JSON tab on top", step2: "Paste your JSON", step3: "Click Draw" },
        use: { value: "click to see node path & value", collapse: "double click to expand/collapse nodes with a stroke" },
        credits: { developer: "Mostafa Gaafar", graph: "arbor.js", ui: "Bootstrap + Get Shit Done", textarea: "jquery-linedtextarea",lint:"jsonlint" },
        notes: ["works best for smaller JSON", "send feedback to @iga3far"]
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

    $("#jsonInput").val(JSON.stringify(instructions));
    draw();
});