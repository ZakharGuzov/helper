<?php

$obj = json_decode($_POST["q"], false);

$myObj = new stdClass();
$myObj->request = file_get_contents("../".$obj->file);

echo json_encode($myObj);

?>