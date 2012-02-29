/* 
 * Copyright (C) 2012 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * LoadMonitor object.
 * Monitor's the loading with a loadingbar
 * @author <a href="mailto:roybraam@b3partners.nl">Roy Braam</a>
 */
Ext.define ("viewer.components.FeatureInfo",{
    extend: "viewer.components.Component",   
    progressElement: null,
    constructor: function (conf){      
        conf.isPopup=true;
        viewer.components.FeatureInfo.superclass.constructor.call(this, conf);        
        //this.initConfig(conf);        
        this.popup.hide();
        this.progressElement = new Ext.Element(document.createElement("div"));       
        //register ondata event.
        this.getViewerController().mapComponent.getMap().registerEvent(viewer.viewercontroller.controller.Event.ON_GET_FEATURE_INFO_DATA,this.onGetFeatureInfoData,this);
        this.getViewerController().mapComponent.getMap().registerEvent(viewer.viewercontroller.controller.Event.ON_GET_FEATURE_INFO,this.onFeatureInfo,this);
        this.getViewerController().mapComponent.getMap().registerEvent(viewer.viewercontroller.controller.Event.ON_GET_FEATURE_INFO_PROGRESS,this.onProgress,this);
        
        return this;
    },
    onGetFeatureInfoData: function(map,options){
        var contentDiv=Ext.get(this.getContentDiv());
        contentDiv.update("");   
        var data=options.data;
        var html="";
        for (var layerName in data){
            var appLayer = this.viewerController.getApplayer(options.layer.serviceId,layerName);
            html+="<div class='featureinfo_layertitle'>"
                //TODO: Use the alias of the layer???
                html+=appLayer.layerName;                
                html+="<div class='featureinfo_attributes'>";
                for (var index in data[layerName]){
                    for (var attributeName in data[layerName][index]){
                        html+="<div class='featureinfo_attr'>";
                            html+="<div class='featureinfo_attrname'>"+attributeName+"</div>";
                            html+="<div class='featureinfo_attrvalue'>"+data[layerName][index][attributeName]+"</div>";
                        html+="</div>"
                    }
                }
                html+="</div>";
            html+="</div>";
        }
        contentDiv.insertHtml("beforeEnd", html);                
    },
    onFeatureInfo: function(map,options){          
        Ext.get(this.getContentDiv()).update("");
        Ext.get(this.getContentDiv()).appendChild(this.progressElement);
        this.popup.show();
        this.setProgress(0);      
        
    },
    onProgress: function(map,options){
        if (options.total==options.nr){
            this.progressElement.hide();
        }else{
            this.progressElement.show();
            //calculate the percentage but add 1 to both because we begin at 0
            var percentage=100/(options.total+1) * (options.nr+1);
            this.setProgress(percentage);      
        }
    },
    setProgress: function (progress){
        this.progressElement.update(""+progress+" %");
    }
});

