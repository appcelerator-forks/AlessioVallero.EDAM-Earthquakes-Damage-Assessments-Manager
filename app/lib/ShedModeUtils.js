function ShedModeUtils()
{
}

// Query to retrieve the ShedForm, given the form_id
ShedModeUtils.LoadDetailsQuery = function( form_id )
{
    var recoverDetails = Alloy.createCollection( 'ShedForms' ) ;

    if( form_id )
    {
        recoverDetails.fetch(
        {
            query: "SELECT * FROM ShedForms where ID=" + form_id
        } ) ;
    }
    else
    {
        recoverDetails.fetch(
        {
            query: "SELECT * FROM ShedForms where USER is null or USER = '' or USER=\"" + Alloy.Globals.SessionUsername + "\" and SYNCHRONIZED=\"0\""
        } ) ;
    }

    return recoverDetails ;
} ;

// Query to retrieve the ShedPosition, given the form_id
ShedModeUtils.LoadShedPositionQuery = function( form_id )
{
    var recoverShedsPositions = Alloy.createCollection( 'ShedFormsShedsPositions' ) ;
    recoverShedsPositions.fetch(
    {
        query: "SELECT * FROM ShedFormsShedsPositions where FORM_ID=" + form_id
    } ) ;

    return recoverShedsPositions ;
} ;

// Query to retrieve the ShedCharacteristics, given the form_id
ShedModeUtils.LoadShedCharacteristicsQuery = function( form_id )
{
    var recoverShedCharacteristics = Alloy.createCollection( 'ShedFormsShedsCharacteristics' ) ;
    recoverShedCharacteristics.fetch(
    {
        query: "SELECT * FROM ShedFormsShedsCharacteristics where FORM_ID=" + form_id
    } ) ;

    return recoverShedCharacteristics ;
} ;

// Query to retrieve the Infrastructure, given the form_id
ShedModeUtils.LoadInfrastructureQuery = function( form_id )
{
    var recoverInfrastructure = Alloy.createCollection( 'ShedFormsInfrastructure' ) ;
    recoverInfrastructure.fetch(
    {
        query: "SELECT * FROM ShedFormsInfrastructure where FORM_ID=" + form_id
    } ) ;

    return recoverInfrastructure ;
} ;

// Query to retrieve the Damages, given the form_id
ShedModeUtils.LoadDamagesQuery = function( form_id )
{
    var recoverDamages = Alloy.createCollection( 'ShedFormsDamages' ) ;
    recoverDamages.fetch(
    {
        query: "SELECT * FROM ShedFormsDamages where FORM_ID=" + form_id
    } ) ;

    return recoverDamages ;
} ;

// Query to retrieve the JudgmentOfPracticability, given the form_id
ShedModeUtils.LoadJudgmentOfPracticabilityQuery = function( form_id )
{
    var recoverJudgmentOfPracticability = Alloy.createCollection( 'ShedFormsJudgmentOfPracticability' ) ;
    recoverJudgmentOfPracticability.fetch(
    {
        query: "SELECT * FROM ShedFormsJudgmentOfPracticability where FORM_ID=" + form_id
    } ) ;

    return recoverJudgmentOfPracticability ;
} ;

// Query to retrieve the OtherComments, given the form_id
ShedModeUtils.LoadOtherCommentsQuery = function( form_id )
{
    var recoverOtherComments = Alloy.createCollection( 'ShedFormsOtherComments' ) ;
    recoverOtherComments.fetch(
    {
        query: "SELECT * FROM ShedFormsOtherComments where FORM_ID=" + form_id
    } ) ;

    return recoverOtherComments ;
} ;

// Query to retrieve the TeamPersonalData, given the form_id
ShedModeUtils.LoadTeamPersonalData = function()
{
    if( Alloy.Collections.ShedModePD && _.size( Alloy.Collections.ShedModePD ) > 0 )
    {
        // If the array isn't null or empty, we use the array as is (a previous setting was done)
    }
    else
    {
        // Extraction only of the Shed data (only one row is expected)
        Alloy.Collections.ShedModePD.fetch( { query: "SELECT * FROM ShedPD" } ) ;
    }
} ;

// Query to retrieve the Images, given the form_id
ShedModeUtils.LoadImagesQuery = function( form_id )
{
    var recoverPictureGallery = Alloy.createCollection( 'ShedFormsImages' ) ;
    recoverPictureGallery.fetch(
    {
        query: "SELECT ID, IMAGE_PATH, LATITUDE, LONGITUDE, ADDRESS, HEADING, DAMAGES_LEVEL, DAMAGES_AREA, COMMENT FROM ShedFormsImages where FORM_ID=" + form_id
    } ) ;

    return recoverPictureGallery ;
} ;

// Query to retrieve the Videos, given the form_id
ShedModeUtils.LoadVideosQuery = function( form_id )
{
    var recoverVideoGallery = Alloy.createCollection( 'ShedFormsVideos' ) ;
    recoverVideoGallery.fetch(
    {
        query: "SELECT ID, VIDEO_PATH, LATITUDE, LONGITUDE, ADDRESS, HEADING, DAMAGES_LEVEL, DAMAGES_AREA, COMMENT FROM ShedFormsVideos where FORM_ID=" + form_id
    } ) ;

    return recoverVideoGallery ;
} ;

// Create a media array with all pictures and videos
ShedModeUtils.CreateMediaArray = function( form_id , not_saved_needed , only_pictures )
{
    var media_array = new Array() ;

    // If this is not a new form, we have to search on the DB
    if( form_id != -1 )
    {
        var recoverPictureGallery = ShedModeUtils.LoadImagesQuery( form_id ) ;
        if( recoverPictureGallery.length > 0 )
        {
            for( var i = 0 ; i < recoverPictureGallery.length ; i++ )
            {
                var image = recoverPictureGallery.at( i ) ;
                var id = image.get( "ID" ) ;
                var image_path = image.get( "IMAGE_PATH" ) ;
                var latitude = image.get( "LATITUDE" ) ;
                var longitude = image.get( "LONGITUDE" ) ;
                var address = image.get( "ADDRESS" ) ;
                var heading = image.get( "HEADING" ) ;
                var damages_level = image.get( "DAMAGES_LEVEL" ) ;
                var damages_area = image.get( "DAMAGES_AREA" ) ;
                var comment = image.get( "COMMENT" ) ;

                var media_found = false ;
                var file = Alloy.Globals.getFileForRead( image_path ) ;
                if( file )
                {
                    // OK
                    filename = file.getNativePath() ;
                    media_found = true ;
                }

                // Push in the media array
                media_array.push( { media: filename , id: id , type: "PIC" , latitude: latitude , longitude: longitude , address: address , heading: heading , damages_level: damages_level , damages_area: damages_area , comment: comment , path: image_path , media_found: media_found } ) ;
            }
        }

        if( only_pictures )
        {
        }
        else
        {
            var recoverVideoGallery = ShedModeUtils.LoadVideosQuery( form_id ) ;
            if( recoverVideoGallery.length > 0 )
            {
                for( var i = 0 ; i < recoverVideoGallery.length ; i++ )
                {
                    var video = recoverVideoGallery.at( i ) ;
                    var id = video.get( "ID" ) ;
                    var video_path = video.get( "VIDEO_PATH" ) ;
                    var latitude = video.get( "LATITUDE" ) ;
                    var longitude = video.get( "LONGITUDE" ) ;
                    var address = video.get( "ADDRESS" ) ;
                    var heading = video.get( "HEADING" ) ;
                    var damages_level = video.get( "DAMAGES_LEVEL" ) ;
                    var damages_area = video.get( "DAMAGES_AREA" ) ;
                    var comment = video.get( "COMMENT" ) ;

                    var media_found = false ;
                    var file = Alloy.Globals.getFileForRead( video_path ) ;
                    var filename = null ;
                    if( file )
                    {
                        filename = file.getNativePath() ;
                        media_found = true ;
                    }
                    // Push in the media array
                    media_array.push( { media: filename , id: id , type: "VID" , latitude: latitude , longitude: longitude , address: address , heading: heading , damages_level: damages_level , damages_area: damages_area , comment: comment , path: video_path , media_found: media_found } ) ;
                }
            }
        }
    }

    if( not_saved_needed )
    {
        // If the array isn't null or empty, we have some not saved images
        if( Alloy.Globals.CurrentPicsPath && Alloy.Globals.CurrentPicsPath.length > 0 )
        {
            for( var i = 0 ; i < Alloy.Globals.CurrentPicsPath.length ; i++ )
            {
                if( Alloy.Globals.CurrentPicsPath[i].media )
                {
                    // Nothing to do
                }
                else
                {
                    // The media is not set, this mean that is a modified container and we must search the corresponding DB element and update it's values
                    for( var j = 0 ; j < media_array.length ; j++ )
                    {
                        if( media_array[j].id && media_array[j].id == Alloy.Globals.CurrentPicsPath[i].id )
                        {
                            media_array[j].latitude = Alloy.Globals.CurrentPicsPath[i].latitude ;
                            media_array[j].longitude = Alloy.Globals.CurrentPicsPath[i].longitude ;
                            media_array[j].address = Alloy.Globals.CurrentPicsPath[i].address ;
                            media_array[j].heading = Alloy.Globals.CurrentPicsPath[i].heading ;
                            media_array[j].damages_level = Alloy.Globals.CurrentPicsPath[i].damages_level ;
                            media_array[j].damages_area = Alloy.Globals.CurrentPicsPath[i].damages_area ;
                            media_array[j].comment = Alloy.Globals.CurrentPicsPath[i].comment ;

                            break ;
                        }
                    }
                }

                // Push in the media array
                media_array.push( { index: i , media: Alloy.Globals.CurrentPicsPath[i].media , type: "PIC" , latitude: Alloy.Globals.CurrentPicsPath[i].latitude , longitude: Alloy.Globals.CurrentPicsPath[i].longitude , address: Alloy.Globals.CurrentPicsPath[i].address , heading: Alloy.Globals.CurrentPicsPath[i].heading , damages_level: Alloy.Globals.CurrentPicsPath[i].damages_level , damages_area: Alloy.Globals.CurrentPicsPath[i].damages_area , comment: Alloy.Globals.CurrentPicsPath[i].comment , media_found: true } ) ;
            }
        }

        if( only_pictures )
        {
        }
        else
        {
            // If the array isn't null or empty, we have some not saved videos
            if( Alloy.Globals.CurrentVideosPath && Alloy.Globals.CurrentVideosPath.length > 0 )
            {
                for( var i = 0 ; i < Alloy.Globals.CurrentVideosPath.length ; i++ )
                {
                    if( Alloy.Globals.CurrentVideosPath[i].media )
                    {
                        // Nothing to do
                    }
                    else
                    {
                        // The media is not set, this mean that is a modified container and we must search the corresponding DB element and update it's values
                        for( var j = 0 ; j < media_array.length ; j++ )
                        {
                            if( media_array[j].id && media_array[j].id == Alloy.Globals.CurrentVideosPath[i].id )
                            {
                                media_array[j].latitude = Alloy.Globals.CurrentVideosPath[i].latitude ;
                                media_array[j].longitude = Alloy.Globals.CurrentVideosPath[i].longitude ;
                                media_array[j].address = Alloy.Globals.CurrentVideosPath[i].address ;
                                media_array[j].heading = Alloy.Globals.CurrentVideosPath[i].heading ;
                                media_array[j].damages_level = Alloy.Globals.CurrentVideosPath[i].damages_level ;
                                media_array[j].damages_area = Alloy.Globals.CurrentVideosPath[i].damages_area ;
                                media_array[j].comment = Alloy.Globals.CurrentVideosPath[i].comment ;

                                break ;
                            }
                        }
                    }

                    // Push in the media array
                    media_array.push( { index: i , media: Alloy.Globals.CurrentVideosPath[i].media , type: "VID" , latitude: Alloy.Globals.CurrentVideosPath[i].latitude , longitude: Alloy.Globals.CurrentVideosPath[i].longitude , address: Alloy.Globals.CurrentVideosPath[i].address , heading: Alloy.Globals.CurrentVideosPath[i].heading , damages_level: Alloy.Globals.CurrentVideosPath[i].damages_level , damages_area: Alloy.Globals.CurrentVideosPath[i].damages_area , comment: Alloy.Globals.CurrentVideosPath[i].comment , media_found: true } ) ;
                }
            }
        }
    }

    return media_array ;
} ;

module.exports = ShedModeUtils ;
