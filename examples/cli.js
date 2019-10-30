// var readlineSync = require('readline-sync');
// const { SeedTokenAPIClientEthereumETHPersonal } = require('../index.js')

// var argv = require('minimist')(process.argv.slice(2), {string: ['address', 'from', 'to', 'amount']});

// let st
// if (argv.ethpersonal) {
//     st = SeedTokenAPIClientEthereumETHPersonal.getInstance(argv.url)
// }

// if (argv['_'] == 'getbalance') {        
//     st.getBalance(argv.address).then((balance) => {
//         console.log(balance)
//     }).catch((e) => {
//         console.log(e)
//     })    
// } else if (argv['_'] == 'transfer') {
//     var passphrase = readlineSync.question('Pasphrase: ', {hideEchoBack: true});
//     st.transfer(argv.from, argv.to, argv.amount, passphrase).then((hash) => {
//         console.log('TX Hash: ' + hash)
//     }).catch((e) => {
//         console.log(e)
//     })    
// } else if (argv['_'] == 'createaccount') {
//     if (argv.ethpersonal) { //will ask for passphrase
//         var passphrase = readlineSync.question('New pasphrase: ', {hideEchoBack: true});
//             st.createAccount(passphrase).then((address) => {
//             console.log('Created address: ' + address)
//         }).catch((e) => {
//             console.log(e)
//         })    
//     }
// } else if (argv['_'] == 'getlasttransfers') {
//     let buffer = argv.buffer || 10
//     let timeout = argv.timeout || 5
//     let n = argv.n || 5
//     st.getLastNTransactions(argv.address, n, buffer, timeout, argv.since).then((txs) => {
//             console.log(txs)
//         }).catch((e) => {
//             console.log(e)
//         })    
// } else {
//     console.log(`Seed Token Manager
    
// Usage: nodejs cli.js <command> <options>

// Commands:
// createaddress:      Create a personal account. This will ask for a passphrase and returns the new address.

// getbalance:         Returns balance of an address.
//                     Options:
//                         --address   Address to get balance from

// transfer:           Makes a transfer from one address to another. This will ask for the 'from' address passphrase and returns the tx hash.
//                     Options:
//                         --from      Source address
//                         --to        Destination address
//                         --amount    Amount of tokens to be transfered

// getlasttransfers:   Returns last n transfers of specified address
//                     Options:
//                         --address   Address to get last transfers from
//                         --n         Quantity of tx to return (it will provide more if the library gets more in the same batch request) (default 5)
//                         --buffer    Buffer size of the batch request (default 10)
//                         --timeout   Time in seconds to timeout (default 5)
//                         --since     Date filter in Unix epoch time. Will stop searching for txs with date prior to specified date

// Mandatory global options:
//     --url           Node URL
//     --ethpersonal   Specifies to use ETH Personal module implementation


// Examples:
// nodejs cli.js getlasttransfers --url=http://127.0.0.1:8545 --ethpersonal --address=0x00a329c0648769A73afAc7F9381E08FB43dBEA72 --since=1569392358 --n=50 --buffer=100

// nodejs cli.js transfer --url=http://127.0.0.1:8545 --ethpersonal --from=0x00a329c0648769A73afAc7F9381E08FB43dBEA72 --to=0x00a329c0648769A73afAc7F9381E08FB43dBEA72 --amount 1

// nodejs cli.js createaccount --url=http://127.0.0.1:8545 --ethpersonal

// nodejs cli.js getbalance --url=http://127.0.0.1:8545 --ethpersonal --address=0x00a329c0648769A73afAc7F9381E08FB43dBEA72

// `)
// }
