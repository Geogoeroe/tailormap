/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define("viewer.viewercontroller.ol.OlImageLayer",{
    extend: "viewer.viewercontroller.controller.ImageLayer",
    mixins: {
        OlLayer: "viewer.viewercontroller.ol.OlLayer"
    },
    constructor : function (config){
        viewer.viewercontroller.ol.OlImageLayer.superclass.constructor.call(this, config);
        this.mixins.OlLayer.constructor.call(this,config);
        
        this.utils = Ext.create("viewer.viewercontroller.ol.Utils");
        
        this.type=viewer.viewercontroller.controller.Layer.IMAGE_TYPE;
        var map = this.config.viewerController.mapComponent.getMap().getFrameworkMap();
        var width = this.config.viewerController.mapComponent.getMap().getWidth();
        var height = this.config.viewerController.mapComponent.getMap().getHeight();
        
        if (this.options==null){
            this.options={};
        }
        /* set the displayOutsideMaxExtent and alwaysInRange because the extent is the maxextent
         * and the image is not visible.
        * @see: http://dev.openlayers.org/docs/files/OpenLayers/Layer/Image-js.html#OpenLayers.Layer.Image.extent
        */
        if (this.options.maxExtent==undefined){
            this.options.displayOutsideMaxExtent=true;
            this.options.alwaysInRange=true;
        }
        //set the start visibility
        this.options.visibility = this.visible;
        var me=this;
        var source = new ol.source.ImageStatic({
                url:this.url,
                imageSize: [width,height],
                imageExtent:this.extent,
                projection: map.getView().getProjection()
                }
        );
        this.frameworkLayer = new ol.layer.Image({
                source:source,
                visible:this.options.visibility
            }
         );
         
         //map.addLayer(this.frameworkLayer);
    },
    
    setExtent: function (extent){
        this.extent=extent;
        if(this.frameworkLayer){
            this.frameworkLayer.extent=this.utils.createBounds(extent)
        }
    },
    getLastMapRequest: function(){
        return [{
            url: this.url,
            extent: this.extent
        }];
    },
    /******** overwrite functions to make use of the mixin functions **********/    
    /**
     *Get the type of the layer
     */
    getType : function (){
        return this.mixins.OlLayer.getType.call(this);
    },
    /**
     * @see viewer.viewercontroller.openlayers.OpenLayersLayer#setVisible
     */
    setVisible: function(vis){
        this.mixins.OlLayer.setVisible.call(this,vis);
    },
    /**
     * @see viewer.viewercontroller.openlayers.OpenLayersLayer#setVisible
     */
    getVisible: function(){        
        return this.mixins.OlLayer.getVisible.call(this);
    },
    /**
     * @see viewer.viewercontroller.OpenLayers.OpenLayersLayer#setAlpha
     */
    setAlpha: function (alpha){
        this.mixins.OlLayer.setAlpha.call(this,alpha);
    },
    /**
     * @see viewer.viewercontroller.OpenLayers.OpenLayersLayer#reload
     */
    reload: function (){
        this.mixins.OlLayer.reload.call(this);
    },
    /**
     * @see viewer.viewercontroller.OpenLayers.OpenLayersLayer#addListener
     */
    addListener: function (event,handler,scope){
        this.mixins.OlLayer.addListener.call(this,event,handler,scope);
    },
    /**
     * @see viewer.viewercontroller.OpenLayers.OpenLayersLayer#removeListener
     */
    removeListener: function (event,handler,scope){
        this.mixins.openLayersOlLayer4Layer.removeListener.call(this,event,handler,scope);
    },
    /**
     * @see viewer.viewercontroller.OpenLayers.OpenLayersLayer#destroy
     */
    destroy: function (){
        this.mixins.OlLayer.destroy.call(this);
    }
    
});

