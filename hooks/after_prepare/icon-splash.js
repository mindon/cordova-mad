#!/usr/bin/env node

var _NMR = ''; // update this to your node_modules/ where cordova locates

var cordova_util = require(_NMR +'cordova/src/util');
var platforms = require(_NMR +'cordova/platforms');
var projRoot = cordova_util.isCordova(process.cwd());
var projXml = cordova_util.projectConfig(projRoot);
var ConfigParser = cordova_util.config_parser
if(undefined === ConfigParser) {
    ConfigParser = require(_NMR +'cordova/src/ConfigParser');
}
var projConfig = new ConfigParser(projXml);
var projName = projConfig.name();

var fs = require ('fs');

var platformDir = {
  ios: {
		icon: projName +"/Resources/icons",
		splash: projName +"/Resources/splash",
		nameMap: {
			"icon-40.png": "icon-40.png",
			"icon-40-2x.png": "icon-40@2x.png",
			"icon-50.png": "icon-50.png",
			"icon-50-2x.png": "icon-50.png",
			"icon-60.png": "icon-60.png",
			"icon-60-2x.png": "icon-60@2x.png",
			"icon-72.png": "icon-72.png",
			"icon-72-2x.png": "icon-72@2x.png",
			"icon-76.png": "icon-76.png",
			"icon-76-2x.png": "icon-76@2x.png",
			"icon-small.png": "icon-small.png",
			"icon-small-2x.png": "icon-small@2x.png",
			"icon-57.png": "icon.png",
			"icon-57-2x.png": "icon@2x.png",
			"screen-ipad-landscape.png": "Default-Landscape~ipad.png",
			"screen-ipad-landscape-2x.png": "Default-Landscape@2x~ipad.png",
			"screen-ipad-portrait.png": "Default-Portrait~ipad.png",
			"screen-ipad-portrait-2x.png": "Default-Portrait@2x~ipad.png",
			"screen-iphone-portrait.png": "Default~iphone.png",
			"screen-iphone-portrait-2x.png": "Default@2x~iphone.png",
			"screen-iphone-portrait-568h-2x.png": "Default-568h@2x~iphone.png"
		}
	},
	android: {
		icon:"res/drawable",
		splash:"res/drawable",
		nameMap: {
			"icon-36-ldpi.png": "icon.png",
			"icon-48-mdpi.png": "icon.png",
			"icon-72-hdpi.png": "icon.png",
			"icon-96-xhdpi.png": "icon.png",
			"screen-ldpi-portrait.png": "ic_launcher.png",
			"screen-mdpi-portrait.png": "ic_launcher.png",
			"screen-hdpi-portrait.png": "ic_launcher.png",
			"screen-xhdpi-portrait.png": "ic_launcher.png"
		}
	},
	blackberry10: {},
	wp7: {},
	wp8: {}
};

function copyAsset(platform, from, to, iconRoot, splashRoot) {
    var srcPath = 'res/icons/' + platform +'/' + from;
    var dstPath = 'platforms/' +platform;

    fs.exists(dstPath, function(exists) {
      if (!exists) // skip platform not exists
          return;

      var root = from.indexOf('icon-') === 0 ? iconRoot : splashRoot;
      
      if( platform == 'android' ) {
        var m = from.match(/\-(x*[lmh]dpi)\.\w{3}$/i);
        
        if(from.indexOf('icon-96-') === 0) {
           // default
           var dstDefault = dstPath +'/' +root+ '/'+ to;
           fs.exists(srcPath, function (exists) {
              if (!exists) // skip file not exists
                return;

              if( fs.existsSync(dstPath) )
                fs.unlinkSync(dstDefault);
              
              fs.createReadStream(srcPath).pipe(fs.createWriteStream(dstDefault));
           });
        }
        dstPath += '/' + root + (m ? '-' +m[1] : '') +'/'+ to;

      } else {
        dstPath += '/' + root +'/'+ to;
      }
      fs.exists(srcPath, function (exists) {
        if (!exists) // skip file not exists
          return;

        if( fs.existsSync(dstPath) )
          fs.unlinkSync(dstPath);

        fs.createReadStream(srcPath).pipe(fs.createWriteStream(dstPath));
      });
    });
}

//--------------

var cmdline = (process.env.CORDOVA_CMDLINE);

// parse platform argv
var tag = ' prepare ', i = cmdline.indexOf(tag);
var isAll = true, selected = [];
if( i > -1) {
  var parr = cmdline.substr(i +tag.length).toLowerCase().split(/\s+/);
  parr.forEach(function(v){
    if(platforms[v]) {
      selected.push(v);
    }
  });
  if(selected.length > 0)
    isAll = false;
}

//console.log(isAll, selected) && err();

for(var platform in platformDir) {
  if( !isAll && selected.indexOf(platform) < 0 )
    continue;

  var d = platformDir[platform];
  if(!d.icon && !d.splash)
    continue;

  for(var from in d.nameMap) {
    var to = d.nameMap[from];
    copyAsset(platform, from, to, d.icon, d.splash);
  }
}

//mindon;
//http://mindon.github.io
