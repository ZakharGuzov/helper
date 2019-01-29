<?php

class DownloadNew {
  
    private $prefix = "../tmp/";

    public function __construct($fileName, $saveName) {
        file_put_contents($this->prefix.$saveName, fopen($fileName, "r"));
    }
}

?>