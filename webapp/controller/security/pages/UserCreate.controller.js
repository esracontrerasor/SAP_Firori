sap.ui.define([
    "com/inv/sapfiroriwebinversion/controller/BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, BusyIndicator, MessageToast) {
    "use strict";

    return BaseController.extend("com.inv.sapfiroriwebinversion.controller.security.pages.SecurityTable", {
        onInit: function () {
        let oRouter = this.getRouter();
        oRouter.getRoute("RouteCreate").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
        // Mostrar indicador de carga 
    },
onSave: function () {
    // Obtener el modelo de la vista
    var oView = this.getView();
    var oUserData = {
        USERID: oView.byId("InputCreate").getValue(),
        USERNAME: oView.byId("InputCreate1").getValue(),
        EMAIL: oView.byId("InputCreate2").getValue(),
        ALIAS: oView.byId("InputCreate3").getValue(),
        FIRSTNAME: oView.byId("InputCreate4").getValue(),
        LASTNAME: oView.byId("InputCreate5").getValue(),
        BIRTHDAYDATE: oView.byId("InputCreate6").getValue(),
        PHONENUMBER: oView.byId("InputCreate7").getValue(),
        EXTENSION: oView.byId("InputCreate8").getValue(),
        EMPLOYEEID: oView.byId("InputCreate9").getValue(),
        FUNCTION: oView.byId("InputCreate10").getValue(),
        DEPARTMENT: oView.byId("InputCreate11").getValue(),
        COMPANYID: oView.byId("InputCreate12").getValue(),
        COMPANYNAME: oView.byId("InputCreate13").getValue(),
        COMPANYALIAS: oView.byId("InputCreate14").getValue(),
        CEDIID: oView.byId("InputCreate15").getValue(),
        STREET: oView.byId("InputCreate16").getValue(),
        POSTALCODE: oView.byId("InputCreate17").getValue(),
        CITY: oView.byId("InputCreate18").getValue(),
        REGION: oView.byId("InputCreate19").getValue(),
        STATE: oView.byId("InputCreate20").getValue(),
        COUNTRY: oView.byId("InputCreate21").getValue()
    };

     console.log("Data to be sent:", oUserData) // Verificar los datos a enviar
    // Mostrar indicador de carga
    BusyIndicator.show(0);
    delete oUserData._id;
    delete oUserData.DETAIL_ROW
    // Realizar la solicitud a la API para crear el usuario
    //Cambiar URL
    var sUrl = "http://localhost:3020/api/security/createuser";
    fetch(sUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user:oUserData})
       
    })
    .then(function (response) {
        BusyIndicator.hide(); // Ocultar indicador de carga
        if (!response.ok) {
            throw new Error("Error al crear el usuario");
        }
        return response.json();
    })
    .   then(function (data) {
        // Mostrar mensaje de éxito
        MessageToast.show("Usuario creado correctamente");
        // Navegar a la vista de tabla
        this.getRouter().navTo("RouteSecurityTable");
    }.bind(this))
    .catch(function (error) {
        BusyIndicator.hide(); // Ocultar indicador de carga
        MessageToast.show("Error: " + error.message);
    });
}
    });
});
