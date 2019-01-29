<?php

include_once "Certificate.php";

$obj = json_decode($_POST["q"], false);

$cer = new Certificate();
$cer->setNick($obj->saveName);
$cer->findSizeDB();
$cer->findSizeFile();

$myObj = new stdClass();
$myObj->update = false;
$myObj->nick = $cer->getNick();
$myObj->sizeFile = $cer->getSizeFile();
$myObj->sizeDB = $cer->getSizeDB();
if ($cer->getSizeDB() < $cer->getSizeFile()) {
    $myObj->update = true;
}

echo json_encode($myObj);

?>