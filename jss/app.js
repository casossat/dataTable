var rowData;

$(document).ready(function () {
  const URL_TABLE = '/jss/tabla.json'
  var planta = null
  var estacion = null

  $.ajax({
    url: URL_TABLE,
    type: "GET",
    dataType: "json",
    success: function (dataSet, status, xhr) {
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
        createdRow: function (row, data, index) {
          row.id = data[index + 6] + "-" + data[index + 7];
          $('td', row).eq(1).addClass('prueba');
        },
        initComplete: function () {
          hideTableInfo()

          this.api().columns(1).every(function () {
            var column = this;
            var planta = $('<select class="form-control" name="planta_select"><option value="">Seleccionar</option></select>')
              .appendTo("#planta")
              .on('change', function () {
                planta = $(this).val()

                if ($(this).val())
                  showTableInfo()
                else if (!estacion)
                  hideTableInfo()

                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });

            column.data().unique().sort().each(function (d, j) {
              planta.append('<option value="' + d + '">' + d + '</option>')
            });
          });
          this.api().columns(2).every(function () {
            var column = this;
            var estacion = $('<select class="form-control" name="estacion_select"><option value="">Seleccionar</option></select>')
              .appendTo("#estacion")
              .on('change', function () {
                estacion = $(this)

                if ($(this).val())
                  showTableInfo()
                else if (!planta)
                  hideTableInfo()

                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });

            column.data().unique().sort().each(function (d, j) {
              estacion.append('<option value="' + d + '">' + d + '</option>')
            });
          });
        },
        "destroy": true,
        "select": true
      });

      tabla.on('select', function (e, dt, type, indexes) {
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
          success: function (data, status, xhr) { }
        });
      });
    }
  });

  function hideTableInfo() {
    var table = $('#prueba')

    if (table) {
      var colspan = table.find('thead tr:first-child').children('th').length

      table.find('tbody').css("display", "none")

      setTimeout(function () {
        table.append('<tbody class="hide_info"><tr><td class="odd" colspan="' + colspan + '" id="tableRowShow">No hay registros para mostrar</td></tr></tbody>')
        table.find('thead').css("display", 'none')

        $('.dataTables_info').text('Mostrando 0 registros de 0 en total')
      }, 200)

      $('.dataTables_paginate').css("display", "none")

      $('.dataTables_length').css('display', 'none')
      $('.dataTables_filter').css('display', 'none')
    }
  }

  function showTableInfo() {
    $('#prueba').find('thead').css('display', 'table-header-group')
    $('#prueba').find('tbody:not(.hide_info)').removeAttr('style')
    $('#prueba').find('tbody.hide_info').css('display', 'table-row-group;')
    $('.dataTables_paginate').css("display", "block")
    $('.dataTables_length').css('display', 'block')
    $('.dataTables_filter').css('display', 'block')
  }

});

function producir() {
  if (rowData != null) {
    $.ajax({
      url: 'http://sapmii.tag-consulting.mx:50000/XMII/Illuminator?QueryTemplate=Proceso%20de%20Cajas/Encendido&SelectedTagsValue=1&TagValueEncoded=%22true%22',
      type: 'post',
      dataType: 'json',
      timeout: 10000,
      success: function (data, status, xhr) { }
    });
    setTimeout(function () {
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