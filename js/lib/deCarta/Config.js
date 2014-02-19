var Config = {
    clientName: "Swisttech",
    clientPassword: "e35613cbc0f797747787ba1d936617a0",
    position: "-29.141533, 26.164229"
}

if (!Config.clientName || !Config.clientPassword) alert("Oops! That didn't work...\n\nTo view the examples you need to provide your authentication credentials. \n\nSee Config.js for intructions.");

/* 
If you are running your own instance of DDS/WebServices, 
you can further edit the configuration with the following properties. 
*/

/** Url for DDS WebServices (String)*/
deCarta.Core.Configuration.url = "http://ws.mapit.co.za/openls/JSON";

/** digital globe keys. These are only valid for use on the devzone. */
deCarta.Core.Configuration.digitalGlobeKey = '';
/** Required  for DG3. Only available when projection is set to spherical */
deCarta.Core.Configuration.digitalGlobeConnectID = '';
/** Required for mapIT South Africa Imagery. Only available when projection is set to spherical(3857) 
    mapIT Key can be acquired by contacting mapIT at devzone@mapit.co.za 
*/
deCarta.Core.Configuration.mapitImageryKey =  "JGPAVCKQEVHAHYSLXONKCYTMSQFGTGUM";
//deCarta.Mobile.Configuration.mapitImageryKey = "";
/** Required for mapIT South Africa Imagery. This specifies the zoom levels to use mapIT imagery instead of DG3 imagery
    Higher the value the deeper the zoom level, available levels : 4 - 19 
*/
deCarta.Core.Configuration.mapitImageryFromZoomLevel = 1;
deCarta.Core.Configuration.mapitImageryToZoomLevel = 19;

/** Localizer values */
deCarta.Core.Configuration.language = 'EN';
/** Localizer values */
deCarta.Core.Configuration.country = 'ZA';
/** Projection system; valid values are= EPSG:3857 (Spherical) or EPSG:3395 (ellipsoidal) */
deCarta.Core.Configuration.projection = 'EPSG:3857';
/** Path to image resources */
deCarta.Core.Configuration.imgPath = "img";
/** This flag can be used for debugging. By setting to <em>true</em>;
 *  all exceptions will be also displayed as alerts. */
deCarta.Core.Configuration.vocalExceptions = true;
/** Base z-index for overlays (int). Use this to control the base css index
 * for any map overlays that are created. */
deCarta.Core.Configuration.baseOvlZ = 100;
/** Tile config used for standard resolution devices (String)*/
deCarta.Core.Configuration.defaultConfig = 'tomtom';
/** Tile config used for high res devices (String)*/
deCarta.Core.Configuration.defaultHighResConfig = 'tomtom';
/** Tile Config used in transparent tiles */
deCarta.Core.Configuration.defaultTransparentConfig = 'tomtom-transparent';
/** Resource timeout; milliseconds */
deCarta.Core.Configuration.resourceTimeout = 20000;
/** Request timeout; milliseconds */
deCarta.Core.Configuration.requestTimeout = 15000;
/** When <em>true</em>; the map will use hardware acceleration; if available */
deCarta.Core.Configuration.useHardwareAcceleration = true;
/* force  port on the tile urls if server does not return a port in the init call */
deCarta.Core.Configuration.imagePort = 80; /*8080*/
/* if true; sets the  TILE image URL to 'image-cache'; else just 'image'  */
deCarta.Core.Configuration.useCache = true;
/* DDS dataset which goes into the TILE image URL */
deCarta.Core.Configuration.dataSet = "tomtom-zaf";
/* apiVersion used if server is in strict mode; else leave it null */
deCarta.Core.Configuration.apiVersion = null;
deCarta.Core.Configuration.urlVersion = 'auto'; //1;auto
deCarta.Core.Configuration.consolelogXML = false;
/** Use precaching if the tilestore supports it */
deCarta.Core.Configuration.usePrecaching = true;
