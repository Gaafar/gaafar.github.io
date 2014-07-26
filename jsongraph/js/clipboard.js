$(document).ready(function () {

    var client = new ZeroClipboard($("#copyPath"));

    client.on("ready", function (readyEvent) {
        // alert( "ZeroClipboard SWF is ready!" );

        this.on("aftercopy", function (event) {
            // `this` === `client`
            // `event.target` === the element that was clicked
            event.target.style.display = "none";
            alert("Copied text to clipboard: " + event.data["text/plain"]);
        });

        this.on("copy", function (event) {
            var clipboard = event.clipboardData;
            clipboard.setData("text/plain", "Copy me!");
            clipboard.setData("text/html", "<b>Copy me!</b>");
            clipboard.setData("application/rtf", "{\\rtf1\\ansi\n{\\b Copy me!}}");
        });
    });

    debugger;
});