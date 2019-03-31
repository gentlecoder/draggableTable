/**
 * Created by gentlecoder on 9/4/2017.
 */
// <reference path="../typings/browser/ambient/jquery/jquery.d.ts"/>
(function($) {
  $.fn.tabullet = function(options) {
    var defaults = {
      rowClass: "",
      columnClass: "",
      tableClass: "table",
      textClass: "form-control",
      editClass: "btn btn-default",
      deleteClass: "btn btn-danger",
      saveClass: "btn btn-success",
      deleteContent: "Delete",
      editContent: "Edit",
      saveContent: "Save",
      action: function() {}
    };
    options = $.extend(defaults, options);
    var columns = $(this).find("thead > tr th");
    var idMap = $(this)
      .find("thead > tr")
      .first()
      .attr("data-tabullet-map");
    var metadata = [];
    columns.each(function(i, v) {
      metadata.push({
        map: $(v).attr("data-tabullet-map"),
        readonly: $(v).attr("data-tabullet-readonly"),
        type: $(v).attr("data-tabullet-type")
      });
    });
    var index = 0;
    var data = options.data;
    $(data).each(function(i, v) {
      v._index = index++;
    });
    var select = options.select;
    var table = this;
    $(table)
      .find("tbody")
      .remove();
    var tbody = $("<tbody/>").appendTo($(this));
    // INSERT
    var insertRow = $("<tr/>")
      .appendTo($(tbody))
      .attr("data-tabullet-id", "-1");
    $(metadata).each(function(i, v) {
      if (v.type === "delete") {
        var td = $("<td/>").appendTo(insertRow);
        return;
      }
      if (v.type === "edit") {
        var td = $("<td/>")
          .html(
            '<button class="' +
              options.saveClass +
              '">' +
              options.saveContent +
              "</button>"
          )
          .attr("data-tabullet-type", "save")
          .appendTo(insertRow);
        td.find("button").click(function(event) {
          // var saveData = [];
          var saveData = {};
          var rowParent = td.closest("tr");
          var rowChildren = rowParent.find("input");
          $(rowChildren).each(function(ri, rv) {
            saveData[$(rv).attr("name")] = $(rv).val();
          });
          var rowSelectChildren = rowParent.find("select");
          $(rowSelectChildren).each(function(ri, rv) {
            saveData[$(rv).attr("name")] = $(rv).val();
          });
          // saveData[_index] =
          options.action("save", saveData);
          return;
        });
        return;
      }
      if (v.type === "select") {
        var selectHtml = '<select name="' + v.map + '">';
        for (var i = 0; i < select.length; i++) {
          selectHtml += "<option>" + select[i].value + "</option>";
        }
        selectHtml += "</select>";
        var td = $("<td/>")
          .html(selectHtml)
          .attr("data-tabullet-type", "select")
          .appendTo(insertRow);
        return;
      }
      if (v.readonly !== "true") {
        $("<td/>")
          .html(
            '<input type="text" name="' +
              v.map +
              '" class="' +
              options.textClass +
              '"/>'
          )
          .appendTo(insertRow);
      } else {
        $("<td/>").appendTo(insertRow);
      }
    });
    $(data).each(function(i, v) {
      var tr = $("<tr/>")
        .appendTo($(tbody))
        .attr("data-tabullet-id", v[idMap]);
      $(metadata).each(function(mi, mv) {
        if (mv.type === "delete") {
          var td = $("<td/>")
            .html(
              '<button class="' +
                options.deleteClass +
                '">' +
                options.deleteContent +
                "</button>"
            )
            .attr("data-tabullet-type", mv.type)
            .appendTo(tr);
          td.find("button").click(function(event) {
            tr.remove();
            options.action("delete", $(tr).attr("data-tabullet-id"));
          });
        } else if (mv.type === "edit") {
          var td = $("<td/>")
            .html(
              '<button class="' +
                options.editClass +
                '">' +
                options.editContent +
                "</button>"
            )
            .attr("data-tabullet-type", mv.type)
            .appendTo(tr);
          td.find("button").click(function(event) {
            if ($(this).attr("data-mode") === "edit") {
              // var editData = [];
              var editData = {};
              var rowParent = td.closest("tr");
              var rowChildren = rowParent.find("input");
              $(rowChildren).each(function(ri, rv) {
                editData[$(rv).attr("name")] = $(rv).val();
              });
              var rowSelectChildren = rowParent.find("select");
              $(rowSelectChildren).each(function(ri, rv) {
                editData[$(rv).attr("name")] = $(rv).val();
              });
              editData[idMap] = $(rowParent).attr("data-tabullet-id");
              options.action("edit", editData);
              return;
            }
            $(this)
              .removeClass(options.editClass)
              .addClass(options.saveClass)
              .html(options.saveContent)
              .attr("data-mode", "edit");
            var rowParent = td.closest("tr");
            var rowChildren = rowParent.find("td");
            $(rowChildren).each(function(ri, rv) {
              if (
                $(rv).attr("data-tabullet-type") === "edit" ||
                $(rv).attr("data-tabullet-type") === "delete"
              ) {
                return;
              }
              var mapName = $(rv).attr("data-tabullet-map");
              if ($(rv).attr("data-tabullet-type") === "select") {
                var selectHtml = '<select name="' + mapName + '">';
                for (var i = 0; i < select.length; i++) {
                  if (select[i].value === v[mapName]) {
                    selectHtml +=
                      "<option selected>" + select[i].value + "</option>";
                  } else {
                    selectHtml += "<option>" + select[i].value + "</option>";
                  }
                }
                selectHtml += "</select>";
                $(rv)
                  .html(selectHtml)
                  .attr("data-tabullet-type", "select");
                return;
              }
              if ($(rv).attr("data-tabullet-readonly") !== "true") {
                $(rv).html(
                  '<input type="text" name="' +
                    mapName +
                    '" value="' +
                    v[mapName] +
                    '" class="' +
                    options.textClass +
                    '"/>'
                );
              }
            });
          });
        } else {
          var td = $("<td/>")
            .html(v[mv.map])
            .attr("data-tabullet-map", mv.map)
            .attr("data-tabullet-readonly", mv.readonly)
            .attr("data-tabullet-type", mv.type)
            .attr("draggable", true)
            .appendTo(tr);
        }
      });
    });
  };
})(jQuery);
