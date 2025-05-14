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
        oRouter.getRoute("RouteUpdate").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
        // Mostrar indicador de carga
    BusyIndicator.show(0);

    // Obtener el parámetro USERID
    var sUserId = oEvent.getParameter("arguments").USERID;
    var sUrl = "http://localhost:3020/api/security/users?userid=" + sUserId;

    // Realizar la solicitud a la API
    fetch(sUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(function (response) {
        BusyIndicator.hide(); // Ocultar indicador de carga
        if (!response.ok) {
            throw new Error("Error en la autenticación");
        }
        return response.json();
    })
    .then(function (data) {
        // Tomar el primer elemento del array
            var oUserData = data.value[0];
        // Asignar los datos al modelo de la vista
        var oViewModel = new JSONModel(oUserData);
        console.log("Data received:", oUserData); // Verificar los datos recibidos
        this.getView().setModel(oViewModel, "userModel"); // Asignar el modelo con el nombre "userModel"
    }.bind(this))
    .catch(function (error) {
        BusyIndicator.hide(); // Ocultar indicador de carga
        MessageToast.show("Error: " + error.message);
    });
},
onSave: function () {
    // Obtener el modelo de la vista
    var oViewModel = this.getView().getModel("userModel");
    // Obtener los datos del modelo
    var oData = oViewModel.getData();
    var oUserData = oViewModel.getData();

     console.log("Data to be sent:", oUserData) // Verificar los datos a enviar
    // Mostrar indicador de carga
    BusyIndicator.show(0);
    delete oUserData._id;
    delete oUserData.DETAIL_ROW
    // Realizar la solicitud a la API para actualizar el usuario
    //Cambiar URL
    var sUrl = "http://localhost:3020/api/security/updateuser?userid=" + oData.USERID;
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
            throw new Error("Error al actualizar el usuario");
        }
        return response.json();
    })
    .   then(function (data) {
        // Mostrar mensaje de éxito
        MessageToast.show("Usuario actualizado correctamente");
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
