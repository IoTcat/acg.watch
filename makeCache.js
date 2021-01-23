const fs = require('fs');
const md5 = require('md5');

const _dir = '/o/video/';

var video = {};

fs.readdir(_dir, (err, series)=>{
    series.forEach((item)=>{
        var conf = fs.readFileSync(
            _dir + item + '/config.json', 
            {encoding:"utf-8"}
        );
        conf = JSON.parse(conf);
        if(!video.hasOwnProperty(conf.class)){
            video[conf.class] = {};
        }
        video[conf.class][item] = {};
        video[conf.class][item]['series'] = conf.series;
        video[conf.class][item]['video'] = [];
        // console.log(conf);
        /* get Series Info */
        var no = fs.readdirSync(_dir + item); 
        no.splice(no.findIndex(fName => fName == 'config.json'), 1);
        no.forEach(fName => {
            var videoInfo = getVideoInfo(fName, conf, item);
            video[conf.class][item]['video'].push(videoInfo);
            if(conf.hasOwnProperty('video') && conf.video.hasOwnProperty(videoInfo.no)){
                Object.assign(video[conf.class][item]['video'][video[conf.class][item]['video'].length - 1], conf.video[videoInfo.no]);
            }
        });
        /* video sort */
        video[conf.class][item]['video'].sort((a, b)=>a.no-b.no);
 
    });
    console.log(video.acg.YuruYuri.video);
    fs.writeFile('/mnt/cache/video/video.json', JSON.stringify(video), 'utf8', err=>console.log(err));
});


var getVideoInfo = (fName, conf, item) => {
   var o = {};
   
   var arr = fName.split('.');
   arr = arr[0].split('_');

   o['season'] = getVideoSeason(arr);
   o['no'] = getVideoNo(arr);
   o['name'] = getVideoName(arr, conf);
   o['danmakuID'] = md5(item+o.no).substring(0, 8); 
   o['url'] = 'https://onedrive.yimian.xyz/video/' + item + '/' + fName;
   o['extra'] = ['https://proxy.yimian.xyz/get/?url='+(new Buffer(o['url']).toString('base64'))];

   return o;
}

var getVideoSeason = arr => parseInt(arr[0].replace(/[^0-9]/ig,""));

var getVideoNo = arr => parseInt(arr[0].replace(/[^0-9]/ig,"")) * 1000 + parseInt(arr[1].replace(/[^0-9]/ig,""));

var getVideoName = (arr, conf) => {

    var season = getVideoSeason(arr);

    if(arr.length >= 3){
        var alias = arr[2];
    }else{
        var alias = '第' + getVideoNo(arr) % 1000 + '集';
    }

    return conf.series + '--第' + season + '季-' + alias;
}
