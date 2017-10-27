import assert from "assert";
import { Manager } from "../lib";

var defaultUrl = "wss://flashchain.flashchain.org/ws";
defaultUrl = "wss://dexnode.net/ws";
var faultyNodeList = [
    {url: "wss://bitsqsdqsdhares.flashchain.org/ws", location: "Nuremberg, Germany"},
    {url: "wss://bitazdazdshares.flashchain.org/ws", location: "Nuremberg, Germany"},
    {url: "wss://bitshaazdzares.flashchain.org/ws", location: "Nuremberg, Germany"},
    {url: "wss://bit.btzadazdsabc.org/ws", location: "Hong Kong"},
    {url: "ws://127.0.0.1:8091", location: "Hangzhou, China"},
    {url: "wss://flashchain.flashchain.org/ws", location: "Nuremberg, Germany"},
    {url: "wss://secure.freedomledger.com/ws", location: "Toronto, Canada"},
    {url: "wss://node.testnet.flashchain.eu", location: "Public Testnet Server (Frankfurt, Germany)"}
];

var noWorkingNodes = [
    {url: "wss://bitsqsdqsdhares.flashchain.org/ws", location: "Nuremberg, Germany"},
    {url: "wss://bitazdazdshares.flashchain.org/ws", location: "Nuremberg, Germany"},
    {url: "wss://bitshaazdzares.flashchain.org/ws", location: "Nuremberg, Germany"},
    {url: "wss://bit.btzadazdsabc.org/ws", location: "Hong Kong"},
    {url: "ws://127.23230.0.1:8091", location: "Hangzhou, China"},
    {url: "wss://bitshasdares.dacplay.org:8089/ws", location:  "Hangzhou, China"},
    {url: "wss://secuasdre.freedomledger.com/ws", location: "Toronto, Canada"},
    {url: "wss://testnet.flashchain.eu/wqsdsqs", location: "Public Testnet Server (Frankfurt, Germany)"}
];

var goodNodeList = [
    {url: "wss://flashchain.flashchain.org/ws", location: "Nuremberg, Germany"},
    {url: "wss://bit.flcabc.org/ws", location: "Hong Kong"},
    {url: "wss://flc.transwiser.com/ws", location: "Hangzhou, China"},
    {url: "wss://flashchain.dacplay.org:8089/ws", location:  "Hangzhou, China"},
    {url: "wss://openledger.hk/ws", location: "Hong Kong"},
    {url: "wss://secure.freedomledger.com/ws", location: "Toronto, Canada"},
    {url: "wss://node.testnet.flashchain.eu", location: "Public Testnet Server (Frankfurt, Germany)"}
];

/* This node currently throws an API error for the crypto API */
var failedInitNodes = [
    {url: "wss://flashchain.crypto.fans/ws", location: "Munich"}
];

describe("Connection Manager", function() {

    // beforeEach(function() {
    //     return Manager.close();
    // });

    it("Instantiates", function() {
        let man = new Manager({url: defaultUrl, urls: faultyNodeList.map(a => a.url)});
        assert.equal(man.url, defaultUrl);
    });

    it("Tries to connect default url", function() {
        this.timeout(3000);
        let man = new Manager({url: defaultUrl, urls: faultyNodeList.map(a => a.url)});
        return new Promise( function(resolve, reject) {
            man.connect().then(resolve)
            .catch(reject)
        });
    });

    it("Tries to connect to fallback and updates current url on connection success", function() {
        this.timeout(15000);
        let man = new Manager({url: "ws://127.0.0.1:8092", urls: faultyNodeList.map(a => a.url)});
        return new Promise( function(resolve, reject) {
            man.connectWithFallback().then(function() {
                assert.equal(man.url, "wss://flashchain.flashchain.org/ws");
                resolve();
            })
            .catch(reject)
        });
    });

    it("Rejects if no connections are successful ", function() {
        this.timeout(15000);
        let man = new Manager({url: "ws://127.0.0.1:8092", urls: noWorkingNodes.map(a => a.url)});
        return new Promise( function(resolve, reject) {
            man.connectWithFallback().then(reject)
            .catch(resolve);
        });
    });

    it("Can check connection times for all connections", function() {
        this.timeout(20000);
        let man = new Manager({url: "ws://127.0.0.1:8090", urls: goodNodeList.map(a => a.url).concat([
            "wss://bit.flcabc.org/ws",
            "wss://secure.freedomledger.com/ws"
        ])});
        return new Promise( function(resolve, reject) {
            man.checkConnections().then(resolve).catch(reject);
        });
    });

    // it("Throws an error if an API fails to initialize", function() {
    //     this.timeout(5000);
    //     let man = new Manager({url: failedInitNodes[0].url, urls: []});
    //     return new Promise(function(resolve, reject) {
    //         man.connect(undefined, undefined, true).then(function(res) {
    //             reject();
    //         }).catch(function(err) {
    //             resolve();
    //         });
    //     });
    // });

});
