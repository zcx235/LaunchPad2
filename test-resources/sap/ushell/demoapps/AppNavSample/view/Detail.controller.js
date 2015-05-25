// Copyright (c) 2013 SAP AG, All Rights Reserved
/*global sap, jQuery, JSONModel*/
sap.ui.controller("sap.ushell.demo.AppNavSample.view.Detail", {
    oApplication : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
        // set the current user in the model (testing UserInfo service)
        var oUserInfoService = sap.ushell.Container.getService("UserInfo"),
            oModel = new sap.ui.model.json.JSONModel();
        oModel.setData({
            "userId": oUserInfoService.getId()
        });
        this.getView().setModel(oModel, "UserInfo");
    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Detail
*/
    onBeforeRendering: function () {
        "use strict";
    },
    handleBtn1Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View1");
    },

    handleBtn2Press : function () {
        "use strict";
        var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
        oCrossAppNavigator.toExternal({
            target: { semanticObject : "Action", action: "toappnavsample" },
            params : { zval : "some data", date : new Date().toString()}
        });

    }
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Detail
*/
//  onAfterRendering: function() {
//
//  },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Detail
*/
//  onExit: function() {
//
//  }

});