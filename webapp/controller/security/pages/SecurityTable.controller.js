sap.ui.define([
    "com/inv/sapfiroriwebinversion/controller/BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, BusyIndicator, MessageToast) {
    "use strict";

    return BaseController.extend("com.inv.sapfiroriwebinversion.controller.security.pages.SecurityTable", {
        //Constructor de la clase Security Table
        onInit: function () {
            let oRouter = this.getRouter();
            //Obtener la ruta de donde se manda a llmar y realizar el metodo onroutematched
            oRouter.getRoute("RouteSecurity").attachPatternMatched(this._onRouteMatched, this);
        },

        //metodo que realiza la introduccion de datos a la tabla al momento de ejecutar
        _onRouteMatched: function () {
            BusyIndicator.show(0);
            //Inicializar la tabla y el modelo Json
            const oTable = this.byId("IdTable1SecurityTable");
            const oModel = new JSONModel();

            // Construir la URL
            var sUrl = "http://localhost:3020/api/security/users";
            //realizar un fetch con la operacion GET
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
        //Metodo para obtener lo seleccionado cada que se selecciona la tabla
        onRowSelectionChange: function (oEvent) {
        // Obtener el elemento seleccionado
        var oSelectedItem = oEvent.getParameter("rowContext"); // Para sap.m.Table
        if (!oSelectedItem) {
            MessageToast.show("No se seleccionó ninguna fila");
            return;
        }

        // Obtener el contexto del modelo asociado a la fila seleccionada
        var oData = oSelectedItem.getObject(); // Obtiene los datos de la fila seleccionada
        //Llamada al metodo onVer con los datos seleccionados
        this.onVer(this, oData);
            },

        //Metodo onVer que manda a llmar al modal con los datos seleccionados
        onVer: function (oEvent, oData) {
        var oView = this.getView();

        // Cargar el fragmento si no está cargado
        if (!this._oDialog) {
            this.loadFragment({
                id: oView.getId(),
                name: "com.inv.sapfiroriwebinversion.view.security.components.User",
                controller: this
            }).then(function (oDialog) {
                //Ejecitar el fragmento
                this._oDialog = oDialog;
                oView.addDependent(this._oDialog);
                //Ingresar la data en formato JSON
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
        //Funcion para cerrar el modal
        onCloseDialog: function () {
            // Cerrar el diálogo
            this._oDialog.close();
        
        },
        //Funcion para la llamada a la venta de actualizar
            onUpdateDialog: function () {
            var oData = this._oDialog.getModel().getData();
            // Cerrar el diálogo
            this.getRouter().navTo("RouteUpdate", {
                USERID: oData.USERID
            });       
            this._oDialog.close();
        
        },
        //Funcion a la llmada de crear
        onCreate: function () {
            // Navegar a la vista de creación
            this.getRouter().navTo("RouteCreate");
        },
        //Funcion al boton eliminar el cual ejecuta el modal 
        onDeleteDialog: function () {
                var oView = this.getView();

                // Cargar el fragmento si no está cargado
                if (!this._oDeleteDialog) {
                    this.loadFragment({
                        id: oView.getId(),
                        name: "com.inv.sapfiroriwebinversion.view.security.components.UserDelete",
                        controller: this
                    }).then(function (oDialog) {
                        this._oDeleteDialog = oDialog;
                        oView.addDependent(this._oDeleteDialog);
                        this._oDeleteDialog.open();
                    }.bind(this));
                } else {
                    this._oDeleteDialog.open();
                }
        },
        //Funcion en caso de confirmar la eliminacion
            onConfirmDelete: function () {
            // Obtener el usuario seleccionado del modelo del diálogo
            var oData = this._oDialog.getModel().getData();

            // Mostrar indicador de carga
            BusyIndicator.show(0);

            // Construir la URL para la solicitud DELETE
            var sUrl = "http://localhost:3020/api/security/deleteusers?userid=" + oData.USERID;

            fetch(sUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(function (response) {
                BusyIndicator.hide(); // Ocultar indicador de carga
                if (!response.ok) {
                    throw new Error("Error al eliminar el usuario");
                }
                MessageToast.show("Usuario eliminado correctamente");
                this.onRefresh(); // Actualizar la tabla después de eliminar
                this.onCloseDialog(); // Cerrar el diálogo de confirmación
            }.bind(this))
            .catch(function (error) {
                BusyIndicator.hide(); // Ocultar indicador de carga
                MessageToast.show("Error: " + error.message);
            });

            // Cerrar el diálogo
            this._oDeleteDialog.close();
        },
        //Funcion en caso de denegar la elimincacion
        onCancelDelete: function () {
            // Cerrar el diálogo sin realizar ninguna acción
            this._oDeleteDialog.close();
        },
        //Funcion para refrescar la tabla 
        onRefresh: function () {
            BusyIndicator.show(0);
            //seleccionar la tabla
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
                    // Asignar los datos obtenidos al modelo
                    oModel.setData({ users: data.value }); // Asegúrate de que "data.value" sea el array de usuarios
                    oTable.setModel(oModel); // Asignar el modelo a la tabla

                    // Vincular la tabla al modelo
                    oTable.bindRows("/users"); // Vincular las filas de la tabla al array "users"
                }.bind(this))
                .catch(function (error) {
                    BusyIndicator.hide(); // Ocultar indicador de carga
                    // Manejar el error de la solicitud
                    MessageToast.show("Error: " + error.message);
                });
        },
        //Funcion a la tabla de roles
        onRoles: function () {
            this.getRouter().navTo("RouteRoles");
        },
        //Funcion a la tabla de catalogos 
        onCatalogs: function () {
            this.getRouter().navTo("RouteCatalogs");
        }



    })
});
