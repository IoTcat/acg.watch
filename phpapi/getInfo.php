<?php
include '../functions.php';

$url = $_REQUEST['url'];
$url = 'https://onedrive.yimian.xyz/video/YuruYuri/s1_01.mp4';
if(!isset($url)) die();




echo json_encode(getVideoByUrl($url));
