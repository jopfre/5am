!function(e,t){if("function"==typeof define&&define.amd)define(["leaflet","proj4leaflet"],t);else if("object"==typeof exports){var o=require("leaflet");require("proj4leaflet"),module.exports=t(o)}else{if(void 0===window.L)throw new Error("Leaflet missing");e.returnExports=t(e.L)}}(this,function(r){return r.OSOpenSpace=r.OSOpenSpace||{},r.OSOpenSpace.VERSION="1.0.0",r.OSOpenSpace.CRS=r.extend(new r.Proj.CRS("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs",{resolutions:[16,8,4,2,1]}),{distance:function(e,t){return r.CRS.Earth.distance(e,t)}}),r.OSOpenSpace.LogoControl=r.Control.extend({options:{position:"bottomleft"},onAdd:function(){var e=r.DomUtil.create("div","os-logo-control"),t=r.DomUtil.create("img","",e);return t.title="Powered by OS OpenSpace",t.classList="openspace-attr",t.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAA7CAMAAAD4p6zTAAAAdVBMVEUAAABDPYxDPY1AQI9EPY5EPoxEPY3///9EPY3z8/iWkr+KhrhzbqrEB1FnYaJbVZtQSZR+erGinsb00d7Fwtv78PTwwdTQz+PTRX3IF1zc2+ro5/Gtqs25ttTig6jaZJLtssn44OnLJmfpor7lk7PPNnLWVYfBOrQkAAAAB3RSTlMAUJ8Qv8+vnqzJJAAAAmNJREFUeAHl14Vi2zAUheHyuVds5nD6/o84211YcsHj/aVA85lBd0P3T/S1nu7vxh5fiIyIP58wRA+PA/FApsHXagw9DEtBhvHV2FC/LM/U4Os19Hx3RwZzMtQTAnMSAxFjTvE5QaRkg4lUARRqkgDLaC6BVHWOhBToeo9qS4adU4JIsCJrB8I5Em0EmM5HxMIJV7ORFhGlXWRaRDHVtWN2MkJNI9GwjYlrBx9RFE2sgFjZwrUy6kgpJQit6/+6DjDfFySOZStFYEFQWEbUCisb59imYKbxtVrKw1wwVFtY14QISGcN15TCSHSkXEdAZI1t+h83EtYaholwSxxqahzj4uy1gk9P2BYe4jOxFZhJ9P0vRN1K1RenjIvWu2WJbblIME1wa+mYbM6Ape7DbqP1ZjtFpJYuEoc5WVV6aLB6pcyChKDrTP0m6LcwttBVEiAk3eYGY11dEMir0k9I8uUYWOpLAknuJVLypwB9aHqjsqNAHZYfI2IKZbH+GGEpWIrXA5HkSZCoKZzE7kCUWleLzE/EFM4hPyN6ZOslJE3EOCf6tj5C0UTFNaFX84kqm03oxS0R0USM/TWx+ewWQVZeETq7IQoKF6Fvu78k8hsCjoJ1GFvnizAxvSSOceiMSD5zpMbwEbgl0JI/Ax/x6iFC29XVWCW3RO4l2JCnAiir/JoInDvBkf/sm1R6cUlUWYAAWkcXqQZD673ebLMTsUmmblGkOwMKHNpV/cwvF9lILLPpayqnQlkiFbUNzlst91onZVXu1n/mzcH8kcD88cj8UdGPGJvNHyH2PT7MHKfOHy1/Axgmj2KBwwXnAAAAAElFTkSuQmCC",e}}),r.OSOpenSpace.TileLayer=r.TileLayer.WMS.extend({initialize:function(e,t,o){if(!e)throw new Error("OSOpenSpace layer requires an API Key parameter to function.");t||(t="file:///"),o=r.extend({crs:r.OSOpenSpace.CRS,tileSize:250,minNativeZoom:2},o),r.TileLayer.WMS.prototype.initialize.call(this,"https://openspace.ordnancesurvey.co.uk/osmapapi/ts",o),this.wmsParams={KEY:e,FORMAT:"image/png",URL:t,REQUEST:"GetMap",WIDTH:this.options.tileSize,HEIGHT:this.options.tileSize}},getAttribution:function(){return"&copy; Crown copyright and database rights "+(new Date).getFullYear()+' Ordnance Survey. <a target="_blank" href="https://www.ordnancesurvey.co.uk/web-services/os-openspace/developer-agreement.html" title="OS OpenSpace Terms of Use">Terms of Use</a>.'},onAdd:function(e){e.options.attributionControl&&(this.logoControl=new r.OSOpenSpace.LogoControl,e.addControl(this.logoControl)),r.TileLayer.prototype.onAdd.call(this,e)},onRemove:function(e){this.logoControl&&e.removeControl(this.logoControl),r.TileLayer.prototype.onRemove.call(this,e)},getTileUrl:function(e){var t=this.options.crs.options.resolutions[e.z],o=this.options.tileSize*t,n=o*e.x,i=o*(-1-e.y);return this.wmsParams.BBOX=[n,i,0,0].join(","),this.wmsParams.LAYERS=t,this._url+r.Util.getParamString(this.wmsParams)}}),r.OSOpenSpace.tilelayer=function(e,t,o){return new r.OSOpenSpace.TileLayer(e,t,o)},r.OSOpenSpace});