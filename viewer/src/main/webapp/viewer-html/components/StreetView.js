/* 
 * Copyright (C) 2012-2013 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * StreetView component
 * Creates a MapComponent Tool with the given configuration by calling createTool 
 * of the MapComponent
 * @author <a href="mailto:meinetoonen@b3partners.nl">Meine Toonen</a>
 */
Ext.define ("viewer.components.tools.StreetView",{
    extend: "viewer.components.tools.Tool",
    config:{
        name: i18next.t('viewer_components_tools_streetview_0'),
        width: 600,
        height: 600,
        useMarker: false,
        usePopup: false,
        title: i18next.t('viewer_components_tools_streetview_1'),
        nonSticky: false,
        titlebarIcon : "",
        tooltip : i18next.t('viewer_components_tools_streetview_2')
    },
    toolMapClick: null,
    markerName:null,
    button: null,
    popupWindow:null,
    url: "",
    constructor: function (conf){
        this.initConfig(conf);   
		viewer.components.tools.StreetView.superclass.constructor.call(this, this.config);

        this.markerName = this.id + "MARKER";
        
        this.toolMapClick = this.config.viewerController.mapComponent.createTool({
            type: viewer.viewercontroller.controller.Tool.MAP_CLICK,
            id: this.config.name,
            handler:{
                fn: this.mapClicked,
                scope:this
            },
            viewerController: this.config.viewerController
        });
        
        this.toolMapClick.addListener(viewer.viewercontroller.controller.Event.ON_ACTIVATE,this.onActivate,this);
        this.toolMapClick.addListener(viewer.viewercontroller.controller.Event.ON_DEACTIVATE,this.onDeactivate,this);
        
        this.button= this.config.viewerController.mapComponent.createTool({
            type: viewer.viewercontroller.controller.Tool.MAP_TOOL,
            id:this.getName(),
            name: this.getName(),
            tooltip: this.config.tooltip || null,
            displayClass : "streetView",
            viewerController: this.config.viewerController,
            preventActivationAsFirstTool: true
        });
        this.config.viewerController.mapComponent.addTool(this.button);
        
        this.button.addListener(viewer.viewercontroller.controller.Event.ON_EVENT_DOWN,this.buttonDown, this);
        this.button.addListener(viewer.viewercontroller.controller.Event.ON_EVENT_UP,this.buttonUp, this);
        
        if(this.viewerController.projection !== "EPSG:4236"){
            Proj4js.defs[this.viewerController.projection] = this.viewerController.projectionString;
        }
	Proj4js.defs["EPSG:4236"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ";
        
        this.url="http://maps.google.nl/maps?q=[y],[x]&z=16&layer=c&cbll=[y],[x]&cbp=12,0,,0,0";
        return this;
    },
    mapClicked : function (toolMapClick,comp){        
        var coords = comp.coord;
        var x = coords.x;
        var y = coords.y;
        var point = this.transformLatLon(x,y);
        if(this.config.useMarker){
            this.config.viewerController.mapComponent.getMap().setMarker(this.markerName,x,y);
        }
        var newUrl = ""+this.url;
        newUrl=newUrl.replace(/\[x\]/g, point.x);
        newUrl=newUrl.replace(/\[y\]/g, point.y);
        if(this.config.usePopup){        
           this.popupWindow = window.open(newUrl,'name','height='+this.config.height + ',width=' + this.config.width + ',location=no,status=no,resizable=true,toolbar=no,menubar=no');
           if(window.focus){
               this.popupWindow.focus();
           }
        }else{
            window.open(newUrl);
        }
        if(this.config.nonSticky){
            this.config.viewerController.mapComponent.activateTool(null,true);
        }
    },
    transformLatLon : function(x,y){
        var dest = new Proj4js.Proj("EPSG:4236");
        //TODO don't set SRS hardcoded
        var source = new Proj4js.Proj(this.viewerController.projection);
        var point = new Proj4js.Point(x,y);
        Proj4js.transform(source,dest,point);
        return point;
    },
    /**
     *The next functions will synchronize the button and the tool.
     */
    /**
     * When the button is hit and toggled true
     * @param button the button
     * @param object the options.        
     */
    buttonDown : function(button,object){        
        this.toolMapClick.activateTool();
        
        this.config.viewerController.mapComponent.setCursor(true, "crosshair");
    },
    /**
     * When the button is hit and toggled false
     */
    buttonUp: function(button,object){
        this.config.viewerController.mapComponent.setCursor(false);
        if(this.config.useMarker){
            this.config.viewerController.mapComponent.getMap().removeMarker(this.markerName);
        }
        this.toolMapClick.deactivateTool();
    },    
    /**
     * raised when the tool is activated.
     */    
    onActivate: function (){
        this.config.viewerController.mapComponent.setCursor(true, "crosshair");
        this.button.setSelectedState(true);
    },
    /**
     * raised when the tool is deactivated.
     */
    onDeactivate: function(){
        if(this.config.useMarker){
            this.config.viewerController.mapComponent.getMap().removeMarker(this.markerName);
        }
        this.button.setSelectedState(false);
        this.config.viewerController.mapComponent.setCursor(false);
    }
});