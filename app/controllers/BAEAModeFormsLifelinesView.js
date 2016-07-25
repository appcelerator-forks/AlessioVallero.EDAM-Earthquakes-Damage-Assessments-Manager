var args = arguments[0] || {} ;
var current_form_id = args.form_id ;
var current_global_ar_index = args.global_ar_index ;
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
controls.push( $.btnBAEAModeFormsLifelinesLoadAddress ) ;
controls.push( $.btnBAEAModeFormsLifelinesViewAddress ) ;
controls.push( $.btnBAEAModeFormsLifelinesRecord ) ;

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
        Alloy.Globals.ProtectedRemoveEventListener( Ti.App , "baea_mode_lifelines:communication_changed" , OnCommunication_Changed ) ;
        Alloy.Globals.ProtectedRemoveEventListener( Ti.App , "baea_mode_lifelines:electric_power_delivery_changed" , OnElectricPowerDelivery_Changed ) ;
        Alloy.Globals.ProtectedRemoveEventListener( Ti.App , "baea_mode_lifelines:other_changed" , OnOther_Changed ) ;

        Alloy.Globals.ProtectedCleanUpEventListener( Ti.App , "baea_mode_manage_section:record_new" ) ;
        Alloy.Globals.ProtectedCleanUpEventListener( Ti.App , "baea_mode_manage_section:record_update" ) ;

        Alloy.Globals.CurrentTemporaryPicsPath = null ;

        // On iOS devices, the NavigationWindow will be closed.
        // Instead on Android devices, the Window will be close
        if( OS_IOS )
        {
            $.navigationWindowLifelines.close() ;
        }
        else
        {
            $.baeaModeFormsLifelinesWindow.close() ;
        }
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
}

// TableView Photo click event handler
function OnTableViewBAEAModeFormsLifelinesPhoto_Click( e )
{
    try
    {
        BusyAction( $.activity_indicator , controls , function()
        {
            if( view_enabled )
            {
                // OptionDialog to ask user about the action to use about the Photo
                var optionDialog = Ti.UI.createOptionDialog(
                {
                    title: L( 'baea_photo_selection_title' ) ,
                    cancel: 4 ,
                    options: [ L( 'baea_photo_new_photo_msg' ) , L( 'baea_photo_import_photo_msg' ) , L( 'baea_photo_new_sketch_msg' ) , L( 'baea_photo_view_photos_msg' ) , L( 'generic_cancel_btn_title' ) ] ,
                    selectedIndex: 1
                } ) ;
                optionDialog.addEventListener( 'click' , function( e )
                {
                    switch( e.index )
                    {
                        // New photo
                        case 0:
                        {
                            Titanium.Media.showCamera(
                            {
                                success: function( event )
                                {
                                    // Init of the array (if it's necessary)
                                    if( !Alloy.Globals.CurrentTemporaryPicsPath )
                                    {
                                        Alloy.Globals.CurrentTemporaryPicsPath = new Array() ;
                                    }

                                    // Since the Blob object sometimes cause strange effect on a TableGalleryView, we'll write the image in a temporary folder and use the nativePath
                                    // The files in the temporary folder may not persist when the application is shut down and restarted.
                                    var newFile = Titanium.Filesystem.getFile( Titanium.Filesystem.getTempDirectory() , Ti.Platform.createUUID() + ".png" ) ;
                                    if( newFile.exists )
                                    {
                                        // A previous image will be dropped
                                        newFile.deleteFile() ;
                                    }
                                    newFile.write( event.media ) ;

                                    // Inserting the image on the array of pictures
                                    Alloy.Globals.CurrentTemporaryPicsPath.push( { media: newFile.getNativePath() , section: "LI" } ) ;
                                } ,
                                cancel: function()
                                {
                                    // Called when user cancels taking a media
                                } ,
                                error: function( error )
                                {
                                    // Called when there's an error
                                    var alertDialog = Titanium.UI.createAlertDialog(
                                    {
                                        title: L( 'generic_camera_title' ) ,
                                        buttonNames: [ L( 'generic_ok_msg' ) ]
                                    } ) ;
                                    if( error.code == Titanium.Media.NO_CAMERA )
                                    {
                                        alertDialog.setMessage( L( 'no_camera_on_this_device_msg' ) ) ;
                                    }
                                    else
                                    {
                                        alertDialog.setMessage( L( 'generic_exception_msg' ) + error.code ) ;
                                    }
                                    alertDialog.show() ;
                                },
                                saveToPhotoGallery: false ,
                                mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
                            } ) ;
                        }
                        break ;

                        // Import photo
                        case 1:
                        {
                            // Obtain an image from the gallery
                            Titanium.Media.openPhotoGallery(
                            {
                                success:function( event )
                                {
                                    // Since the Blob object sometimes cause strange effect on a TableGalleryView, we'll write the image in a temporary folder and use the nativePath
                                    // The files in the temporary folder may not persist when the application is shut down and restarted.
                                    var newFile = Titanium.Filesystem.getFile( Titanium.Filesystem.getTempDirectory() , Ti.Platform.createUUID() + ".png" ) ;
                                    if( newFile.exists )
                                    {
                                        // A previous image will be dropped
                                        newFile.deleteFile() ;
                                    }
                                    newFile.write( event.media ) ;

                                    // Getting media
                                    var mediaDetails = { media: newFile.getNativePath() , section: "LI" } ;

                                    // Init of the array (if it's necessary)
                                    if( !Alloy.Globals.CurrentTemporaryPicsPath )
                                    {
                                        Alloy.Globals.CurrentTemporaryPicsPath = new Array() ;
                                    }

                                    // Inserting the image on the array of pictures
                                    Alloy.Globals.CurrentTemporaryPicsPath.push( mediaDetails ) ;

                                    alert( L( "generic_content_imported_msg" ) ) ;
                                } ,
                                mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
                            } ) ;
                        }
                        break ;

                        case 2:
                        {
                            Alloy.Globals.createAndOpenControllerExt( 'DraftPaintView' , { type: "Detailed_BAEA_Sketch" , baea_section: "LI" } ) ;
                        }
                        break ;

                        case 3:
                        {
                            var media_array = { "PERMANENT": null , "TEMPORARY": null } ;

                            if( Alloy.Globals.BAEAModeLifelines &&
                                Alloy.Globals.BAEAModeLifelines[current_global_ar_index] &&
                                Alloy.Globals.BAEAModeLifelines[current_global_ar_index].PHOTOS && 
                                Alloy.Globals.BAEAModeLifelines[current_global_ar_index].PHOTOS.length > 0 )
                            {
                                media_array["PERMANENT"] = Alloy.Globals.BAEAModeLifelines[current_global_ar_index].PHOTOS ;
                            }
                            if( Alloy.Globals.CurrentTemporaryPicsPath && Alloy.Globals.CurrentTemporaryPicsPath.length > 0 )
                            {
                                media_array["TEMPORARY"] = Alloy.Globals.CurrentTemporaryPicsPath ;
                            }

                            if( media_array["PERMANENT"] || media_array["TEMPORARY"] )
                            {
                                // Controller creation for the Next View (inited in BAEA Mode)
                                Alloy.Globals.createAndOpenControllerExt( 'BAEATableGalleryView' , { media_contents: media_array , is_synchronized: current_is_synchronized } ) ;
                            }
                            else
                            {
                                alert( L( 'no_media_for_the_gallery_msg' ) ) ;
                            }
                        }
                        break ;
                    }
                } ) ;
                // Show OptionDialog about the type of ATC-20 form
                optionDialog.show() ;
            }
            else
            {
                var media_array = { "PERMANENT": null , "TEMPORARY": null } ;

                if( Alloy.Globals.BAEAModeLifelines &&
                    Alloy.Globals.BAEAModeLifelines[current_global_ar_index] &&
                    Alloy.Globals.BAEAModeLifelines[current_global_ar_index].PHOTOS && 
                    Alloy.Globals.BAEAModeLifelines[current_global_ar_index].PHOTOS.length > 0 )
                {
                    media_array["PERMANENT"] = Alloy.Globals.BAEAModeLifelines[current_global_ar_index].PHOTOS ;
                }
                if( Alloy.Globals.CurrentTemporaryPicsPath && Alloy.Globals.CurrentTemporaryPicsPath.length > 0 )
                {
                    media_array["TEMPORARY"] = Alloy.Globals.CurrentTemporaryPicsPath ;
                }

                if( media_array["PERMANENT"] || media_array["TEMPORARY"] )
                {
                    // Controller creation for the Next View (inited in BAEA Mode)
                    Alloy.Globals.createAndOpenControllerExt( 'BAEATableGalleryView' , { media_contents: media_array , is_synchronized: current_is_synchronized } ) ;
                }
                else
                {
                    alert( L( 'no_media_for_the_gallery_msg' ) ) ;
                }
            }

            bRet = true ;

            return bRet ;
        } , view_enabled ) ;
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
}

var bViewAddress = false ;

// Load address button click event handler
function OnBtnLoadAddress_Click( e )
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

// Function to update the coordinates and call the georeverse function
function UpdatePosition( e )
{
    Ti.Geolocation.removeEventListener( 'location' , UpdatePosition ) ;

    if( !e.success || e.error )
    {
        alert( L( 'unable_to_get_location_err_msg' ) + " " + e.error ) ;
        return ;
    }

    $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.set_text_value( e.coords.latitude ) ;
    $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.set_text_value( e.coords.longitude ) ;

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
        var address = null ;
        if( Titanium.Locale.currentLanguage == "en" )
        {
            address = formattedAnswer['street_number'] + " " + formattedAnswer['route'] ;
        }
        else
        {
            address = formattedAnswer['route'] + " " + formattedAnswer['street_number'] ;
        }
        $.widgetAppTextFieldBAEAModeFormsLifelinesAddress.set_text_value( address ) ;
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
    finally
    {
        EndAsyncBusyAction( $.activity_indicator , controls , EndAsyncBusyAction_CallBack ) ;

        if( bViewAddress )
        {
            Alloy.Globals.createAndOpenControllerExt( 'ViewUsersLocations' , { users_coordinates: { 'LATITUDE': $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.get_text_value() , 'LONGITUDE': $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.get_text_value() } , mode: "YL" } ) ;

            bViewAddress = false ;
        }
    }
}

// View address button click event handler
function OnBtnViewAddress_Click( e )
{
    try
    {
        if( Titanium.Network.networkType === Titanium.Network.NETWORK_NONE )
        {
            alert( L( 'generic_no_network_msg' ) ) ;
        }
        else
        {
            if( !$.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.get_text_value() ||
                !$.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.get_text_value() )
            {
                bViewAddress = true ;

                OnBtnLoadAddress_Click() ;
            }
            else
            {
                Alloy.Globals.createAndOpenControllerExt( 'ViewUsersLocations' , { users_coordinates: { 'LATITUDE': $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.get_text_value() , 'LONGITUDE': $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.get_text_value() } , mode: "YL" } ) ;
            }
        }
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
}

var current_communication = "000" ;

// Communication change event handler
function OnCommunication_Changed( e )
{
    current_communication = e.value ;
}

var current_electric_power_delivery = "00" ;

// Electric Power Delivery change event handler
function OnElectricPowerDelivery_Changed( e )
{
    current_electric_power_delivery = e.value ;
}

var current_other = "0000" ;

// Other picker event handler
function OnOther_Changed( e )
{
    current_other = e.value ;
}

// TableView Lifelines's elements click event handler
function OnTableViewBAEAModeFormsLifelines_Click( e )
{
    try
    {
        BusyAction( $.activity_indicator , controls , function()
        {
            switch( e.index )
            {
                case 0:
                {
                    Alloy.Globals.ProtectedAddEventListener( Ti.App , "baea_mode_lifelines:communication_changed" , OnCommunication_Changed ) ;

                    // Controller creation for the Next View (inited in BAEA Mode)
                    Alloy.Globals.createAndOpenControllerExt( 'BAEAModeFormsLifelinesCommunicationView' , { communication: current_communication , is_synchronized: current_is_synchronized } ) ;
                }
                break ;

                case 1:
                {
                    Alloy.Globals.ProtectedAddEventListener( Ti.App , "baea_mode_lifelines:electric_power_delivery_changed" , OnElectricPowerDelivery_Changed ) ;

                    // Controller creation for the Next View (inited in BAEA Mode)
                    Alloy.Globals.createAndOpenControllerExt( 'BAEAModeFormsLifelinesElectricPowerDeliveryView' , { electric_power_delivery: current_electric_power_delivery , is_synchronized: current_is_synchronized } ) ;
                }
                break ;

                case 2:
                {
                    Alloy.Globals.ProtectedAddEventListener( Ti.App , "baea_mode_lifelines:other_changed" , OnOther_Changed ) ;

                    // Controller creation for the Next View (inited in BAEA Mode)
                    Alloy.Globals.createAndOpenControllerExt( 'BAEAModeFormsLifelinesOtherView' , { other: current_other , is_synchronized: current_is_synchronized } ) ;
                }
                break ;
            }

            bRet = true ;

            return bRet ;
        } ) ;
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
}

var current_functionality = "1" ;

// Functionality picker change event handler
function OnFunctionality_Change( e )
{
    current_functionality = e.id ;
}

var current_repair_time = "0" ;

// Repair Time picker change event handler
function OnRepairTime_Change( e )
{
    current_repair_time = e.id ;
}

var current_recommend_further_investigation = "0" ;

// Recommend Further Investigation picker change event handler
function OnRecommendFurtherInvestigation_Change( e )
{
    current_recommend_further_investigation = e.id ;
}

// Record button click event handler
function OnBtnRecord_Click( e )
{
    try
    {
        // Recording the data (add or edit)
        if( current_global_ar_index != -1 )
        {
            // Recording the photos
            if( Alloy.Globals.CurrentTemporaryPicsPath && Alloy.Globals.CurrentTemporaryPicsPath.length > 0 )
            {
                // Init of the array (if it's necessary)
                if( !Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["PHOTOS"] )
                {
                    Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["PHOTOS"] = new Array() ;
                }

                for( var i = 0 ; i < Alloy.Globals.CurrentTemporaryPicsPath.length ; i++ )
                {
                    Alloy.Globals.CurrentTemporaryPicsPath[i].isNew = true ;
                    Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["PHOTOS"].push( Alloy.Globals.CurrentTemporaryPicsPath[i] ) ;
                }

                Alloy.Globals.CurrentTemporaryPicsPath = null ;
            }

            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["DATE"] = new Date().getTime().toString() ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["SITE"] = $.widgetAppTextFieldBAEAModeFormsLifelinesSiteName.get_text_value() ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["LATITUDE"] = $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.get_text_value() ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["LONGITUDE"] = $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.get_text_value() ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["ADDRESS"] = $.widgetAppTextFieldBAEAModeFormsLifelinesAddress.get_text_value() ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["NOTES"] = $.widgetAppTextFieldBAEAModeFormsLifelinesNotes.get_text_value() ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["COMMUNICATION"] = current_communication ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["ELECTRIC_POWER_DELIVERY"] = current_electric_power_delivery ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["OTHER"] = current_other ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["FUNCTIONALITY"] = current_functionality ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["REPAIR_TIME"] = current_repair_time ;
            Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["RECOMMEND_FURTHER_INVESTIGATION"] = current_recommend_further_investigation ;

            Ti.App.fireEvent( 'baea_mode_manage_section:record_update' , { index: current_global_ar_index , value: Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["SITE"] } ) ;
        }
        else
        {
            var newLifelinesItem =
            {
                "ID": -1 ,
                "DATE": new Date().getTime().toString() ,
                "COMMUNICATION": current_communication ,
                "ELECTRIC_POWER_DELIVERY": current_electric_power_delivery ,
                "OTHER": current_other ,
                "FUNCTIONALITY": current_functionality ,
                "REPAIR_TIME": current_repair_time ,
                "RECOMMEND_FURTHER_INVESTIGATION": current_recommend_further_investigation ,
                "SITE": $.widgetAppTextFieldBAEAModeFormsLifelinesSiteName.get_text_value() ,
                "LATITUDE": $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.get_text_value() ,
                "LONGITUDE": $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.get_text_value() ,
                "ADDRESS": $.widgetAppTextFieldBAEAModeFormsLifelinesAddress.get_text_value() ,
                "NOTES": $.widgetAppTextFieldBAEAModeFormsLifelinesNotes.get_text_value()
            } ;

            // Recording the photos
            if( Alloy.Globals.CurrentTemporaryPicsPath && Alloy.Globals.CurrentTemporaryPicsPath.length > 0 )
            {
                // Init of the array
                newLifelinesItem["PHOTOS"] = new Array() ;

                for( var i = 0 ; i < Alloy.Globals.CurrentTemporaryPicsPath.length ; i++ )
                {
                    Alloy.Globals.CurrentTemporaryPicsPath[i].isNew = true ;
                    newLifelinesItem["PHOTOS"].push( Alloy.Globals.CurrentTemporaryPicsPath[i] ) ;
                }

                Alloy.Globals.CurrentTemporaryPicsPath = null ;
            }

            if( Alloy.Globals.BAEAModeLifelines.length > 0 )
            {
                Alloy.Globals.BAEAModeLifelines.splice( 0 , 0 , newLifelinesItem ) ;
            }
            else
            {
                Alloy.Globals.BAEAModeLifelines.push( newLifelinesItem ) ;
            }

            Ti.App.fireEvent( 'baea_mode_manage_section:record_new' ) ;
        }

        Back() ;
    }
    catch( exception )
    {
        Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
    }
}

try
{
    Alloy.Globals.CurrentTemporaryPicsPath = null ;

    // Init controls
    var functionalityView = null ;
    var repairTimeView = null ;
    var recommendFurtherInvestigationView = null ;
    // On iOS devices the parentView must be the mainView because is used a new Window to show the picker.
    // so if we use the container of the Widget, the new Window will appear compressed inside the container
    if( OS_IOS )
    {
        var mainView = $.getView() ;
        functionalityView = mainView ;
        repairTimeView = mainView ;
        recommendFurtherInvestigationView = mainView ;
    }
    else
    {
        functionalityView = $.viewAppComboBoxBAEAModeFormsLifelinesFunctionality ;
        repairTimeView = $.viewAppComboBoxBAEAModeFormsLifelinesRepairTime ;
        recommendFurtherInvestigationView = $.viewAppComboBoxBAEAModeFormsLifelinesRecommendFurtherInvestigation ;
    }
    $.btnBAEAModeFormsLifelinesLoadAddress.enabled = view_enabled ;
    $.btnBAEAModeFormsLifelinesRecord.enabled = view_enabled ;
    // Init app textfields
    $.widgetAppTextFieldBAEAModeFormsLifelinesSiteName.init( L( 'generic_site_name_txt_hint' ) ) ;
    $.widgetAppTextFieldBAEAModeFormsLifelinesSiteName.enabled( view_enabled ) ;

    $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.init( L( 'generic_latitude_txt_hint' ) , null , Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION ) ;
    $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.enabled( view_enabled ) ;

    $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.init( L( 'generic_longitude_txt_hint' ) , null , Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION ) ;
    $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.enabled( view_enabled ) ;

    $.widgetAppTextFieldBAEAModeFormsLifelinesAddress.init( L( 'generic_address_txt_hint' ) ) ;
    $.widgetAppTextFieldBAEAModeFormsLifelinesAddress.enabled( view_enabled ) ;

    $.widgetAppTextFieldBAEAModeFormsLifelinesNotes.init( L( 'generic_notes_txt_hint' ) ) ;
    $.widgetAppTextFieldBAEAModeFormsLifelinesNotes.enabled( view_enabled ) ;

    // Init app comboboxes
    var functionalityValues =
    {
        0: { title: L( 'generic_functionality_fully_functional' ) } ,
        1: { title: L( 'generic_functionality_partially_functional' ) } ,
        2: { title: L( 'generic_functionality_not_functional' ) }
    } ;
    $.widgetAppComboBoxBAEAModeFormsLifelinesFunctionality.init( L( 'generic_functionality_text_msg' ) , functionalityValues , OnFunctionality_Change , null , functionalityView ) ;
    $.widgetAppComboBoxBAEAModeFormsLifelinesFunctionality.enabled( view_enabled ) ;

    var repairTimeValues =
    {
        0: { title: L( 'generic_repair_time_one_to_six_days' ) } ,
        1: { title: L( 'generic_repair_time_one_to_four_weeks' ) } ,
        2: { title: L( 'generic_repair_time_one_to_twelve_months' ) } ,
        3: { title: L( 'generic_repair_time_one_to_three_years' ) } ,
        4: { title: L( 'generic_repair_time_four_plus_years' ) }
    } ;
    $.widgetAppComboBoxBAEAModeFormsLifelinesRepairTime.init( L( 'generic_repair_time_text_msg' ) , repairTimeValues , OnRepairTime_Change , null , repairTimeView ) ;
    $.widgetAppComboBoxBAEAModeFormsLifelinesRepairTime.enabled( view_enabled ) ;

    var recommendFurtherInvestigationValues =
    {
        0: { title: L( 'generic_yes_msg' ) } ,
        1: { title: L( 'generic_no_msg' ) }
    } ;
    $.widgetAppComboBoxBAEAModeFormsLifelinesRecommendFurtherInvestigation.init( L( 'generic_recommend_further_investigation_text_msg' ) , recommendFurtherInvestigationValues , OnRecommendFurtherInvestigation_Change , null , recommendFurtherInvestigationView ) ;
    $.widgetAppComboBoxBAEAModeFormsLifelinesRecommendFurtherInvestigation.enabled( view_enabled ) ;

    if( current_global_ar_index != -1 )
    {
        $.widgetAppTextFieldBAEAModeFormsLifelinesSiteName.set_text_value( Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["SITE"] ) ;
        $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.set_text_value( Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["LATITUDE"] ) ;
        $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.set_text_value( Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["LONGITUDE"] ) ;
        $.widgetAppTextFieldBAEAModeFormsLifelinesAddress.set_text_value( Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["ADDRESS"] ) ;
        $.widgetAppTextFieldBAEAModeFormsLifelinesNotes.set_text_value( Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["NOTES"] ) ;
        current_communication = Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["COMMUNICATION"] ;
        current_electric_power_delivery = Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["ELECTRIC_POWER_DELIVERY"] ;
        current_other = Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["OTHER"] ;
        current_functionality = Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["FUNCTIONALITY"] ;
        $.widgetAppComboBoxBAEAModeFormsLifelinesFunctionality.set_selected_index( current_functionality ) ;
        current_repair_time = Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["REPAIR_TIME"] ;
        $.widgetAppComboBoxBAEAModeFormsLifelinesRepairTime.set_selected_index( current_repair_time ) ;
        current_recommend_further_investigation = Alloy.Globals.BAEAModeLifelines[current_global_ar_index]["RECOMMEND_FURTHER_INVESTIGATION"] ;
        $.widgetAppComboBoxBAEAModeFormsLifelinesRecommendFurtherInvestigation.set_selected_index( current_recommend_further_investigation ) ;
    }
    else
    {
        $.widgetAppComboBoxBAEAModeFormsLifelinesFunctionality.set_selected_index( "1" ) ;                 // Partially Functional
        $.widgetAppComboBoxBAEAModeFormsLifelinesRepairTime.set_selected_index( "0" ) ;                    // 1 - 6 days
        $.widgetAppComboBoxBAEAModeFormsLifelinesRecommendFurtherInvestigation.set_selected_index( "0" ) ; // Yes
    }

    RegisterHideKeyboard( $.baeaModeFormsLifelinesWindow ,
    [
        $.widgetAppTextFieldBAEAModeFormsLifelinesSiteName.get_text_field() ,
        $.widgetAppTextFieldBAEAModeFormsLifelinesLatitude.get_text_field() ,
        $.widgetAppTextFieldBAEAModeFormsLifelinesLongitude.get_text_field() ,
        $.widgetAppTextFieldBAEAModeFormsLifelinesAddress.get_text_field() ,
        $.widgetAppTextFieldBAEAModeFormsLifelinesNotes.get_text_field()
    ] ) ;

    // On iOS devices will be opened the NavigationWindow, on Android will be opened the Window instead
    // Also the top margin of the ScrollView must be different depending on the device type
    if( OS_IOS )
    {
        $.navigationWindowLifelines.open() ;
    }
    else
    {
        $.baeaModeFormsLifelinesWindow.open() ;
    }
}
catch( exception )
{
    Alloy.Globals.AlertUserAndLogAsync( L( 'generic_exception_msg' ) + exception.message ) ;
}