<?php

include_once "Certificate.php";

$obj = json_decode($_POST["q"], false);

$cer = new Certificate();
$cer->setNick($obj->saveName);
$cer->findNewCertificate();

$myObj = new stdClass();
$myObj->nick = $obj->saveName;

echo json_encode($myObj);

?>