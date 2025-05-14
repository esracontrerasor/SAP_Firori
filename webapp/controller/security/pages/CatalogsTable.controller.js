sap.ui.define([ 
    "com/inv/sapfiroriwebinversion/controller/BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, BusyIndicator, MessageToast) {
    "use strict";

    return BaseController.extend("com.inv.sapfiroriwebinversion.controller.security.pages.CatalogsTable", {
        
        onInit: function () {
            const oRouter = this.getRouter();
            oRouter.getRoute("RouteCatalogs").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            BusyIndicator.show(0);

            const oTree = this.byId("IdTree1Catalogs");
            const oModel = new JSONModel();
            
    console.log("oTree:", oTree);
    console.log("oModel:", oModel);

            fetch("http://localhost:3020/api/security/catalogs", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                BusyIndicator.hide();
                if (!response.ok) {
                    throw new Error("Error al obtener los catálogos");
                }
                return response.json();
            })
            .then(data => {
                // data.value es el array de catálogos
                console.log("Catalogs payload:", data);
                oModel.setData({ catalogs: data.value });
                oTree.setModel(oModel);
                // Binding con arrayNames para que TreeTable expanda la propiedad VALUES
                oTree.bindRows({
                    path: "/catalogs",
                    parameters: { arrayNames: ["VALUES"] }
                });
            })
            .catch(err => {
                BusyIndicator.hide();
                MessageToast.show("Error: " + err.message);
            });
        },

        onRefresh: function () {
            this._onRouteMatched();
        },

        onCreate: function () {
            this.getRouter().navTo("RouteCatalogCreate");
        },

        onRowSelectionChange: function (oEvent) {
            const oContext = oEvent.getParameter("rowContext");
            if (!oContext) {
                MessageToast.show("No se seleccionó ninguna fila");
                return;
            }
            const oData = oContext.getObject();
            MessageToast.show("Seleccionaste: " + (oData.LABELID || oData.VALUEID));
        }
    });
});
