sap.ui.controller("sap.ui.Z_DEEP2.view.Master", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf Z_DEEP2.view.Master
*/
	onInit: function() {
		this._oView = this.getView();
		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
		this._oRouter = this._oComponent.getRouter();
		this._oRouter.attachRoutePatternMatched(this.onRouteMatched,this);
		this._oModel = this._oComponent.getModel();
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf Z_DEEP2.view.Master
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf Z_DEEP2.view.Master
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf Z_DEEP2.view.Master
*/
//	onExit: function() {
//
//	}
	onRouteMatched : function(){
		var sPath = "/HeaderSet(ID='1')";
		this._oView.byId("master_page").bindElement(sPath);
	},

	change : function(){
//		alert("a");
		mParameters = {};
		var sPath = "/HeaderSet(ID='1')";
		oEntry = {};
		oEntry.ID = this._oView.byId("id").getValue();
		oEntry.NAME1 = this._oView.byId("name1").getValue();
		oEntry.NAME2 = this._oView.byId("name2").getValue();
		this._oModel.update(sPath,oEntry,mParameters);
	},
});