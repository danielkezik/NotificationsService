var NotificationClientConfig = {
    wsServer: "ws://localhost:8765/"
}

class NotificationClient {
    constructor(website, uid = null) {
        this.websocket = new WebSocket(NotificationClientConfig.wsServer);
        this.websocket.onopen = () => this.registerAllUidsAndUclasses();
        this.uclasses = [];
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

    websocketSend = {
        registerUid : (uid) => {
            this.websocketSend.wasOpen = true;
            this.websocket.send(
                JSON.stringify(
                    { 
                        action: 'register_uid',
                        website: this.website,
                        uid: uid
                    }
                )
            );
        },
        registerUclass : (uclass) => {
            this.websocketSend.wasOpen = true;
            this.websocket.send(
                JSON.stringify(
                    {
                        action: 'register_uclass',
                        website: this.website,
                        uclass: uclass
                    }
                )
            );
        },
        wasOpen : false
    }

    setUid(uid) {
        this.userid = uid.toString();
        if (this.websocket.readyState == WebSocket.OPEN) {
            this.websocketSend.registerUid(this.userid);
        }
    }

    addClass(uclass) {
        uclass = uclass.toString();
        if (! this.uclasses.includes(uclass)) {
            this.uclasses.push(uclass);
            if (this.websocket.readyState == WebSocket.OPEN) {
                this.websocketSend.registerUclass(uclass);
            }
        }
    }

    registerAllUidsAndUclasses() {
        if (this.websocketSend.wasOpen) return;
        this.websocketSend.registerUid(this.userid);
        this.uclasses.forEach(element => {
            this.websocketSend.registerUclass(element);
        });
    }

    showNotification(msg, status = null) {
        console.log(msg);
    }
    
    notificationReceived(msg) {
        var notification = msg.data;//JSON.parse(msg.data);
        this.showNotification(notification);
    }

}