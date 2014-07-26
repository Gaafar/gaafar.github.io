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
    $('#nodeValue').text(node.data.original.toString());

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
        hi:"this is the coolest way to view a json!",
        start: { step1: "click on the JSON tab on top", step2: "Paste your JSON file", step3: "Click Draw" },
        view: { value: "click to see node path & value", collapse: "double click to expand/collapse" },
        credits: { developer: "Mostafa Gaafar", graph: "arbor.js library", ui: "Bootstrap + Get Shit Done" },
        notes:["works best for smaller JSON","send bug reports & requests to @iga3far"]
    };
    var insJson = JSON.stringify(instructions);
    $("#jsonInput").val(insJson);
    draw();
});