sap.ui.define([
    "com/inv/sapfiroriwebinversion/controller/BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, BusyIndicator, MessageToast) {
    "use strict";

    return BaseController.extend("com.inv.sapfiroriwebinversion.controller.security.pages.Security", {
        //Contructor al llamar la pestaña de crear role
        onInit: function () {
        /* Colocar cuando este getproceso
        const oRolesModel = new JSONModel();
        var sUrl = "http://localhost:3020/api/security/roles";

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
                // Asignar los datos al modelo
        oRolesModel.setData({ roles: data.value });
        console.log("Roles data:", data.value); // Verificar los datos recibidos
    
        }.bind(this))
        .catch(function (error) {
            BusyIndicator.hide(); // Ocultar indicador de carga
            MessageToast.show("Error: " + error.message);
        });



        this.getView().setModel(oRolesModel, "rolesModel");

        // Inicializar el modelo para los datos del usuario
        var oUserModel = new JSONModel({
            ROLES: [] // Lista de roles seleccionados
        });
        this.getView().setModel(oUserModel, "userModel");    

        */
        let oRouter = this.getRouter();
        oRouter.getRoute("RouteCreate").attachPatternMatched(this._onRouteMatched, this);
    },
    _onRouteMatched: function (oEvent) {
    },
    onSave: function () {
        // Obtener el modelo de la vista
        var oView = this.getView();
        var oUserModel = oView.getModel("userModel");
        var oUserData = {
            ROLEID: oView.byId("InputCreateRole").getValue(),
            ROLENAME: oView.byId("InputCreate1Role").getValue(),
            DESCRIPTION: oView.byId("InputCreate2Role").getValue()
        };

        
      
        BusyIndicator.show(0);
        delete oUserData._id;
        delete oUserData.DETAIL_ROW;
        
        // Realizar la solicitud a la API para crear el usuario
        //Cambiar URL
        var sUrl = "http://localhost:3020/api/security/createrole";
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
                throw new Error("Error al crear el usuario");
            }
            return response.json();
        })
        .   then(function (data) {
            // Mostrar mensaje de éxito
            MessageToast.show("Rol creado correctamente");
            // Navegar a la vista de tabla
            this.getRouter().navTo("RouteSecurityTable");
        }.bind(this))
        .catch(function (error) {
            BusyIndicator.hide(); // Ocultar indicador de carga
            MessageToast.show("Error: " + error.message);
        });
    },
    });
});
