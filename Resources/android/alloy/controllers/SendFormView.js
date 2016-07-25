function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function OnAndroidBackButton_Click() {
        bIsWorkInProgress || Back();
    }
    function Back() {
        try {
            $.viewSendFormViewWindow.close();
        } catch (exception) {
            Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
        }
    }
    function OnBtnNext_Click() {
        try {
            BusyAction($.activity_indicator, controls, function() {
                var bRet = false;
                if (Alloy.Globals.SendFormPreview && "1" == Alloy.Globals.SendFormPreview) {
                    var intent = Ti.Android.createIntent({
                        action: Ti.Android.ACTION_VIEW,
                        type: "application/pdf",
                        data: current_pdf_native_path
                    });
                    try {
                        $.viewSendFormViewWindow.getActivity().startActivityForResult(intent, function(e) {
                            if (e.error) {
                                alert(L("form_preview_not_possible_msg"));
                                SendForm();
                            } else SendForm();
                        });
                    } catch (exception) {
                        alert(L("form_preview_not_possible_msg"));
                        SendForm();
                    }
                } else SendForm();
                bRet = true;
                return bRet;
            });
        } catch (exception) {
            Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
        }
    }
    function SendForm() {
        try {
            bIsWorkInProgress = true;
            BeginAsyncBusyAction($.activity_indicator, controls, function() {
                var bRet = false;
                var zipContent = new Array();
                zipContent.push(current_pdf_native_path);
                var all_media_found = true;
                if (Alloy.Globals.SendFormMediaContents && "1" == Alloy.Globals.SendFormMediaContents) {
                    switch (current_type) {
                      case "UsersResidents":
                        var Utils = require("/UsersResidentsModeUtils");
                        break;

                      case "AeDES":
                        var Utils = require("/AeDESModeUtils");
                        break;

                      case "Shed":
                        var Utils = require("/ShedModeUtils");
                        break;

                      case "ATC20":
                        var Utils = require("/ATC20ModeUtils");
                    }
                    var media_array = Utils.CreateMediaArray(current_form_id, false);
                    if (media_array && media_array.length > 0) for (var i = 1; i <= media_array.length; i++) {
                        var media = media_array[i - 1];
                        all_media_found &= media.media_found;
                        if (media.media_found) {
                            zipContent.push(media.media);
                            var fileName = null;
                            fileName = "PIC" == media.type ? media.path.replace(".png", "") : "VID" == media.type ? media.path.replace(".3gp", "") : "";
                            var newFile = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory(), fileName + "_data.dat");
                            newFile.exists() && newFile.deleteFile();
                            newFile.write("Latitude: " + media.latitude + "\nLongitude: " + media.longitude + "\nAddress: " + media.address + "\nHeading: " + media.heading + "\nDamages level: " + media.damages_level + "\nDamages area: " + media.damages_area + "\nComment: " + media.comment);
                            zipContent.push(newFile.getNativePath());
                        }
                    }
                }
                var formZipArchive = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory(), current_zip_filename);
                formZipArchive.exists() && formZipArchive.deleteFile();
                var compressedZipArchive = require("ti.compression");
                compressedZipArchive.zip(formZipArchive.getNativePath(), zipContent);
                EndAsyncBusyAction($.activity_indicator, controls, EndAsyncBusyAction_CallBack);
                if (all_media_found) {
                    var emailDialog = Ti.UI.createEmailDialog();
                    if (emailDialog.isSupported()) {
                        emailDialog.subject = L(current_email_subject_language_msg);
                        emailDialog.addAttachment(formZipArchive);
                        emailDialog.addEventListener("complete", function(e) {
                            e.result == emailDialog.SENT && Back();
                        });
                        emailDialog.open();
                    } else alert(L("no_email_client_configured_msg"));
                } else {
                    var alertDialog = Titanium.UI.createAlertDialog({
                        title: L("generic_missing_media_contents_title"),
                        message: L("missing_media_contents_default_msg"),
                        buttonNames: [ L("generic_yes_msg"), L("generic_no_msg") ],
                        cancel: 1
                    });
                    alertDialog.addEventListener("click", function(e) {
                        if (0 == e.index) {
                            var emailDialog = Ti.UI.createEmailDialog();
                            if (emailDialog.isSupported()) {
                                emailDialog.subject = L(current_email_subject_language_msg);
                                emailDialog.addAttachment(formZipArchive);
                                emailDialog.addEventListener("complete", function(e) {
                                    e.result == emailDialog.SENT && Back();
                                });
                                emailDialog.open();
                            } else alert(L("no_email_client_configured_msg"));
                        }
                    });
                    alertDialog.show();
                }
                bRet = true;
                return bRet;
            }, EndAsyncBusyAction_CallBack);
        } catch (exception) {
            Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
        }
    }
    function EndAsyncBusyAction_CallBack() {
        bIsWorkInProgress = false;
    }
    function OnPreview_Change() {
        try {
            var newPreviewValue = $.widgetAppCheckBoxSendFormViewPreview.get_value();
            Alloy.Globals.SendFormPreview = newPreviewValue;
            Ti.App.Properties.setString("send_form_preview", newPreviewValue);
        } catch (exception) {
            Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
        }
    }
    function OnMediaContents_Change() {
        try {
            var newMediaContentsValue = $.widgetAppCheckBoxSendFormViewMediaContents.get_value();
            Alloy.Globals.SendFormMediaContents = newMediaContentsValue;
            Ti.App.Properties.setString("send_form_media_contents", newMediaContentsValue);
        } catch (exception) {
            Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "SendFormView";
    this.args = arguments[0] || {};
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
    $.__views.viewSendFormViewWindow = Ti.UI.createWindow({
        title: L("send_form_view_title"),
        backgroundColor: "#ffffcc",
        id: "viewSendFormViewWindow"
    });
    $.__views.viewSendFormViewWindow && $.addTopLevelView($.__views.viewSendFormViewWindow);
    OnAndroidBackButton_Click ? $.__views.viewSendFormViewWindow.addEventListener("android:back", OnAndroidBackButton_Click) : __defers["$.__views.viewSendFormViewWindow!android:back!OnAndroidBackButton_Click"] = true;
    OnAndroidBackButton_Click ? $.__views.viewSendFormViewWindow.addEventListener("androidback", OnAndroidBackButton_Click) : __defers["$.__views.viewSendFormViewWindow!androidback!OnAndroidBackButton_Click"] = true;
    $.__views.activity_indicator = Ti.UI.createActivityIndicator({
        color: "#000",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 11,
            fontWeight: "bold"
        },
        style: Ti.UI.ActivityIndicatorStyle.DARK,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        zIndex: 1,
        id: "activity_indicator"
    });
    $.__views.viewSendFormViewWindow.add($.__views.activity_indicator);
    $.__views.scrollViewSendForm = Ti.UI.createScrollView({
        top: 10,
        contentWidth: "100%",
        scrollType: "vertical",
        id: "scrollViewSendForm"
    });
    $.__views.viewSendFormViewWindow.add($.__views.scrollViewSendForm);
    $.__views.viewAppButtonNext = Ti.UI.createView({
        top: 0,
        width: 60,
        id: "viewAppButtonNext"
    });
    $.__views.scrollViewSendForm.add($.__views.viewAppButtonNext);
    $.__views.widgetAppButtonNext = Alloy.createWidget("com.diseg.AppButton", "widget", {
        id: "widgetAppButtonNext",
        __parentSymbol: $.__views.viewAppButtonNext
    });
    $.__views.widgetAppButtonNext.setParent($.__views.viewAppButtonNext);
    $.__views.viewAppCheckBoxSendFormViewPreview = Ti.UI.createView({
        top: 90,
        height: 50,
        width: 290,
        id: "viewAppCheckBoxSendFormViewPreview"
    });
    $.__views.scrollViewSendForm.add($.__views.viewAppCheckBoxSendFormViewPreview);
    $.__views.widgetAppCheckBoxSendFormViewPreview = Alloy.createWidget("com.diseg.AppCheckBox", "widget", {
        id: "widgetAppCheckBoxSendFormViewPreview",
        __parentSymbol: $.__views.viewAppCheckBoxSendFormViewPreview
    });
    $.__views.widgetAppCheckBoxSendFormViewPreview.setParent($.__views.viewAppCheckBoxSendFormViewPreview);
    $.__views.viewAppCheckBoxSendFormViewMediaContents = Ti.UI.createView({
        top: 190,
        height: 50,
        width: 290,
        id: "viewAppCheckBoxSendFormViewMediaContents"
    });
    $.__views.scrollViewSendForm.add($.__views.viewAppCheckBoxSendFormViewMediaContents);
    $.__views.widgetAppCheckBoxSendFormViewMediaContents = Alloy.createWidget("com.diseg.AppCheckBox", "widget", {
        id: "widgetAppCheckBoxSendFormViewMediaContents",
        __parentSymbol: $.__views.viewAppCheckBoxSendFormViewMediaContents
    });
    $.__views.widgetAppCheckBoxSendFormViewMediaContents.setParent($.__views.viewAppCheckBoxSendFormViewMediaContents);
    $.__views.imageViewSendEmailLogo = Ti.UI.createImageView({
        top: 260,
        width: "100%",
        image: "/images/send_email_logo.png",
        id: "imageViewSendEmailLogo"
    });
    $.__views.scrollViewSendForm.add($.__views.imageViewSendEmailLogo);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var current_type = args.type;
    var current_form_id = args.form_id;
    var current_pdf_native_path = args.pdf_native_path;
    var current_zip_filename = args.zip_filename;
    var current_email_subject_language_msg = args.email_subject_language_msg;
    var controls = new Array();
    controls.push($.widgetAppButtonNext.get_button());
    var bIsWorkInProgress = false;
    try {
        var previewValue = "0";
        Alloy.Globals.SendFormPreview && (previewValue = Alloy.Globals.SendFormPreview);
        var mediaContentsValue = "0";
        Alloy.Globals.SendFormMediaContents && (mediaContentsValue = Alloy.Globals.SendFormMediaContents);
        $.widgetAppCheckBoxSendFormViewPreview.init(L("generic_preview_text_msg"), previewValue, OnPreview_Change);
        $.widgetAppCheckBoxSendFormViewMediaContents.init(L("generic_send_media_contents_text_msg"), mediaContentsValue, OnMediaContents_Change);
        $.widgetAppButtonNext.init("/images/next_normal.png", "/images/next_pressed.png", "/images/next_disabled.png", L("generic_next_btn_title"), OnBtnNext_Click);
        $.viewSendFormViewWindow.open();
    } catch (exception) {
        Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
    }
    __defers["$.__views.viewSendFormViewWindow!android:back!OnAndroidBackButton_Click"] && $.__views.viewSendFormViewWindow.addEventListener("android:back", OnAndroidBackButton_Click);
    __defers["$.__views.viewSendFormViewWindow!androidback!OnAndroidBackButton_Click"] && $.__views.viewSendFormViewWindow.addEventListener("androidback", OnAndroidBackButton_Click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;