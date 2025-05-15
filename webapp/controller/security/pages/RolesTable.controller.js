sap.ui.define([ 
    "com/inv/sapfiroriwebinversion/controller/BaseController", 
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, BusyIndicator, MessageToast) {
    "use strict";

    return BaseController.extend("com.inv.sapfiroriwebinversion.controller.security.pages.RolesTable", {
        //Inicializar la clase de RolesTable
        onInit: function () {
            const oRouter = this.getRouter();
            oRouter.getRoute("RouteRoles").attachPatternMatched(this._onRouteMatched, this);
        },
        //Colocar los roles en la tabla 
         _onRouteMatched: function () {
            BusyIndicator.show(0);
            //Inicializar la tabla
            const oTree = this.byId("IdTree1Roles");
            const oModel = new JSONModel();

            // Construir la URL
            var sUrl = "http://localhost:3020/api/security/roles";

                fetch(sUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(response => {
                BusyIndicator.hide();
                if (!response.ok) {
                    throw new Error("Error al obtener los catálogos");
                }
                return response.json();
            })
            .then(data => {
                // data.value es el array de roles
                oModel.setData({ roles: data.value });
                oTree.setModel(oModel);
                // Binding con arrayNames para que TreeTable expanda la propiedad VALUES
                oTree.bindRows({
                    path: "/roles",
                    parameters: { arrayNames: ["VALUES"] }
                });
            })
            .catch(err => {
                BusyIndicator.hide();
                MessageToast.show("Error: " + err.message);
            });
        },
        //Funcion onRefresh para refresacar la tabla
        onRefresh: function () {
            this._onRouteMatched();
        },
        //Boton para redirigir a create Role
        onCreate: function () {
            this.getRouter().navTo("RouteRolesCreate");
        },
        //seleccion de un rol 
        onRowSelectionChange: function (oEvent) {
            //Inicar la seleccion
            const oContext = oEvent.getParameter("rowContext");
            //Verificar si hay un rol seleccionado
            if (!oContext) {
                MessageToast.show("No se seleccionó ninguna fila");
                return;
            }
           
            var oData = oContext.getObject(); // Obtiene los datos de la fila seleccionada
            //Llamada a la funcion onVer
        this.onVer(this, oData);
            },

            //funcion que manda a llamar al modal con los datos seleccionados
        onVer: function (oEvent, oData) {
        var oView = this.getView();

        // Cargar el fragmento si no está cargado
        if (!this._oDialog) {
            this.loadFragment({
                id: oView.getId(),
                name: "com.inv.sapfiroriwebinversion.view.security.components.Role",
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
        //Funcion para cerrar el modal
        onCloseDialog: function () {
            // Cerrar el diálogo
            this._oDialog.close();
        
        },
        //Funcion para mandar a llmar actualizar rol
            onUpdateDialog: function () {
            var oData = this._oDialog.getModel().getData();
            // Cerrar el diálogo
            this.getRouter().navTo("RouteRolesUpdate", {
                ROLEID: oData.ROLEID
            });       
            this._oDialog.close();
        },
        //funcion para eliminar un Role
        onDeleteDialog: function () {
                var oView = this.getView();

                // Cargar el fragmento si no está cargado
                if (!this._oDeleteDialog) {
                    this.loadFragment({
                        id: oView.getId(),
                        name: "com.inv.sapfiroriwebinversion.view.security.components.RoleDelete",
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
        //Funcion en caso de aceptar eliminar un rol 
            onConfirmDelete: function () { 
            // Obtener el usuario seleccionado del modelo del diálogo
            var oData = this._oDialog.getModel().getData();

            // Mostrar indicador de carga
            BusyIndicator.show(0);

            // Construir la URL para la solicitud DELETE
            var sUrl = "http://localhost:3020/api/security/removerole?roleid=" + oData.ROLEID;

            fetch(sUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(function (response) {
                BusyIndicator.hide(); // Ocultar indicador de carga
                if (!response.ok) {
                    throw new Error("Error al eliminar el eol");
                }
                MessageToast.show("Rol eliminado correctamente");
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
        //funcion en caso de cancelar la eliminacion de un rol
        onCancelDelete: function () {
            // Cerrar el diálogo sin realizar ninguna acción
            this._oDeleteDialog.close();
        }

    });
});
