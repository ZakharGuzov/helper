<?php

include_once 'DownloadNew.php';

$obj = json_decode($_POST["q"], false);
$download = new DownloadNew($obj->fileName, $obj->saveName);
$myObj = new stdClass();
$myObj->saveName = $obj->saveName;

echo json_encode($myObj);

?>