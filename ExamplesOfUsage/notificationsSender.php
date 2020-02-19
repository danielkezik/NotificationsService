<?php

require_once('../NotificationsServer.php');

$notificationsServer = new NotificationsServer('site.com', 'qwerty1234');

$res = $notificationsServer->sendNotificationByClass('player', 'Hello, player');

var_dump($res);