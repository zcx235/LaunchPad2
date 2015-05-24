/*globals sap*/
sap.ui.controller("sap.ushell.demo.AppNavSample.view.View3", {
    oApplication : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
    },
    handleBtn1Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View1");
    },

    handleBtn2Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "Detail");
    },

    handleBtnHomePress : function () {
        "use strict";
        this.oApplication.navigate("toHome");
    }
});