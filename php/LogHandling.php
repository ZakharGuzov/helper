<?php

include_once 'Connection.php';

class LogHandling {

    private $sizeDB;
    private $sizeWeb;
    private $link;
    private $date;
    private $time;
    private $prefix = "../tmp/";
    private $fileName;

    public function __construct() {
        $this->link = Connection::doConnection();
    }

    public function setSizeDB($size) {
        $this->sizeDB = $size;
    }

    public function getSizeDB() {
        $this->findSizeDB();
        return $this->sizeDB;
    }

    private function findSizeDB() {
        $result = $this->link->query(
            'SELECT * FROM temp WHERE text1 = "logs_new/ra_handling.log"');
        while ($row = $result->fetch_assoc()) {
            $this->setSizeDB($row['text2']);
        }
    }

    public function setSizeWeb($size) {
        $this->sizeWeb = $size;
    }

    public function getSizeWeb() {
        $this->findSizeWeb();
        return $this->sizeWeb;
    }

    public function setFileName($file) {
        $this->fileName = $file;
    }

    public function getFileName() {
        return $this->fileName;
    }

    private function findSizeWeb() {
        $lines = file($this->prefix.$this->getFileName());
        foreach ($lines as $line) {
            if (strpos($line, 'logs_new/ra_handling.log') === 0) {
                $nCnt = strpos($line, ': ');
                $line = substr($line, $nCnt + 2);
                $nCnt = strpos($line, ' ');
                $this->setSizeWeb(substr($line, 0, $nCnt));
            }
        }
    }

    public function setDate($date) {
        $this->date = $date;
    }

    public function getDate() {
        $this->findDateAndTime();
        return $this->date;
    }

    public function setTime($time) {
        $this->time = $time;
    }

    public function getTime() {
        return $this->time;
    }

    private function findDateAndTime() {
        $result = $this->link->query(
            'SELECT * FROM certificatelog_v4 ORDER BY `date` DESC, `time` DESC LIMIT 1');
        $row = $result->fetch_assoc();
        $this->setDate($row['date']);
        $this->setTime($row['time']);
    }

    public function readLogHandling() {
        $lines = file($this->prefix.$this->getFileName());
        $date = new DateTime($this->getDate());
        $dateYmd = new DateTime($this->getDate());
        $date = $date->format('d.m.Y');
        $dateYmd = $dateYmd->format('Y.m.d');
        $time = $this->getTime();
        $display = false;
        $count = 0;
        $arr = array();
        $this->findDateAndTimeInWeb($lines[0], $dateWeb, $timeWeb);
        $dateWeb = new DateTime($dateWeb);
        $dateWeb = $dateWeb->format('Y.m.d');
        if ($dateYmd < $dateWeb) {
            $display = true;
        }
        if ($dateYmd == $dateWeb and $time < $timeWeb) {
            $display = true;
        }
        foreach ($lines as $line) {
            $line = mb_convert_encoding($line, 'UTF-8', 'Windows-1251');
            if (strpos($line, $date) === 0 && strpos($line, $time) > 0) {
                $display = true;
            }
            if ($display) {
                $this->deepRead($line, $arr, $count);
            }
        }
        return $arr;
    }

    public function deepRead($line, &$arr, &$count) {
        if (strpos($line, '>>>') > 0 or strpos($line, '---') > 0 
            or strpos($line, '!!!') > 0) {
            $this->findDateAndTimeInWeb($line, $date, $time);
            $count++;
            $arr[$count][0] = $date;
            $arr[$count][1] = $time;
            $arr[$count][2] = substr($line, 24);
        } else {
            $arr[$count][2] = $arr[$count][2].substr($line, 24);
        }
    }

    function findDateAndTimeInWeb($line, &$date, &$time) {
        list($day, $month, $year, $hh,$mm,$ss) = 
            sscanf($line, "%d.%d.%d %d:%d:%d");
        $date = $year.'-'.$this->addZero($month).'-'.$this->addZero($day);
        $time = $this->addZero($hh).':'.$this->addZero($mm).':'
            .$this->addZero($ss);
    }

    function addZero($str) {
        strlen($str) == 1 ? $str = '0'.$str : 0;
        return $str;
    }
}

?>
