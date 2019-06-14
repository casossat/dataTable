var rowData;

$(document).ready(function () {
  const URL_TABLE = '/jss/tabla.json'

  //$.ajax({
  //url: URL_TABLE,
  //type: "GET",
  //dataType: "json",
  //success: function (dataSet, status, xhr) {
  const dataSet = {
    "Rowsets": {
      "DateCreated": "2019-06-14T15:03:56", "Version": "15.1 SP6 Patch 0 (Nov 14, 2017)", "StartDate": "2019-06-14T14:03:52+0000", "EndDate": "2019-06-14T15:03:52+0000", "CachedTime": "",
      "Rowset": [
        {
          "Columns": {
            "Column": [
              { "Name": "ORDER_NUMBER", "SourceColumn": "ORDER_NUMBER", "Description": "ORDER_NUMBER", "SQLDataType": 1, "MinRange": 1.0, "MaxRange": 1.0 },
              { "Name": "PRODUCTION_PLANT", "SourceColumn": "PRODUCTION_PLANT", "Description": "PRODUCTION_PLANT", "SQLDataType": 1, "MinRange": 1.0, "MaxRange": 1.0 },
              { "Name": "WORK_CENTER", "SourceColumn": "WORK_CENTER", "Description": "WORK_CENTER", "SQLDataType": 1, "MinRange": 1.0, "MaxRange": 1.0 },
              { "Name": "MATERIAL", "SourceColumn": "MATERIAL", "Description": "MATERIAL", "SQLDataType": 1, "MinRange": 1.0, "MaxRange": 1.0 },
              { "Name": "TARGET_QUANTITY", "SourceColumn": "TARGET_QUANTITY", "Description": "TARGET_QUANTITY", "SQLDataType": 1, "MinRange": 1.0, "MaxRange": 1.0 },
              { "Name": "UNIT", "SourceColumn": "UNIT", "Description": "UNIT", "SQLDataType": 1, "MinRange": 1.0, "MaxRange": 1.0 },
              { "Name": "SCHED_RELEASE_DATE", "SourceColumn": "SCHED_RELEASE_DATE", "Description": "SCHED_RELEASE_DATE", "SQLDataType": 1, "MinRange": 1.0, "MaxRange": 1.0 },
              { "Name": "OPERATION_NUMBER", "SourceColumn": "OPERATION_NUMBER", "Description": "OPERATION_NUMBER", "SQLDataType": 1, "MinRange": 1.0, "MaxRange": 1.0 }]
          },
          "Row": [
            { "ORDER_NUMBER": "000001001160", "PRODUCTION_PLANT": "1001", "WORK_CENTER": "PLAN1001", "MATERIAL": "000000000003000170", "TARGET_QUANTITY": "8000", "UNIT": "Pieza", "SCHED_RELEASE_DATE": "2019-07-16", "OPERATION_NUMBER": "0010" },
            { "ORDER_NUMBER": "000001001201", "PRODUCTION_PLANT": "1001", "WORK_CENTER": "PLAN1001", "MATERIAL": "000000000003000170", "TARGET_QUANTITY": "99999", "UNIT": "Pieza", "SCHED_RELEASE_DATE": "2019-06-03", "OPERATION_NUMBER": "0010" },
            { "ORDER_NUMBER": "000001001202", "PRODUCTION_PLANT": "1001", "WORK_CENTER": "PLAN1001", "MATERIAL": "000000000003000170", "TARGET_QUANTITY": "99999", "UNIT": "Pieza", "SCHED_RELEASE_DATE": "2019-06-03", "OPERATION_NUMBER": "0010" },
            { "ORDER_NUMBER": "001151515151", "PRODUCTION_PLANT": "1888", "WORK_CENTER": "PLAN8888", "MATERIAL": "000000000003000170", "TARGET_QUANTITY": "99999", "UNIT": "Pieza", "SCHED_RELEASE_DATE": "2019-06-03", "OPERATION_NUMBER": "0010" },
            { "ORDER_NUMBER": "001151515151", "PRODUCTION_PLANT": "1777", "WORK_CENTER": "PLAN8877", "MATERIAL": "000000000003000170", "TARGET_QUANTITY": "99999", "UNIT": "Pieza", "SCHED_RELEASE_DATE": "2019-06-03", "OPERATION_NUMBER": "0010" }]
        }]
    }
  }

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
      this.api().columns(1).every(function () {
        var column = this;
        var planta = $('<select class="form-control" name="planta_select"><option value="">Seleccionar</option></select>')
          .appendTo("#planta")
          .on('change', function () {
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
  //}
  //});
  //});

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
})