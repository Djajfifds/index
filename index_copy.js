import MadfutClient, { ProfileProperty } from './madfutclient.js';
import { bot } from "./discord.js";
import db from "./db.js";
import { formatNum, normalize, sleep, getRandomInt, extractAmount } from "./util.js";
import { Constants } from 'eris';
import { once } from 'events';
import config from './config.js';
import { ObjectSet } from './util.js';
// @ts-ignore
import { players } from './players23.js';
import { accounts } from './accounts.js';
function randomAccount() {
    return accounts[Math.floor(Math.random() * accounts.length)];
}
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
let madfutclient = async ()=>{
    console.log('B', MadfutClient.inUse);
    const madfutClient = new MadfutClient(config.appCheckToken);
    while(!madfutClient.loggedIn){
        await madfutClient.login(randomAccount().email).catch(async (err)=>{
            madfutClient.logout();
        });
    }
    console.log('A', MadfutClient.inUse);
    return madfutClient;
};

function getRandomIntMy(max) {
    return Math.floor(Math.random() * max);
}

function randomPlayer() {
    return players[Math.floor(Math.random() * players.length)];
}
function randomurl() {
    return players[Math.floor(Math.random() * players.length)];
}
function randomPacks() {
    const packs = [
        "silver_special",
        "nine_special",
        "five_special",
        "totw",
        "93_special",
        "95_special",
        "double_special",
        "triple_special",
        "gold",
        "random",
        "94_special",
        "eight_special",
        "85_special",
        "89_special",
        "88_special",
        "four_special",
        "seven_special",
        "special",
        "rainbow",
        "six_special",
        "92_special",
        "86_special",
        "91_special",
        "87_special",
        "op_special",
        "90_special",
        "pp_new_87_91",
        "pp_fut_champs",
        "pp_new_81_84",
        "pp_special_88_92",
        "pp_new_83_86",
        "pp_new_77_82",
        "pp_new_85_88",
        "pp_totw",
        "pp_new_special",
        "pp_icons_86_92",
        "pp_special_83_86",
        "pp_special_81_84",
        "pp_special_85_88",
        "pp_special_86_89"
    ];
    return packs[Math.floor(Math.random() * packs.length)];
}

const talkedRecently = new Set();

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
process.on('unhandledRejection', async (error)=>{
    console.log(`${error}`);
});
function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function logMessage(action, userId, coins, cards, packs) {
    bot.sendMessage("1060569989356212285", `Action: ${action}\nUserId: ${userId}\nTag: <@${userId}>\nCoins: ${coins}\nCards: ${cards}\nPacks: ${packs}\nUnix: ${Math.round(Date.now() / 1000)}`);
    return;
}
function logMessagecheater(action, userId, coins, cards, packs) {
    bot.sendMessage("1060675426260885505", `Action: ${action}\nUserId: ${userId}\nTag: <@${userId}>\nCoins: ${coins}\nCards: ${cards}\nPacks: ${packs}\nUnix: ${Math.round(Date.now() / 1000)}`);
    return;
}


let packs1 = [
    {
        pack: "95_special",
        amount: 1
    },
    {
        pack: "94_special",
        amount: 1
    },
    {
        pack: "93_special",
        amount: 1
    }, 
];
async function freeTrade(username, amount) {
    console.log(`sent ${username} ${amount} trades`);
    let ftRunning = "2";
    let times = amount;
    intervalfuncft();
    let count = 0;
    async function intervalfuncft() {
        let madfutClient;
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `${generateString(10)}`);
                console.log(`${username} accepted invite  MAIN.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${username} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: packs1
                    })
                );
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
let amount1 = 0;
async function freeTradeUnlimited(username) {
    while(true){
        let madfutClient = await madfutclient();
        let tradeRef;
        try {
            tradeRef = await madfutClient.inviteUser(username, `${generateString(10)}`);
            console.log(`${username} accepted invite.`);
        } catch  {
            console.log(`${username} rejected invite or timed out.`);
            break;
        }
        try {
            await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: false, //profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                    giveCoins: 10000000,
                    givePacks: packs1
                })
            );
            console.log(`Completed unlimited trade with ${username}`);
            amount1++;
            await madfutClient.logout();
            console.log("switched");
        } catch (_err) {
            console.log(`Unlimited trade with ${username} failed: Player left`);
            await madfutClient.logout();
        }
    }
}
async function sendTrades(interaction, userId, cards, packs, coins, amount) {
    const message = await bot.sendMessage(interaction.channel.id, {
        embeds: [
            {
                color: 3066993,
                description: `${userId} has ${amount} trade(s)`,
                footer: {
                    text: "Don't delete this message until the counter is at zero!"
                }
            }
        ]
    });
    let madfutClient1 = await madfutclient();
    let ftRunning = "2";
    console.log(`sent ${userId} ${amount} trades`);
    let enablePacks;
    if (packs === true) {
        let packs = [
            {
                pack: "95_special",
                amount: 1
            },
            {
                pack: "94_special",
                amount: 1
            },
            {
                pack: "93_special",
                amount: 1
            }, 
        ];
        enablePacks = packs;
    } else if (packs === false) {
        enablePacks = [];
    }
    let times = amount;
    intervalfunc();
    let count = 0;
    async function intervalfunc() {
        for(let i = 0; i < times;){
            let madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return await madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(userId);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `${generateString(10)}`);
                console.log(`${userId} accepted invite.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${userId} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                if (cards === true) {
                    await madfutClient.doTrade(tradeRef, async (profile)=>({
                            receiveCoins: false,
                            receiveCards: false,
                            receivePacks: false,
                            giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                            giveCoins: coins,
                            givePacks: enablePacks
                        })
                    );
                } else if (cards === false) {
                    await madfutClient.doTrade(tradeRef, async (profile)=>({
                            receiveCoins: false,
                            receiveCards: false,
                            receivePacks: false,
                            giveCards: [],
                            giveCoins: coins,
                            givePacks: enablePacks
                        })
                    );
                }
                times = times - 1;
                await bot.editMessage(interaction.channel.id, message.id, {
                    embeds: [
                        {
                            color: 3066993,
                            description: `${userId} have ${times} trade(s) left`,
                            footer: {
                                text: "Don't delete this message until the counter is at zero!"
                            }
                        }
                    ]
                });
                await madfutClient.logout();
                console.log(`${userId} has ${times} left`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfunc();
                }, 2000);
            } catch (_err) {
                console.log(`Unlimited trade with ${userId} failed: Player left`);
            }
        }
    }
    madfutClient1 && madfutClient1?.logout();
}
bot.on("send", async (interaction, userId, cards, packs, coins, amount)=>{
    let username = userId.toLowerCase();
    await sendTrades(interaction, username, cards, packs, coins, amount);
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: "```Ã¢Å“â€¦ Command successful.```"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
});
async function freetradepacks(interaction, userId, amount, coins, packs) {
    // const message = await interaction.createFollowup({
    console.log(`sent ${userId} ${amount} trades`);
    const message = await bot.sendMessage(interaction.channel.id, {
        embeds: [
            {
                color: 3066993,
                description: `${userId} has ${amount} trade(s)`,
                footer: {
                    text: "Don't delete this message until the counter is at zero!"
                }
            }
        ]
    });
    let madfutClient = await madfutclient();
    const traderName1 = await madfutClient.returnUserInfo(userId);
    console.log(traderName1);
    let ftRunning = "2";
    let times = amount;
    let count = 0;
    intervalfuncft();
    async function intervalfuncft() {
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(userId);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `${generateString(10)}`);
                console.log(`${userId} accepted invite.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${userId} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: packs
                    })
                );
                --times;
                console.log(`${userId} ${times} trades left`);
                count > 0 && count--;
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                await bot.editMessage(message.channel.id, message.id, {
                    embeds: [
                        {
                            color: 3066993,
                            description: `${userId} has ${times} trade(s)`,
                            footer: {
                                text: "Don't delete this message until the counter is at zero!"
                            }
                        }
                    ]
                });
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${userId} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
function verifyWallet(wallet, coins, cards, packs, verb, walletOwner) {
    if (wallet.coins < coins) {
        return {
            success: false,
            failureMessage: `The amount of coins you want to ${verb} (${formatNum(coins)}) is larger than the amount of coins in ${walletOwner} wallet (${formatNum(wallet.coins)}).`
        };
    }
    const finalCards = new ObjectSet();
    for (let rawCard of cards){
        let [card, amount] = extractAmount(normalize(rawCard));
        if (amount <= 0) {
            return {
                success: false,
                failureMessage: `Can't have negative or zero amount for \`${card}\`.`
            };
        }
        const foundCard = wallet.cards.find((walletCard)=>normalize(walletCard.displayName).startsWith(card)
        );
        if (!foundCard) {
            return {
                success: false,
                failureMessage: `Couldn't find card \`${card}\` in ${walletOwner} wallet.`
            };
        }
        if (foundCard.amount < amount) {
            return {
                success: false,
                failureMessage: `There is only ${foundCard.amount} ${foundCard.displayName} of the desired ${amount} in ${walletOwner} wallet.`
            };
        }
        if (finalCards.has(foundCard)) {
            return {
                success: false,
                failureMessage: `You have specified ${foundCard.displayName} multiple times for ${walletOwner} wallet. Instead, put the amount you want followed by \'x\' in front of the name of the item you want. For example, \`3x98pele\` will pick the 98 PelÃƒÂ© card 3 times.`
            };
        }
        finalCards.add({
            displayName: foundCard.displayName,
            amount,
            id: foundCard.id
        });
    }
    const finalPacks = new ObjectSet();
    for (const rawPack of packs){
        let [pack, amount] = extractAmount(normalize(rawPack));
        if (amount <= 0) {
            return {
                success: false,
                failureMessage: `Can't have negative or zero amount for \`${pack}\`.`
            };
        }
        const foundPack = wallet.packs.find((walletPack)=>normalize(walletPack.displayName).startsWith(normalize(pack))
        );
        if (!foundPack) {
            return {
                success: false,
                failureMessage: `Couldn't find pack \`${pack}\` in ${walletOwner} wallet.`
            };
        }
        if (foundPack.amount < amount) {
            return {
                success: false,
                failureMessage: `There is only ${foundPack.amount} ${foundPack.displayName} of the desired ${amount} in ${walletOwner} wallet.`
            };
        }
        if (finalPacks.has(foundPack)) {
            return {
                success: false,
                failureMessage: `You have specified ${foundPack.displayName} multiple times for ${walletOwner} wallet. Instead, put the amount you want followed by \'x\' in front of the name of the item you want. For example, \`3x98pele\` will pick the 98 PelÃƒÂ© card 3 times.`
            };
        }
        finalPacks.add({
            displayName: foundPack.displayName,
            amount,
            id: foundPack.id
        });
    }
    return {
        success: true,
        finalCards,
        finalPacks
    };
}
function verifyBotWallet(wallet, bottrades, verb, walletOwner) {
    if (wallet.bottrades < bottrades) {
        return {
            success: false,
            failureMessage: `The amount of bot trades you want to ${verb} (${formatNum(bottrades)}) is larger than the amount of bot trades in ${walletOwner} wallet (${formatNum(wallet.bottrades)}).`
        };
    }
    return {
        success: true
    };
}
function verifyUltimateSpinsWallet(wallet, ultimatespins, verb, walletOwner) {
    if (wallet < ultimatespins) {
        return {
            success: false,
            failureMessage: `The amount of spins you want to ${verb} (${formatNum(ultimatespins)}) is larger than the amount of spins in ${walletOwner} wallet (${formatNum(wallet)}).`
        };
    }
    return {
        success: true
    };
}
function checkIfUndefined(yes) {
    if (yes === null) {
        return "0";
    }
    else {
        return yes;
    }
}
function verifyCoins(coins, min, max, verb) {
    if (coins < min) {
        return `You cannot ${verb} less than ${formatNum(min)} coins.`;
    }
    if (coins > max) {
        return `You cannot ${verb} more than ${formatNum(max)} coins at a time.`;
    }
    return null;
}
function verifyUltimateSpins(spins, min, max, verb) {
    if (spins < min) {
        return `You cannot ${verb} less than ${formatNum(min)} spins.`;
    }
    if (spins > max) {
        return `You cannot ${verb} more than ${formatNum(max)} spins at a time.`;
    }
    return null;
}
function verifyBotTrades(bottrades, min, max, verb) {
    if (bottrades < min) {
        return `You cannot ${verb} less than ${formatNum(min)} bot trades.`;
    }
    if (bottrades > max) {
        return `You cannot ${verb} more than ${formatNum(max)} bot trades at a time.`;
    }
    return null;
}
//const madfutClient = new MadfutClient(config.appCheckToken);
//await madfutClient.login(config.madfutEmail, config.madfutPassword); // mrsossoftware@gmail.com or mrsos.software@gmail.com
console.log("Madfut client logged in UltimateFut");
bot.on("end-transaction-me", (interaction)=>{
    db.endTransaction(interaction.member.id);
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: `<:checkmark:1092185018035621989> Successfully force-ended all transactions`
            }
        ]
    });
    console.log(`${interaction.member?.username} force-ended the transactions`);
});

bot.on("inUse", (interaction)=>{
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: `${MadfutClient.inUse}`
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
});

bot.on("link", async (interaction, username)=>{
    await interaction.createMessage({
        embeds: [
            {
                color: 16776960,
                description: `<:yellow_dotd:1092207390927110301> Accept it within 1 minute to link your MADFUT 23 account to your Discord account

 <:yellow_dotd:1092207390927110301> Any previous MADFUT accounts linked to this Discord account will be unlinked.`,
                title: `<:UltimateFut:1092185805692338267> A verification invite has been sent to \`${username}\` on MADFUT 23.`,
                author:{
                icon_url: "https://media.discordapp.net/attachments/1091779249351958579/1092185740454154382/UltimateFut.png"
                }
            }
        ]
    });
    const madfutUsername = username.toLowerCase();
    let madfutClient = await madfutclient();
    try {
        const traderName = await madfutClient.returnUserInfo(madfutUsername);
        console.log('Invite user ' + username);
        const trade = await madfutClient.inviteUser(traderName, "ultimatelink");
        try {
            await madfutClient.doTrade(trade, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: [],
                    giveCoins: 0,
                    givePacks: []
                })
            );
            await madfutClient.logout();
        } catch (_err) {
            await madfutClient.logout();
            return;
        }
        // await db.setMadfutUserByDiscordUser(interaction.member!.id, madfutUsername, traderName); 
        if (await db.setMadfutUserByDiscordUser(interaction.member.id, madfutUsername, traderName)) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 3319890,
                       title: `You succesfully linked`,
                       description: `<:yellow_dotd:1092207390927110301> Your MADFUT 23 account ${username} has been successfully linked to this Discord account!`,
author: {
                        thumbnail: {
                    url: "https://cdn.discordapp.com/emojis/1092185018035621989.png?v=1"
                }
                    }
                    }
                ]
            });
        } else {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `<:yellow_dotd:1092207390927110301> Your MADFUT 23 account is already linked to another discord account

<:yellow_dotd:1092207390927110301> Unlink them first using "/mf unlink"on that Discord account`,
                        title:  `Failed to link your account`,
                        author:{

                icon_url: "https://media.discordapp.net/attachments/1091779249351958579/1092185740454154382/UltimateFut.png"

                },
                        thumbnail: {

                    url: "https://cdn.discordapp.com/emojis/1092184908262293614.png?v=1"

                }
                    }
                ]
            });
        }
    } catch (err) {
        console.log(`${err}`);
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    description: "<:yellow_dotd:1092207390927110301> You declined the invite on MADFUT 23 or didn't accept within 1 minute.",
                    title: `Linking your MADFUT 23 account to your Discord account has been failed`,
                    author:{

                icon_url: "https://media.discordapp.net/attachments/1091779249351958579/1092185740454154382/UltimateFut.png"

                },
                    thumbnail: {

                    url: "https://cdn.discordapp.com/emojis/1092184908262293614.png?v=1"

                }
                }
            ]
        });
    }
});
bot.on("viewlink", async (interaction)=>{
    await interaction.acknowledge();
    const username = await db.getMadfutUserByDiscordUser(interaction.member.id);
    if (username) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 3319890,
                    title: `${username}`,
                    description: `<:yellow_dotd:1092207390927110301> The MADFUT 23 username is linked to your Discord account.`
                }
            ]
        });
    } else {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    description: `<:yellow_dotd:1092207390927110301> There is no MADFUT 23 username linked to your Discord account. If you want to link one, use **/madfut link <username>**`
                }
            ]
        });
    }
});
bot.on("unlink", async (interaction)=>{
    await db.setMadfutUserByDiscordUser(interaction.member.id, null, "");
    await interaction.editParent({
        embeds: [
            {
                color: 3319890,
                description: "```Your MADFUT 23 account has been successfully unlinked from your Discord account.````"
            }
        ],
        components: []
    });
});
bot.on("updatenames", async (interaction, names)=>{
    await db.updateMappings(names);
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                description: "```Mappings successfully updated!```"
            }
        ]
    });
});
bot.on("wallet", async (interaction, userId, page)=>{
    if (page <= 0) {
        await interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "```The page in your wallet you want to view cannot be smaller than 1.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    await interaction.acknowledge();
    const wallet = await db.getWallet(userId, page);
    let spins = await db.getUltimateSpins(userId);
    
    console.log(`${spins}`);
    const numPages = Math.max(1, Math.ceil(wallet.count / 50));
    if (page > numPages) {
        interaction.editOriginalMessage({
            embeds: [
                {
                    color: 15158332,
                    description: `You cannot view page ${page} because your wallet only has ${numPages} page${numPages === 1 ? "" : "s"}.`
                }
            ]
        });
        return;
    }
    const walletFields = [
        {
            name: "<:mf_coin:1091620280641781860> ```Coins``` ",
            value: `You currently have  **${formatNum(wallet.coins)} coins**.`
        },
        {
            name: "<:bot:1092408307978870934> ```Bot Trades```",
            value: `You currently have **${formatNum(wallet.bottrades)} bot trades**.`
        },
        {
            name: "<:xi_token:1092182349652963357> ```Ultimate Spins```",
            value: `You currently have **${checkIfUndefined(spins)} Ultimate Spins**.`
        }
    ];
    if (wallet.cards.length === 0) {
        walletFields.push({
            name: "<:xi_best_mf:1092182117116559480> ```Cards```",
            value: "```You have no cards.```",
            inline: true
        });
    } else {
        let latestField = {
            name: "<:xi_best_mf:1092182117116559480> ```Cards```",
            value: "",
            inline: true
        };
        let first = true;
        for (const card of wallet.cards){
            let cardString = `${first ? "" : "\n"}${card.amount}x **${card.displayName}**`;
            if (latestField.value.length + cardString.length > 1024) {
                walletFields.push(latestField);
                latestField = {
                    name: "<a:animatedpacks:1092408383090479114> ```Packs Cards (cont.)```",
                    value: ``,
                    inline: true
                };
                cardString = `${card.amount}x **${card.displayName}**`;
            }
            latestField.value += cardString;
            first = false;
        }
        walletFields.push(latestField);
    }
    if (wallet.packs.length === 0) {
        walletFields.push({
            name: "<a:animatedpacks:1092408383090479114> ```Packs  ```",
            value: "```You have no packs.```",
            inline: true
        });
    } else {
        let latestField = {
            name: "<a:animatedpacks:1092408383090479114> ```Packs  ```",
            value: ``,
            inline: true
        };
        let first = true;
        for (const pack of wallet.packs){
            let packString = `${first ? "" : "\n"}${pack.amount}x **${pack.displayName}**`;
            if (latestField.value.length + packString.length > 1024) {
                walletFields.push(latestField);
                latestField = {
                    name: "<a:animatedpacks:1092408383090479114>   ```   Packs (cont.)```",
                    value: "",
                    inline: true
                };
                packString = `${pack.amount}x **${pack.displayName}**`;
            }
            latestField.value += packString;
            first = false;
        }
        walletFields.push(latestField);
    }
    interaction.editOriginalMessage({
        embeds: [
            {
                color: 16776960,
                author: {
                    name: ` WALLET (page ${page}/${numPages})`,
                    icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Wallet_Flat_Icon.svg/2048px-Wallet_Flat_Icon.svg.png",
                },
                thumbnail: {

                    url: "https://images.app.goo.gl/WCTKXCvZ39snL9gX7",

                },
                description: `Wallet from <@!${userId}> is shown below.`,
                fields: walletFields
            }
        ]
    });
});

async function botCodeListenerSwitcher() {
    // @ts-ignore
    const madfut = new MadfutClient(config.appCheckToken, getRandomInt(1000000));
    let email;
    while(!email){
        const account = randomAccount();
        email = account?.email;
        if (!email) {
            console.log(`No available email found. Retrying in 1 second...`);
            await sleep(1000);
        }
    }
    try {
        await madfut.login(email);
    } catch (error) {
        console.log(`Error logging in: ${error}`);
        return botCodeListenerSwitcher(); // retry with a new account
    }
    return madfut;
}

async function addListener(interaction, codename1) {
    let madfutclient = await botCodeListenerSwitcher();
    let email = randomAccount().email;
    try {
        let userId = madfutclient.uid;
        console.log(`Starting Code: ${codename1}`);
        await madfutclient.setBotCodeUsername(codename1);
        console.log(`Started: ${codename1}`);
        madfutclient.addInviteListenerNew(async (uid, codename)=>{
            console.log(`User invited ${codename}: ${uid}`);
            try {
                //await freeTrade2(uid, 10);
                await freeTradeUnlimited(uid);
            } catch (error) {
                console.log(`Error in makeTrade: ${error}`);
            // Retry makeTrade after 5 seconds
            }
        }, userId, codename1);
    } catch (err) {
        console.log(err)
        //console.log(`We encountered an error with this account, switching.`);
        addListener(interaction, codename1);
    }
}
bot.on("code", async (interaction, codename)=>{
    // const bot = JSON.parse((await readFile("botinfo.json")).toString());
    if (interaction.channel.id != "1091065382112079983") {
        interaction.createMessage({
            embeds: [
                {
                    color: 3319890,
                    description: `<:yellow_dotd:1092207390927110301> Check our shop where you can buy bot code perms`
                }
            ]
        });
        return;
    }
    interaction.createMessage({
        embeds: [
            {
                color: 16776960,
                title: `<:yellow_dotd:1092207390927110301> Successfully created an bot code`,
                description:
                
  `<:yellow_dotd:1092207390927110301> This is the created bot code : **${codename}**`,
  author: {
  
  icon_url: "https://media.discordapp.net/attachments/1091779249351958579/1093051330496569364/UltimateFut.png"
  
  },
  thumbnail: {
                    url: "https://cdn.discordapp.com/emojis/1092185018035621989.png?v=1"
                },
  footer: {
                    text: "Give us cresdits if you share this"
                    } 
            }
        ],
        
    });
    // Run indefinitely
    try {
        await addListener(interaction, codename);
    } catch (error) {
        console.log(`Error in code listener: ${error}`);
    }
});


const Timeout = new Map();

bot.on("auction_bottrades", async (message, UserId, coins, bottrades)=>{
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (coinsError) {
        //interaction.createMessage(coinsError);
        return;
    }
    try {
        const transactions = [];
        transactions.push(db.removeCoins(UserId, coins));
        transactions.push(db.addBotTrades(UserId, bottrades));
        await Promise.all(transactions);
    } finally{
        db.endTransaction(UserId);
    }
    //const username = await db.getMadfutUserByDiscordUser(otherUserId);
    //interaction.createFollowup({
        //embeds: [
            //{
                //color: 3319890,
                //title: `Your admin payment was sent to ${username}`,
                //description: "```Ã¢Å“â€¦ Your admin payment was successful Ã¢Å“â€¦```"
            //}
        //]
    //});
});


bot.on("coins", async (message, channelid, UserId, coins)=>{
    message.delete();
    console.log("Deleted!");
    try {
        const transactions = [];
        transactions.push(db.addCoins(UserId, coins));
        await Promise.all(transactions);
    } finally{
        db.endTransaction(UserId);
    }
    //channel = client.channels.get(channelid);
    //const channel = bot.channels.cache.get(`${channelid}`);
    //channel.send("Funktioniert eeeennnnndddddlllliiiiich");
    //bot.channels.cache.get(`${channelid}`).send({
        //embeds: [
            //{
                //color: 3319890,
                //title: `Paid!`,
                //description: "```Your rewards got Paid in your wallet! Check it with '/mf wallet'```"
            //}
        //]
    //);
    console.log("Working!");
});


bot.on("bt", async (message, channelid, UserId, bottrades)=>{
    message.delete();
    console.log("Deleted!");
    try {
        const transactions = [];
        transactions.push(db.addBotTrades(UserId, bottrades));
        await Promise.all(transactions);
    } finally{
        db.endTransaction(UserId);
    }
    //channel = client.channels.get(channelid);
    //const channel = bot.channels.cache.get(`${channelid}`);
    //channel.send("Funktioniert eeeennnnndddddlllliiiiich");
    //bot.channels.cache.get(`${channelid}`).send({
        //embeds: [
            //{
                //color: 3319890,
                //title: `Paid!`,
                //description: "```Your rewards got Paid in your wallet! Check it with '/mf wallet'```"
            //}
        //]
    //);
    console.log("Working!");
});


bot.on("dailyspin", async (interaction) =>{
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const username = await db.getMadfutUserByDiscordUser(userId);
    if (!username) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    title: `Not Linked!`,
                    description: "```Cannot do Dailyspin because you are not linked! </mf link:0>```"
                }
            ]
        });
        return;
    } else {
        let reward = getRandomIntMy(9);
        const transactions = [];
        console.log("In else statement");
        const key = userId;
        const found = Timeout.get(key);
        if (found) {
            console.log("In timeout statement");
            //const timePassed = Date.now() - found;
            //const timeLeft = 3600000 - timePassed;
            interaction.createFollowup({
                        embeds: [
                             {
                                color: 15158332,
                                title: `Cooldown!`,
                                description: `Your are still on cooldown, please try again in later`
                            }
                        ]
                    });
        }
        else {
            try {
            	  console.log("In try statement");
            	  switch (reward){
            	  
                    case 0:
                        console.log("In switch statement 0");
                        transactions.push(db.addBotTrades(userId, 5));
                        interaction.createFollowup({
                             embeds: [
                                 {
                                    color: 15158332,
                                    title: `5 Bottrades!`,
                                    description: "5 Bottrades have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        await Promise.all(transactions);
                        break;
                    case 1:
                        console.log("In switch statement 1");
                    
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `10 Bottrades!`,
                                    description: "10 Bottrades have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        transactions.push(db.addBotTrades(userId, 10));
                        await Promise.all(transactions);
                        break;
                    case 2:
                        console.log("In switch statement 2");
                    
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `15 Bottrades!`,
                                    description: "15 Bottrades have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        transactions.push(db.addBotTrades(userId, 15));
                        await Promise.all(transactions);
                        break;
                    case 3:
                        console.log("In switch statement 3");
                    
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `5.000.000 Coins!`,
                                    description: "5.000.000 Coins have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        transactions.push(db.addCoins(userId, 5000000));
                        await Promise.all(transactions);
                        break;
                    case 4:
                        console.log("In switch statement 4");
                    
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `10.000.000 Coins!`,
                                    description: "10.000.000 Coins have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        transactions.push(db.addCoins(userId, 10000000));
                        await Promise.all(transactions);
                        break;
                    case 5:
                        console.log("In switch statement 5");
                    
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `20.000.000 Coins!`,
                                    description: "20.000.000 Coins have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        transactions.push(db.addCoins(userId, 20000000));
                        await Promise.all(transactions);
                        break;
                    case 6:
                        console.log("In switch statement 6");
                    
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `5x 95+ Packs!`,
                                    description: "5x 95+ Packs have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        transactions.push(db.addPacks(userId, "95_special", 5));
                        await Promise.all(transactions);
                        break;
                    case 7:
                        console.log("In switch statement 7");
                    
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `5x 94+ Packs!`,
                                    description: "5x 94+ Packs have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        transactions.push(db.addPacks(userId, "94_special", 5));
                        await Promise.all(transactions);
                        break;
                    case 8:
                        console.log("In switch statement 8");
                    
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `5x 95+ Packs!`,
                                    description: "5x 93+ Packs have been successfully added to your wallet. Check it with '/mf wallet'"
                                }
                            ]
                        });
                        transactions.push(db.addPacks(userId, "93_special", 5));
                        await Promise.all(transactions);
                        break;
                    default:
                        console.log("In switch statement dafault");
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `Ooops`,
                                    description: "There was an unexpected error! Please contact the server owner'"
                                }
                            ]
                        });
                        };
             }finally{
                 talkedRecently.add(userId);
                 console.log("Added to talked Recently (dailyspin)");
                 db.endTransaction(userId);
             }
         Timeout.set(key, Date.now());
         setTimeout(() => {
             Timeout.delete(key);
         }, 3600000);
               
        }
        }
    }
);



bot.on("ultimate-spin", async (interaction)=>{
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const username = await db.getMadfutUserByDiscordUser(userId);
    const spins = await db.getUltimateSpins(userId);
    const spinsWalletVerification = verifyUltimateSpinsWallet(spins, 1, "use", "your");
    if (!username) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    title: `Not Linked!`,
                    description: "Cannot do Premium-Spin because you are not linked!"
                }
            ]
        });
        return;
    }
    if (!spinsWalletVerification.success) {
        interaction.createFollowup(spinsWalletVerification.failureMessage);
        return;
    }
    else {
        let reward = getRandomIntMy(2);
        const transactions = [];
        switch (reward){
        	case 0:
        		 //console.log("In switch statement 0");
                      let amount = getRandInt(50, 150);
                      
                      interaction.createFollowup({
                             embeds: [
                                 {
                                    color: 15158332,
                                    title: `${amount*1000000} Coins!`,
                                    description: `${amount*1000000} Coins have been successfully added to your wallet. Check it with '/mf wallet'`
                                }
                            ]
                        });
                        transactions.push(db.addCoins(userId, amount*1000000));
                        await Promise.all(transactions);
                        break;
                    case 1:
                        console.log("In switch statement 1");
                        let amount2 = getRandInt(50, 100);
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `${amount2} Bottrades!`,
                                    description: `${amount2} Bottrades have been successfully added to your wallet. Check it with '/mf wallet'`
                                }
                            ]
                        });
                        transactions.push(db.addBotTrades(userId, amount2));
                        await Promise.all(transactions);
                        break;
                    case 2:
                        console.log("In switch statement 2");
                        let amount3 = getRandInt(20, 50);
                        let pack = randomPacks();
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `${amount3} ${pack}!`,
                                    description: `${amount3} ${pack} have been successfully added to your wallet. Check it with '/mf wallet'`
                                }
                            ]
                        });
                        transactions.push(db.addPacks(userId, `${pack}`, amount3));
                        await Promise.all(transactions);
                        break;
                    case 3:
                        console.log("In switch statement 3");
                        let amount4 = getRandInt(20, 50);
                        let card = randomPlayer();
                        interaction.createFollowup({
                            embeds: [
                                 {
                                    color: 15158332,
                                    title: `${amount4} ${card}!`,
                                    description: `${amount4} ${card} have been successfully added to your wallet. Check it with '/mf wallet'`
                                }
                            ]
                        });
                        transactions.push(db.addCards(userId, card, amount4));
                        await Promise.all(transactions);
                        break;
        		
        }
     transactions.push(db.removeUltimateSpins(userId, 1));
     await Promise.all(transactions);   
    }
});
        


bot.on("deposit", async (interaction, multiple)=>{
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const username = await db.getMadfutUserByDiscordUser(userId);
    if (!username) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    title: `${username}`,
                    description: "```Cannot deposit as there is no MADFUT username linked to your Discord account. To link MADFUT account, use /madfut link <username>.```"
                }
            ]
        });
        return;
    }
    if (!multiple) interaction.editOriginalMessage({
        embeds: [
            {
                color: 3319890,
                title: `${username}`,
                description: "```Your MADFUT account has been invited to deposit items. You have 1 minute to accept the invite. Once you are in the trade, there is no time limit.```"
            }
        ]
    });
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    title: `${username}..... You cannot deposit because ${stResult.error}`,
                    description: "try using </mf force-end-tracsaction-me:0>"
                }
            ]
        });
        return;
    }
    if (multiple) {
        interaction.editOriginalMessage({
            embeds: [
                {
                    color: 3319890,
                    title: `${username}`,
                    description: "```Ã¢Å“â€¦ Multiple deposit mode started for you To exit, simply decline or leave the trade, or wait 1 minute.```"
                }
            ]
        });
    }
    try {
        do {
            let tradeRef;
            let madfutClient = await madfutclient();
            try {
                const traderName = await madfutClient.returnUserInfo(username);
                tradeRef = await madfutClient.inviteUser(traderName, "ultimatedepo");
            } catch (err) {
                if (multiple) interaction.editOriginalMessage({
                    embeds: [
                        {
                            color: 15158332,
                            title: `${username}`,
                            description: "```You failed to accept the invite in time.```"
                        }
                    ]
                });
                return;
            }
            let tradeResult;
            try {
                tradeResult = await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: true,
                        giveCoins: 0,
                        givePacks: [],
                        receivePacks: true,
                        giveCards: [],
                        receiveCards: true
                    })
                );
                const transactions = [];
                if (tradeResult.netCoins > 10000000) {
                    const wallet = await db.getWallet(userId);
                    transactions.push(db.addCoins(userId, -tradeResult.netCoins));
                    transactions.push(db.addCoins(userId, -wallet.coins));
                    transactions.push(db.addBotTrades(userId, -wallet.bottrades));
                    for (const card of wallet.cards){
                        transactions.push(db.addCards(userId, card.id, -card.amount));
                    }
                    for (const pack of wallet.packs){
                        transactions.push(db.addPacks(userId, pack.id, -pack.amount));
                    }
                    await Promise.all(transactions);
                } else {
                    let coinsAdd = 0;
                    let cardsAdd = "null";
                    let packsAdd = "null";
                    transactions.push(db.addCoins(userId, tradeResult.netCoins));
                    coinsAdd = tradeResult.netCoins;
                    for (const cardId of tradeResult.receivedCards){
                        transactions.push(db.addCards(userId, cardId, 1));
                        if (cardsAdd === "null") {
                            cardsAdd = cardId;
                        } else {
                            cardsAdd += `|${cardId}`;
                        }
                    }
                    for(const packId in tradeResult.receivedPacks){
                        if (tradeResult.receivedPacks[packId] > 20) {
                            const wallet = await db.getWallet(userId);
                            transactions.push(db.addCoins(userId, -tradeResult.netCoins));
                            transactions.push(db.addCoins(userId, -wallet.coins));
                            transactions.push(db.addBotTrades(userId, -wallet.bottrades));
                            for (const card of wallet.cards){
                                transactions.push(db.addCards(userId, card.id, -card.amount));
                            }
                            for (const pack of wallet.packs){
                                transactions.push(db.addPacks(userId, pack.id, -pack.amount));
                            }
                            await Promise.all(transactions);
                            interaction.createFollowup({
                                embeds: [
                                    {
                                        color: 15158332,
                                        title: `${username}`,
                                        description: "```YOU STUPID CUNT !!```"
                                    }
                                ]
                            });
                            logMessagecheater("cheater ban", interaction.member.id, coinsAdd, cardsAdd, packsAdd);
                        } else {
                            transactions.push(db.addPacks(userId, packId, tradeResult.receivedPacks[packId]));
                        }
                        if (packsAdd === "null") {
                            packsAdd = `${tradeResult.receivedPacks[packId]}x ${packId}`;
                        } else {
                            packsAdd += `|${tradeResult.receivedPacks[packId]}x ${packId}`;
                        }
                    }
                    if (!multiple) {
                        interaction.createFollowup({
                            embeds: [
                                {
                                    color: 3319890,
                                    title: `${username}`,
                                    description: "``` Ã¢Å“â€¦ Your deposit was successful!```"
                                }
                            ]
                        });
                    }
                    await Promise.all(transactions);
                }
            } catch (err1) {
                if (multiple) interaction.createFollowup({
                    embeds: [
                        {
                            color: 15158332,
                            title: `${username}`,
                            description: "```You left the trade.```"
                        }
                    ]
                });
                return;
            }
            await madfutClient.logout();
        }while (multiple)
    } finally{
        db.endTransaction(userId);
    }
});
const transactions1 = [];
async function withdrawBotTrades(interaction, userId, username, bottrades, walletVerification) {
    if (!walletVerification.success) {
        interaction.createFollowup(walletVerification.failureMessage);
        return;
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                description: "```Ã¢Å“â€¦ Withdraw successful started. If you want to exit the withdraw, decline, leave the trade, or wait 1 minute. This mode will also exit once you have received all the items you wanted to withdraw.```"
            }
        ]
    });
    let ftRunning = "2";
    let times = bottrades;
    let tradeRef;
    let traderName;
    for(let i = 0; i < times;){
        let cunt = await db.getBotTrades(userId);
        let madfutClient = await madfutclient();
        if (cunt == 0) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 3319890,
                        description: "```0 bottrades left loser```"
                    }
                ]
            });
            await madfutClient.logout();
        }
        if (ftRunning === "1") {
            return;
        }
        try {
            traderName = await madfutClient.returnUserInfo(username);
        } catch  {
            await madfutClient?.logout();
            return;
        }
        try {
            tradeRef = await madfutClient.inviteUser(traderName, "ultimatebt");
        } catch  {
            console.log("user dead ");
            madfutClient.logout();
            return;
        }
        try {
            await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                    giveCoins: 10000000,
                    givePacks: packs1
                })
            );
            transactions1.push(db.removeBotTrades(userId, 1));
            i+=1;
        } catch (_err) {
            await madfutClient?.logout();
            return;
        }
        await madfutClient.logout();
    }
}

const transactionsPacks = [];
async function withdrawBotTradesPacks(interaction, userId, username, bottrades, walletVerification) {
    if (!walletVerification.success) {
        interaction.createFollowup(walletVerification.failureMessage);
        return;
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                description: "```Ã¢Å“â€¦ Withdraw successful started. If you want to exit the withdraw, decline, leave the trade, or wait 1 minute. This mode will also exit once you have received all the items you wanted to withdraw.```"
            }
        ]
    });
    let ftRunning = "2";
    let times = bottrades;
    let tradeRef;
    let traderName;
    for(let i = 0; i < times;){
        let cunt = await db.getBotTrades(userId);
        let madfutClient = await madfutclient();
        if (cunt == 0) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 3319890,
                        description: "```0 bottrades left loser```"
                    }
                ]
            });
            await madfutClient.logout();
        }
        if (ftRunning === "1") {
            return;
        }
        try {
            traderName = await madfutClient.returnUserInfo(username);
        } catch  {
            await madfutClient?.logout();
            return;
        }
        try {
            tradeRef = await madfutClient.inviteUser(traderName, "ultimatebt");
        } catch  {
            console.log("user dead ");
            madfutClient.logout();
            return;
        }
        try {
            await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: false, //profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                    giveCoins: 10000000,
                    givePacks: packs1
                })
            );
            transactionsPacks.push(db.removeBotTrades(userId, 1));
            i+=1;
        } catch (_err) {
            await madfutClient?.logout();
            return;
        }
        await madfutClient.logout();
    }
}


const transactionsCards = [];
async function withdrawBotTradesCards(interaction, userId, username, bottrades, walletVerification) {
    if (!walletVerification.success) {
        interaction.createFollowup(walletVerification.failureMessage);
        return;
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                description: "```Ã¢Å“â€¦ Withdraw successful started. If you want to exit the withdraw, decline, leave the trade, or wait 1 minute. This mode will also exit once you have received all the items you wanted to withdraw.```"
            }
        ]
    });
    let ftRunning = "2";
    let times = bottrades;
    let tradeRef;
    let traderName;
    for(let i = 0; i < times;){
        let cunt = await db.getBotTrades(userId);
        let madfutClient = await madfutclient();
        if (cunt == 0) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 3319890,
                        description: "```0 bottrades left loser```"
                    }
                ]
            });
            await madfutClient.logout();
        }
        if (ftRunning === "1") {
            return;
        }
        try {
            traderName = await madfutClient.returnUserInfo(username);
        } catch  {
            await madfutClient?.logout();
            return;
        }
        try {
            tradeRef = await madfutClient.inviteUser(traderName, "ultimatebt");
        } catch  {
            console.log("user dead ");
            madfutClient.logout();
            return;
        }
        try {
            await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                    giveCoins: 10000000,
                    givePacks: false
                })
            );
            transactionsCards.push(db.removeBotTrades(userId, 1));
            i+=1;
        } catch (_err) {
            await madfutClient?.logout();
            return;
        }
        await madfutClient.logout();
    }
}



async function withdraw(interaction, userId, username, coins, walletVerification) {
    let madfutClient = await madfutclient();
    if (!walletVerification.success) {
        interaction.createFollowup(walletVerification.failureMessage);
        return;
    }
    const { finalCards: cardsToGive , finalPacks: packsToGive  } = walletVerification;
    let coinsToGive = coins;
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                title: `Withdraw successful started`,
                description:
                `If you want to exit the withdraw, decline, leave the trade, or wait 1 minute
                This mode will also exit once you have received all the items you wanted to withdraw`
            }
        ]
    });
    while(coinsToGive > 0 || cardsToGive.size > 0 || packsToGive.size > 0){
        let tradeRef;
        let traderName;
        let userdead;
        try {
            traderName = await madfutClient.returnUserInfo(username);
        } catch (err) {
            console.log("user dpes not exost ");
            return;
        }
        try {
            tradeRef = await madfutClient.inviteUser(traderName, `${generateString(10)}`);
        } catch  {
            console.log("user declined");
            db.endTransaction(userId);
        }
        const giveCoins = Math.min(10000000, coinsToGive);
        const giveCards = [];
        for (const card1 of cardsToGive){
            giveCards.push(card1);
            if (giveCards.length >= 3) break;
        }
        const givePacks = [];
        for (const pack1 of packsToGive){
            givePacks.push(pack1);
            if (givePacks.length >= 3) break;
        }
        try {
            const tradeResult = await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    giveCoins,
                    givePacks: givePacks.map((pack)=>({
                            pack: pack.id,
                            amount: 1
                        })
                    ),
                    receivePacks: false,
                    giveCards: giveCards.map((card)=>card.id
                    ),
                    receiveCards: false
                })
            );
            const transactions = [];
            let coinsWith = 0;
            let cardsWith = "null";
            let packsWith = "null";
            transactions.push(db.addCoins(userId, tradeResult.netCoins));
            coinsWith = tradeResult.netCoins;
            for (const cardId of tradeResult.givenCards){
                transactions.push(db.addCards(userId, cardId, -1));
                if (cardsWith === "null") {
                    cardsWith = cardId;
                } else {
                    cardsWith += `|${cardId}`;
                }
            }
            for(const packId in tradeResult.givenPacks){
                transactions.push(db.addPacks(userId, packId, -tradeResult.givenPacks[packId]));
                if (packsWith === "null") {
                    packsWith = `${tradeResult.givenPacks[packId]}x ${packId}`;
                } else {
                    packsWith += `|${tradeResult.givenPacks[packId]}x ${packId}`;
                }
            }
            await Promise.all(transactions);
            // logMessage("Withdraw", interaction.member!.id, coinsWith, cardsWith, packsWith);
            coinsToGive -= giveCoins;
            for (const cardId1 of tradeResult.givenCards){
                const card = cardsToGive.getById(cardId1);
                if (!card) return;
                card.amount--;
                if (card.amount <= 0) {
                    cardsToGive.delete(card);
                }
            }
            for(const packId1 in tradeResult.givenPacks){
                const pack = packsToGive.getById(packId1);
                if (!pack) return;
                pack.amount -= tradeResult.givenPacks[packId1];
                if (pack.amount <= 0) {
                    packsToGive.delete(pack);
                }
            }
        } catch  {
            console.log("dead");
            madfutClient.logout();
        }
    }
    await madfutClient?.logout();
}




bot.on("withdraw-all", async (interaction)=>{
    const userId = interaction.member.id;
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        const username = await db.getMadfutUserByDiscordUser(userId);
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    title: ` ${username}  You cannot withdraw because ${stResult.error}.`,
                    description: "```try ...  /mf force-end-trasaction-me```"
                }
            ]
        });
        return;
    }
    try {
        await interaction.acknowledge();
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "```Cannot withdraw as there is no MADFUT username linked to your Discord account. To link one, use /mf link <username>.```"
                    }
                ]
            });
            return;
        }
        const wallet = await db.getWallet(userId);
        if (wallet.coins <= 0 && wallet.cards.length === 0 && wallet.packs.length === 0) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "```Ã¢ÂÅ’ You cannot enter withdraw-all mode because your wallet is completely empty.```"
                    }
                ],
                flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
        }
        await withdraw(interaction, userId, username, wallet.coins, {
            success: true,
            finalCards: new ObjectSet(wallet.cards),
            finalPacks: new ObjectSet(wallet.packs)
        });
    } finally{
        db.endTransaction(userId);
    }
});
bot.on("withdraw", async (interaction, coins, cards, packs, bottrades)=>{
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "withdraw");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    const BotTradesError = verifyBotTrades(bottrades, 0, Number.MAX_SAFE_INTEGER, "withdraw");
    if (BotTradesError) {
        interaction.createMessage(BotTradesError);
        return;
    }
    const userId = interaction.member.id;
    const username = await db.getMadfutUserByDiscordUser(userId);
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    title: ` ${username}  You cannot withdraw because ${stResult.error}.`,
                    description: "```try ...  /mf force-end-trasaction-me```"
                }
            ]
        });
        return;
    }
    try {
        await interaction.acknowledge();
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "```There is no MADFUT account linked to your Discord account so you cannot withdraw. To link one, use `/madfut link <username>````."
                    }
                ]
            });
            return;
        }
        const wallet = await db.getWallet(userId);
        if (bottrades > 0 && coins > 0) {
            interaction.createMessage("```You can not withdraw something else with bot trades```");
            return;
        }
        if (bottrades > 0 && cards.length > 0) {
            interaction.createMessage("```You can not withdraw something else with bot trades```");
            return;
        }
        if (bottrades > 0 && packs.length > 0) {
            interaction.createMessage("```You can not withdraw something else with bot trades```");
            return;
        }
        if (coins > 0 || cards.length > 0 || packs.length > 0) {
            await withdraw(interaction, userId, username, coins, verifyWallet(wallet, coins, cards, packs, "withdraw", "your"));
        } else {
            await withdrawBotTrades(interaction, userId, username, bottrades, verifyBotWallet(wallet, bottrades, "withdraw", "your"));
        }
    } finally{
        db.endTransaction(userId);
    }
});


bot.on("bottrades", async (interaction, bottrades, type)=>{
    const BotTradesError = verifyBotTrades(bottrades, 0, Number.MAX_SAFE_INTEGER, "withdraw");
    if (BotTradesError) {
        interaction.createMessage(BotTradesError);
        return;
    }
    const userId = interaction.member.id;
    const username = await db.getMadfutUserByDiscordUser(userId);
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    title: ` ${username}  You cannot withdraw because ${stResult.error}.`,
                    description: "```try ...  /mf force-end-trasaction-me```"
                }
            ]
        });
        return;
    }
    try {
        await interaction.acknowledge();
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "```There is no MADFUT account linked to your Discord account so you cannot withdraw. To link one, use `/madfut link <username>````."
                    }
                ]
            });
            return;
        }
        const wallet = await db.getWallet(userId);
       
        if (type === "packs") {
            await withdrawBotTradesPacks(interaction, userId, username, bottrades, verifyBotWallet(wallet, bottrades, "withdraw", "your"));
        }
        if (type === "cards") {
            await withdrawBotTradesCards(interaction, userId, username, bottrades, verifyBotWallet(wallet, bottrades, "withdraw", "your"));
        }
    } finally{
        db.endTransaction(userId);
    }
});





const moneyChannels = [
    config.commandsChannelId,
    config.tradingChannelId
];
const Adminchannel = [
    config.adminChannelId,
    config.commandsChannelId,
    config.tradingChannelId
];
const moneyChannelsMention = `<#${moneyChannels[0]}> or <#${moneyChannels[1]}>`;
//level command
let codeDuration;
let rawCodeDuration;
let codeEndTimeout;
let test = 0;
async function codeUnlimited(codename, username) {
    let madfutClient = await madfutclient();
    let ftRunning = "2";
    const dbDuration = await db.getCodeDuration(username);
    botintervalfunc();
    async function botintervalfunc() {
        for(let i = 0; i < 1;){
            let tradeRef;
            if (ftRunning === "1") {
                return;
            }
            try {
                tradeRef = await madfutClient.inviteUser(username, `${generateString(10)}`);
            //console.log(`${username} accepted invite.`);
            } catch  {
                console.log(`${username} rejected invite.`);
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: false, //profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: packs1
                    })
                );
                console.log(`Completed trade with ${username} using bot code ${codename}`);
                //console.log(`Completed trade with ${userId}`);
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(async ()=>{
                    if (dbDuration.toString() > Math.round(Date.now() / 1000).toString()) {
                        ftRunning = "2";
                        botintervalfunc();
                    } else {
                        await db.runPromise(`DELETE FROM code WHERE codename = "${codename}"`);
                        console.log(`${codename} expired, successfully removed from db`);
                        return;
                    }
                }, 10000);
            } catch (_err) {
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
    }
//}
}
async function codeTrade(username, codename, duration) {
    let madfutClient = await madfutclient();
    try {
        madfutClient.addInviteListener((async (getInviter) => {
            console.log(`${getInviter} invite the code ${codename}`);
            await codeUnlimited(codename, username);
     }),codename);
        console.log(`Added bot code!`);
    } catch (_err) {
        console.log("error");
    }
}
let matchStartTimeout;
let matchMessage;
let invitemessage;
bot.on("invite", async (interaction, amount, packs, username, coins)=>{
    if (packs.length > 3) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: "```Ã¢ÂÅ’ You can't pick more than 3 packs.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    const usernameMe = await db.getMadfutUserByDiscordUser(interaction.member.id);
    if (!usernameMe) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: "```Ã¢ÂÅ’ You have not linked your Madfut account.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    // const stResult = db.startTransaction(interaction.member!.id);
    //     if (!stResult.success) {
    //     interaction.createMessage({embeds: [
    //         {
    //             color: 15158332,
    //             description: "Ã¢ÂÅ’ You have a ongoing transaction."
    //         }
    //     ],
    //     flags: Constants.MessageFlags.EPHEMERAL
    // });
    //     return;
    // }
    const invatation = await interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                title: `${username}`,
                description: "```You have been invited on madfut. Accept the invite and do the trade. After the acception you have to click on the button if the pack was correct or wrong.\nYou have 1 minute to accept the trade, otherwise you have to do the command again.```"
            }
        ]
    });
    // for (let i = 0; i < 1;) {
    //     let tradeRef;
    //     try {
    //         tradeRef = await madfutClient.inviteWithTimeout(usernameMe, 60000, `${generateString(10)}`);
    //         console.log(`${usernameMe} accepted invite.`);
    //     } catch {
    //         console.log(`${usernameMe} rejected invite.`);
    //         continue;
    //     }
    //     try {
    //         await madfutClient.doTrade(tradeRef, async (profile) => ({
    //             receiveCoins: false,
    //             receiveCards: false,
    //             receivePacks: false,
    //             giveCards: profile[ProfileProperty.wishList]?.slice(0, 0) as Max3Array<string> ?? [],
    //             giveCoins: coins,
    //             givePacks: packs ? packs.map(pack => ({pack, amount: 1})) as Max3Array<{pack: string, amount:number}> : packs
    //         }));
    //         invitemessage = await interaction.editOriginalMessage({
    //             embeds: [
    //                 {
    //                     color: 0x32A852,
    //                     description: `Click on the button below if the packs where correct or wrong`
    //                 }
    //             ],
    //             components: [
    //                 {
    //                     type: Constants.ComponentTypes.ACTION_ROW,
    //                     components: [
    //                         {
    //                             custom_id: "correct-packs",
    //                             type: Constants.ComponentTypes.BUTTON,
    //                             style: Constants.ButtonStyles.SUCCESS,
    //                             label: "Ã°Å¸â€˜Â"
    //                         },
    //                         {
    //                             custom_id: "wrong-packs",
    //                             type: Constants.ComponentTypes.BUTTON,
    //                             style: Constants.ButtonStyles.DANGER,
    //                             label: "Ã°Å¸â€˜Å½"
    //                         }
    //                     ]
    //                 }
    //             ],
    //         });
    //         console.log(`Completed trade with ${usernameMe}`);
    //         i++;
    //     } catch (err) {
    //         console.log(`Trade with ${usernameMe} failed: Player left`);
    //         i++;
    //         invitemessage = await interaction.editOriginalMessage({
    //             embeds: [
    //                 {
    //                     color: 15158332,
    //                     description: `You left the trade. This can mean that the packs where wrong. Use the command again and change the packs`
    //                 }
    //             ]
    //         });
    //     }
    // }
    // const messageId = (await interaction.getOriginalMessage()).id;
    // bot.setPermittedReact(messageId, interaction.member!.id);
    // const result = await Promise.race([once(bot, "invitepacks" + messageId), sleep(30000)]);
    // bot.removeAllListeners("invitepacks" + messageId);
    // await bot.editMessage(invitemessage.channel.id, invitemessage.id, {
    //     components: []
    // });
    // if (!result) {
    //     await interaction.editMessage(invitemessage.id, {
    //         embeds: [
    //             {
    //                 color: 15158332, 
    //                 description: "You didn't answer the buttons in time so the trades will be canceld"
    //             }
    //         ],
    //     });
    //     return;
    // }
    // const [reactInteraction, reaction] = result as [ComponentInteraction, boolean];
    // reactInteraction.acknowledge();
    // if (!reaction) { // declined
    //     await interaction.editMessage(invitemessage.id, {
    //         embeds: [
    //             {
    //                 color: 15158332, 
    //                 description: "The packs where wrong. The user you want to sent the trades to, doesn't get the invites now. Use the command again and change the packs"
    //             }
    //         ],
    //     });
    //     return;
    // }
    // if (reaction) {
    //     await interaction.editMessage(invitemessage.id, {
    //         embeds: [
    //             {
    //                 color: 0x32A852, 
    //                 description: `The Madfut user \`${username}\` have successfully received \`${amount}\` trades with \`${coins}\` coins and the packs you've chosen.`
    //             }
    //         ]
    //     });
    freetradepacks(interaction, username, amount, coins, packs ? packs.map((pack)=>({
            pack,
            amount: 1
        })
    ) : packs);
//}
});
bot.on("end-transaction", (interaction, userId)=>{
    db.endTransaction(userId);
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                title: `<@${userId}>`,
                description: "```Ã¢Å“â€¦ Successfully force-ended all transactions```"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} force-ended the transactions from ${userId}`);
});

bot.on("pay", async (interaction, otherUserId, coins, cards, packs, bottrades, ultimatespins)=>{
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    const spinsError = verifyUltimateSpins(ultimatespins, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (spinsError) {
        interaction.createMessage(spinsError);
        return;
    }
    const botTradesError = verifyBotTrades(bottrades, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (botTradesError) {
        interaction.createMessage(botTradesError);
        return;
    }
    const userId = interaction.member.id;
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    title: ` ${userId} You cannot pay because ${stResult.error}.`,
                    description: "``` try again later ```"
                }
            ]
        });
        return;
    }
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "```The user you want to pay have a ongoing transaction, so you can't pay him right now.```"
                }
            ]
        });
        db.endTransaction(userId);
        return;
    }
    try {
        await interaction.acknowledge();
        const wallet = await db.getWallet(userId);
        const spins = await db.getUltimateSpins(userId);
        const walletVerification = verifyWallet(wallet, coins, cards, packs, "pay", "your");
        const botWalletVerification = verifyBotWallet(wallet, bottrades, "pay", "your");
        const spinsWalletVerification = verifyUltimateSpinsWallet(spins, ultimatespins, "pay", "your");
        if (!walletVerification.success) {
            interaction.editOriginalMessage(walletVerification.failureMessage);
            return;
        }
        if (!spinsWalletVerification.success) {
            interaction.editOriginalMessage(spinsWalletVerification.failureMessage);
            return;
        }
        if (!botWalletVerification.success) {
            interaction.editOriginalMessage(botWalletVerification.failureMessage);
            return;
        }
        const { finalCards , finalPacks  } = walletVerification;
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "```There is no MADFUT account linked to your Discord account so you cannot pay. To link one, use `/madfut link <username>`.```"
                    }
                ]
            });
            return;
        }
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "```The user you want to pay have not linked their MADFUT account to his Discord account so you can't pay him. To link one, use `/madfut link <username>`.```"
                    }
                ]
            });
            return;
        }
        const transactions = [];
        transactions.push(db.removeBotTrades(userId, bottrades));
        transactions.push(db.addBotTrades(otherUserId, bottrades));
        transactions.push(db.addCoins(userId, -coins));
        transactions.push(db.addCoins(otherUserId, coins));
        transactions.push(db.removeUltimateSpins(userId, ultimatespins));
        transactions.push(db.addUltimateSpins(otherUserId, ultimatespins));
        for (const card of finalCards){
            transactions.push(db.addCards(otherUserId, card.id, card.amount));
            transactions.push(db.addCards(userId, card.id, -card.amount));
        }
        for (const pack of finalPacks){
            transactions.push(db.addPacks(otherUserId, pack.id, pack.amount));
            transactions.push(db.addPacks(userId, pack.id, -pack.amount));
        }
        await Promise.all(transactions);
    } finally{
        db.endTransaction(userId);
        db.endTransaction(otherUserId);
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                description: `Ã¢Å“â€¦ Your payment to <@${otherUserId}> was successful.`
            }
        ]
    });
});
bot.on("admin-pay", async (interaction, otherUserId, coins, cards, packs, bottrades, ultimatespins)=>{
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    const spinsError = verifyUltimateSpins(ultimatespins, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (spinsError) {
        interaction.createMessage(spinsError);
        return;
    }
    const botTradesError = verifyBotTrades(bottrades, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (botTradesError) {
        interaction.createMessage(botTradesError);
        return;
    }
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "```The user you want to pay have a ongoing transaction, so you can't pay him right now.```"
                }
            ]
        });
        return;
    }
    try {
        await interaction.acknowledge();
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "```The user you want to pay have not linked their MADFUT account to his Discord account so you can't pay him. To link one, use `/madfut link <username>`.```"
                    }
                ]
            });
            return;
        }
        const transactions = [];
        transactions.push(db.addCoins(otherUserId, coins));
        transactions.push(db.addBotTrades(otherUserId, bottrades));
        transactions.push(db.addUltimateSpins(otherUserId, ultimatespins));
        for (const card of cards){
            const [cardId, cardAmount] = extractAmount(card);
            transactions.push(db.addCards(otherUserId, cardId, cardAmount));
        }
        for (const pack of packs){
            const [packId, packAmount] = extractAmount(pack);
            transactions.push(db.addPacks(otherUserId, packId, packAmount));
        }
        await Promise.all(transactions);
    } finally{
        db.endTransaction(otherUserId);
    }
    const username = await db.getMadfutUserByDiscordUser(otherUserId);
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                title: `Your admin payment was sent to ${username}`,
                description: "```Ã¢Å“â€¦ Your admin payment was successful Ã¢Å“â€¦```"
            }
        ]
    });
});
bot.on("remove", async (interaction, otherUserId, coins, cards, packs, bottrades, ultimatespins)=>{
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "```The user you want to remove items from have a ongoing transaction, so you can't remove items from him right now.```"
                }
            ]
        });
        return;
    }
    try {
        await interaction.acknowledge();
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "```The user you want to remove items from have not linked their MADFUT account to his Discord account so you can't remove items from him. To link one, use `/madfut link <username>`.```"
                    }
                ]
            });
            return;
        }
        const wallet = await db.getWallet(otherUserId);
        const walletVerification = verifyWallet(wallet, coins, cards, packs, "remove", "the other user's");
        const botWalletVerification = verifyBotWallet(wallet, bottrades, "remove", "the other user's");
        const spins = verifyUltimateSpins(otherUserId);
        const spinsWalletVerification = verifyUltimateSpinsWallet(spins, ultimatespins, "remove", "the other user's");
        if (!walletVerification.success) {
            interaction.editOriginalMessage(walletVerification.failureMessage);
            return;
        }
        if (!botWalletVerification.success) {
            interaction.editOriginalMessage(botWalletVerification.failureMessage);
            return;
        }
        if (!spinsWalletVerification.success) {
            interaction.editOriginalMessage(spinsWalletVerification.failureMessage);
            return;
        }
        const { finalCards , finalPacks  } = walletVerification;
        const transactions = [];
        transactions.push(db.addCoins(otherUserId, -wallet.coins));
        transactions.push(db.addBotTrades(otherUserId, -wallet.bottrades));
        transactions.push(db.removeUltimateSpins(otherUserId, spins));
        for (const card of wallet.cards){
            transactions.push(db.addCards(otherUserId, card.id, -card.amount));
        }
        for (const pack of wallet.packs){
            transactions.push(db.addPacks(otherUserId, pack.id, -pack.amount));
        }
        await Promise.all(transactions);
    } finally{
        db.endTransaction(otherUserId);
    }
    const username = await db.getMadfutUserByDiscordUser(otherUserId);
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                title: `Admin remove from  ${username}`,
                description: "```Ã¢Å“â€¦ removed all users items Ã¢Å“â€¦```"
            }
        ]
    });
});
bot.on("trade", async (interaction, otherUserId, givingCoins, givingCards, givingPacks, givingBotTrades, givingUltimateSpins, receivingCoins, receivingCards, receivingPacks, receivingBotTrades,  receivingUltimateSpins)=>{
    let coinsError = verifyCoins(givingCoins, 0, Number.MAX_SAFE_INTEGER, "give");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    coinsError = verifyCoins(receivingCoins, 0, Number.MAX_SAFE_INTEGER, "receive");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    let spinsError = verifyUltimateSpins(givingUltimateSpins, 0, Number.MAX_SAFE_INTEGER, "give");
    if (spinsError) {
        interaction.createMessage(spinsError);
        return;
    }
    spinsError = verifyUltimateSpins(receivingUltimateSpins, 0, Number.MAX_SAFE_INTEGER, "receive");
    if (spinsError) {
        interaction.createMessage(spinsError);
        return;
    }
    let botTradesError = verifyBotTrades(givingBotTrades, 0, Number.MAX_SAFE_INTEGER, "give");
    if (botTradesError) {
        interaction.createMessage(botTradesError);
        return;
    }
    botTradesError = verifyBotTrades(receivingBotTrades, 0, Number.MAX_SAFE_INTEGER, "receive");
    if (botTradesError) {
        interaction.createMessage(botTradesError);
        return;
    }
    if (givingCoins !== 0 && receivingCoins !== 0) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "```You cannot both give and receive coins at the same time.```"
                }
            ]
        });
        return;
    }
    if (givingUltimateSpins !== 0 && receivingUltimateSpins !== 0) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "```You cannot both give and receive Ultimate Spins at the same time.```"
                }
            ]
        });
        return;
    }
    if (givingBotTrades !== 0 && receivingBotTrades !== 0) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "```You cannot both give and receive bot trades at the same time.```"
                }
            ]
        });
        return;
    }
    
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const myWallet = await db.getWallet(userId);
    const spins = await db.getUltimateSpins(userId);
    const myWalletVerification = verifyWallet(myWallet, givingCoins, givingCards, givingPacks, "give", "your");
    const myBotWalletVerification = verifyBotWallet(myWallet, givingBotTrades, "give", "your");
    const spinsVerification = verifyUltimateSpinsWallet(spins, givingUltimateSpins, "give", "your");
    
    if (!myWalletVerification.success) {
        interaction.editOriginalMessage(myWalletVerification.failureMessage);
        return;
    }
    if (!myBotWalletVerification.success) {
        interaction.editOriginalMessage(myBotWalletVerification.failureMessage);
        return;
    }
    if (!spinsVerification.success) {
        interaction.editOriginalMessage(spinsVerification.failureMessage);
        return;
    }
    
    const { finalCards: myFinalCards , finalPacks: myFinalPacks  } = myWalletVerification;
    const otherWallet = await db.getWallet(otherUserId);
    const otherSpins = await db.getUltimateSpins(otherUserId);
    const otherWalletVerification = verifyWallet(otherWallet, receivingCoins, receivingCards, receivingPacks, "receive", "the other user's");
    const otherBotWalletVerification = verifyBotWallet(otherWallet, receivingBotTrades, "receive", "the other user's");
    //const otherSpinsVerification = verifyUltimateSpins(otherSpins, receivingUltimateSpins, "receive", "the other user's");
    const otherUltimateSpinsWalletVerification = verifyUltimateSpinsWallet(otherSpins, receivingUltimateSpins, "receive", "the other user's");
    
    if (!otherWalletVerification.success) {
        interaction.editOriginalMessage(otherWalletVerification.failureMessage);
        return;
    }
    if (!otherBotWalletVerification.success) {
        interaction.editOriginalMessage(otherBotWalletVerification.failureMessage);
        return;
    }
    if (!otherUltimateSpinsWalletVerification.success) {
        interaction.editOriginalMessage(otherUltimateSpinsWalletVerification.failureMessage);
        return;
    }
    
    const { finalCards: otherFinalCards , finalPacks: otherFinalPacks  } = otherWalletVerification;
    const msg = {
        embeds: [
            {
                color: 3319890,
                author: {
                    name: "```Trade Request```",
                    icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Human-emblem-handshake.svg/240px-Human-emblem-handshake.svg.png"
                },
                description: `<@${otherUserId}>, <@${userId}> wants to trade with you. You have 1 minute to accept.`,
                fields: [
                    {
                        name: "<:mf_coin:1091620280641781860> Coins",
                        value: `You will *${givingCoins === 0 ? "give* **" + formatNum(receivingCoins) : "receive* **" + formatNum(givingCoins)} coins**.`
                    },
                    {
                        name: "<:bot:1092408307978870934> Bot Trades",
                        value: `You will *${givingBotTrades === 0 ? "give* **" + formatNum(receivingBotTrades) : "receive* **" + formatNum(givingBotTrades)} bot-trades**.`
                    },
                    {
                        name: "<:xi_token:1092182349652963357> Ultimate Spins",
                        value: `You will *${givingUltimateSpins === 0 ? "give* **" + formatNum(receivingUltimateSpins) : "receive* **" + formatNum(givingUltimateSpins)} Ultimate Spins**.`
                    },
                    {
                        name: "<:xi_best_mf:1092182117116559480> Cards you will receive",
                        value: myFinalCards.size === 0 ? "No cards." : myFinalCards.map((card)=>`${card.amount}x **${card.displayName}**`
                        ).join("\n")
                    },
                    {
                        name: "<a:animatedpacks:1092408383090479114> Packs you will receive",
                        value: myFinalPacks.size === 0 ? "No packs." : myFinalPacks.map((pack)=>`${pack.amount}x **${pack.displayName}**`
                        ).join("\n")
                    },
                    {
                        name: "<:xi_best_mf:1092182117116559480> Cards you will give",
                        value: otherFinalCards.size === 0 ? "No cards." : otherFinalCards.map((card)=>`${card.amount}x **${card.displayName}**`
                        ).join("\n")
                    },
                    {
                        name:"<a:animatedpacks:1092408383090479114> Packs you will give",
                        value: otherFinalPacks.size === 0 ? "No packs." : otherFinalPacks.map((pack)=>`${pack.amount}x **${pack.displayName}**`
                        ).join("\n")
                    }
                ]
            }
        ],
        components: [
            {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: [
                    {
                        custom_id: "trade-confirm",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.SUCCESS,
                        label: "Confirm"
                    },
                    {
                        custom_id: "trade-decline",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.DANGER,
                        label: "Decline"
                    }
                ]
            }
        ]
    };
    interaction.createMessage(msg);
    const messageId = (await interaction.getOriginalMessage()).id;
    bot.setPermittedReact(messageId, otherUserId);
    const result = await Promise.race([
        once(bot, "tradereact" + messageId),
        sleep(60000)
    ]);
    bot.removeAllListeners("tradereact" + messageId);
    msg.components = [];
    if (!result) {
        msg.embeds[0].footer = {
            text: "This trade request has expired."
        };
        interaction.editOriginalMessage(msg);
        return;
    }
    const [reactInteraction, reaction] = result;
    reactInteraction.acknowledge();
    if (!reaction) {
        msg.embeds[0].footer = {
            text: "This trade request has been declined."
        };
        interaction.editOriginalMessage(msg);
        return;
    }
    interaction.editOriginalMessage(msg);
    // trade request accepted
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createFollowup(stResult.globalError ? `You cannot trade because ${stResult.error}.` : `You cannot trade because <@${userId}> has an ongoing transaction.`);
        return;
    }
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createFollowup(stResult2.globalError ? `You cannot trade because ${stResult2.error}.` : `You cannot trade because <@${otherUserId}> has an ongoing transaction.`);
        db.endTransaction(userId);
        return;
    }
    try {
        const myWalletVerification2 = verifyWallet(await db.getWallet(userId), givingCoins, givingCards, givingPacks, "receive", `<@${userId}>'s`);
        const myBotWalletVerification2 = verifyBotWallet(await db.getWallet(userId), givingBotTrades, "receive", `<@${userId}>'s`); // TODO: name collisions could cause success even if the user doesn't have the original packs
        if (!myWalletVerification2.success) {
            interaction.createFollowup(myWalletVerification2.failureMessage);
            return;
        }
        if (!myBotWalletVerification2.success) {
            interaction.createFollowup(myBotWalletVerification2.failureMessage);
            return;
        }
        const otherWalletVerification2 = verifyWallet(await db.getWallet(otherUserId), receivingCoins, receivingCards, receivingPacks, "give", `<@${otherUserId}>'s`);
        const otherBotWalletVerification2 = verifyBotWallet(await db.getWallet(otherUserId), receivingBotTrades, "give", `<@${otherUserId}>'s`);
        if (!otherWalletVerification2.success) {
            interaction.createFollowup(otherWalletVerification2.failureMessage);
            return;
        }
        if (!otherBotWalletVerification2.success) {
            interaction.createFollowup(otherBotWalletVerification2.failureMessage);
            return;
        }
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `Trade failed as there is no MADFUT username linked to <@${userId}>'s Discord account. To link one, use \`/madfut link <username>\`.`
                    }
                ]
            });
            return;
        }
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `Trade failed as there is no MADFUT username linked to <@${otherUserId}>'s Discord account. To link one, use \`/madfut link <username>\`.`
                    }
                ]
            });
            return;
        }
        const transactions = [];
        transactions.push(db.addBotTrades(userId, receivingBotTrades - givingBotTrades));
        transactions.push(db.addBotTrades(otherUserId, givingBotTrades - receivingBotTrades));
        transactions.push(db.addUltimateSpins(userId, receivingUltimateSpins - givingUltimateSpins));
        transactions.push(db.addUltimateSpins(otherUserId, givingUltimateSpins - receivingUltimateSpins));
        transactions.push(db.addCoins(userId, receivingCoins - givingCoins));
        transactions.push(db.addCoins(otherUserId, givingCoins - receivingCoins));
        for (const card of myFinalCards){
            transactions.push(db.addCards(otherUserId, card.id, card.amount));
            transactions.push(db.addCards(userId, card.id, -card.amount));
        }
        for (const card2 of otherFinalCards){
            transactions.push(db.addCards(userId, card2.id, card2.amount));
            transactions.push(db.addCards(otherUserId, card2.id, -card2.amount));
        }
        for (const pack of myFinalPacks){
            transactions.push(db.addPacks(otherUserId, pack.id, pack.amount));
            transactions.push(db.addPacks(userId, pack.id, -pack.amount));
        }
        for (const pack2 of otherFinalPacks){
            transactions.push(db.addPacks(userId, pack2.id, pack2.amount));
            transactions.push(db.addPacks(otherUserId, pack2.id, -pack2.amount));
        }
        await Promise.all(transactions);
    } finally{
        db.endTransaction(userId);
        db.endTransaction(otherUserId);
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                description: `Ã¢Å“â€¦ Trade between <@${userId}> and <@${otherUserId}> was successful.`
            }
        ]
    });
});
bot.on("flip", async (interaction, coins, heads, otherUserId)=>{
    const flipResult = getRandomInt(2) === 0;
    const iWin = flipResult === heads;
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "flip for");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const myWalletVerification = verifyWallet(await db.getWallet(userId), coins, [], [], "flip for", "your");
    if (!myWalletVerification.success) {
        interaction.editOriginalMessage(myWalletVerification.failureMessage);
        return;
    }
    const openFlip = !otherUserId;
    if (!openFlip) {
        const otherWalletVerification = verifyWallet(await db.getWallet(otherUserId), coins, [], [], "flip for", "the other user's");
        if (!otherWalletVerification.success) {
            interaction.editOriginalMessage(otherWalletVerification.failureMessage);
            return;
        }
    }
    const msg = {
        embeds: [
            {
                description: `${openFlip ? "Does anyone" : `<@${otherUserId}>, do you`} want to coin flip with <@${userId}> for **${formatNum(coins)} coins**? They chose **${heads ? "heads" : "tails"}**.`,
                color: 16114498,
                author: {
                    name: "Coin flip",
                    icon_url: "https://w7.pngwing.com/pngs/191/349/png-transparent-dogecoin-bitcoin-cryptocurrency-exchange-bitcoin-dog-like-mammal-meme-bitcoin.png"
                },
                footer: {
                    text: "You have 30 seconds to respond."
                }
            }
        ],
        components: [
            {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: openFlip ? [
                    {
                        custom_id: "flip-confirm",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.SUCCESS,
                        label: "Confirm"
                    }
                ] : [
                    {
                        custom_id: "flip-confirm",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.SUCCESS,
                        label: "Confirm"
                    },
                    {
                        custom_id: "flip-decline",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.DANGER,
                        label: "Decline"
                    }
                ]
            }
        ]
    };
    interaction.createMessage(msg);
    const messageId = (await interaction.getOriginalMessage()).id;
    bot.setPermittedReact(messageId, otherUserId ?? true);
    const result = await Promise.race([
        once(bot, "flipreact" + messageId),
        sleep(30000)
    ]);
    bot.removeAllListeners("flipreact" + messageId);
    msg.components = [];
    if (!result) {
        msg.embeds[0].footer = {
            text: "This coin flip request has expired."
        };
        interaction.editOriginalMessage(msg);
        return;
    }
    const [reactInteraction, reaction] = result;
    reactInteraction.acknowledge();
    otherUserId = reactInteraction.member.id;
    if (!reaction) {
        msg.embeds[0].footer = {
            text: "This coin flip request has been declined."
        };
        interaction.editOriginalMessage(msg);
        return;
    }
    interaction.editOriginalMessage(msg);
    // flip request accepted
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    description: stResult.globalError ? `You cannot flip because ${stResult.error}.` : `You cannot flip because <@${userId}> has an ongoing transaction.`
                }
            ]
        });
        return;
    }
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    description: stResult2.globalError ? `You cannot flip because ${stResult2.error}.` : `You cannot flip because <@${otherUserId}> has an ongoing transaction.`
                }
            ]
        });
        db.endTransaction(userId);
        return;
    }
    try {
        const myWalletVerification2 = verifyWallet(await db.getWallet(userId), coins, [], [], "flip for", `<@${userId}>'s`);
        if (!myWalletVerification2.success) {
            interaction.createFollowup(myWalletVerification2.failureMessage);
            return;
        }
        const otherWalletVerification2 = verifyWallet(await db.getWallet(otherUserId), coins, [], [], "flip for", `<@${otherUserId}>'s`);
        if (!otherWalletVerification2.success) {
            interaction.createFollowup(otherWalletVerification2.failureMessage);
            return;
        }
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `Coin flip failed as there is no MADFUT username linked to <@${userId}>'s Discord account. To link one, use \`/madfut link <username>\`.`
                    }
                ]
            });
            return;
        }
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `Coin flip failed as there is no MADFUT username linked to <@${otherUserId}>'s Discord account. To link one, use \`/madfut link <username>\`.`
                    }
                ]
            });
            return;
        }
        const transactions = [];
        transactions.push(db.addCoins(userId, iWin ? coins : -coins));
        transactions.push(db.addCoins(otherUserId, iWin ? -coins : coins));
        await Promise.all(transactions);
    } finally{
        db.endTransaction(userId);
        db.endTransaction(otherUserId);
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 16114498,
                author: {
                    name: "Coin flip",
                    icon_url: "https://w7.pngwing.com/pngs/191/349/png-transparent-dogecoin-bitcoin-cryptocurrency-exchange-bitcoin-dog-like-mammal-meme-bitcoin.png"
                },
                description: `**${flipResult ? "Heads" : "Tails"}**! <@${iWin ? userId : otherUserId}> won the coin flip against <@${iWin ? otherUserId : userId}> for **${formatNum(coins)} coins**.`
            }
        ]
    });
});
const allowedPacks = [
    "silver_special",
    "bf_nine_special",
    "bf_five_special",
    "totw",
    "fatal_rare",
    "bf_93_special",
    "bf_95_special",
    "fatal_special",
    "double_special",
    "triple_special",
    "gold",
    "random",
    "gold_super",
    "rare",
    "bf_94_special",
    "bf_eight_special",
    "free",
    "silver_plus",
    "no_totw_special",
    "fatal_silver",
    "85_special",
    "bf_89_special",
    "bf_88_special",
    "bf_four_special",
    "bf_seven_special",
    "gold_mega",
    "special",
    "rainbow",
    "bf_six_special",
    "bf_92_special",
    "80+",
    "bf_86_special",
    "fatal_nonrare",
    "bf_91_special",
    "bf_87_special",
    "silver",
    "op_special",
    "bf_90_special",
    "fatal_rare_silver",
    "pp_sbc_real_madrid_icons",
    "pp_new_87_91",
    "pp_fut_champs",
    "pp_new_81_84",
    "pp_special",
    "pp_special_88_92",
    "pp_best_1",
    "pp_new_83_86",
    "pp_new_77_82",
    "pp_new_85_88",
    "pp_bad_1",
    "pp_totw",
    "pp_new_special",
    "pp_icons_86_92",
    "pp_mega",
    "pp_good_1",
    "pp_icon",
    "pp_special_83_86",
    "pp_special_81_84",
    "pp_special_85_88",
    "pp_special_86_89"
];
bot.on("invme", async (interaction, coins, myPacks)=>{
    const userId = interaction.member.id;
    if (myPacks) {
        if (myPacks.length > 3) {
            interaction.createMessage({
                embeds: [
                    {
                        color: 15417396,
                        description: `Ã¢ÂÅ’ You can't pick more than 3 packs.`
                    }
                ],
                flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
        }
        for (const pack of myPacks){
            if (!allowedPacks.includes(pack)) {
                interaction.createMessage({
                    embeds: [
                        {
                            color: 15417396,
                            description: `Ã¢ÂÅ’ Invalid pack \`${pack}\`.`
                        }
                    ],
                    flags: Constants.MessageFlags.EPHEMERAL
                });
                return;
            }
        }
    }
    coins = Math.max(Math.min(coins, 10000000), 0);
    const username = await db.getMadfutUserByDiscordUser(userId);
    if (!username) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: "```Ã¢ÂÅ’ You have no MADFUT account linked.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: "```Ã¢Å“â€¦ Command successful.```"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    freeTradeUnlimited(username, coins, myPacks ? myPacks.map((pack)=>({
            pack,
            amount: 1
        })
    ) : packs1);
});
bot.on("setpacks", async (interaction, thepacks, type)=>{
    packs1 = thepacks.map((packname)=>({
            pack: packname,
            amount: 1
        })
    );
    //await db.setSetpacks(`{type}`, `${thepacks}`)
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: "```Ã¢Å“â€¦ Command successful.```"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} set the following packs to giveaways: ${thepacks}`);
});
bot.on("freetrade", async (interaction, amount, username, userId)=>{
    if (!username && !userId) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: "```Ã¢ÂÅ’ Enter either a username or a discord user.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    } else if (userId) {
        username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createMessage({
                embeds: [
                    {
                        color: 15417396,
                        description: "```Ã¢ÂÅ’ User does not have their MADFUT account linked.```"
                    }
                ],
                flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
        }
    }
    username = username;
    if (await freeTrade(username, amount) === null) interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: "```Ã¢ÂÅ’ Err.```"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    else interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: "```Ã¢Å“â€¦ Command successful.```"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
});



async function hourlyGiveaways() {
    
    giveawayMessage = await bot.sendMessage(config.autogiveawaysChannelId, {
    content: `<@&1093489286000693288>`,
    embeds: [
        {
            color: 3319890,
            author: {
                name: "Autmoatic Giveaway"
                
            },
            description: `Welcome to our hourly giveaway!\nThe prize now is 1mil coins. The winner will get paid automatticly in wallet **if you are linked**`
        }
    ]
    });
    await bot.react(giveawayMessage, "🎉");
    setTimeout(()=> {
        const reaction = bot.getReacts(giveawayMessage, "🎉");
        const reactionUsers = reaction.users.filter(user => !user.bot)

        if(reactionUsers.size > 0){
            const winner = reactionUsers.random()
            const winnerId = winner.id
            message.channel.send(`Winner: <@${winnerId}>! The price wont be in your wallet because we didnt code it yet`)
        
          } else {
            message.channel.send(`No winner! The automatc giveaway ended but no one likes free coins :(`)
          }
    }, 1000*15)
}



//let timer = setInterval(function() {
    //hourlyGiveaways();
    //console.log('automaitc giveaway started!');
  //}, 1000*60*1);
//
let giveawayRunning = false;
let giveawayStartTimeout;
let giveawayEndTimeout;
let giveawayDuration;
let rawGiveawayDuration;
let giveawayMessage;
bot.on("ga-forcestop", async (interaction)=>{
    giveawayEnd(interaction.channel.id);
    interaction.createMessage({
        content: "Force stop successful",
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} forcestoped the giveaway.`);
    return;
});
bot.on("ga-announce", async (interaction, start, duration)=>{
    if (isNaN(parseFloat(start))) {
        interaction.createMessage({
            content: "Enter a valid number of minutes for the start",
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    if (duration && isNaN(parseFloat(start))) {
        interaction.createMessage({
            content: "Enter a valid number of minutes for the duration",
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    const durationMinutes = duration ? parseFloat(duration) : undefined;
    rawGiveawayDuration = duration;
    giveawayDuration = durationMinutes ? durationMinutes * 60000 : undefined;
    const minutes = parseFloat(start);
    const startTime = Math.round(Date.now() / 1000 + minutes * 60);
    await interaction.createMessage({
        content: "Command successful",
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} has started a giveaway which will start in ${start} minute(s) and have a duration from ${duration} minute(s)`);
    const channelId = interaction.channel.id;
    giveawayMessage = await bot.sendMessage(channelId, {
        allowedMentions: {
            roles: [
                bot.config.giveawayPingRoleId
            ]
        },
        content: `<@&${bot.config.giveawayPingRoleId}>`,
        embeds: [
            {
                color: 3319890,
                author: {
                    name: "Ã°Å¸Å½â€° Bot Giveaway Ã°Å¸Å½â€°"
                    
                },
                description: `A giveaway for ${duration ? duration + " minutes long " : ""}will start in <t:${startTime}:R>!\n\nÃ¢Å¡Â Ã¯Â¸Â**Make sure to link your madfut account in <#${bot.config.commandsChannelId}>, otherwise you will not get invited!**Ã¢Å¡Â Ã¯Â¸Â\n\nClick on Ã°Å¸Å½â€° to enter the giveaway!`
            }
        ]
    });
    //`<@&${bot.config.giveawayPingRoleId}>, a ${duration ? duration + " minute long " : ""}giveaway is starting <t:${startTime}:R>!\n\nÃ¢Å¡Â Ã¯Â¸Â**Make sure to link your madfut account in <channel>, otherwise you will not get invited!**Ã¢Å¡Â Ã¯Â¸Â\nClick on the Ã°Å¸Å½â€° to enter the giveaway!`
    await bot.react(giveawayMessage, "Ã°Å¸Å½â€°");
    giveawayStartTimeout = setTimeout(()=>{
        giveawayStart();
    }, minutes * 60000);
    return;
});
bot.on("ga-forcestart", async (interaction)=>{
    giveawayStart();
    interaction.createMessage({
        content: "Force start successful",
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} forcestart a giveaway.`);
    return;
});
async function giveawayTrade(username) {
    let madfutClient = await madfutclient();
    const traderName2 = await madfutClient.returnUserInfo(username);
    console.log(traderName2);
    let ftRunning = "2";
    let times = 3;
    let count = 0;
    intervalfuncft();
    async function intervalfuncft() {
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `${generateString(8)}`);
                console.log(`${username} accepted invite.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${username} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: false, //profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: packs1
                    })
                );
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
async function giveawayStart() {
    if (giveawayStartTimeout) clearTimeout(giveawayStartTimeout);
    if (giveawayMessage) {
        await bot.editMessage(giveawayMessage.channel.id, giveawayMessage.id, {
            //content: `Signups for this giveaway are now closed. The giveaway will be starting shortly.`,
            embeds: [
                {
                    color: 15158332,
                    author: {
                        name: "Giveaway closed"
                    },
                    description: "The giveaway is closed, which means you can no longer participate in this giveaway. The giveaway will start soon."
                }
            ],
            components: []
        });
    }
    bot.removeAllListeners("giveawayjoin");
    giveawayRunning = true;
    const giveawaySignups = await db.getMadfutUsersByDiscordUsers(await bot.getReacts(giveawayMessage, "Ã°Å¸Å½â€°"));
    for (const username of giveawaySignups){
        console.log("signupper", username);
        await giveawayTrade(username);
    }
    await bot.sendMessage(giveawayMessage.channel.id, {
        allowedMentions: {
            roles: [
                bot.config.giveawayPingRoleId
            ]
        },
        content: `<@&${bot.config.giveawayPingRoleId}>`,
        embeds: [
            {
                color: 3319890,
                author: {
                    name: "Giveaway Started!"
                },
                description: `The ${rawGiveawayDuration ? rawGiveawayDuration + " minutes long " : ""}giveaway has started with **${giveawaySignups.length} people**! Look at your invites in madfut and trade as many times as you can!`
            }
        ]
    });
    if (giveawayDuration) {
        giveawayEndTimeout = setTimeout(()=>{
            giveawayEnd(giveawayMessage.channel.id);
        }, giveawayDuration);
    }
}
async function giveawayEnd(channelId) {
    giveawayRunning = false;
    if (giveawayEndTimeout) clearTimeout(giveawayEndTimeout);
    bot.sendMessage(channelId, {
        allowedMentions: {
            roles: [
                bot.config.giveawayPingRoleId
            ]
        },
        content: `<@&${bot.config.giveawayPingRoleId}>`,
        embeds: [
            {
                color: 22500,
                author: {
                    name: "Giveaway Ended"
                },
                description: "**The giveaway has ended!**\n\nIf you don't want to miss next time. Then go to the <#1091018436869640273> and grab your role!"
            }
        ]
    });
}
// madfutClient.addInviteListener((async (username1) => {
//     if (username1.startsWith("")) {
//         await freeTrade(username1, 10);
//     }
// }),);
console.log("Bot event listeners registered");
console.log("Started");
export { addListener };