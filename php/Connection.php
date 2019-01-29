<?php

class Connection {

    const HOST = "";
    const USER_NAME = 'admin';
    const PASSWORD = 'ds[jldbytn';
    const DB_NAME = 'asb121';

    public static function doConnection() {
        $link = new mysqli(self::HOST, self::USER_NAME, self::PASSWORD, 
            self::DB_NAME); 
        $link->set_charset("utf8");
        return $link;
    }
}
?>