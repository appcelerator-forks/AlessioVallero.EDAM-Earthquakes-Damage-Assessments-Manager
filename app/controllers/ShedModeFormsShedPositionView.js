var args = arguments[0] || {};
var current_is_synchronized = args.is_synchronized ;
var view_enabled = true ;
if( typeof current_is_synchronized != "undefined" )
{
    view_enabled = ( current_is_synchronized == "0" ) ;
}

// Array of controls to disable/enable during a busy state
var controls = new Array() ;
if( OS_IOS )
{
    controls.push( $.btn_ios_back ) ;
}
controls.push( $.btnShedModeFormsShedPositionLoadPosition ) ;

// This avoid a physical back button event to occur during a critical job
var bIsWorkInProgress = false ;

var timeout = null ;

// Android's physical back button click event handler
function OnAndroidBackButton_Click( e )
{
    // We can go back only if a saving is not in progress
    if( !bIsWorkInProgress )
    {
        Back() ;
    }
}

// Back button click event handler
function OnBtnBack_Click( e )
{
    Back() ;
}

// Back function
function Back()
{
    try
    {
        Alloy.Globals.ProtectedCleanUpEventListener( Ti.App , "form:save_from_section" ) ;

        // On iOS devices, the NavigationWindow will be closed.
        // Instead on Android devices, the Window will be close
        if( OS_IOS )
        {
            $.navigationWindowShedPosition.close() ;
        }
        else
        {
            $.shedModeFormsShedPositionWindow.close() ;
        }
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
}

// Load position button click event handler
function OnBtnLoadPosition_Click( e )
{
    try
    {
        BeginAsyncBusyAction( $.activity_indicator , controls , function()
        {
            bIsWorkInProgress = true ;

            // If we can ask for localization on this device
            if( Alloy.Globals.isLocationAuthorized() )
            {
                // Start a new timeout to the location request
                timeout = setTimeout( function()
                {
                    timeout = null ;

                    EndAsyncBusyAction( $.activity_indicator , controls , EndAsyncBusyAction_CallBack ) ;

                    alert( L( 'geolocation_timeout_occurred_err_msg' ) ) ;
                } , Alloy.Globals.GeolocationRequestTimeoutMillisecs ) ;

                Alloy.Globals.getLocation(
                {
                    success: UpdatePosition
                } ) ;
            }
            else
            {
                EndAsyncBusyAction( $.activity_indicator , controls , EndAsyncBusyAction_CallBack ) ;

                alert( L( 'generic_user_not_authorized_to_ask_localization' ) ) ;
            }
        } , EndAsyncBusyAction_CallBack ) ;
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
}

// Callback for EndAsyncBusyAction
function EndAsyncBusyAction_CallBack()
{
    bIsWorkInProgress = false ;

    if( timeout !== null )
    {
        // Clear a previous timeout, if exist
        clearTimeout( timeout ) ;

        timeout = null ;
    }
}

// Latitude textfield change event handler
function OnLatitude_Change( e , type )
{
    Alloy.Globals.ShedModeShedPosition["LATITUDE"] = $.widgetAppTextFieldShedModeFormsShedPositionLatitude.get_text_value() ;
}

// Longitude textfield change event handler
function OnLongitude_Change( e , type )
{
    Alloy.Globals.ShedModeShedPosition["LONGITUDE"] = $.widgetAppTextFieldShedModeFormsShedPositionLongitude.get_text_value() ;
}

// Altitude textfield change event handler
function OnAltitude_Change( e , type )
{
    Alloy.Globals.ShedModeShedPosition["ALTITUDE"] = $.widgetAppTextFieldShedModeFormsShedPositionAltitude.get_text_value() ;
}

function UpdatePosition( e )
{
    Ti.Geolocation.removeEventListener( 'location' , UpdatePosition ) ;

    if( !e.success || e.error )
    {
        alert( L( 'unable_to_get_location_err_msg' ) + " " + e.error ) ;
        return ;
    }

    $.widgetAppTextFieldShedModeFormsShedPositionLatitude.set_text_value( e.coords.latitude ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionLongitude.set_text_value( e.coords.longitude ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionAltitude.set_text_value( e.coords.altitude ) ;

    if( Titanium.Network.networkType === Titanium.Network.NETWORK_NONE )
    {
        EndAsyncBusyAction( $.activity_indicator , controls , EndAsyncBusyAction_CallBack ) ;

        alert( L( 'generic_no_network_for_georeverse_address_msg' ) ) ;
    }
    else
    {
        Alloy.Globals.reverseGeocode( e.coords.latitude , e.coords.longitude , OnGeoreserve_Done ) ;
    }
}

// Function to callback when georeserve is done
function OnGeoreserve_Done( formattedAnswer )
{
    try
    {
        $.widgetAppTextFieldShedModeFormsShedPositionProvince.set_text_value( formattedAnswer['administrative_area_level_2'] ) ;
        OnProvince_Change() ;
        $.widgetAppTextFieldShedModeFormsShedPositionMunicipality.set_text_value( formattedAnswer['locality'] ) ;
        OnMunicipality_Change() ;
        $.widgetAppTextFieldShedModeFormsShedPositionPlace.set_text_value( formattedAnswer['administrative_area_level_1'] ) ;
        OnPlace_Change() ;
        $.widgetAppTextFieldShedModeFormsShedPositionCivicNo.set_text_value( formattedAnswer['postal_code'] ) ;
        OnCivicNo_Change() ;
        var address = null ;
        if( Titanium.Locale.currentLanguage == "en" )
        {
            address = formattedAnswer['street_number'] + " " + formattedAnswer['route'] ;
        }
        else
        {
            address = formattedAnswer['route'] + " " + formattedAnswer['street_number'] ;
        }
        $.widgetAppTextFieldShedModeFormsShedPositionAddress.set_text_value( address ) ;
        OnAddress_Change() ;
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
    finally
    {
        EndAsyncBusyAction( $.activity_indicator , controls , EndAsyncBusyAction_CallBack ) ;
    }
}

// Province textfield change event handler
function OnProvince_Change( e , type )
{
    Alloy.Globals.ShedModeShedPosition["PROVINCE"] = $.widgetAppTextFieldShedModeFormsShedPositionProvince.get_text_value() ;
}

// Municipality textfield change event handler
function OnMunicipality_Change( e , type )
{
    Alloy.Globals.ShedModeShedPosition["MUNICIPALITY"] = $.widgetAppTextFieldShedModeFormsShedPositionMunicipality.get_text_value() ;
}

// Place textfield change event handler
function OnPlace_Change( e , type )
{
    Alloy.Globals.ShedModeShedPosition["PLACE"] = $.widgetAppTextFieldShedModeFormsShedPositionPlace.get_text_value() ;
}

// Address textfield change event handler
function OnAddress_Change( e , type )
{
    Alloy.Globals.ShedModeShedPosition["ADDRESS"] = $.widgetAppTextFieldShedModeFormsShedPositionAddress.get_text_value() ;
}

// CivicNo textfield change event handler
function OnCivicNo_Change( e , type )
{
    Alloy.Globals.ShedModeShedPosition["CIVIC_NO"] = $.widgetAppTextFieldShedModeFormsShedPositionCivicNo.get_text_value() ;
}

// Save button click event handler
function OnBtnSave_Click( e )
{
    Ti.App.fireEvent( "form:save_from_section" ) ;
}

try
{
    // Init controls
    $.btnShedModeFormsShedPositionLoadPosition.enabled = view_enabled ;
    // Init app textfields
    $.widgetAppTextFieldShedModeFormsShedPositionLatitude.init( L( 'generic_latitude_txt_hint' ) , OnLatitude_Change , Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionLatitude.set_text_value( Alloy.Globals.ShedModeShedPosition["LATITUDE"] ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionLatitude.enabled( view_enabled ) ;

    $.widgetAppTextFieldShedModeFormsShedPositionLongitude.init( L( 'generic_longitude_txt_hint' ) , OnLongitude_Change , Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionLongitude.set_text_value( Alloy.Globals.ShedModeShedPosition["LONGITUDE"] ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionLongitude.enabled( view_enabled ) ;

    $.widgetAppTextFieldShedModeFormsShedPositionAltitude.init( L( 'generic_altitude_txt_hint' ) , OnAltitude_Change , Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionAltitude.set_text_value( Alloy.Globals.ShedModeShedPosition["ALTITUDE"] ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionAltitude.enabled( view_enabled ) ;

    $.widgetAppTextFieldShedModeFormsShedPositionProvince.init( L( 'generic_province_txt_hint' ) , OnProvince_Change ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionProvince.set_text_value( Alloy.Globals.ShedModeShedPosition["PROVINCE"] ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionProvince.enabled( view_enabled ) ;

    $.widgetAppTextFieldShedModeFormsShedPositionMunicipality.init( L( 'generic_municipality_txt_hint' ) , OnMunicipality_Change ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionMunicipality.set_text_value( Alloy.Globals.ShedModeShedPosition["MUNICIPALITY"] ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionMunicipality.enabled( view_enabled ) ;

    $.widgetAppTextFieldShedModeFormsShedPositionPlace.init( L( 'generic_place_txt_hint' ) , OnPlace_Change ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionPlace.set_text_value( Alloy.Globals.ShedModeShedPosition["PLACE"] ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionPlace.enabled( view_enabled ) ;

    $.widgetAppTextFieldShedModeFormsShedPositionAddress.init( L( 'generic_address_txt_hint' ) , OnAddress_Change ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionAddress.set_text_value( Alloy.Globals.ShedModeShedPosition["ADDRESS"] ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionAddress.enabled( view_enabled ) ;

    $.widgetAppTextFieldShedModeFormsShedPositionCivicNo.init( L( 'generic_civicno_txt_hint' ) , OnCivicNo_Change , Titanium.UI.KEYBOARD_NUMBER_PAD ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionCivicNo.set_text_value( Alloy.Globals.ShedModeShedPosition["CIVIC_NO"] ) ;
    $.widgetAppTextFieldShedModeFormsShedPositionCivicNo.enabled( view_enabled ) ;
    // Init app buttons
    $.widgetAppButtonSave.init( '/images/save_normal.png' , '/images/save_pressed.png' , '/images/save_disabled.png' , L( 'generic_save_btn_title' ) , OnBtnSave_Click ) ;
    $.viewAppButtonSave.visible = view_enabled ;

    RegisterHideKeyboard( $.shedModeFormsShedPositionWindow ,
    [
        $.widgetAppTextFieldShedModeFormsShedPositionLatitude.get_text_field() ,
        $.widgetAppTextFieldShedModeFormsShedPositionLongitude.get_text_field() ,
        $.widgetAppTextFieldShedModeFormsShedPositionAltitude.get_text_field() ,
        $.widgetAppTextFieldShedModeFormsShedPositionProvince.get_text_field() ,
        $.widgetAppTextFieldShedModeFormsShedPositionMunicipality.get_text_field() ,
        $.widgetAppTextFieldShedModeFormsShedPositionPlace.get_text_field() ,
        $.widgetAppTextFieldShedModeFormsShedPositionAddress.get_text_field() ,
        $.widgetAppTextFieldShedModeFormsShedPositionCivicNo.get_text_field()
    ] ) ;

    // On iOS devices will be opened the NavigationWindow, on Android will be opened the Window instead
    // Also the top margin of the ScrollView must be different depending on the device type
    if( OS_IOS )
    {
        $.navigationWindowShedPosition.open() ;
    }
    else
    {
        $.shedModeFormsShedPositionWindow.open() ;
    }
}
catch( exception )
{
    Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
}