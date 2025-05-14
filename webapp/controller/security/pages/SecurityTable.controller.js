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
          
        },
        onRowSelectionChange: function (oEvent) {
    // Obtener el elemento seleccionado
        var oSelectedItem = oEvent.getParameter("rowContext"); // Para sap.m.Table
        if (!oSelectedItem) {
            MessageToast.show("No se seleccionó ninguna fila");
            return;
        }

        // Obtener el contexto del modelo asociado a la fila seleccionada
       // var oContext = oSelectedItem.getBindingContext();
        var oData = oSelectedItem.getObject(); // Obtiene los datos de la fila seleccionada

        this.onVer(this, oData);
            },


        onVer: function (oEvent, oData) {
        var oView = this.getView();

        // Cargar el fragmento si no está cargado
        if (!this._oDialog) {
            this.loadFragment({
                id: oView.getId(),
                name: "com.inv.sapfiroriwebinversion.view.security.components.User",
                controller: this
            }).then(function (oDialog) {
                this._oDialog = oDialog;
                oView.addDependent(this._oDialog);

                var oDialogModel = new JSONModel(oData);
                this._oDialog.setModel(oDialogModel);
                // Mostrar el diálogo
                this._oDialog.open();
            }.bind(this));
        } else {
            // Establecer los datos seleccionados en el modelo del fragmento
            var oDialogModel = new JSONModel(oData);
            this._oDialog.setModel(oDialogModel);
            // Mostrar el diálogo si ya está cargado
            this._oDialog.open();
        }
    },


            onCloseDialog: function () {
            // Cerrar el diálogo
            this._oDialog.close();
        
        },
            onUpdateDialog: function () {
            var oData = this._oDialog.getModel().getData();
            // Cerrar el diálogo
            this.getRouter().navTo("RouteUpdate", {
                USERID: oData.USERID
            });       
            this._oDialog.close();
        
        },    onDeleteDialog: function () {
            // Cerrar el diálogo
            this.getRouter().navTo("RouteUpdate");        
            this._oDialog.close();
        
        }



    });
});
