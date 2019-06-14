var noOrden;
var cantidad;
var defectuosas;
var duracion;


$(document).ready(function() {

    var x = document.getElementById("movimiento");
    x.style.display = "none";
    var orden = getParameterByName('orden');
    var d = new Date();
    var mm = d.getMonth() + 1;
    var dd = d.getDate();
    var yyyy = d.getFullYear();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    if (mm < 10) mm = "0" + mm;
    if (dd < 10) dd = "0" + dd;
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    var fecha = yyyy + "-" + mm + "-" + dd + " " + h + ":" + m + ":" + s;
    $.ajax({
        url: "http://sapmii.tag-consulting.mx:50000/XMII/Illuminator?QueryTemplate=GetProductionOrder%2FQueryGetProdOrdList&IsTesting=T&Content-Type=text%2Fjson",
        type: "GET",
        dataType: "json",
        success: function(dataSet, status, xhr) {
            var Rowset = dataSet.Rowsets['Rowset'];
            var Row = Rowset[0].Row;
            var interval = setInterval(ajaxCall, 500);

            function ajaxCall() {
                $.ajax({
                    url: 'http://sapmii.tag-consulting.mx:50000/XMII/Illuminator?QueryTemplate=Proceso+de+Cajas%2FCajas&IsTesting=T&Content-Type=text%2Fjson&JSESSIONID=Fkl0v6DZSNi8ekuffLEZAOTJM1p5aQFSOXQA_SAPIlifsF131PChrpJN8SrYrhQL',
                    dataType: 'json',
                    timeout: 20000,
                    success: function(data, status, xhr) {
                        var Rowset2 = data.Rowsets['Rowset'];
                        var Row2 = Rowset2[0].Row;
                        var data2 = Row2[0];
                        if (data2.Termino == 1) {
                            clearInterval(interval);
                            var d1 = new Date();
                            var h1 = d1.getHours();
                            var m1 = d1.getMinutes();
                            var s1 = d1.getSeconds();
                            var horas = (h1 - h);
                            var minutos = (m1 - m);
                            var segundos = (s1 - s);
                            if (horas < 0) horas = ((h1 - h) * (-1));
                            if (minutos < 0) segundos = ((m1 - m) * (-1));
                            if (segundos < 0) segundos = ((s1 - s) * (-1));
                            if (horas < 10) horas = "0" + horas;
                            if (minutos < 10) minutos = "0" + minutos;
                            if (segundos < 10) segundos = "0" + segundos;
                            var fecha1 = yyyy + "-" + mm + "-" + dd + " " + h1 + ":" + m1 + ":" + s1;
		    duracion = horas + ":" + minutos + ":" + segundos;
                            console.log(fecha1);
                            for (i = 0; i < Row.length; i++) {
                                if (Row[i].ORDER_NUMBER == orden) {
                                    var data = new Array([Row[i].ORDER_NUMBER,
                                        Row[i].PRODUCTION_PLANT,
                                        Row[i].WORK_CENTER,
                                        Row[i].MATERIAL,
                                        Row[i].TARGET_QUANTITY,
                                        Row[i].UNIT,
                                        Row[i].SCHED_RELEASE_DATE,
                                        Row[i].OPERATION_NUMBER,
                                        fecha,
                                        fecha1,
                                        duracion,
                                        Row2[0].NoCajasrefinadas,
                                        Row2[0].NoCajasdefectuosas,
                                    ]);
                                }
                            }
                            x.style.display = "block";
		noOrden = data[0][0];
	cantidad = Row2[0].NoCajasrefinadas;
	defectuosas = Row2[0].NoCajasdefectuosas;
                        } else {

                            for (i = 0; i < Row.length; i++) {
                                if (Row[i].ORDER_NUMBER == orden) {
                                    var data = new Array([Row[i].ORDER_NUMBER,
                                        Row[i].PRODUCTION_PLANT,
                                        Row[i].WORK_CENTER,
                                        Row[i].MATERIAL,
                                        Row[i].TARGET_QUANTITY,
                                        Row[i].UNIT,
                                        Row[i].SCHED_RELEASE_DATE,
                                        Row[i].OPERATION_NUMBER,
                                        fecha,
                                        "",
                                        "",
                                        Row2[0].NoCajasrefinadas,
                                        Row2[0].NoCajasdefectuosas,
                                    ]);
                                }
                            }
                        }
                        var tabla = $('#detalle').DataTable({
                            data: data,
                            columns: [{
                                title: "Orden"
                            }, {
                                title: "Centro"
                            }, {
                                title: "Estación"
                            }, {
                                title: "Material"
                            }, {
                                title: "Cantidad"
                            }, {
                                title: "UM"
                            }, {
                                title: "Fecha Liberación"
                            }, {
                                title: "No. Operación"
                            }, {
                                title: "Fecha inicio"
                            }, {
                                title: "Fecha termino"
                            }, {
                                title: "Duración"
                            }, {
                                title: "Cajas refinadas"
                            }, {
                                title: "Cajas defectuosas"
                            }],
                            "searching": false,
                            "paging": false,
                            "ordering": false,
                            "info": false,
                            "destroy": true
                        });
	console.log(noOrden);
	console.log(cantidad);
                    }
                });
            }
        }
    });
});

$('#movimiento').click(function(){
                $.ajax({
                    url: 'http://sapmii.tag-consulting.mx:50000/XMII/Runner?Transaction=GetProductionOrder/CreateMaterialDocument&orden='+noOrden+'&cantidad='+cantidad+'&tiempo='+duracion+'&defectuosas='+defectuosas+'',
                    type: 'post',
                    dataType: 'json',
                    timeout: 10000,
                    success: function(data,status,xhr){
	var documento = materialDocument;
                    }
                 });
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}