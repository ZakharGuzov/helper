<?php

include_once "Connection.php";

class Certificate {
    
    private $sizeFile;
    private $sizeDB;
    private $link;
    private $nick;
    private $prefix = "../tmp/";

    function __construct() {
        $this->link = Connection::doConnection();
    }

    function findSizeFile() {
        $lines = file($this->prefix.$this->getNick());
        foreach ($lines as $line) {
            if (strpos($line, '<td class=nick>') > 0) {
                $nCnt = strpos($line, 'Count=');
                $nCnt_1 = strpos($line, '&', $nCnt);
                $size = substr($line, $nCnt + 6, $nCnt_1 - $nCnt - 6);
                $this->setSizeFile($size);
            }
        }
    }
    
    function findSizeDB() {
        $result = $this->link->query(
            "SELECT * FROM `certiftmp` WHERE `nike` = '{$this->getNick()}'");
        $this->setSizeDB($result->fetch_assoc()["cnt"]);
    }

    function findNewCertificate() {
        $lines = file($this->prefix.$this->getNick());
        foreach ($lines as $line) {
            $line = mb_convert_encoding($line, 'UTF-8', 'Windows-1251');
            if (strpos($line, '</td><td>') > 0) {
                $res = $line;
                $N = 0;
                $i = 0;
                while (strpos($res, '</td><td>', $N) > 0) {
                    $nCnt = strpos($res, '</td><td>', $N);
                    $nCnt_1 = strpos($res, '</td><', $nCnt + 1);
                    $res1 = substr($res, $nCnt + 9, $nCnt_1 - $nCnt - 9);
                    $N = ($nCnt + 9) + ($nCnt_1 - $nCnt - 9) - 1;
                    $buf[$i++] = $res1;
                }
                $str = 'http://10.200.121.24/cc/getcertificate.php?SN='.$buf[4];
                $buf[$i++] = file_put_contents("temp", file_get_contents($str));
                $query = "INSERT INTO `certificate`(`nike`, `fio`, `company`, 
                    `department`, `serial`, `identification`, `startD`, 
                    `startT`, `endD`, `endT`, `sign`) VALUES ('".$buf[0]."', 
                    '".$buf[1]."', '".$buf[2]."', '".$buf[3]."', '".$buf[4]."', 
                    '".$buf[5]."', '".$this->dateYMD($buf[6])."', 
                    '".$this->dateHMS($buf[6])."', '".$this->dateYMD($buf[7])."', 
                    '".$this->dateHMS($buf[7])."', ".$buf[8].")";
                $this->link->query($query);
            }
        }
        $this->findSizeFile();
        $query = "UPDATE `certiftmp` SET `cnt`="
            .$this->getSizeFile()." WHERE nike = '".$this->getNick()."'";
        $this->link->query($query);
    }
    
    function dateYMD($str) {
        $d = 0;
        $d = substr($str, 0, 10);
        return $d;
    }

    function dateHMS($str) {
        $d = 0;
        $d = substr($str, 11);
        return $d;
    }

    function getSizeFile() {
        return $this->sizeFile;
    }
    
    function setSizeFile($size) {
        $this->sizeFile = $size;
    }
    
    function getSizeDB() {
        return $this->sizeDB;
    }
    
    function setSizeDB($size) {
        $this->sizeDB = $size;
    }

    function getNick() {
        return $this->nick;
    }

    function setNick($nick) {
        $this->nick = $nick;
    }

}

?>