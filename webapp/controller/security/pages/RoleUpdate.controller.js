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
        oRouter.getRoute("RouteRolesUpdate").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
        // Mostrar indicador de carga
    BusyIndicator.show(0);

    // Obtener el parámetro USERID
    var sRoleId = oEvent.getParameter("arguments").ROLEID;
    var sUrl = "http://localhost:3020/api/security/roles?roleid=" + sRoleId;

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
            var oUserData = data.value[0]  ;
            
            console.log("RoleID", oUserData);
        // Asignar los datos al modelo de la vista
        var oViewModel = new JSONModel(oUserData);
        
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
        // Mostrar indicador de carga
        BusyIndicator.show(0);
        
        delete oUserData._id;
        delete oUserData.DETAIL_ROW;
        delete oUserData.__v;
        delete oUserData.USERS;
        /*
         if (Array.isArray(oUserData.ROLES)) {
        oUserData.ROLES.forEach(function (role) {
            delete role._id;
            delete role.ROLENAME;
            delete role.DESCRIPTION;
            delete role.PRIVILEGES;
            delete role.DETAIL_ROW;
        });
        }*/ 

        // Realizar la solicitud a la API para actualizar el usuario
        //Cambiar URL
        var sUrl = "http://localhost:3020/api/security/updaterole?roleid=" + oData.ROLEID;
        fetch(sUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({role:oUserData})
        
        })
        .then(function (response) {
            BusyIndicator.hide(); // Ocultar indicador de carga
            if (!response.ok) {
                console.log("Data to be sent:", JSON.stringify({user:oUserData}))
                throw new Error("Error al actualizar el usuario");
            }
            return response.json();
        })
        .   then(function (data) {
            // Mostrar mensaje de éxito
            MessageToast.show("Rol actualizado correctamente");
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
