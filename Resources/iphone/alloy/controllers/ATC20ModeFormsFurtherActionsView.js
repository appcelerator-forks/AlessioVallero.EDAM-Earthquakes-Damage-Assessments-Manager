function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function OnBtnBack_Click() {
        try {
            Alloy.Globals.ProtectedCleanUpEventListener(Ti.App, "form:save_from_section");
            $.navigationWindowFurtherActions.close();
        } catch (exception) {
            Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
        }
    }
    function OnBarricadesNeededInTheFollowingAreas_Change() {
        Alloy.Globals.ATC20ModeFurtherActions["BARRICADES_IN_THE_FOLLOWING_AREAS"] = $.widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas.get_text_value();
    }
    function OnEvaluationRecommended_Change(e) {
        Alloy.Globals.ATC20ModeFurtherActions["EVALUATION_RECOMMENDED"] = e.id;
        if (3 != e.id) {
            $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended.set_text_value("");
            Alloy.Globals.ATC20ModeFurtherActions["OTHER_EVALUATION_RECOMMENDED"] = "";
        }
    }
    function OnOtherEvaluationRecommended_Change() {
        var newOtherNameValue = $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended.get_text_value();
        Alloy.Globals.ATC20ModeFurtherActions["OTHER_EVALUATION_RECOMMENDED"] = newOtherNameValue;
        if (newOtherNameValue) {
            $.widgetAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended.set_selected_index("3");
            Alloy.Globals.ATC20ModeFurtherActions["EVALUATION_RECOMMENDED"] = "3";
        }
    }
    function OnOtherRecommendations_Change() {
        Alloy.Globals.ATC20ModeFurtherActions["OTHER_RECOMMENDATIONS"] = $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations.get_text_value();
    }
    function OnComments_Change() {
        Alloy.Globals.ATC20ModeFurtherActions["COMMENTS"] = $.widgetAppTextFieldATC20ModeFormsFurtherActionsComments.get_text_value();
    }
    function OnBtnSave_Click() {
        Ti.App.fireEvent("form:save_from_section");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "ATC20ModeFormsFurtherActionsView";
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
    $.__views.atc20ModeFurtherActionsWindow = Ti.UI.createWindow({
        title: L("atc20_mode_further_actions_view_title"),
        backgroundColor: "#ffffcc",
        id: "atc20ModeFurtherActionsWindow"
    });
    $.__views.btn_ios_back = Ti.UI.createButton({
        title: L("generic_back_btn_title"),
        id: "btn_ios_back"
    });
    OnBtnBack_Click ? $.__views.btn_ios_back.addEventListener("click", OnBtnBack_Click) : __defers["$.__views.btn_ios_back!click!OnBtnBack_Click"] = true;
    $.__views.atc20ModeFurtherActionsWindow.leftNavButton = $.__views.btn_ios_back;
    $.__views.scrollViewFurtherActions = Ti.UI.createScrollView({
        top: 10,
        contentWidth: "100%",
        scrollType: "vertical",
        id: "scrollViewFurtherActions"
    });
    $.__views.atc20ModeFurtherActionsWindow.add($.__views.scrollViewFurtherActions);
    $.__views.viewAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas = Ti.UI.createView({
        top: 0,
        height: 50,
        width: Ti.UI.FILL,
        id: "viewAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas"
    });
    $.__views.scrollViewFurtherActions.add($.__views.viewAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas);
    $.__views.widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas = Alloy.createWidget("com.diseg.AppTextField", "widget", {
        id: "widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas",
        __parentSymbol: $.__views.viewAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas
    });
    $.__views.widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas.setParent($.__views.viewAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas);
    $.__views.viewAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended = Ti.UI.createView({
        top: 70,
        height: 50,
        width: Ti.UI.FILL,
        id: "viewAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended"
    });
    $.__views.scrollViewFurtherActions.add($.__views.viewAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended);
    $.__views.widgetAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended = Alloy.createWidget("com.diseg.AppComboBox", "widget", {
        id: "widgetAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended",
        __parentSymbol: $.__views.viewAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended
    });
    $.__views.widgetAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended.setParent($.__views.viewAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended);
    $.__views.viewAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended = Ti.UI.createView({
        top: 140,
        height: 50,
        width: Ti.UI.FILL,
        id: "viewAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended"
    });
    $.__views.scrollViewFurtherActions.add($.__views.viewAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended);
    $.__views.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended = Alloy.createWidget("com.diseg.AppTextField", "widget", {
        id: "widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended",
        __parentSymbol: $.__views.viewAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended
    });
    $.__views.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended.setParent($.__views.viewAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended);
    $.__views.viewAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations = Ti.UI.createView({
        top: 210,
        height: 50,
        width: Ti.UI.FILL,
        id: "viewAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations"
    });
    $.__views.scrollViewFurtherActions.add($.__views.viewAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations);
    $.__views.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations = Alloy.createWidget("com.diseg.AppTextField", "widget", {
        id: "widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations",
        __parentSymbol: $.__views.viewAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations
    });
    $.__views.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations.setParent($.__views.viewAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations);
    $.__views.viewAppTextFieldATC20ModeFormsFurtherActionsComments = Ti.UI.createView({
        top: 280,
        height: 50,
        width: Ti.UI.FILL,
        id: "viewAppTextFieldATC20ModeFormsFurtherActionsComments"
    });
    $.__views.scrollViewFurtherActions.add($.__views.viewAppTextFieldATC20ModeFormsFurtherActionsComments);
    $.__views.widgetAppTextFieldATC20ModeFormsFurtherActionsComments = Alloy.createWidget("com.diseg.AppTextField", "widget", {
        id: "widgetAppTextFieldATC20ModeFormsFurtherActionsComments",
        __parentSymbol: $.__views.viewAppTextFieldATC20ModeFormsFurtherActionsComments
    });
    $.__views.widgetAppTextFieldATC20ModeFormsFurtherActionsComments.setParent($.__views.viewAppTextFieldATC20ModeFormsFurtherActionsComments);
    $.__views.viewAppButtonSave = Ti.UI.createView({
        top: 350,
        width: 60,
        height: 80,
        bottom: 10,
        id: "viewAppButtonSave"
    });
    $.__views.scrollViewFurtherActions.add($.__views.viewAppButtonSave);
    $.__views.widgetAppButtonSave = Alloy.createWidget("com.diseg.AppButton", "widget", {
        id: "widgetAppButtonSave",
        __parentSymbol: $.__views.viewAppButtonSave
    });
    $.__views.widgetAppButtonSave.setParent($.__views.viewAppButtonSave);
    $.__views.navigationWindowFurtherActions = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.atc20ModeFurtherActionsWindow,
        id: "navigationWindowFurtherActions"
    });
    $.__views.navigationWindowFurtherActions && $.addTopLevelView($.__views.navigationWindowFurtherActions);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var current_mode = args.mode;
    var current_is_synchronized = args.is_synchronized;
    var current_atc20_type = args.atc20_type;
    var view_enabled = true;
    "undefined" != typeof current_is_synchronized && (view_enabled = "0" == current_is_synchronized);
    try {
        var evaluationRecommendedParentView = null;
        var thisView = $.getView();
        evaluationRecommendedParentView = thisView;
        var evaluationRecommendedLanguageMsg = "generic_rapid_evaluation_recommended_text_msg";
        "0" == current_atc20_type && (evaluationRecommendedLanguageMsg = "generic_detailed_evaluation_recommended_text_msg");
        var evaluationRecommendedValues = {
            0: {
                title: L("generic_evaluation_recommended_none")
            },
            1: {
                title: L("generic_evaluation_recommended_structural")
            },
            2: {
                title: L("generic_evaluation_recommended_geotechnical")
            },
            3: {
                title: L("generic_evaluation_recommended_other")
            }
        };
        $.widgetAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended.init(L(evaluationRecommendedLanguageMsg), evaluationRecommendedValues, OnEvaluationRecommended_Change, null, evaluationRecommendedParentView);
        $.widgetAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended.enabled(view_enabled);
        Alloy.Globals.ATC20ModeFurtherActions["EVALUATION_RECOMMENDED"] && $.widgetAppComboBoxATC20ModeFormsFurtherActionsEvaluationRecommended.set_selected_index(Alloy.Globals.ATC20ModeFurtherActions["EVALUATION_RECOMMENDED"]);
        $.widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas.init(L("generic_barricades_in_the_following_areas_txt_hint"), OnBarricadesNeededInTheFollowingAreas_Change);
        $.widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas.set_text_value(Alloy.Globals.ATC20ModeFurtherActions["BARRICADES_IN_THE_FOLLOWING_AREAS"]);
        $.widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas.enabled(view_enabled);
        $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended.init(L("generic_other_text_msg"), OnOtherEvaluationRecommended_Change);
        $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended.set_text_value(Alloy.Globals.ATC20ModeFurtherActions["OTHER_EVALUATION_RECOMMENDED"]);
        $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended.enabled(view_enabled);
        if ("CA" == current_mode || "NEPAL" == current_mode) {
            $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations.init(L("generic_other_recommendations_text_msg"), OnOtherRecommendations_Change);
            $.widgetAppTextFieldATC20ModeFormsFurtherActionsComments.init(L("generic_comments_text_msg"), OnComments_Change);
            $.widgetAppTextFieldATC20ModeFormsFurtherActionsComments.set_text_value(Alloy.Globals.ATC20ModeFurtherActions["COMMENTS"]);
            $.widgetAppTextFieldATC20ModeFormsFurtherActionsComments.enabled(view_enabled);
            RegisterHideKeyboard($.atc20ModeFurtherActionsWindow, [ $.widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas.get_text_field(), $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended.get_text_field(), $.widgetAppTextFieldATC20ModeFormsFurtherActionsComments.get_text_field(), $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations.get_text_field() ]);
        } else if ("NZ" == current_mode) {
            $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations.init(L("generic_other_recommendations_comments_text_msg"), OnOtherRecommendations_Change);
            $.scrollViewFurtherActions.remove($.viewAppTextFieldATC20ModeFormsFurtherActionsComments);
            $.viewAppTextFieldATC20ModeFormsFurtherActionsComments = null;
            $.viewAppButtonSave.setTop(280);
            RegisterHideKeyboard($.atc20ModeFurtherActionsWindow, [ $.widgetAppTextFieldATC20ModeFormsFurtherActionsBarricadesNeededInTheFollowingAreas.get_text_field(), $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherEvaluationRecommended.get_text_field(), $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations.get_text_field() ]);
        }
        $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations.set_text_value(Alloy.Globals.ATC20ModeFurtherActions["OTHER_RECOMMENDATIONS"]);
        $.widgetAppTextFieldATC20ModeFormsFurtherActionsOtherRecommendations.enabled(view_enabled);
        $.widgetAppButtonSave.init("/images/save_normal.png", "/images/save_pressed.png", "/images/save_disabled.png", L("generic_save_btn_title"), OnBtnSave_Click);
        $.viewAppButtonSave.visible = view_enabled;
        $.navigationWindowFurtherActions.open();
    } catch (exception) {
        Alloy.Globals.AlertUserAndLogAsync(L("generic_exception_msg") + exception.message);
    }
    __defers["$.__views.btn_ios_back!click!OnBtnBack_Click"] && $.__views.btn_ios_back.addEventListener("click", OnBtnBack_Click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;