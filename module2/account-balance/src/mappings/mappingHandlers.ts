import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {Account} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleEvent(event: SubstrateEvent): Promise<void> {

    const {event: {data: [account, balance]}} = event;
    
    let targetAccount = await Account.get(account.toString());
    if (!targetAccount) {
        targetAccount = new Account(event.extrinsic.block.block.header.hash.toString());
        targetAccount.account = account.toString();
        targetAccount.balance = (balance as Balance).toBigInt();
        targetAccount.lastDepositAmount = targetAccount.balance;
    } else {
        targetAccount.balance += (balance as Balance).toBigInt();
        targetAccount.lastDepositAmount = (balance as Balance).toBigInt();
    }
    await targetAccount.save();
}
