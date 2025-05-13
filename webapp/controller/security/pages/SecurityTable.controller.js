sap.ui.define([
    "com/inv/sapfiroriwebinversion/controller/BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, BusyIndicator, MessageToast) {
    "use strict";

    return BaseController.extend("com.inv.sapfiroriwebinversion.controller.security.pages.SecurityTable", {
        
        onInit: function () {
            let oRouter = this.getRouter();
            oRouter.getRoute("RouteSecurity").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            BusyIndicator.show(0);

            const oTable = this.byId("IdTable1SecurityTable");
            const oModel = new JSONModel();

            // Construir la URL
            var sUrl = "http://localhost:3020/api/security/users";

                fetch(sUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(function (response) {
                    BusyIndicator.hide(); // Ocultar indicador de carga
                    if (!response.ok) {
                        // Manejar el error de autenticación
                        throw new Error("Error en la autenticación");
                    }
                    return response.json();
                })
                .then(function (data) {

                    // Manejar la respuesta de la API
                    // Aquí puedes procesar los datos recibidos y asignarlos al modelo
                    oModel.setData(data);
                    // Asignar el modelo a la tabla
                    oTable.setModel(oModel);
                }.bind(this))
                .catch(function (error) {
                    BusyIndicator.hide(); // Ocultar indicador de carga
                    // Manejar el error de la solicitud
                    MessageToast.show("Error: " + error.message);
                });
          
        }
    });
});
