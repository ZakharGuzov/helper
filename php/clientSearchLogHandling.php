<?php

include_once 'Connection.php';

$obj = json_decode($_POST["q"], false);

$link = Connection::doConnection();
$result = $link->query($obj->query);

$myObj = new stdClass();
while ($row = $result->fetch_assoc()) {
    $myObj->date[] = $row['date'];
    $myObj->time[] = $row['time'];
    $myObj->all[] = $row['all'];
}

echo json_encode($myObj);

?>