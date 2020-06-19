<?php
include '../functions.php';

$url = $_REQUEST['url'];

if(!isset($url)) die();

$conn = db__connect();

if(!db__rowNum($conn, "video", "url", $url)) {
    echo json_encode(array(
    quality => array(
        name => "首选",
        url => $url
    ),
    danmaku => substr(md5($url), 0, 8)
    ));
    die();
}


$res = db__getData($conn, "video", "url", $url);

$arr = Array();

array_push($arr, array(
    name => "首选",
    url => $url

));

for($i = 1; $i <= 3; $i ++){
    if($res[0]["url".$i] !== ""){
        array_push($arr, array(
            name => "备选".$i,
            url => $res[0]["url".$i]
        ));
    }
}




echo json_encode(Array(
    quality => $arr,
    danmaku => substr(md5($res[0]['vid']),0, 8)
));
