<?php
class NotificationsServer {
    private $url = 'http://localhost:8101/';
    private $website = null;
    private $token = null;
    
    function __construct($website, $token) {
        $this->website = $website;
        $this->token = $token;
    }
    
    public function setWsUrl($url) {
        $this->url = $url;
    }
    
    public function sendNotificationByUid($uid, $notification) {
        $data = array('website' => $this->website, 'token' => $this->token, 'uid' => strval($uid), 'notification' => $notification);
        return $this->sendNotification($data);
    }
    
    public function sendNotificationByClass($uclass, $notification) {
        $data = array('website' => $this->website, 'token' => $this->token, 'uclass' => strval($uclass), 'notification' => $notification);
        return $this->sendNotification($data);
    }
    
    private function sendNotification($data) {
        $options = array(
            'http' => array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data)
            )
        );
        $context  = stream_context_create($options);
        $result = file_get_contents($this->url, true, $context);
        if ($result === FALSE) { /* Handle error */ }
        
        return $result;
    }
}