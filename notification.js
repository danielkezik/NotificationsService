var NotificationClientConfig = {
    wsServer: "ws://localhost:8765/"
}

class NotificationClient {
    constructor(website, uid = null) {
        this.websocket = new WebSocket(NotificationClientConfig.wsServer);
        this.website = website;
        if (uid != null) {
            this.setUid(uid);
        }
        this.websocket.onmessage = (msg) => this.notificationReceived(msg);
    }

    set uid(id){
        this.setUid(id);
    }

    get uid(){
        return this.userid;
    }

    setUid(uid) {
        var tmpSetUid = () => {
            this.userid = uid.toString();
            this.websocket.send(
                JSON.stringify(
                    { 
                        action: 'register_uid',
                        website: this.website,
                        uid: this.userid
                    }
                )
            );
        };
        if (this.websocket.readyState != WebSocket.OPEN) {
            this.websocket.onopen = () => tmpSetUid();
        } else {
            tmpSetUid();
        }
    }

    addClass(uclass) {
        var tmpAddClass = () => {
            if (! ('uclasses' in this)) {
                this.uclasses = [];
            }
            uclass = uclass.toString();
            if (! this.uclasses.includes(uclass)) {
                this.uclasses.push(uclass);
                this.websocket.send(
                    JSON.stringify(
                        {
                            action: 'register_uclass',
                            website: this.website,
                            uclass: uclass
                        }
                    )
                );
            }
        };
        if (this.websocket.readyState != WebSocket.OPEN) {
            this.websocket.onopen = () => tmpAddClass();
        } else {
            tmpAddClass();
        }
    }

    showNotification(msg, status = null) {
        console.log(msg);
    }
    
    notificationReceived(msg) {
        var notification = msg.data;//JSON.parse(msg.data);
        this.showNotification(notification);
    }

}