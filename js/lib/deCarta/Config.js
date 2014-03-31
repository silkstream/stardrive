
var Config = {
    clientName: "Netstar",
    clientPassword: "1ad8fb5bb45776eb3936181f87ca7db0",
    position: "-33.8999, 18.6233"
}
if (!Config.clientName || !Config.clientPassword) alert("Opps! That didn't work...\n\nTo view the examples you need to provide your authentication credentials. \n\nSee Config.js for intructions.");

deCarta.Core.Configuration.url = "https://ws.mapit.co.za/openls/JSON";


/** digital globe keys. These are only valid for use on the devzone. */
deCarta.Core.Configuration.digitalGlobeKey = '';
/** Required  for DG3. Only available when projection is set to spherical */
deCarta.Core.Configuration.digitalGlobeConnectID = '4f824986-7ea6-4c00-80ed-a028926f09cc';
/** Localizer values */
deCarta.Core.Configuration.language = 'EN';
/** Localizer values */
deCarta.Core.Configuration.country = 'ZA';
/** Projection system; valid values are= EPSG3857 (Spherical) or EPSG3395 (ellipsoidal) */
deCarta.Core.Configuration.projection = 'EPSG:3857';
/** Path to image resources */
deCarta.Core.Configuration.imgPath = "img/";
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
deCarta.Core.Configuration.urlVersion = 2; //1;auto
deCarta.Core.Configuration.consolelogXML = false;
/** Use precaching if the tilestore supports it */
deCarta.Core.Configuration.usePrecaching = false;


