sap.ui.define([
    "com/inv/sapfiroriwebinversion/controller/BaseController",
    'sap/ui/model/json/JSONModel'
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("com.inv.sapfiroriwebinversion.controller.security.Security", {
        onInit: function () {
            var oModel = new JSONModel();
            oModel.loadData("./resources/jsons/salesforecastNavItems.json"); 
            this.getView().setModel(oModel, "securityNavModel");  
 },
 onAvatarPress: function () {
    console.log("Avatar pressed");
    let oMyAvatar = this.getView().byId("IdAvatar1Security");

    oMyAvatar.setActive(!oMyAvatar.getActive());

    
    // Create a popover with the menu
    let oPopover = new sap.m.Popover({
        title: "Opciones",
        placement: sap.m.PlacementType.Bottom,
        afterClose: function () {
            oMyAvatar.setActive(false);
        },
        content: new sap.m.List({
            items: [
                new sap.m.StandardListItem({
                    title: "Cerrar sesión",
                    icon: "sap-icon://log",
                    type: sap.m.ListType.Active,
                    press: function () {
                        oPopover.close();
                        oMyAvatar.setActive(false);
                        this.getRouter().navTo("RouteLogin", {}, true /*no history*/);
                    }.bind(this)
                })
            ]
        })
    });

    // Open the popover
    oPopover.openBy(oMyAvatar);
},
        //* FIC: On Menu (hamburguer) Button Press     
        onMenuButtonPress: function () {
            let toolPage = this.byId("IdToolPage1Security");

            toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },
        onMenuButtonPress2: function () {
            let toolPage = this.byId("IdToolPage2Security");

            toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },
        onMenuButtonPress3: function () {
            let toolPage = this.byId("IdToolPage3Security");

            toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },
    });
});