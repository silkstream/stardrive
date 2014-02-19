/**
 * @class
 * Add a Geolocation button to the map.
 * This class inherits from {@link deCarta.UI.MapControl}.
 *
 * @description Traffic Map Control
 *
 * @constructor
 * @param opt Options A list of options with which to initialize the TrafficControl.
 * Valid options are:
 * <ul>
 *   <li>(string) position: (Inherited from {@link deCarta.UI.MapControl}), which should
 *       be set to one of: 'topLeft', 'topRight', 'bottomLeft', 'bottomRight' (default='topLeft')</li> 
 *   <li>(function) newLocationCallback: a function that will be invoked when a new location is found.</li>
 *   <li>(function) newLocationErrorCallback: a function that will invoked when an error is returned from the geolocation api. </li>
 *   <li>(bool) enableHighAccuracy: enebles the highest accuracy supported by the device. </li>
 * </ul>
 * To style this control, edit the corresponding CSS file in the css/UI dir.
 * @see deCarta.UI.MapControl
 * @see deCarta.Core.Map
 */
deCarta.UI.TrafficControl = function(opt){	 
    this.options = {
        enableTrafficCallback : undefined,
        disableTrafficCallback : undefined,
        enableHighAccuracy : false,
        cssClass : "deCarta-control-traffic",
        layout: function(width, height, existingControls){
            return {top: height - this.height, left:  0};
        }
    }
    this.options = deCarta.Utilities.extendObject(this.options, opt);
    deCarta.UI.MapControl.call(this, this.options);  
}


//Define methods to extend TrafficControl
deCarta.UI.TrafficControl.prototype = {
    /**
     * @private
     */
    ready: false,
    tracking: false,
    /**
     * @private
     */
    initElements: function(){   

        this.domElement = document.createElement('div');
        this.contentElement = document.createElement('div');
        this.domElement.style.position = 'absolute';
        this.contentElement.className = 'deCarta-control-traffic deCarta-control-traffic-off';
        if(this.options.cssClass !== this.contentElement.className){
            this.contentElement.className = this.contentElement.className + ' ' + this.options.cssClass;
        }

        this.domElement.className = "domElement";

        deCarta.Touch.attachListener('tap', this.contentElement, this.toggleTraffic.bind(this), true);

        this.height = (this.options.height || 20);
        this.ready = true; 
    },

    /**
     * @private
     */
    toggleTraffic : function(){

        if(this.contentElement.className.match(/-off/g)){
            this.contentElement.className="deCarta-control-traffic deCarta-control-traffic-on";
            this.options.map.showTraffic();
            if(this.options.enableTrafficCallback)
                this.options.enableTrafficCallback()
        } else {
            this.contentElement.className="deCarta-control-traffic deCarta-control-traffic-off";
            this.options.map.hideTraffic();
            if(this.options.disableTrafficCallback)
                this.options.disableTrafficCallback()
        }
    },        
    /**
     * This render method implements the render method from the 
     * {@link deCarta.UI.MapControl} base class.
     * It is responsible for rendering this control on the map,
     * and produces a single HTML Dom Element containing the whole
     * GUI for the control.
     * @param {string} container The DOM element within which the control is rendered. 
     */
    render: function(container){
        if (!this.ready) this.initElements();
        this.domElement.appendChild( this.contentElement );
        container.appendChild( this.domElement );
        this.width = this.domElement.offsetWidth;
        this.height = this.domElement.offsetHeight;        
    }
}; 
//Extend the MapControl with the additional methods for TrafficControl
deCarta.UI.TrafficControl.prototype = deCarta.Utilities.inherit(deCarta.UI.TrafficControl.prototype, deCarta.UI.MapControl.prototype);