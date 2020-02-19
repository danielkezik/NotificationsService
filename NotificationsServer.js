var NotificationsServerConfig = {
    wsServer: "ws://localhost:8765/"
}

class NotificationsServer {
    constructor(website, token) {
        this.website = website;
        this.token = token;
    }
    
    callback = (response) => {
        console.log(response);
    }
    
    sendNotificationByUid(uid, notification) {
        var params = 'website=' + this.website +
                    '&token=' + this.token +
                    '&uid=' + uid +
                    '&notification=' + encodeURI(notification);
        this.sendNotification(params);
    }
    
    sendNotificationByClass(uclass, notification) {
        var params = 'website=' + this.website +
                    '&token=' + this.token +
                    '&uclass=' + uclass +
                    '&notification=' + encodeURI(notification);
        this.sendNotification(params);
    }
    
    sendNotification(params) {
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                self.callback(this.responseText);
            }
        };
        xhttp.open("POST", NotificationsServerConfig.wsServer, true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
}