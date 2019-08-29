'use strict';

var libQ = require('kew');
var fs=require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;


module.exports = freedspAuroraControl;
function freedspAuroraControl(context) {
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;

}



freedspAuroraControl.prototype.onVolumioStart = function()
{
	var self = this;
	var configFile=this.commandRouter.pluginManager.getConfigurationFile(this.context,'config.json');
	this.config = new (require('v-conf'))();
	this.config.loadFile(configFile);

    return libQ.resolve();
}

freedspAuroraControl.prototype.onStart = function() {
    var self = this;
	var defer=libQ.defer();

	self.addVolumeScripts();
	self.addToBrowseSources();


	// Once the Plugin has successfull started resolve the promise
	defer.resolve();

    return defer.promise;
};

freedspAuroraControl.prototype.onStop = function() {
    var self = this;
    var defer=libQ.defer();

    // Once the Plugin has successfull stopped resolve the promise
    defer.resolve();

    return libQ.resolve();
};

freedspAuroraControl.prototype.onRestart = function() {
    var self = this;
    // Optional, use if you need it
};

freedspAuroraControl.prototype.addVolumeScripts = function() {
    var self = this;

    var enabled = true;
    var setVolumeScript = '/data/plugins/miscellanea/freedsp_aurora_control/setvolume.sh';
    var getVolumeScript = '/data/plugins/miscellanea/freedsp_aurora_control/getvolume.sh';
    var setMuteScript = '/data/plugins/miscellanea/freedsp_aurora_control/setmute.sh';
    var getMuteScript = '/data/plugins/miscellanea/freedsp_aurora_control/getmute.sh';
    var minVol = 0;
    var maxVol = 63;
    var mapTo100 = self.config.get('map_to_100', false);

    var data = {'enabled': enabled, 'setvolumescript': setVolumeScript, 'getvolumescript': getVolumeScript, 'setmutescript': setMuteScript,'getmutescript': getMuteScript, 'minVol': minVol, 'maxVol': maxVol, 'mapTo100': mapTo100};
    self.logger.info('Adding FreeDSP Aurora  parameters'+ JSON.stringify(data))
    self.commandRouter.updateVolumeScripts(data);
};


// Configuration Methods -----------------------------------------------------------------------------

freedspAuroraControl.prototype.getUIConfig = function() {
    var defer = libQ.defer();
    var self = this;

    var lang_code = this.commandRouter.sharedVars.get('language_code');

    self.commandRouter.i18nJson(__dirname+'/i18n/strings_'+lang_code+'.json',
        __dirname+'/i18n/strings_en.json',
        __dirname + '/UIConfig.json')
        .then(function(uiconf)
        {


            defer.resolve(uiconf);
        })
        .fail(function()
        {
            defer.reject(new Error());
        });

    return defer.promise;
};

freedspAuroraControl.prototype.getConfigurationFiles = function() {
	return ['config.json'];
}

freedspAuroraControl.prototype.setUIConfig = function(data) {
	var self = this;
	//Perform your installation tasks here
};

freedspAuroraControl.prototype.getConf = function(varName) {
	var self = this;
	//Perform your installation tasks here
};

freedspAuroraControl.prototype.setConf = function(varName, varValue) {
	var self = this;
	//Perform your installation tasks here
};



// Playback Controls ---------------------------------------------------------------------------------------
// If your plugin is not a music_sevice don't use this part and delete it


freedspAuroraControl.prototype.addToBrowseSources = function () {
	var data = {name: 'FreeDSPAurora', uri: 'aurora', plugin_type:'music_service', icon: 'fa fa-plug', plugin_name:'freedsp_aurora_control'};
	this.commandRouter.volumioAddToBrowseSources(data);
};

freedspAuroraControl.prototype.handleBrowseUri = function (curUri) {
    var self = this;

    //self.commandRouter.logger.info(curUri);
    var response;


    return response;
};



// Define a method to clear, add, and play an array of tracks
freedspAuroraControl.prototype.clearAddPlayTrack = function(track) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'freedspAuroraControl::clearAddPlayTrack');

	self.commandRouter.logger.info(JSON.stringify(track));

	return self.sendSpopCommand('uplay', [track.uri]);
};

freedspAuroraControl.prototype.seek = function (timepos) {
    this.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'freedspAuroraControl::seek to ' + timepos);

    return this.sendSpopCommand('seek '+timepos, []);
};

// Stop
freedspAuroraControl.prototype.stop = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'freedspAuroraControl::stop');


};

// Spop pause
freedspAuroraControl.prototype.pause = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'freedspAuroraControl::pause');


};

// Get state
freedspAuroraControl.prototype.getState = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'freedspAuroraControl::getState');


};

//Parse state
freedspAuroraControl.prototype.parseState = function(sState) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'freedspAuroraControl::parseState');

	//Use this method to parse the state and eventually send it with the following function
};

// Announce updated State
freedspAuroraControl.prototype.pushState = function(state) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'freedspAuroraControl::pushState');

	return self.commandRouter.servicePushState(state, self.servicename);
};


freedspAuroraControl.prototype.explodeUri = function(uri) {
	var self = this;
	var defer=libQ.defer();

	// Mandatory: retrieve all info for a given URI

	return defer.promise;
};

freedspAuroraControl.prototype.getAlbumArt = function (data, path) {

	var artist, album;

	if (data != undefined && data.path != undefined) {
		path = data.path;
	}

	var web;

	if (data != undefined && data.artist != undefined) {
		artist = data.artist;
		if (data.album != undefined)
			album = data.album;
		else album = data.artist;

		web = '?web=' + nodetools.urlEncode(artist) + '/' + nodetools.urlEncode(album) + '/large'
	}

	var url = '/albumart';

	if (web != undefined)
		url = url + web;

	if (web != undefined && path != undefined)
		url = url + '&';
	else if (path != undefined)
		url = url + '?';

	if (path != undefined)
		url = url + 'path=' + nodetools.urlEncode(path);

	return url;
};





freedspAuroraControl.prototype.search = function (query) {
	var self=this;
	var defer=libQ.defer();

	// Mandatory, search. You can divide the search in sections using following functions

	return defer.promise;
};

freedspAuroraControl.prototype._searchArtists = function (results) {

};

freedspAuroraControl.prototype._searchAlbums = function (results) {

};

freedspAuroraControl.prototype._searchPlaylists = function (results) {


};

freedspAuroraControl.prototype._searchTracks = function (results) {

};

freedspAuroraControl.prototype.goto=function(data){
    var self=this
    var defer=libQ.defer()

// Handle go to artist and go to album function

     return defer.promise;
};
