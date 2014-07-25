function draw() {
    console.log($("#jsonInput").val());
    drawJson(JSON.parse($("#jsonInput").val()));


    $('#pageTabs a[href="#graphView"]').tab('show') // Select tab by name
    //$("#jsonInput").val();
}
$(document).ready(function () {
    $('#info').tooltip({html:true,title:'Version 1.0<br>Developed by Mostafa Gaafar<br>Graph by arbor.js'})
    $("#btnDraw").click(draw);

    var temp = '{"_id": "53d1cef83b04edda916d716f","index": 0,"guid": "fe1f0100-5689-4a22-9940-4bdbd5af55dc","isActive": false,"balance": "$1,095.73","picture": "http://placehold.it/32x32","age": 21,"eyeColor": "blue","name": "Concepcion Tyson","gender": "female","company": "QUARMONY","email": "concepciontyson@quarmony.com"}';

    var temp2 = '[{"_id": "53d2a283b9e8b9ed7956f7ea", "index": 0, "guid": "83a03010-3e8b-480e-a351-ae394caf8f2c", "isActive": true, "balance": "$3,838.97", "picture": "http://placehold.it/32x32", "age": 27, "eyeColor": "green", "name": "Rosella Mckinney", "gender": "female", "company": "STOCKPOST", "email": "rosellamckinney@stockpost.com", "list":[  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",  "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com",   "rosellamckinney@stockpost.com"  ],  "obj": {"email": "rosellamckinney@stockpost.com",   "phone": "45272752"}}]'

    $("#jsonInput").val(temp2);
    draw();
});