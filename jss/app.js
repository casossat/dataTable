var rowData;

$(document).ready(function() {

    $.ajax({
        url: "tabla",
        type: "GET",
        dataType: "json",
        success: function(dataSet, status, xhr) {
            var Rowset = dataSet.Rowsets['Rowset'];
            var Row = Rowset[0].Row;
            var data = new Array(Row.length);
            for (i = 0; i < Row.length; i++) {
                data[i] = [
                    Row[i].ORDER_NUMBER,
                    Row[i].PRODUCTION_PLANT,
                    Row[i].WORK_CENTER,
                    Row[i].MATERIAL,
                    Row[i].TARGET_QUANTITY,
                    Row[i].UNIT,
                    Row[i].SCHED_RELEASE_DATE,
                    Row[i].OPERATION_NUMBER
                ];
            }

            var tabla = $('#prueba').DataTable({
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
                    title: "Cantidad a Producir"
                }, {
                    title: "UM"
                }, {
                    title: "Fecha Liberación"
                }, {
                    title: "No. Operación"
                }],
                createdRow: function(row, data, index) {
                    row.id = data[index + 6] + "-" + data[index + 7];
                    $('td', row).eq(1).addClass('prueba');
                },
                initComplete: function() {
                    this.api().columns(1).every(function() {
                        var column = this;
                        var planta = $('<select class="form-control"><option value="">Seleccionar</option></select>')
                            .appendTo("#planta")
                            .on('change', function() {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );

                                column
                                    .search(val ? '^' + val + '$' : '', true, false)
                                    .draw();
                            });

                        column.data().unique().sort().each(function(d, j) {
                            planta.append('<option value="' + d + '">' + d + '</option>')
                        });
                    });
                    this.api().columns(2).every(function() {
                        var column = this;
                        var estacion = $('<select class="form-control"><option value="">Seleccionar</option></select>')
                            .appendTo("#estacion")
                            .on('change', function() {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );

                                column
                                    .search(val ? '^' + val + '$' : '', true, false)
                                    .draw();
                            });

                        column.data().unique().sort().each(function(d, j) {
                            estacion.append('<option value="' + d + '">' + d + '</option>')
                        });
                    });
                },
                "destroy": true,
                "select": true
            });

            tabla.on('select', function(e, dt, type, indexes) {
                document.getElementById('error').innerHTML = '';
                rowData = tabla.rows(indexes).data();
                var orden = rowData[0][0];
                document.getElementById('orden').value = orden;
                var cantidad = rowData[0][4];
                $.ajax({
                    url: 'http://sapmii.tag-consulting.mx:50000/XMII/Illuminator?QueryTemplate=Proceso%20de%20Cajas/Produccion&SelectedTagsValue=' + cantidad + '&TagValueEncoded=%22true%22',
                    type: 'post',
                    dataType: 'json',
                    timeout: 10000,
                    success: function(data, status, xhr) {}
                });
            });
        }
    });

});


function producir() {
    if (rowData != null) {
        $.ajax({
            url: 'http://sapmii.tag-consulting.mx:50000/XMII/Illuminator?QueryTemplate=Proceso%20de%20Cajas/Encendido&SelectedTagsValue=1&TagValueEncoded=%22true%22',
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            success: function(data, status, xhr) {}
        });
        setTimeout(function() {
            data = "?orden=" + rowData[0][0];
            window.location = 'orderDetails.html' + data;
        }, 5000);
    } else {
        $('#error').html(
            '<div class="alert alert-warning" role="alert">' +
            'Debes seleccionar una orden' +
            '</div>');
    }
}