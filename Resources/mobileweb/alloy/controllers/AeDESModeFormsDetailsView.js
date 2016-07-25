function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function OnFormNo_Change() {
        Alloy.Globals.AeDESModeDetails["FORM_NO"] = $.widgetAppTextFieldAeDESModeFormsDetailsFormNo.get_text_value();
    }
    function OnDate_Change() {
        Alloy.Globals.AeDESModeDetails["DATE"] = Date.parse($.datePickerDate.getValue());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "AeDESModeFormsDetailsView";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.aedesModeFormsDetailsWindow = Ti.UI.createWindow({
        title: L("aedes_mode_form_details_view_title"),
        backgroundColor: "#ffffcc",
        id: "aedesModeFormsDetailsWindow"
    });
    $.__views.aedesModeFormsDetailsWindow && $.addTopLevelView($.__views.aedesModeFormsDetailsWindow);
    $.__views.viewAppTextFieldAeDESModeFormsDetailsFormNo = Ti.UI.createView({
        top: 10,
        height: 50,
        width: Ti.UI.FILL,
        id: "viewAppTextFieldAeDESModeFormsDetailsFormNo"
    });
    $.__views.aedesModeFormsDetailsWindow.add($.__views.viewAppTextFieldAeDESModeFormsDetailsFormNo);
    $.__views.widgetAppTextFieldAeDESModeFormsDetailsFormNo = Alloy.createWidget("com.diseg.AppTextField", "widget", {
        id: "widgetAppTextFieldAeDESModeFormsDetailsFormNo",
        __parentSymbol: $.__views.viewAppTextFieldAeDESModeFormsDetailsFormNo
    });
    $.__views.widgetAppTextFieldAeDESModeFormsDetailsFormNo.setParent($.__views.viewAppTextFieldAeDESModeFormsDetailsFormNo);
    $.__views.viewDate = Ti.UI.createView({
        top: 80,
        left: 0,
        right: 10,
        height: 100,
        id: "viewDate"
    });
    $.__views.aedesModeFormsDetailsWindow.add($.__views.viewDate);
    $.__views.lblDate = Ti.UI.createLabel({
        text: L("generic_date_text_msg"),
        left: 0,
        width: 50,
        height: 50,
        font: {
            fontFamily: "Arial",
            fontWeight: "bold",
            fontSize: "12"
        },
        color: "#000",
        textAlign: "right",
        id: "lblDate"
    });
    $.__views.viewDate.add($.__views.lblDate);
    $.__views.viewDisabler = Ti.UI.createView({
        left: 60,
        right: 10,
        borderColor: "transparent",
        backgroundColor: "transparent",
        zIndex: 1,
        id: "viewDisabler"
    });
    $.__views.viewDate.add($.__views.viewDisabler);
    $.__views.datePickerDate = Ti.UI.createPicker({
        left: 60,
        right: 10,
        type: Titanium.UI.PICKER_TYPE_DATE,
        selectionIndicator: true,
        useSpinner: true,
        id: "datePickerDate"
    });
    $.__views.viewDate.add($.__views.datePickerDate);
    OnDate_Change ? $.__views.datePickerDate.addEventListener("change", OnDate_Change) : __defers["$.__views.datePickerDate!change!OnDate_Change"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var current_is_synchronized = args.is_synchronized;
    var view_enabled = true;
    "undefined" != typeof current_is_synchronized && (view_enabled = "0" == current_is_synchronized);
    try {
        $.widgetAppTextFieldAeDESModeFormsDetailsFormNo.init(L("generic_formno_txt_hint"), OnFormNo_Change, null, 4);
        $.widgetAppTextFieldAeDESModeFormsDetailsFormNo.set_text_value(Alloy.Globals.AeDESModeDetails["FORM_NO"]);
        $.widgetAppTextFieldAeDESModeFormsDetailsFormNo.enabled(view_enabled);
        $.viewDisabler.setHeight($.datePickerDate.getHeight());
        $.viewDisabler.visible = !view_enabled;
        if (Alloy.Globals.AeDESModeDetails["DATE"]) {
            var saved_date = new Date();
            saved_date.setTime(Alloy.Globals.AeDESModeDetails["DATE"]);
            $.datePickerDate.setValue(saved_date);
        }
        $.aedesModeFormsDetailsWindow.open();
    } catch (exception) {
        Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
    }
    __defers["$.__views.datePickerDate!change!OnDate_Change"] && $.__views.datePickerDate.addEventListener("change", OnDate_Change);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;