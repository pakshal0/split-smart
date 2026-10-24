export function splitEqually(amountMinor, participantIds) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) throw new Error('Amount must be a positive whole number of minor currency units.');
  if (!Array.isArray(participantIds) || !participantIds.length || new Set(participantIds.map(String)).size !== participantIds.length) throw new Error('Choose at least one unique participant.');
  const base=Math.floor(amountMinor/participantIds.length), remainder=amountMinor%participantIds.length;
  return participantIds.map((user,index)=>({user,shareMinor:base+(index<remainder?1:0)}));
}
const idOf=value=>String(value?._id??value);
export function calculateBalances(members,expenses,settlements) {
 const map=new Map(members.map(m=>[idOf(m),0]));
 for(const e of expenses){const payer=idOf(e.paidBy);if(!map.has(payer))throw new Error('Expense payer is not a group member.'); map.set(payer,map.get(payer)+e.amountMinor);for(const s of e.splits){const participant=idOf(s.user);if(!map.has(participant))throw new Error('Expense participant is not a group member.');map.set(participant,map.get(participant)-s.shareMinor);}}
 for(const s of settlements){const sender=idOf(s.fromUser),recipient=idOf(s.toUser);if(!map.has(sender)||!map.has(recipient))throw new Error('Settlement users must be group members.');map.set(sender,map.get(sender)+s.amountMinor);map.set(recipient,map.get(recipient)-s.amountMinor);}
 const total=[...map.values()].reduce((a,b)=>a+b,0); if(total!==0)throw new Error('Group balances do not sum to zero.');return map;
}
export function simplifyDebts(balances){let creditors=[],debtors=[];for(const [user,amount] of balances){if(amount>0)creditors.push({user,amount});else if(amount<0)debtors.push({user,amount:-amount});}creditors.sort((a,b)=>a.user.localeCompare(b.user));debtors.sort((a,b)=>a.user.localeCompare(b.user));let out=[];let i=0,j=0;while(i<debtors.length&&j<creditors.length){const amount=Math.min(debtors[i].amount,creditors[j].amount);out.push({fromUser:debtors[i].user,toUser:creditors[j].user,amountMinor:amount});debtors[i].amount-=amount;creditors[j].amount-=amount;if(!debtors[i].amount)i++;if(!creditors[j].amount)j++;}return out;}
