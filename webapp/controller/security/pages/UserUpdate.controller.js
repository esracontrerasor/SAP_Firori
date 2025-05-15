sap.ui.define([
    "com/inv/sapfiroriwebinversion/controller/BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, BusyIndicator, MessageToast) {
    "use strict";

    return BaseController.extend("com.inv.sapfiroriwebinversion.controller.security.pages.SecurityTable", {
        //Controlador con la llamda de roles para colocar en el combobox
        onInit: function () {
 
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
        
        this.getView().setModel(oViewModel, "userModel"); // Asignar el modelo con el nombre "userModel"
    }.bind(this))
    .catch(function (error) {
        BusyIndicator.hide(); // Ocultar indicador de carga
        MessageToast.show("Error: " + error.message);
    });
},
    //Agregar un rol a la lista
    onAddRole: function () {
        var oView = this.getView();
        var oComboBox = oView.byId("ComboBoxRoles1");
        var sSelectedRole = oComboBox.getSelectedKey();

        if (!sSelectedRole) {
            MessageToast.show("Por favor, seleccione un rol.");
            return;
        }

        // Obtener el modelo de usuario
        var oUserModel = oView.getModel("userModel");
        var aRoles = oUserModel.getProperty("/ROLES");

        // Verificar si el rol ya está en la lista
        var bExists = aRoles.some(function (role) {
            return role.ROLEID === sSelectedRole;
        });

        if (bExists) {
            MessageToast.show("El rol ya está añadido.");
            return;
        }

        // Añadir el rol seleccionado
        var oRolesModel = oView.getModel("rolesModel");
        var aAvailableRoles = oRolesModel.getProperty("/roles");
        var oSelectedRole = aAvailableRoles.find(function (role) {
            return role.ROLEID === sSelectedRole;
        });

        if (oSelectedRole) {
            aRoles.push(oSelectedRole);
            oUserModel.setProperty("/ROLES", aRoles);
            MessageToast.show("Rol añadido correctamente.");
        }
    },

    //Remover un rol de la lista 
    onRemoveRole: function (oEvent) {
        // Obtener el ID del rol a eliminar
        var sRoleId = oEvent.getSource().data("roleid");
       
        // Obtener el modelo de usuario
        var oUserModel = this.getView().getModel("userModel");
        var aRoles = oUserModel.getProperty("/ROLES");
        
        // Filtrar los roles para eliminar el seleccionado
        var aUpdatedRoles = aRoles.filter(function (role) {          
            return role.ROLEID !== sRoleId;
        });

        // Actualizar el modelo con la nueva lista de roles
        oUserModel.setProperty("/ROLES", aUpdatedRoles);
        // Mostrar un mensaje de confirmación
        MessageToast.show("Rol eliminado correctamente.");
    },
    //Guardar cambios y mandarlos a la api
    onSave: function () {
        // Obtener el modelo de la vista
        var oViewModel = this.getView().getModel("userModel");
        // Obtener los datos del modelo
        var oData = oViewModel.getData();
        var oUserData = oViewModel.getData();
        // Mostrar indicador de carga 
        BusyIndicator.show(0);
        //Elimiacion de parametros 
        delete oUserData._id;
        delete oUserData.DETAIL_ROW
        delete oUserData.__v

         if (Array.isArray(oUserData.ROLES)) {
        oUserData.ROLES.forEach(function (role) {
            delete role._id;
            delete role.ROLENAME;
            delete role.DESCRIPTION;
            delete role.PRIVILEGES;
            delete role.DETAIL_ROW;
        });
        }

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
                console.log("Data to be sent:", JSON.stringify({user:oUserData}))
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
