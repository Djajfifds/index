import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getRandomInt, sleep, createTask } from "./util.js";
import { getDatabase, ref, onValue, onChildAdded, onChildChanged, onChildMoved, set, update, serverTimestamp, onDisconnect, off, get } from "firebase/database";
import { CustomProvider, initializeAppCheck } from "firebase/app-check";
import { getFirestore, collection, getDocs, doc, setDoc, query, limit, where } from "firebase/firestore";
//var TempMail = require('node-temp-mail');
import { addListener } from './index.js';
import { accounts } from './accounts.js';
const timeChars = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandom(min, max) {
    let len = getRandInt(min, max);
    let a = String(btoa((Math.random() + 1).toString(36))).replace("=", "").toLowerCase();
    return a.length > len ? a.substring(a.length - len) : a;
}
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function randomAccount() {
    return accounts[Math.floor(Math.random() * accounts.length)];
}
var ProfileProperty1;
(function(ProfileProperty) {
    ProfileProperty["uid"] = 'a';
    ProfileProperty["username"] = 'b';
    ProfileProperty["nationId"] = 'c';
    ProfileProperty["wishList"] = 'd';
    ProfileProperty["messages"] = 'e';
    ProfileProperty["collectionPercentage"] = 'g';
})(ProfileProperty1 || (ProfileProperty1 = {
}));
const EmptyTradeRequirement = {
    receiveCoins: false,
    giveCoins: 0,
    givePacks: [],
    receivePacks: false,
    giveCards: [],
    receiveCards: false
};
var ActionType1;
(function(ActionType) {
    ActionType["loaded"] = 'b';
    ActionType["putCard"] = 'e';
    ActionType["putPack"] = 'o';
    ActionType["putCoins"] = 'q';
    ActionType["ready"] = 'h';
    ActionType["unready"] = 'i';
    ActionType["confirm"] = 'k';
    ActionType["handshake"] = 'l';
    ActionType["cancel"] = 'j';
    ActionType["wantCoinsMessage"] = 'r';
    ActionType["sendEmoji"] = 'n';
})(ActionType1 || (ActionType1 = {
}));
function isTradeHandshake(action) {
    return action.x === ActionType1.handshake;
}
class MadfutClient {
    async logout() {
        try {
            console.log(this.auth.currentUser?.uid);
            //const bot = JSON.parse((await readFile("botinfo.json")).toString());
            //if (!this.auth.currentUser || this.auth.currentUser.uid == "QlvaC775seYWfu8cTfQc7gzzJyQ2") {
            //    console.log('Trying to sign out of an unknown account')
            //    this.auth.signOut()
            //    return;
            //}
            let email = this.auth.currentUser.email;
            console.log('Logging out of', email);
            let ind = MadfutClient.inUse.indexOf(email);
            this.auth.signOut();
            MadfutClient.inUse.splice(ind, 1);
        } catch (error) {
            // @ts-ignore
            console.log(error.message);
        }
    }
    async login(email) {
        if (MadfutClient.inUse.includes(email)) return null;
        else MadfutClient.inUse.push(email);
        if (MadfutClient.inUse.length > 10) {
            MadfutClient.inUse = [];
        }
        const { user  } = await signInWithEmailAndPassword(this.auth, email, "joinVitafut123");
        this.username = `${generateString(5)}`;
        this.nationId = "nation_badge_21";
        this.uid = user.uid;
        this.authdb = getDatabase(this.app, "https://mf23-room-ids.europe-west1.firebasedatabase.app");
        this.invitesDatabase = getDatabase(this.app);
        this.tradingRoomDatabase = getDatabase(this.app, "https://mf23-trading-invites-rooms-1.europe-west1.firebasedatabase.app/");
        this.queue = getDatabase(this.app, "https://mf23-trading-queue-1.europe-west1.firebasedatabase.app/");
        this.loggedIn = true;
        //   let dbRef3 = ref(this.tradingRoomDatabase, "/" + this.uid +"/"+ this.uid  )
        let dbRef = ref(this.invitesDatabase, this.uid);
        let dbRef2 = ref(this.authdb, this.uid);
        try {
            if ((await get(dbRef2)).val() != null) set(dbRef2, null);
        } catch (error) {
        }
        let dbRef4 = ref(this.queue, this.uid);
        //let uid = "WCFXd2jAPWTV89lCBvAY9b0np3P2"
        // console.log(user.displayName)
        onValue(dbRef, (snapshot)=>{
            const data = snapshot.val();
            const key = snapshot.key;
        // console.log("onValue ", key, " ONVAL:", data);
        });
        onChildAdded(dbRef, (snapshot)=>{
            const data = snapshot.val();
            const key = snapshot.key;
            //  let uid = "hDOE4mBFZ8goZsPce7sOg0Dd7023"
            const data2 = snapshot.ref.toJSON();
        // console.log("onChildAdded ", key, " CAdata:", data2);
        });
        onChildChanged(dbRef, (snapshot)=>{
            const data = snapshot.val();
            const key = snapshot.key;
            const data2 = snapshot.ref.toJSON();
        // console.log("onChildChanged ", key, " CHANGED:", data2);
        });
        onChildMoved(dbRef, (snapshot)=>{
            const data = snapshot.val();
            const key = snapshot.key;
        // console.log("onChildMoved", key, " MOVED:", data);
        });
        onValue(dbRef2, (snapshot)=>{
            const data = snapshot.val();
            const key = snapshot.key;
        // console.log("onValue ", key, " room:", data);
        });
        onChildAdded(dbRef2, (snapshot)=>{
            const data = snapshot.val();
            const key = snapshot.key;
            //  let uid = "hDOE4mBFZ8goZsPce7sOg0Dd7023"
            const data2 = snapshot.ref.toJSON();
        // console.log("onChildAdded ", key, " room:", data2);
        });
        onChildChanged(dbRef2, (snapshot)=>{
            const data = snapshot.val();
            const key = snapshot.key;
            const data2 = snapshot.ref.toJSON();
        // console.log("onChildChanged ", key, " room:", data2);
        });
        onChildMoved(dbRef2, (snapshot)=>{
            const data = snapshot.val();
            const key = snapshot.key;
        });
    }
    async newLogin(email1) {
        if (MadfutClient.inUse.includes(email1)) return null;
        else MadfutClient.inUse.push(email1);
        if (MadfutClient.inUse.length > 100) {
            MadfutClient.inUse = [];
        }
        const { user  } = await signInWithEmailAndPassword(this.auth, email1, "joinVitafut123");
        this.username = `${generateString(5)}`;
        this.nationId = "nation_badge_103";
        this.uid = user.uid;
        this.authdb = getDatabase(this.app, "https://mf23-room-ids.europe-west1.firebasedatabase.app");
        this.invitesDatabase = getDatabase(this.app);
        this.tradingRoomDatabase = getDatabase(this.app, "https://mf23-trading-invites-rooms-1.europe-west1.firebasedatabase.app/");
        this.queue = getDatabase(this.app, "https://mf23-trading-queue-1.europe-west1.firebasedatabase.app/");
        this.loggedIn = true;
    }
    // @ts-ignore
    async addInviteListenerNew(callback, invitee, codename) {
        if (this.uid != null) {
            console.log(this.uid);
            try {
                const invitesRef = ref(this.invitesDatabase, invitee || this.auth.currentUser?.uid);
                console.log("Add invite listener to ref:", invitesRef.toString());
                onChildAdded(invitesRef, (snapshot)=>{
                    console.log("Child added:", snapshot.key);
                    callback(snapshot.key);
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    console.log("Child changed:", snapshot.key, snapshot.val());
                    if (typeof snapshot.val() === 'number') {
                        console.log(snapshot.val());
                        callback(snapshot.key);
                    }
                });
                setTimeout(async ()=>{
                    off(invitesRef);
                    await addListener(null, codename);
                }, 20000);
            } catch (err) {
                console.log("Error in addInviteListenerNew:", err);
                await addListener(null, codename);
            }
        }
    }
    async addInviteListener(callback1, invitee1) {
        try {
            if (this.uid != null) {
                console.log(this.uid);
                const username2 = await this.getUsernameByUid(user.uid);
                console.log(username2);
                console.log("USER STARTED INVITE BOT invite2");
                const invitesRef = ref(this.invitesDatabase, user.uid);
                onChildAdded(invitesRef, (snapshot)=>{
                    if (snapshot != null) {
                        callback1(snapshot.key);
                    }
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    if (typeof snapshot.val() === 'number') {
                        callback1(snapshot.key);
                    }
                });
            }
        } catch (err) {
            console.log("account failed");
        }
    }
    async setBotCodeUsername(username) {
        let db = getFirestore(this.app);
        setDoc(doc(db, "usernames", username), {
            uid: this.uid,
            badgeName: this.nationId
        });
    }
    invitewu(username1) {
        return new Promise(async (resolve)=>{
            let inviteData = {
                "b": "nation_badge_" + getRandomInt(269),
                "t": serverTimestamp(),
                "u": `zeefut`
            };
            try {
                let path = username1 + "/" + this.uid;
                let inviteRef = ref(this.invitesDatabase, path);
                try {
                    await set(inviteRef, inviteData);
                } catch (error) {
                    await set(inviteRef, inviteData);
                return console.log("This bot account is banned", error.message);
                }
                let timeoutObj = setTimeout(()=>{
                    off(inviteRef);
                    set(inviteRef, null).then((e)=>{
                    }).catch((err)=>console.log("This bot account is banned")
                    );
                }, 60000);
                onDisconnect(inviteRef).remove();
                let tradeData = ref(this.authdb, this.uid);
                onValue(tradeData, async (snapshot)=>{
                    if (typeof snapshot.val() !== 'string') return;
                    if (snapshot.val().toString().split(",")[0] == null) return;
                    let tradeRef = ref(this.tradingRoomDatabase, snapshot.val().toString().split(",")[0]);
                    if (await (await get(tradeRef)).val() == null) return;
                    if (await await get(tradeRef) == null) return;
                    if (await (await get(tradeRef)).val().u1 == null) return;
                    if (await (await get(tradeRef)).val().u1 == username1) {
                        try {
                            await set(inviteRef, null);
                            await set(tradeData, null);
                        } catch  {
                            console.log("This bot account is banned");
                        }
                        clearTimeout(timeoutObj);
                        if (snapshot.val().toString().split(",")[1] == "true") {
                            resolve({
                                tradeRef,
                                amHosting: true
                            });
                        } else if (snapshot.val().toString().split(",")[1] == "false") {
                            resolve({
                                tradeRef,
                                amHosting: false
                            });
                        }
                    }
                });
            } catch (error) {
                console.log(error);
            }
        });
    }
    async returnUserInfo(invitee2) {
        const myFirestore = getFirestore(this.app);
        const myCollection = query(collection(myFirestore, "users"), limit(1), where("username", "==", invitee2));
        const users = await getDocs(myCollection);
        let userId = '';
        users.forEach((user)=>{
            userId = user.id;
        });
        return userId;
    }
    async getUsernameByUid(invitee3) {
        const myFirestore = getFirestore(this.app);
        const myCollection = query(collection(myFirestore, "usernames"), limit(1), where("uid", "==", invitee3));
        const users = await getDocs(myCollection);
        let username = '';
        users.forEach((user)=>{
            username = user.id;
        });
        return username;
    }
    inviteWithTimeout(invitee4, timeout, inviter) {
        let fix = {
            b: this.nationId,
            t: serverTimestamp(),
            u: inviter
        };
        // let uid = ["4LBTVCJgkEN5xsBKN2uwZQweN0N2"]
        // let uid = ["WCFXd2jAPWTV89lCBvAY9b0np3P2"]
        // let uid = "WCFXd2jAPWTV89lCBvAY9b0np3P2"
        let done = false;
        return new Promise(async (resolve, reject)=>{
            const invitePath = invitee4 + "/" + this.uid;
            const inviteRef = ref(this.invitesDatabase, invitePath);
            const dbRef2 = ref(this.authdb, this.uid);
            onDisconnect(inviteRef).remove();
            //await set(inviteRef, fix)
            // await set(inviteRef, serverTimestamp()); // or serverTimestamp()
            onValue(dbRef2, (snapshot)=>{
                // console.log(snapshot.key, snapshot.val())s
                // console.log("snap",snapshot.val())
                if (typeof snapshot.val() !== 'string') return;
                const tradeRef = ref(this.tradingRoomDatabase, snapshot.val().toString().split(",")[0]);
                const check = snapshot.val().toString().split(",")[1];
                done = true;
                set(inviteRef, null);
                set(dbRef2, null);
                off(dbRef2);
                resolve({
                    tradeRef,
                    amHosting: check == 'true'
                });
            });
            setTimeout(()=>{
                if (done) return;
                set(inviteRef, null);
                set(dbRef2, null);
                off(dbRef2);
                reject('User didn\'t accept in time');
            }, 1000 * 30);
            // @ts-ignore
            try {
                await set(inviteRef, fix);
            } catch (error) {
                console.log(error.message), await set(inviteRef, fix);
            }
        });
    }
    leaveTrade({ tradeRef: tradeRef1 , amHosting  }) {
        return set(tradeRef1, null);
    }
    inviteUser(invitee5, inviter1) {
        let fix = {
            b: this.nationId,
            t: serverTimestamp(),
            /*u: `${generateString(10)}`*/ u: inviter1
        };
        let done = false;
        return new Promise(async (resolve, reject)=>{
            //const invitePath = invitee + "/" + this.uid;
            const invitePath = invitee5 + "/" + this.uid;
            const inviteRef = ref(this.invitesDatabase, invitePath);
            // onDisconnect(inviteRef).remove();
            let dbRef2 = ref(this.authdb, this.uid);
            onValue(dbRef2, (snapshot)=>{
                // console.log(snapshot.key, snapshot.val())s
                // console.log("snap",snapshot.val())
                if (typeof snapshot.val() !== 'string') return;
                const tradeRef = ref(this.tradingRoomDatabase, snapshot.val().toString().split(",")[0]);
                const check = snapshot.val().toString().split(",")[1];
                done = true;
                set(inviteRef, null);
                set(dbRef2, null);
                off(dbRef2);
                resolve({
                    tradeRef,
                    amHosting: check == 'true'
                });
            });
            setTimeout(()=>{
                if (done) return;
                set(inviteRef, null);
                set(dbRef2, null);
                off(dbRef2);
                reject('User didn\'t accept in time');
            }, 1000 * 60);
            try {
                await set(inviteRef, fix);
            } catch (error) {
            }
        });
    }
    doTrade({ tradeRef , amHosting: amHosting1  }, giver) {
        return new Promise(async (resolve, reject)=>{
            const otherProfile = amHosting1 ? "g" : "h";
            const otherAction = amHosting1 ? "G" : "H";
            const ownProfile = amHosting1 ? "h" : "g";
            const ownAction = amHosting1 ? "H" : "G";
            let loaded = false;
            let tradeReqTask = createTask();
            // console.log(trad)
            const self = this;
            // onDisconnect(tradeRef).remove();
            let dbRef3 = ref(this.tradingRoomDatabase, "/" + this.uid + "/" + this.uid);
            let dbRef = ref(this.invitesDatabase, this.uid);
            let dbRef2 = ref(this.authdb, this.uid);
            let dbRef4 = ref(this.queue, this.uid);
            let lastInteraction = Date.now();
            let ended = false;
            setTimeout(function a() {
                if (ended) return;
                let est = Date.now() - lastInteraction;
                if (est < 1000 * 60) return setTimeout(a, est);
                off(tradeRef);
                reject('Trade timeout');
            }, 1000);
            async function childUpdate(snapshot) {
                let snappy = snapshot.val().toString().split("/")[0];
                // console.log(snappy)
                let snapshotVal = snapshot.val();
                let istrue = snapshot.key;
                //  console.log(istrue)
                if (snapshotVal === null) return;
                if (snapshot.key === otherProfile) {
                    try {
                        tradeReqTask.finish(await giver(snapshotVal));
                        await update(tradeRef, {
                            h1: true,
                            h2: false,
                            [ownProfile]: {
                                a: self.uid,
                                b: self.username,
                                c: 'nation_badge_21',
                                d: [],
                                e: [],
                                f: '',
                                g: '69',
                                h: '',
                                i: '',
                                j: '',
                                k: '',
                                u1: '',
                                u2: self.uid
                            },
                            [ownAction]: {
                                x: ActionType1.loaded
                            }
                        });
                        await sleep(1000);
                    //console.log("Loaded Bot Profile");
                    } catch  {
                        console.log("Failed to Update bot profile");
                    }
                } else if (snapshot.key === otherAction) {
                    lastInteraction = Date.now();
                    const tradeReq = await tradeReqTask.promise;
                    const updates = [];
                    if (snapshotVal.x === ActionType1.loaded) {
                        loaded = true;
                        await sleep(800);
                        try {
                            updates.push({
                                [ownAction]: {
                                    v: "10",
                                    x: ActionType1.sendEmoji
                                }
                            });
                            for (const updateElem of updates){
                                await update(tradeRef, updateElem);
                            }
                        //console.log("Loaded ownAction: Emoji within joining trade.");
                        } catch  {
                            console.log("Failed to load ownAction: Emoji within joining trade.");
                        }
                        try {
                            for(let i = 0; i < tradeReq.giveCards.length; i++){
                                await update(tradeRef, {
                                    [ownAction]: {
                                        v: `${tradeReq.giveCards[i]},${i}`,
                                        x: ActionType1.putCard
                                    }
                                });
                            }
                            for(let i1 = 0; i1 < tradeReq.givePacks.length; i1++){
                                await update(tradeRef, {
                                    [ownAction]: {
                                        a: tradeReq.givePacks[i1].pack,
                                        b: tradeReq.givePacks[i1].amount,
                                        c: i1,
                                        x: ActionType1.putPack
                                    }
                                });
                            }
                            await update(tradeRef, {
                                [ownAction]: {
                                    v: Math.max(tradeReq.giveCoins, 0),
                                    x: ActionType1.putCoins
                                }
                            });
                        //console.log(`Loaded (Cards, Packs, Coins)`);
                        } catch  {
                            console.log("Failed to load (Cards, Packs, Coins)");
                        }
                    } else if (snapshotVal.x === ActionType1.ready) {
                        try {
                            await update(tradeRef, {
                                [ownAction]: {
                                    x: ActionType1.ready
                                }
                            });
                            await sleep(300);
                            await update(tradeRef, {
                                [ownAction]: {
                                    x: ActionType1.confirm
                                }
                            });
                            await update(tradeRef, {
                                [otherAction]: {
                                    x: ActionType1.confirm
                                }
                            });
                        //console.log("Bot: Ready and confirmed")
                        } catch  {
                            console.log("Bot: Failed to (Ready & Confirm)");
                        }
                    } else if (snapshotVal.x === ActionType1.confirm) {
                        try {
                            if (snapshotVal.x === ActionType1.unready) {
                                await update(tradeRef, {
                                    [ownAction]: {
                                        x: ActionType1.confirm
                                    }
                                });
                                await update(tradeRef, {
                                    [otherAction]: {
                                        x: ActionType1.confirm
                                    }
                                });
                            }
                        //console.log("User confirmed, bot confirmed")
                        } catch  {
                            console.log("User confirmed, bot failed to confirm");
                        }
                    } else if (isTradeHandshake(snapshotVal)) {
                        const updates = [];
                        // a: cards I'm giving
                        // b: cards I'm getting
                        // c: packs I'm giving
                        // d: packs I'm getting
                        // e: net coins I'm getting
                        const newAction = {
                            x: ActionType1.handshake
                        };
                        const cardsGivenByOther = snapshotVal.a ?? [];
                        try {
                            if (!tradeReq.receiveCards && cardsGivenByOther.length > 0) {
                                updates.push({
                                    [ownAction]: {
                                        v: "61",
                                        x: ActionType1.sendEmoji
                                    }
                                });
                            }
                            newAction.b = cardsGivenByOther;
                            const packsGivenByOther = snapshotVal.c ?? {
                            };
                            if (!tradeReq.receivePacks && Object.keys(packsGivenByOther).length > 0) {
                                updates.push({
                                    [ownAction]: {
                                        v: "62",
                                        x: ActionType1.sendEmoji
                                    }
                                });
                            }
                            newAction.d = packsGivenByOther;
                            const gottenCards = snapshotVal.b ?? []; // TODO: shortcut with alreadyUpdated
                            for(let i = 0, j = 0; i < tradeReq.giveCards.length; i++, j++){
                                if (tradeReq.giveCards[i] != gottenCards[j]) {
                                    updates.push({
                                        [ownAction]: {
                                            v: `${tradeReq.giveCards[i]},${i}`,
                                            x: ActionType1.putCard
                                        }
                                    });
                                    j--;
                                }
                            }
                            newAction.a = tradeReq.giveCards;
                            const gottenPacks = snapshotVal.d ?? {
                            };
                            for(let i2 = 0, j1 = 0; i2 < tradeReq.givePacks.length; i2++, j1++){
                                if (!(tradeReq.givePacks[i2].pack in gottenPacks)) {
                                    updates.push({
                                        [ownAction]: {
                                            a: tradeReq.givePacks[i2].pack,
                                            b: tradeReq.givePacks[i2].amount,
                                            c: i2,
                                            x: ActionType1.putPack
                                        }
                                    });
                                    gottenPacks[tradeReq.givePacks[i2].pack] = tradeReq.givePacks[i2].amount;
                                    j1--;
                                }
                            }
                            newAction.c = gottenPacks;
                            let gottenCoins = snapshotVal.e ?? 0;
                            if (gottenCoins < tradeReq.giveCoins && !tradeReq.receiveCoins) {
                                updates.push({
                                    [ownAction]: {
                                        v: Math.max(tradeReq.giveCoins, 0),
                                        x: ActionType1.putCoins
                                    }
                                });
                                updates.push({
                                    [ownAction]: {
                                        v: '00',
                                        x: ActionType1.wantCoinsMessage
                                    }
                                });
                            }
                            newAction.e = -gottenCoins;
                            if (updates.length === 0) {
                                await update(tradeRef, {
                                    [ownAction]: newAction
                                });
                                updates.push({
                                    [ownAction]: {
                                        v: "1",
                                        x: ActionType1.sendEmoji
                                    }
                                });
                                for (const updateElem of updates){
                                    await update(tradeRef, updateElem);
                                }
                                off(tradeRef);
                                ended = true;
                                resolve({
                                    givenCards: newAction.a,
                                    givenPacks: newAction.c,
                                    netCoins: newAction.e,
                                    receivedCards: newAction.b,
                                    receivedPacks: newAction.d
                                });
                            } else {
                                await update(tradeRef, {
                                    [ownAction]: {
                                        x: ActionType1.cancel
                                    }
                                });
                                for (const updateElem of updates){
                                    await update(tradeRef, updateElem);
                                }
                            }
                        //console.log("Bot done all checks and went through, and completed the trade");
                        } catch  {
                            console.log("everything loaded but within the checks failed");
                        }
                    }
                }
            }
            onChildMoved(tradeRef, function a(...args) {
                try {
                    // @ts-ignore
                    childUpdate(...args);
                } catch (error) {
                    ended = true;
                    return reject('Unknown');
                }
            });
            onChildAdded(tradeRef, function a(...args) {
                try {
                    // @ts-ignore
                    childUpdate(...args);
                } catch (error) {
                    ended = true;
                    return reject('Unknown');
                }
            });
            onChildChanged(tradeRef, function a(...args) {
                try {
                    // @ts-ignore
                    childUpdate(...args);
                } catch (error) {
                    ended = true;
                    return reject('Unknown');
                }
            });
            onValue(tradeRef, async (snapshot)=>{
                if (snapshot.val() == null && loaded) {
                    ended = true;
                    console.log('User left', self.auth.currentUser?.email);
                    off(tradeRef);
                    reject('User left');
                }
            });
        });
    }
    constructor(token){
        this.loggedIn = false;
        this.token = token;
        this.app = initializeApp({
            apiKey: "AIzaSyBJzsSLElHaERgbTXKUKG0GQrY8ipui2jg",
            authDomain: "madfut-23.firebaseapp.com",
            projectId: "madfut-23",
            storageBucket: "madfut-23.appspot.com",
            messagingSenderId: "359609929204",
            databaseURL: "https://mf23-trading-invites-2.europe-west1.firebasedatabase.app",
            appId: "1:359609929204:android:8bb77a9a5e5fdfb7d2fda1"
        }, Math.random().toPrecision(1));
        //});
        initializeAppCheck(this.app, {
            provider: new CustomProvider({
                getToken: ()=>{
                    return Promise.resolve({
                        token: this.token,
                        expireTimeMillis: 1637066608 * 1000 // TODO: read from token
                    });
                }
            })
        });
        this.auth = getAuth(this.app);
    }
}
MadfutClient.inUse = [];
export default MadfutClient;
export { ProfileProperty1 as ProfileProperty };
