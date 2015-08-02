/* /usr/local/bin/nagios-audio-alert.js */
var dgram = require('dgram')
    , server = dgram.createSocket('udp4')
    , exec=require('execSync').exec
    , server_port=20123;

function ts_log(_msg) {
    console.log('[%s] %s', new Date().toString(), _msg);
}

server.on("message", function (msg, rinfo) {
        var pmsg=msg.toString().replace(/^\s+|\s+$/, '')
        if(pmsg==='X') { return; }
        if(pmsg!=='') {
            ts_log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
            var arr=pmsg.split(/::/);
            if(arr.length>2) {
                var msg_target=arr[0], msg_state=arr[1], msg_body=arr[2];
                if(msg_state==='PROBLEM') {
                    exec('afplay /System/Library/Sounds/Glass.aiff')
                    exec('afplay /System/Library/Sounds/Glass.aiff')
                    if(msg_target==='host') {
                        exec('say "Attention Please, host '+msg_body+' is having a problem."');
                    } else if (msg_target==='service') {
                        exec('say "May I have your attention please, service problem: '+msg_body+ '"');
                    }
                } else {
                    ts_log('Received a message regarding nagios alert'+msg_body);
                }
            } else {
                ts_log('Not a valid message ('+pmsg+')');
            }
        } else {
            ts_log('Blank or space only message received.');
        }
});

server.on("listening", function () {
  var address = server.address();
  ts_log("server listening " + address.address + ":" + address.port);
});
server.bind(server_port);
