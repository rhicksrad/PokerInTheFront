(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();var b=(e=>(e[e.Two=2]="Two",e[e.Three=3]="Three",e[e.Four=4]="Four",e[e.Five=5]="Five",e[e.Six=6]="Six",e[e.Seven=7]="Seven",e[e.Eight=8]="Eight",e[e.Nine=9]="Nine",e[e.Ten=10]="Ten",e[e.Jack=11]="Jack",e[e.Queen=12]="Queen",e[e.King=13]="King",e[e.Ace=14]="Ace",e))(b||{});function ye(e){let t=e>>>0||1;return{get seed(){return t},set seed(n){t=n>>>0||1},next(){t+=1831565813;let n=Math.imul(t^t>>>15,1|t);return n^=n+Math.imul(n^n>>>7,61|n),((n^n>>>14)>>>0)/4294967296}}}function ut(e,t,n){return Math.floor(e.next()*(n-t))+t}function ve(){const e=["C","D","H","S"],t=[];for(const n of e)for(let i=b.Two;i<=b.Ace;i++){const r=i;t.push({rank:r,suit:n,id:it(r)+n})}return t}function it(e){return e<=10?String(e):{[b.Jack]:"J",[b.Queen]:"Q",[b.King]:"K",[b.Ace]:"A"}[e]}function Ae(e,t){for(let n=e.length-1;n>0;n--){const i=ut(t,0,n+1);[e[n],e[i]]=[e[i],e[n]]}}function ae(e,t){return e.splice(0,t)}function ht(e){if(e.length!==52)return console.warn("⚠️ Deck integrity check failed: Expected 52 cards, got",e.length),!1;const t=new Set(e.map(i=>i.id));if(t.size!==52)return console.warn("⚠️ Deck integrity check failed: Duplicate cards detected"),!1;const n=["C","D","H","S"];for(const i of n)for(let r=b.Two;r<=b.Ace;r++){const s=it(r)+i;if(!t.has(s))return console.warn("⚠️ Deck integrity check failed: Missing card",s),!1}return!0}const ft={S:"♠️",H:"♥️",D:"♦️",C:"♣️"},pt={A:"A",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"10",J:"J",Q:"Q",K:"K"};function gt(e){let t,n;e.startsWith("10")?(t="10",n=e[2]):(t=e[0],n=e[1]);const i=pt[t]||t,r=ft[n]||n;return`${i}${r}`}function mt(e){return gt(e.id)}function X(e){return e.map(mt).join(" ")}function st(e){const t=Object.values(e.players),n=t.filter(l=>!l.isFolded&&!l.isAllIn&&!l.isBustedOut&&l.chips>0),i=t.filter(l=>!l.isFolded&&l.isAllIn&&!l.isBustedOut),r=t.filter(l=>l.isFolded),a=t.filter(l=>l.isBustedOut||l.chips<=0),s=t.filter(l=>!l.isFolded&&!l.isBustedOut),o=t.filter(l=>!l.isBustedOut);return{active:n,allIn:i,folded:r,busted:a,remaining:s,eligible:o}}function yt(e){const t=st(e);return t.remaining.length===1?t.remaining[0]:null}function vt(e){const t={};return Object.values(e).forEach(n=>{t[n.id]={...n,isFolded:!1,isAllIn:!1,hand:null}}),t}function bt(){const i=[0,1,2,3].map(a=>({index:a})),r={P0:{id:"P0",name:"You",isHuman:!0,seatIndex:0,chips:1e3,isFolded:!1,isAllIn:!1},P1:{id:"P1",name:"Silas McGraw",isHuman:!1,seatIndex:1,chips:1e3,isFolded:!1,isAllIn:!1},P2:{id:"P2",name:"Martha Jensen",isHuman:!1,seatIndex:2,chips:1e3,isFolded:!1,isAllIn:!1},P3:{id:"P3",name:"Samuel Whitmore",isHuman:!1,seatIndex:3,chips:1e3,isFolded:!1,isAllIn:!1}};return ve(),{handNumber:1,smallBlind:5,bigBlind:10,buttonIndex:0,seats:i,players:r,board:[],deck:[],pots:[],handContributions:{},round:void 0,phase:"Idle",rngSeed:42,devLog:["[dev] game initialized"]}}function ke(e){const t=Date.now()%1e6,n=ye(e.rngSeed+e.handNumber*1e3+t),i=ve();ht(i)||console.error("❌ Critical error: Deck integrity check failed in beginNewHand"),Ae(i,n),console.log(`🎴 Hand #${e.handNumber+1}: Fresh 52-card deck shuffled with seed ${n.seed}`);const r=e.handNumber===1?e.buttonIndex:(e.buttonIndex+1)%e.seats.length,a=(r+1)%e.seats.length,s=(r+2)%e.seats.length,o=[];o.push(`🃏 Hand #${e.handNumber+1} begins`);const l=Object.values(e.players).find(w=>w.seatIndex===r),d=Object.values(e.players).find(w=>w.seatIndex===a),u=Object.values(e.players).find(w=>w.seatIndex===s);l&&o.push(`🔘 ${l.name} is on the button`),d&&u&&o.push(`🏦 Blinds: ${d.name} ($${e.smallBlind}) • ${u.name} ($${e.bigBlind})`);const g=e.seats.map(w=>({...w,isButton:w.index===r,isSmallBlind:w.index===a,isBigBlind:w.index===s})),m=Object.values(e.players),c=new Map;for(const w of m)c.set(w.seatIndex,w);const f=vt(e.players);for(let w=0;w<2;w++)for(let I=0;I<g.length;I++){const B=c.get(I);if(!B)continue;const M=ae(i,1)[0],O=f[B.id].hand??{};f[B.id]={...f[B.id],hand:w===0?{c1:M}:{...O,c2:M}}}console.log(`🎴 Hand #${e.handNumber+1}: Dealt ${52-i.length} cards to players, ${i.length} remaining`),o.push(`🎯 Hole cards dealt to ${Object.keys(f).length} players`);const v={};let k={...f};const p=c.get(a),y=c.get(s);if(p){const w=Math.min(e.smallBlind,p.chips);k[p.id]={...k[p.id],chips:p.chips-w},v[p.id]=w}if(y){const w=Math.min(e.bigBlind,y.chips);k[y.id]={...k[y.id],chips:y.chips-w},v[y.id]=w+(v[y.id]??0)}const $=Object.values(v).reduce((w,I)=>w+I,0),C=(s+1)%g.length,h=[];for(let w=0;w<g.length;w++){const I=(C+w)%g.length,B=c.get(I);!B||B.isBustedOut||h.push(I)}return{...e,handNumber:e.handNumber+1,buttonIndex:r,seats:g,players:k,board:[],pots:$>0?[{amount:$,contributors:v,eligible:Object.keys(k)}]:[],handContributions:v,handSummary:void 0,round:{street:"Preflop",currentBet:e.bigBlind,minRaise:e.bigBlind,toActQueue:h,actions:[],committedThisStreet:v,currentTurnSeatIndex:h[0]??0,raisesThisStreet:0},phase:"Preflop",devLog:[...o,`[dev] Hand #${e.handNumber+1}: BTN=${r}, SB=${a}, BB=${s}`,...e.devLog].slice(0,50)}}function kt(e){const t=(e.buttonIndex+1)%e.seats.length,n=[];for(let i=0;i<e.seats.length;i++){const r=(t+i)%e.seats.length,a=Object.values(e.players).find(s=>s.seatIndex===r);!a||a.isFolded||a.isAllIn||a.isBustedOut||n.push(r)}return n}function ee(e){if(!e.round)return e;const t=e.round,n=[],i=st(e);i.active.length+i.allIn.length;const r=yt(e);if(r){const p=`🏆 ${r.name} wins by elimination - all other players folded!`;return{...e,phase:"Showdown",devLog:[p,"[dev] win by fold",...e.devLog].slice(0,50)}}if(i.active.length===0&&i.allIn.length>1)return console.log("🎰 All remaining players are all-in, going to showdown"),Qe(e,"[dev] all-in showdown");if(i.active.length===1&&i.allIn.length>0)return console.log("🎰 One active player, rest all-in, going to showdown"),Qe(e,"[dev] mixed showdown");if(!i.active.every(p=>(t.committedThisStreet[p.id]??0)>=t.currentBet)||t.toActQueue.length>0)return e;const s=`🔄 Street complete: ${t.street} -> advancing (queue empty, all matched)`;console.log(s);let o=e.board,l=t.street,d=e.phase;const u=Date.now()%1e6,g=ye(e.rngSeed+e.handNumber*1e3+o.length*100+u),m=ve(),c=new Set;Object.values(e.players).forEach(p=>{p.hand?.c1&&c.add(p.hand.c1.id),p.hand?.c2&&c.add(p.hand.c2.id)}),e.board.forEach(p=>c.add(p.id));const f=m.filter(p=>!c.has(p.id)),v=52-c.size;if(f.length!==v&&console.warn(`⚠️ Card count mismatch: Expected ${v} remaining cards, got ${f.length}`),Ae(f,g),console.log(`🎴 Street ${t.street}: Dealing from ${f.length} remaining cards with seed ${g.seed}`),t.street==="Preflop"){const p=ae(f,3);o=p,l="Flop",d="Flop";const y=`🎴 Flop revealed: ${X(p)}`;console.log(y),n.push(y),n.push(`💰 Pot: $${e.pots.reduce(($,C)=>$+C.amount,0)} • New betting round begins`)}else if(t.street==="Flop"){const p=ae(f,1)[0];o=[...e.board,p],l="Turn",d="Turn";const y=`🎴 Turn revealed: ${X([p])} • Board: ${X(o)}`;console.log(y),n.push(y),n.push(`💰 Pot: $${e.pots.reduce(($,C)=>$+C.amount,0)} • New betting round begins`)}else if(t.street==="Turn"){const p=ae(f,1)[0];o=[...e.board,p],l="River",d="River";const y=`🎴 River revealed: ${X([p])} • Final board: ${X(o)}`;console.log(y),n.push(y),n.push(`💰 Pot: $${e.pots.reduce(($,C)=>$+C.amount,0)} • Final betting round begins`)}else{const y=["🎰 All betting complete - going to showdown!",`🃏 ${Object.values(e.players).filter($=>!$.isFolded&&!$.isBustedOut).length} players remain with final board: ${X(e.board)}`];return{...e,phase:"Showdown",devLog:[...y,"[dev] showdown",...e.devLog].slice(0,50)}}const k=kt(e);return{...e,board:o,phase:d,round:{...t,street:l,currentBet:0,minRaise:e.bigBlind,committedThisStreet:{},toActQueue:k,currentTurnSeatIndex:k[0]??0,raisesThisStreet:0,actions:[]},devLog:[...n,`[dev] advance street -> ${l}`,...e.devLog].slice(0,50)}}function Qe(e,t){let n=[...e.board];const i=Date.now()%1e6,r=ye(e.rngSeed+e.handNumber*1e3+n.length*100+i),a=ve(),s=new Set;Object.values(e.players).forEach(u=>{u.hand?.c1&&s.add(u.hand.c1.id),u.hand?.c2&&s.add(u.hand.c2.id)}),e.board.forEach(u=>s.add(u.id));const o=a.filter(u=>!s.has(u.id)),l=52-s.size;o.length!==l&&console.warn(`⚠️ Showdown card count mismatch: Expected ${l} remaining cards, got ${o.length}`),Ae(o,r),console.log(`🎴 Showdown: Dealing from ${o.length} remaining cards with seed ${r.seed}`);const d=5-n.length;if(d>0){const u=ae(o,d);n=[...n,...u],console.log(`🎴 Showdown: Dealt ${d} additional cards: ${u.map(g=>g.id).join(", ")}`)}return{...e,board:n,phase:"Showdown",devLog:[t,...e.devLog].slice(0,50)}}function he(e){const t=Object.values(e.players).filter(a=>a.chips>0),n=Object.values(e.players).filter(a=>a.chips<=0);let i={...e.players};if(n.forEach(a=>{a.isBustedOut||(i[a.id]={...a,isBustedOut:!0,isFolded:!0,chips:0})}),Object.values(i).find(a=>a.seatIndex===0)?.isBustedOut){console.log("💀 Game Over! Human player busted out!");const a=Object.values(i).filter(o=>!o.isBustedOut),s=a.length>0?a.reduce((o,l)=>o.chips>l.chips?o:l):Object.values(i).find(o=>o.seatIndex!==0);return{...e,players:i,phase:"GameOver",winner:s?.id,devLog:[`💀 Human player busted out! ${s?.name||"Unknown"} wins!`,...e.devLog].slice(0,50)}}if(t.length<=1){const a=t[0];if(a)return console.log(`🏆 Game Over! ${a.name} wins the tournament!`),{...e,players:i,phase:"GameOver",winner:a.id,devLog:[`🏆 ${a.name} wins the tournament!`,...e.devLog].slice(0,50)}}if(e.phase==="Idle"&&n.length>0){const a=Object.values(i).filter(s=>!s.isBustedOut);if(a.length<2){const s=a[0];if(s)return console.log(`🏆 Game Over! ${s.name} wins the tournament!`),{...e,players:i,phase:"GameOver",winner:s.id,devLog:[`🏆 ${s.name} wins the tournament!`,...e.devLog].slice(0,50)}}}return{...e,players:i}}function wt(e){const t=Object.values(e.players).map(n=>({...n,chips:1e3,isBustedOut:!1,isFolded:!1,isAllIn:!1,hand:null,committedThisStreet:0}));return{...e,players:Object.fromEntries(t.map(n=>[n.id,n])),phase:"Idle",winner:null,handNumber:0,devLog:["🔄 Tournament reset - all players start with $1000",...e.devLog].slice(0,50)}}function Y(e,t){if(!e.round)return 0;const n=e.round.currentBet,i=e.round.committedThisStreet[t]??0;return Math.max(0,n-i)}function V(e,t){const n=new Set;if(!e.round)return n;const i=Object.values(e.players).find(o=>o.seatIndex===t);if(!i||i.isFolded||i.isAllIn)return n;const r=Y(e,i.id),s=e.round.raisesThisStreet<3;return r>0?(n.add("Fold"),i.chips>0&&n.add("Call"),i.chips>r&&s&&n.add("Raise")):(n.add("Check"),i.chips>0&&n.add("Bet")),n}function te(e,t){if(!e.round)return e;const n=e.round,i=Object.values(e.players).find(a=>a.seatIndex===t.seatIndex);if(!i)return e;function r(a,s){const o=[...n.toActQueue],l=s||e.players;if(a==="Fold"||a==="Call"||a==="Check"){const m=o.indexOf(n.currentTurnSeatIndex);m>=0&&o.splice(m,1)}if(a==="Bet"||a==="Raise"){const m=Object.values(l).filter(f=>!f.isFolded&&!f.isAllIn&&f.seatIndex!==n.currentTurnSeatIndex).map(f=>f.seatIndex),c=o.indexOf(n.currentTurnSeatIndex);c>=0&&o.splice(c,1);for(const f of m)o.includes(f)||o.push(f)}const d=o.filter(m=>{const c=Object.values(l).find(f=>f.seatIndex===m);return c&&!c.isAllIn&&!c.isFolded&&c.chips>0});if(d.length===0)return console.log("🎯 Queue empty after filtering - no more players to act"),{toActQueue:[],currentTurnSeatIndex:-1};let u=0;if(d.length>1){const m=d.indexOf(n.currentTurnSeatIndex);m>=0&&(u=(m+1)%d.length)}const g=d[u]??-1;return console.log(`🎯 Before ${a} - Queue: [${n.toActQueue.join(",")}], Current: ${t.seatIndex}`),console.log(`🎲 After ${a} - Queue: [${d.join(",")}], Next: ${g}`),{toActQueue:d,currentTurnSeatIndex:g}}if(t.type==="Fold"){const a={...e.players,[i.id]:{...i,isFolded:!0}},s=r("Fold");return{...e,players:a,round:{...n,toActQueue:s.toActQueue,currentTurnSeatIndex:s.currentTurnSeatIndex},devLog:[`${i.name} folded`,`[seat ${t.seatIndex}] Fold`,...e.devLog].slice(0,50)}}if(t.type==="Check"){const a=r("Check");return{...e,round:{...n,toActQueue:a.toActQueue,currentTurnSeatIndex:a.currentTurnSeatIndex},devLog:[`${i.name} checked`,`[seat ${t.seatIndex}] Check`,...e.devLog].slice(0,50)}}if(t.type==="Call"){const a=Y(e,i.id),s=Math.min(i.chips,a),o={...e.players,[i.id]:{...i,chips:i.chips-s,isAllIn:i.chips-s===0}},l={...n.committedThisStreet,[i.id]:(n.committedThisStreet[i.id]??0)+s},d={...e.handContributions,[i.id]:(e.handContributions[i.id]??0)+s},u=we(d,o),g=r("Call",o);return{...e,players:o,pots:u,handContributions:d,round:{...n,committedThisStreet:l,toActQueue:g.toActQueue,currentTurnSeatIndex:g.currentTurnSeatIndex},devLog:[`${i.name} called $${s}${s===i.chips+s?" (all-in)":""}`,`[seat ${t.seatIndex}] Call ${s}`,...e.devLog].slice(0,50)}}if(t.type==="Bet"){if(n.currentBet!==0)return ue(e,`illegal Bet: current bet already ${n.currentBet}`);const a=e.bigBlind,s=Math.max(0,Math.floor(t.amount)),o=Math.min(i.chips,s);if(o<a&&o<i.chips)return ue(e,`bet too small: ${s} (min ${a})`);const l={...e.players,[i.id]:{...i,chips:i.chips-o,isAllIn:i.chips-o===0}},d={...n.committedThisStreet,[i.id]:(n.committedThisStreet[i.id]??0)+o},u={...e.handContributions,[i.id]:(e.handContributions[i.id]??0)+o},g=we(u,l),{toActQueue:m,nextSeat:c}=Re(e,t.seatIndex,l);return{...e,players:l,pots:g,handContributions:u,round:{...n,committedThisStreet:d,currentBet:o,minRaise:o,toActQueue:m,currentTurnSeatIndex:c,raisesThisStreet:n.raisesThisStreet+1},devLog:[`${i.name} bet $${o}${l[i.id].isAllIn?" (all-in)":""}`,`[seat ${t.seatIndex}] Bet ${o} (aggressive action #${n.raisesThisStreet+1})`,...e.devLog].slice(0,50)}}if(t.type==="Raise"){const a=Y(e,i.id);if(a<=0)return ue(e,"illegal Raise: no bet to face");const s=Math.max(0,Math.floor(t.amount)),o=n.minRaise,l=Math.min(i.chips,a+s),d=l===i.chips;if(!d&&s<o)return ue(e,`raise too small: ${s} (min ${o})`);const u={...e.players,[i.id]:{...i,chips:i.chips-l,isAllIn:d}},g={...n.committedThisStreet,[i.id]:(n.committedThisStreet[i.id]??0)+l},m={...e.handContributions,[i.id]:(e.handContributions[i.id]??0)+l},c=we(m,u),f=g[i.id]??0,v=Math.max(n.currentBet,Math.min(f,n.currentBet+s)),k=d&&s<o?n.minRaise:s,{toActQueue:p,nextSeat:y}=Re(e,t.seatIndex,u);return{...e,players:u,pots:c,handContributions:m,round:{...n,committedThisStreet:g,currentBet:v,minRaise:k,toActQueue:p,currentTurnSeatIndex:y,raisesThisStreet:n.raisesThisStreet+1},devLog:[`${i.name} raised to $${v} (+$${s})${d?" (all-in)":""}`,`[seat ${t.seatIndex}] Raise ${s} (raise #${n.raisesThisStreet+1})`,...e.devLog].slice(0,50)}}return e}function ue(e,t){return{...e,devLog:[`[warn] ${t}`,...e.devLog].slice(0,50)}}function Re(e,t,n){const i=e.seats.map(o=>o.index),r=n||e.players;console.log(`🔄 Rebuilding queue after aggression from seat ${t}`);const a=[];for(let o=1;o<i.length;o++){const l=(t+o)%i.length,d=Object.values(r).find(u=>u.seatIndex===l);console.log(`🔍 Checking seat ${l}: ${d?.name||"empty"} - folded: ${d?.isFolded}, allIn: ${d?.isAllIn}`),!(!d||d.isFolded||d.isAllIn)&&(a.push(l),console.log(`✅ Added seat ${l} (${d.name}) to queue`))}const s=a[0]??-1;return console.log(`🎯 New queue: [${a.join(",")}], next seat: ${s}`),{toActQueue:a,nextSeat:s}}function we(e,t){const n=Object.keys(t).filter(s=>!t[s].isFolded),i=Array.from(new Set(n.map(s=>e[s]??0))).filter(s=>s>0).sort((s,o)=>s-o);let r=0;const a=[];for(const s of i){const o={};let l=0;const d=[];for(const u of n){const g=e[u]??0,m=Math.max(0,Math.min(g,s)-r);m>0&&(o[u]=m,l+=m,d.push(u))}l>0&&a.push({amount:l,contributors:o,eligible:d}),r=s}return a}const je={HighCard:0,OnePair:1,TwoPair:2,ThreeKind:3,Straight:4,Flush:5,FullHouse:6,FourKind:7,StraightFlush:8};function qe(e,t){const n=je[e.category],i=je[t.category];if(n!==i)return n-i;const r=Math.max(e.tiebreak.length,t.tiebreak.length);for(let a=0;a<r;a++){const s=e.tiebreak[a]??0,o=t.tiebreak[a]??0;if(s!==o)return s-o}return 0}function re(e){if(e.length!==7)throw new Error("evaluateBestOfSeven requires 7 cards");const t=new Map,n=new Map;for(const u of e){t.set(u.rank,(t.get(u.rank)??0)+1);const g=n.get(u.suit)??[];g.push(u),n.set(u.suit,g)}let i;for(const[u,g]of n.entries())if(g.length>=5){i=u;break}const r=Array.from(new Set(e.map(u=>u.rank))).sort((u,g)=>u-g),a=We(r);if(i){const u=Array.from(new Set((n.get(i)??[]).map(m=>m.rank))).sort((m,c)=>m-c),g=We(u);if(g>0)return{category:"StraightFlush",tiebreak:[g]}}const s=xt(t,4);if(s){const u=Ge(r,[s]);return{category:"FourKind",tiebreak:[s,u]}}const o=St(t,3);if(o.length){const u=Ke(t,o[0]);if(u.length)return{category:"FullHouse",tiebreak:[o[0],u[0]]};if(o.length>=2)return{category:"FullHouse",tiebreak:[o[0],o[1]]}}if(i)return{category:"Flush",tiebreak:(n.get(i)??[]).map(m=>m.rank).sort((m,c)=>c-m).slice(0,5)};if(a>0)return{category:"Straight",tiebreak:[a]};if(o.length){const u=_e(r,[o[0]],2);return{category:"ThreeKind",tiebreak:[o[0],...u]}}const l=Ke(t);if(l.length>=2){const[u,g]=l.slice(0,2),m=Ge(r,[u,g]);return{category:"TwoPair",tiebreak:[u,g,m]}}if(l.length===1){const[u]=l,g=_e(r,[u],3);return{category:"OnePair",tiebreak:[u,...g]}}return{category:"HighCard",tiebreak:[...r].sort((u,g)=>g-u).slice(0,5)}}function We(e){if(e.length===0)return 0;const t=[...e];t[t.length-1]===b.Ace&&t.unshift(1);let n=1,i=0;for(let r=1;r<t.length;r++)t[r]!==t[r-1]&&(t[r]===t[r-1]+1?(n++,n>=5&&(i=t[r])):n=1);return i}function xt(e,t){return Array.from(e.entries()).filter(([,i])=>i>=t).map(([i])=>i).sort((i,r)=>r-i)[0]}function St(e,t){return Array.from(e.entries()).filter(([,n])=>n>=t).map(([n])=>n).sort((n,i)=>i-n)}function Ke(e,t){return Array.from(e.entries()).filter(([n,i])=>i>=2&&n!==t).map(([n])=>n).sort((n,i)=>i-n)}function Ge(e,t){for(let n=e.length-1;n>=0;n--){const i=e[n];if(!t.includes(i))return i}return 0}function _e(e,t,n){const i=[];for(let r=e.length-1;r>=0&&i.length<n;r--){const a=e[r];t.includes(a)||i.push(a)}return i}const Ue={1:{aggression:.4,tightness:.5,bluffFreq:.15},2:{aggression:.8,tightness:.3,bluffFreq:.25},3:{aggression:.6,tightness:.4,bluffFreq:.2}};function $t(e,t){const n=V(e,t),i=Object.values(e.players).find(C=>C.seatIndex===t);if(!i||!i.hand?.c1||!i.hand?.c2)return n.has("Check")?"Check":"Fold";const r=Ue[t]||Ue[3],a=Y(e,i.id),s=e.pots.reduce((C,h)=>C+h.amount,0),o=ye(e.rngSeed+t+e.handNumber),l=Ct(i.hand.c1,i.hand.c2,e.board),d=Ft(t,e.buttonIndex),u=a>0?(s+a)/a:1/0,g=i.chips/e.bigBlind;console.log(`🧠 ${i.name} Analysis:`,{hand:`${i.hand.c1.rank}${i.hand.c1.suit} ${i.hand.c2.rank}${i.hand.c2.suit}`,handStrength:l.toFixed(2),position:d,facing:`$${a}`,potSize:`$${s}`,potOdds:u.toFixed(1),personality:`agg:${r.aggression} tight:${r.tightness}`});const c=Math.min(1,l*(d==="early"?.85:d==="late"?1.15:1)),f=.15+r.tightness*.25,v=.5+r.tightness*.2,k=.3,p=c>=f,y=c>=v,$=c<k&&o.next()<r.bluffFreq&&(d==="late"||e.board.length>0);if(a>0&&a>=i.chips){const C=g<10?.3:.4;return c>=C?"Call":"Fold"}if(a>0){const C=Math.max(.2,f-Math.log(u)*.1),h=e.round?.raisesThisStreet??0,A=Math.min(.8,h*.2),w=Math.max(.1,r.aggression-A);return y?o.next()<w&&n.has("Raise")&&h<2?(console.log(`🚀 ${i.name} raising with strong hand (${c.toFixed(2)}) - raises: ${h}, legal: ${Array.from(n).join(",")}`),"Raise"):(console.log(`📞 ${i.name} calling with strong hand (raises: ${h}, legal: ${Array.from(n).join(",")})`),n.has("Call")?"Call":"Fold"):$&&n.has("Raise")&&e.board.length>=3&&h<1?(console.log(`🃏 ${i.name} bluffing (${c.toFixed(2)}) - raises: ${h}`),"Raise"):p&&u>=2.5?(console.log(`📊 ${i.name} calling with pot odds (${u.toFixed(1)}:1)`),n.has("Call")?"Call":"Fold"):c>=C?n.has("Call")?"Call":"Fold":(console.log(`❌ ${i.name} folding weak hand (${c.toFixed(2)})`),"Fold")}return y&&o.next()<r.aggression&&n.has("Bet")?(console.log(`💪 ${i.name} betting strong hand (${c.toFixed(2)})`),"Bet"):$&&n.has("Bet")&&e.board.length>=3?(console.log(`🎭 ${i.name} bluff betting (${c.toFixed(2)})`),"Bet"):c>=.4&&o.next()<r.aggression*.7&&n.has("Bet")?(console.log(`💰 ${i.name} value betting (${c.toFixed(2)})`),"Bet"):(console.log(`✋ ${i.name} checking (${c.toFixed(2)})`),n.has("Check")?"Check":"Fold")}function Ct(e,t,n){if(n.length===0)return Je(e,t);try{const i=[e,t,...n];for(;i.length<7;)i.push({suit:"S",rank:2});const r=re(i.slice(0,7));return{HighCard:.1,OnePair:.25,TwoPair:.4,ThreeKind:.6,Straight:.75,Flush:.8,FullHouse:.9,FourKind:.95,StraightFlush:1}[r.category]||.1}catch{return Je(e,t)}}function Je(e,t){const n=e.rank,i=t.rank,r=e.suit===t.suit,a=Math.abs(n-i),s=Math.max(n,i),o=Math.min(n,i);return n===i?n>=14?.95:n>=13?.92:n>=12?.88:n>=11?.82:n>=9?.65:n>=7?.5:n>=5?.35:.25:s>=14?o>=13?r?.87:.78:o>=12?r?.75:.65:o>=11?r?.68:.55:o>=10?r?.6:.45:o>=9?r?.5:.35:o>=7?r?.42:.28:o>=5?r?.38:.22:r?.35:.18:s>=13?o>=12?r?.7:.58:o>=11?r?.62:.48:o>=10?r?.55:.4:o>=9?r?.45:.3:r?.35:.22:s>=12?o>=11?r?.6:.45:o>=10?r?.52:.38:o>=9?r?.45:.32:r?.32:.2:s>=11?o>=10?r?.5:.36:o>=9?r?.42:.28:r?.3:.18:s>=10?o>=9?r?.4:.26:o>=8?r?.36:.24:r?.28:.16:a<=1&&o>=6?r?.4:.26:a<=1&&o>=4?r?.32:.2:a<=2&&o>=7?r?.35:.22:a===2&&o>=6?r?.3:.18:r?o>=8?.32:o>=6?.28:o>=4?.24:.2:o>=9?.25:.15}function Ft(e,t){let i=(e-t+4)%4;return i<=1?"late":i===2?"middle":"early"}class Tt{audioContext=null;enabled=!0;constructor(){this.initAudio()}initAudio(){typeof window<"u"&&"AudioContext"in window&&document.addEventListener("click",()=>{this.audioContext||(this.audioContext=new AudioContext)},{once:!0})}getAudioContext(){if(!this.audioContext&&typeof window<"u"&&"AudioContext"in window)try{this.audioContext=new AudioContext}catch{return console.log("Audio not available"),null}return this.audioContext}setEnabled(t){this.enabled=t}playTone(t,n,i=.1,r="sine"){if(!this.enabled)return;const a=this.getAudioContext();if(a)try{const s=a.createOscillator(),o=a.createGain();s.connect(o),o.connect(a.destination),s.frequency.setValueAtTime(t,a.currentTime),s.type=r,o.gain.setValueAtTime(0,a.currentTime),o.gain.linearRampToValueAtTime(i,a.currentTime+.01),o.gain.exponentialRampToValueAtTime(.001,a.currentTime+n),s.start(a.currentTime),s.stop(a.currentTime+n)}catch{}}playCardDeal(){this.playTone(150,.15,.05,"triangle"),setTimeout(()=>this.playTone(120,.1,.03,"triangle"),50)}playCardFlip(){this.playTone(800,.05,.08,"square"),setTimeout(()=>this.playTone(600,.05,.05,"square"),20)}playChips(){this.playTone(440,.1,.06,"triangle"),setTimeout(()=>this.playTone(660,.08,.04,"triangle"),30)}playClick(){this.playTone(300,.05,.04,"square")}playFold(){this.playTone(220,.2,.04,"sine"),setTimeout(()=>this.playTone(180,.15,.03,"sine"),80)}playCheck(){this.playTone(400,.08,.05,"triangle")}playCall(){this.playTone(500,.12,.06,"triangle")}playBet(){this.playTone(350,.08,.06,"square"),setTimeout(()=>this.playTone(450,.1,.05,"square"),60)}playWin(){this.playTone(523,.15,.08,"triangle"),setTimeout(()=>this.playTone(659,.15,.07,"triangle"),100),setTimeout(()=>this.playTone(784,.2,.06,"triangle"),200)}playShowdown(){this.playTone(262,.3,.05,"triangle"),this.playTone(330,.3,.04,"triangle"),this.playTone(392,.3,.04,"triangle")}playNewHand(){this.playTone(200,.1,.06,"sine"),setTimeout(()=>this.playTone(250,.1,.05,"sine"),80),setTimeout(()=>this.playTone(300,.12,.04,"sine"),160)}playError(){this.playTone(150,.1,.06,"sawtooth"),setTimeout(()=>this.playTone(120,.15,.04,"sawtooth"),80)}}const T=new Tt;class At{timers=new Map;setTimeout(t,n,i){const r=i||`timer_${Date.now()}_${Math.random()}`;this.clearTimeout(r);const a=window.setTimeout(()=>{t(),this.timers.delete(r)},n);return this.timers.set(r,{id:r,timeoutId:a,callback:t,delay:n,created:Date.now()}),r}clearTimeout(t){const n=this.timers.get(t);n&&(window.clearTimeout(n.timeoutId),this.timers.delete(t))}clearTimersMatching(t){for(const[n,i]of this.timers)n.includes(t)&&(window.clearTimeout(i.timeoutId),this.timers.delete(n))}clearAll(){for(const t of this.timers.values())window.clearTimeout(t.timeoutId);this.timers.clear()}getActiveCount(){return this.timers.size}getTimerInfo(){const t=Date.now();return Array.from(this.timers.values()).map(n=>({id:n.id,delay:n.delay,age:t-n.created}))}}const se=new At,fe={BOT_PROCESSING:"bot_processing",AUTO_FOLD:"auto_fold",UI_UPDATE:"ui_update",STUCK_BOT_CHECK:"stuck_bot_check",SOUND_DELAY:"sound_delay",scheduleBotProcessing:(e,t=300)=>{se.setTimeout(e,t,fe.BOT_PROCESSING)},scheduleAutoFold:e=>{se.setTimeout(e,100,fe.AUTO_FOLD)},scheduleUIUpdate:(e,t=100)=>{se.setTimeout(e,t,fe.UI_UPDATE)},clearBotTimers:()=>{se.clearTimersMatching("bot")},clearAllGameTimers:()=>{se.clearAll()}};function Bt(){let e=bt();const t=new Set;function n(){for(const c of t)c(e)}function i(c){return t.add(c),c(e),()=>t.delete(c)}function r(){return e}function a(c){e=c,n()}function s(){let c=he(e);if(c.phase==="GameOver"){a(c);return}c=ke(c),c.showdownProcessed=!1,a(c),d()}function o(){a(ke(e)),d()}function l(c,f){const v=r();if(!v.round){console.warn("🤖 dispatchAction called but no round in progress");return}const k=v.round.currentTurnSeatIndex;console.log(`🎯 Human action: ${c} by seat ${k}`);const p=V(v,k);if(console.log("🎯 Legal actions for human:",Array.from(p)),!p.has(c)){console.warn(`🎯 Illegal human action: ${c}, legal:`,Array.from(p)),T.playError(),a({...v,devLog:[`⚠️ Invalid move: ${c} not allowed right now`,...v.devLog].slice(0,50)});return}if(c==="Fold"||c==="Check"||c==="Call"){c==="Fold"?T.playFold():c==="Check"?T.playCheck():c==="Call"&&T.playCall();let y=te(v,{type:c,seatIndex:k}),$=c;c==="Fold"?$="folded":c==="Check"?$="checked":c==="Call"&&($="called");const C=Object.values(y.players).find(w=>w.seatIndex===0);C?.isAllIn&&!v.players[C.id]?.isAllIn&&c==="Call"&&($="called all in"),y={...y,devLog:[`🎯 You ${$}`,`You ${$}`,...y.devLog].slice(0,50)},y=ee(y),a(y),Object.values(y.players).find(w=>w.seatIndex===0)?.isAllIn&&y.round?setTimeout(()=>d(),100):d()}else if(c==="Bet"||c==="Raise"){const y=f||v.bigBlind*2,$=Object.values(v.players).find(w=>w.seatIndex===0);if(!$)return;T.playBet(),setTimeout(()=>T.playChips(),100);let C=te(v,{type:c,seatIndex:k,amount:y});const A=C.players[$.id]?.isAllIn?`went all in ($${$.chips})`:`${c.toLowerCase()} $${y}`;C={...C,devLog:[`🎯 You ${A}`,`You ${A}`,...C.devLog].slice(0,50)},C=ee(C),C=he(C),a(C),setTimeout(()=>d(),100)}}function d(){fe.scheduleBotProcessing(()=>{const c=r();if(!c.round||c.phase==="Showdown"||c.phase==="GameOver"||c.phase==="Idle"){console.log("🤖 Bot processing stopped - phase:",c.phase);return}if(c.round.currentTurnSeatIndex===0||c.round.toActQueue.length===0){console.log("🤖 Bot processing stopped - human turn or empty queue:",{currentTurn:c.round.currentTurnSeatIndex,queueLength:c.round.toActQueue.length});return}const f=Object.values(c.players).find(y=>y.seatIndex===c.round.currentTurnSeatIndex);if(!f){console.log("🤖 No bot found for seat",c.round.currentTurnSeatIndex,"- completing street"),a(ee(c));return}if(console.log(`🤖 Processing bot: ${f.name} (seat ${c.round.currentTurnSeatIndex})`),f.isFolded||f.isBustedOut||f.isAllIn||f.chips<=0){console.log(`🤖 Bot ${f.name} cannot act:`,{isFolded:f.isFolded,isBustedOut:f.isBustedOut,isAllIn:f.isAllIn,chips:f.chips}),a(ee(c));return}const v=V(c,c.round.currentTurnSeatIndex);if(v.size===0){console.log(`🤖 Bot ${f.name} has no legal actions`),a(ee(c));return}console.log(`🤖 Bot ${f.name} legal actions:`,Array.from(v));const k={seat:c.round.currentTurnSeatIndex,action:"pending",timestamp:Date.now()};let p;if(c.round&&c.round.raisesThisStreet>=3?(p=v.has("Call")?"Call":"Fold",console.log(`🤖 Safety valve activated for ${f.name}: ${p}`)):(p=$t(c,c.round.currentTurnSeatIndex),console.log(`🤖 ${f.name} decided: ${p}`)),v.has(p)||(console.warn(`🤖 ${f.name} made illegal decision ${p}, legal actions:`,Array.from(v)),p=v.has("Check")?"Check":v.has("Call")?"Call":"Fold",console.log(`🤖 Corrected to: ${p}`)),typeof window<"u"&&window.lastBotAction){const y=window.lastBotAction;y.seat===k.seat&&y.action===p&&k.timestamp-y.timestamp<2e3&&(console.log(`🚨 STUCK BOT DETECTED: ${f.name} attempting ${p} again within 2s`),p=v.has("Check")?"Check":v.has("Fold")?"Fold":"Call",console.log(`🛑 Stuck bot failsafe: forcing ${p} to break loop`))}if(typeof window<"u"&&(window.lastBotAction={...k,action:p}),v.has(p)){let y;if(p==="Bet"||p==="Raise"){const C=Math.min(f.chips,c.bigBlind*2);console.log(`🤖 Applying ${p} for ${f.name} with amount $${C}`),y=te(c,{type:p,seatIndex:c.round.currentTurnSeatIndex,amount:C})}else console.log(`🤖 Applying ${p} for ${f.name}`),y=te(c,{type:p,seatIndex:c.round.currentTurnSeatIndex});console.log(`🤖 Action applied. New turn seat: ${y.round?.currentTurnSeatIndex}, queue length: ${y.round?.toActQueue.length}`),u=Date.now(),p==="Fold"?T.playFold():p==="Check"?T.playCheck():p==="Call"?T.playCall():(p==="Bet"||p==="Raise")&&(T.playBet(),setTimeout(()=>T.playChips(),100));const $=p==="Fold"?"folded":p==="Check"?"checked":p==="Call"?"called":`${p.toLowerCase()}`;y={...y,devLog:[`${f.name} ${$}`,...y.devLog].slice(0,50)},y=ee(y),y=he(y),a(y)}else{console.error(`❌ Illegal decision ${p}, folding instead`);const y=te(c,{type:"Fold",seatIndex:c.round.currentTurnSeatIndex});a({...y,devLog:[`${f.name} folded`,...y.devLog].slice(0,50)})}setTimeout(()=>d(),750)},300)}let u=Date.now();function g(){const c=r();if(!(!c.round||c.phase==="Showdown"||c.phase==="GameOver"||c.phase==="Idle")&&c.round.currentTurnSeatIndex>0&&Date.now()-u>5e3){console.warn("🚨 STUCK BOT DETECTED - forcing action after 5 seconds");const f=Object.values(c.players).find(v=>v.seatIndex===c.round.currentTurnSeatIndex);if(f&&!f.isFolded&&!f.isAllIn){console.log(`🚨 Force folding stuck bot: ${f.name}`);const v=te(c,{type:"Fold",seatIndex:c.round.currentTurnSeatIndex});a({...v,devLog:[`${f.name} folded (stuck)`,...v.devLog].slice(0,50)}),u=Date.now()}}}setInterval(g,2e3);function m(){console.log("🔄 Starting tournament reset...");let c=wt(e);console.log("🔄 After resetBustedPlayers, phase:",c.phase),c=ke(c),console.log("🔄 After beginNewHand, phase:",c.phase),console.log("🔄 Players after reset:",Object.values(c.players).map(f=>({name:f.name,chips:f.chips,busted:f.isBustedOut}))),c.showdownProcessed=!1,a(c),T.playNewHand(),console.log("🔄 Final state set, calling maybeRunBots..."),d()}return{subscribe:i,getState:r,setState:a,newHand:s,startGame:o,dispatchAction:l,resetTournament:m}}const It="modulepreload",Et=function(e){return"/PokerInTheFront/"+e},Ye={},Ve=function(t,n,i){let r=Promise.resolve();if(n&&n.length>0){let d=function(u){return Promise.all(u.map(g=>Promise.resolve(g).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};var s=d;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");r=d(n.map(u=>{if(u=Et(u),u in Ye)return;Ye[u]=!0;const g=u.endsWith(".css"),m=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${m}`))return;const c=document.createElement("link");if(c.rel=g?"stylesheet":It,g||(c.as="script"),c.crossOrigin="",c.href=u,l&&c.setAttribute("nonce",l),document.head.appendChild(c),g)return new Promise((f,v)=>{c.addEventListener("load",f),c.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${u}`)))})}))}function a(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return r.then(o=>{for(const l of o||[])l.status==="rejected"&&a(l.reason);return t().catch(a)})},at={C1:{name:"Jake Thompson",nickname:"Lucky",description:"Young white cowboy with an optimistic outlook"},C2:{name:"Elena Valdez",nickname:"Rosa",description:"Mexican woman with elegant style and sharp wit"},C3:{name:"Isaiah Washington",nickname:"Doc",description:"Black town doctor with medical expertise and kind heart"},C4:{name:"Wu Chen",nickname:"Dragon",description:"Chinese immigrant with railroad experience and quiet strength"},C5:{name:"Sarah O'Malley",nickname:"Red",description:"Irish woman with fiery hair and determined spirit"}};function Mt(e=72){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Hat -->
      <ellipse cx="50" cy="25" rx="30" ry="8" fill="#2F2F2F"/>
      <rect x="20" y="18" width="60" height="20" fill="#3F3F3F" rx="2"/>
      <rect x="22" y="20" width="56" height="16" fill="#4F4F4F" rx="1"/>
      <circle cx="50" cy="28" r="3" fill="#8B4513"/> <!-- Hat band -->
      
      <!-- Face shape -->
      <ellipse cx="50" cy="60" rx="25" ry="30" fill="#D2B48C"/>
      
      <!-- Eyes -->
      <ellipse cx="42" cy="55" rx="3" ry="2" fill="white"/>
      <ellipse cx="58" cy="55" rx="3" ry="2" fill="white"/>
      <circle cx="42" cy="55" r="1.5" fill="#4A4A4A"/>
      <circle cx="58" cy="55" r="1.5" fill="#4A4A4A"/>
      
      <!-- Weathered eyebrows -->
      <path d="M38 50 Q42 48 46 50" stroke="#8B7355" stroke-width="2" fill="none"/>
      <path d="M54 50 Q58 48 62 50" stroke="#8B7355" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 60 L48 65 L52 65 Z" fill="#C19A6B"/>
      
      <!-- Mouth hidden by mustache -->
      <ellipse cx="50" cy="70" rx="8" ry="3" fill="#8B7355"/> <!-- Mustache -->
      
      <!-- Weathered beard -->
      <path d="M30 75 Q35 82 40 85 Q45 88 50 88 Q55 88 60 85 Q65 82 70 75" 
            fill="#8B7355" stroke="#654321" stroke-width="1"/>
      
      <!-- Cigar -->
      <rect x="65" y="68" width="15" height="3" fill="#8B4513" rx="1"/>
      <rect x="78" y="68.5" width="3" height="2" fill="#CD853F" rx="1"/>
      
      <!-- Smoke wisps -->
      <path d="M82 69 Q85 66 83 63 Q87 61 85 58" stroke="#D3D3D3" stroke-width="1" fill="none" opacity="0.7"/>
      
      <!-- Scars and lines -->
      <path d="M35 52 L40 55" stroke="#A0522D" stroke-width="1" opacity="0.6"/>
      <path d="M32 62 L38 62" stroke="#A0522D" stroke-width="1" opacity="0.4"/>
    </svg>
  `}function Pt(e=72){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Kerchief -->
      <path d="M20 35 Q50 15 80 35 Q75 25 50 20 Q25 25 20 35 Z" fill="#8B0000"/>
      <path d="M22 36 Q50 18 78 36" stroke="#A52A2A" stroke-width="1" fill="none"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="60" rx="22" ry="28" fill="#F5DEB3"/>
      
      <!-- Hair (slightly visible under kerchief) -->
      <path d="M28 45 Q35 42 42 45" stroke="#8B4513" stroke-width="2" fill="none"/>
      <path d="M58 45 Q65 42 72 45" stroke="#8B4513" stroke-width="2" fill="none"/>
      
      <!-- Eyes (sharp and determined) -->
      <ellipse cx="42" cy="55" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="55" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="55" r="2" fill="#4169E1"/> <!-- Piercing blue eyes -->
      <circle cx="58" cy="55" r="2" fill="#4169E1"/>
      <circle cx="42" cy="55" r="0.8" fill="black"/> <!-- Pupils -->
      <circle cx="58" cy="55" r="0.8" fill="black"/>
      
      <!-- Eye highlights -->
      <circle cx="43" cy="54" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="59" cy="54" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyebrows (well-groomed) -->
      <path d="M38 50 Q42 48 46 50" stroke="#654321" stroke-width="2" fill="none"/>
      <path d="M54 50 Q58 48 62 50" stroke="#654321" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 60 L48 64 L52 64 Z" fill="#DEB887"/>
      
      <!-- Mouth (determined expression) -->
      <path d="M45 70 Q50 72 55 70" stroke="#8B4513" stroke-width="2" fill="none"/>
      
      <!-- Chin and jawline -->
      <path d="M35 75 Q50 82 65 75" stroke="#DEB887" stroke-width="1" fill="none" opacity="0.3"/>
      
      <!-- Kerchief knot -->
      <ellipse cx="50" cy="38" rx="3" ry="2" fill="#8B0000"/>
      <path d="M47 40 L53 40" stroke="#A52A2A" stroke-width="1"/>
    </svg>
  `}function Ot(e=72){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Hair (well-groomed, graying) -->
      <path d="M25 40 Q30 35 35 38 Q40 35 45 38 Q50 32 55 38 Q60 35 65 38 Q70 35 75 40" 
            fill="#696969" stroke="#2F2F2F" stroke-width="1"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="60" rx="24" ry="28" fill="#F5DEB3"/>
      
      <!-- Wire spectacles -->
      <circle cx="42" cy="55" r="8" fill="none" stroke="#2F2F2F" stroke-width="1.5"/>
      <circle cx="58" cy="55" r="8" fill="none" stroke="#2F2F2F" stroke-width="1.5"/>
      <path d="M50 55 L50 53" stroke="#2F2F2F" stroke-width="1.5"/> <!-- Bridge -->
      <path d="M34 55 L25 52" stroke="#2F2F2F" stroke-width="1"/> <!-- Left arm -->
      <path d="M66 55 L75 52" stroke="#2F2F2F" stroke-width="1"/> <!-- Right arm -->
      
      <!-- Eyes behind spectacles -->
      <ellipse cx="42" cy="55" rx="3" ry="2" fill="white"/>
      <ellipse cx="58" cy="55" rx="3" ry="2" fill="white"/>
      <circle cx="42" cy="55" r="1.5" fill="#654321"/> <!-- Brown eyes -->
      <circle cx="58" cy="55" r="1.5" fill="#654321"/>
      
      <!-- Eyebrows (distinguished) -->
      <path d="M36 48 Q42 46 48 48" stroke="#696969" stroke-width="2" fill="none"/>
      <path d="M52 48 Q58 46 64 48" stroke="#696969" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 60 L48 65 L52 65 Z" fill="#DEB887"/>
      
      <!-- Mouth (gentle, professional) -->
      <ellipse cx="50" cy="72" rx="6" ry="2" fill="#CD853F"/>
      
      <!-- Mustache (neatly trimmed) -->
      <ellipse cx="50" cy="68" rx="8" ry="2" fill="#696969"/>
      
      <!-- Collar and tie (visible at bottom) -->
      <rect x="40" y="85" width="20" height="10" fill="white"/>
      <rect x="48" y="85" width="4" height="15" fill="#8B0000"/>
      
      <!-- Side burns -->
      <path d="M26 58 Q28 65 30 72" stroke="#696969" stroke-width="3" fill="none"/>
      <path d="M74 58 Q72 65 70 72" stroke="#696969" stroke-width="3" fill="none"/>
    </svg>
  `}function Ze(e=72){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Cowboy hat -->
      <ellipse cx="50" cy="20" rx="32" ry="6" fill="#8B4513"/>
      <path d="M18 20 Q20 15 25 12 Q50 8 75 12 Q80 15 82 20" fill="#A0522D"/>
      <rect x="25" y="15" width="50" height="18" fill="#654321" rx="3"/>
      <rect x="45" y="22" width="10" height="4" fill="#8B4513"/> <!-- Hat band -->
      
      <!-- Young face shape -->
      <ellipse cx="50" cy="62" rx="23" ry="26" fill="#F5DEB3"/>
      
      <!-- Hair (sandy brown, youthful) -->
      <path d="M27 42 Q32 38 38 42" stroke="#DEB887" stroke-width="3" fill="none"/>
      <path d="M62 42 Q68 38 73 42" stroke="#DEB887" stroke-width="3" fill="none"/>
      
      <!-- Eyes (bright and optimistic) -->
      <ellipse cx="42" cy="57" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="57" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="57" r="2" fill="#228B22"/> <!-- Green eyes -->
      <circle cx="58" cy="57" r="2" fill="#228B22"/>
      <circle cx="43" cy="56" r="0.5" fill="white" opacity="0.8"/> <!-- Highlight -->
      <circle cx="59" cy="56" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyebrows (youthful) -->
      <path d="M38 52 Q42 50 46 52" stroke="#DEB887" stroke-width="2" fill="none"/>
      <path d="M54 52 Q58 50 62 52" stroke="#DEB887" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 62 L48 66 L52 66 Z" fill="#DEB887"/>
      
      <!-- Mouth (optimistic smile) -->
      <path d="M44 72 Q50 75 56 72" stroke="#8B4513" stroke-width="2" fill="none"/>
      
      <!-- Clean-shaven chin -->
      <ellipse cx="50" cy="80" rx="12" ry="8" fill="#F5DEB3"/>
      
      <!-- Bandana around neck -->
      <path d="M35 88 Q50 92 65 88" fill="#FF6347" stroke="#CD5C5C" stroke-width="1"/>
    </svg>
  `}function Lt(e=72){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Hair (dark, elegant updo) -->
      <path d="M25 40 Q30 32 40 35 Q50 28 60 35 Q70 32 75 40 Q72 45 65 48 Q50 45 35 48 Q28 45 25 40 Z" 
            fill="#2F1B14"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="62" rx="22" ry="26" fill="#D2B48C"/>
      
      <!-- Hair decoration (flower) -->
      <circle cx="65" cy="38" r="4" fill="#FF1493"/>
      <circle cx="65" cy="38" r="2" fill="#FFB6C1"/>
      <circle cx="65" cy="38" r="1" fill="#FFFF00"/>
      
      <!-- Eyes (dark and elegant) -->
      <ellipse cx="42" cy="57" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="57" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="57" r="2.5" fill="#2F1B14"/> <!-- Dark brown eyes -->
      <circle cx="58" cy="57" r="2.5" fill="#2F1B14"/>
      <circle cx="43" cy="56" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="59" cy="56" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyelashes -->
      <path d="M39 55 L38 53" stroke="#2F1B14" stroke-width="1"/>
      <path d="M42 54 L42 52" stroke="#2F1B14" stroke-width="1"/>
      <path d="M45 55 L46 53" stroke="#2F1B14" stroke-width="1"/>
      <path d="M55 55 L54 53" stroke="#2F1B14" stroke-width="1"/>
      <path d="M58 54 L58 52" stroke="#2F1B14" stroke-width="1"/>
      <path d="M61 55 L62 53" stroke="#2F1B14" stroke-width="1"/>
      
      <!-- Eyebrows (well-shaped) -->
      <path d="M38 51 Q42 49 46 51" stroke="#2F1B14" stroke-width="2" fill="none"/>
      <path d="M54 51 Q58 49 62 51" stroke="#2F1B14" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 62 L48 66 L52 66 Z" fill="#C19A6B"/>
      
      <!-- Mouth (elegant) -->
      <ellipse cx="50" cy="72" rx="6" ry="2" fill="#8B4513"/>
      
      <!-- Earrings -->
      <circle cx="30" cy="62" r="2" fill="#FFD700"/>
      <circle cx="70" cy="62" r="2" fill="#FFD700"/>
      
      <!-- Shawl/dress neckline -->
      <path d="M30 88 Q50 85 70 88" stroke="#8B0000" stroke-width="3" fill="none"/>
      <path d="M32 90 Q50 87 68 90" stroke="#A52A2A" stroke-width="2" fill="none"/>
    </svg>
  `}function Dt(e=72){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Hair (short, professional) -->
      <path d="M28 40 Q35 35 42 38 Q50 32 58 38 Q65 35 72 40 Q70 45 65 48 Q50 45 35 48 Q30 45 28 40 Z" 
            fill="#1C1C1C"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="62" rx="24" ry="28" fill="#704A37"/>
      
      <!-- Eyes (kind and intelligent) -->
      <ellipse cx="42" cy="57" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="57" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="57" r="2" fill="#2F1B14"/> <!-- Dark brown eyes -->
      <circle cx="58" cy="57" r="2" fill="#2F1B14"/>
      <circle cx="43" cy="56" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="59" cy="56" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyebrows -->
      <path d="M38 52 Q42 50 46 52" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      <path d="M54 52 Q58 50 62 52" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 62 L47 67 L53 67 Z" fill="#654321"/>
      
      <!-- Mouth (gentle, wise) -->
      <path d="M44 72 Q50 74 56 72" stroke="#2F1B14" stroke-width="2" fill="none"/>
      
      <!-- Mustache (small, well-groomed) -->
      <ellipse cx="50" cy="69" rx="6" ry="1.5" fill="#1C1C1C"/>
      
      <!-- Goatee -->
      <ellipse cx="50" cy="78" rx="4" ry="6" fill="#1C1C1C"/>
      
      <!-- Medical collar/vest -->
      <rect x="35" y="85" width="30" height="12" fill="white"/>
      <rect x="47" y="85" width="6" height="15" fill="#2F2F2F"/> <!-- Tie -->
      
      <!-- Medical bag handle (just visible) -->
      <path d="M25 85 Q27 82 30 85" stroke="#654321" stroke-width="2" fill="none"/>
    </svg>
  `}function Ht(e=72){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Traditional hat -->
      <path d="M20 35 Q50 25 80 35" fill="#2F2F2F"/>
      <ellipse cx="50" cy="32" rx="25" ry="8" fill="#1C1C1C"/>
      
      <!-- Hair (traditional queue/braid suggestion) -->
      <path d="M30 45 Q35 42 40 45" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      <path d="M60 45 Q65 42 70 45" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="62" rx="22" ry="26" fill="#DEB887"/>
      
      <!-- Eyes (almond-shaped, wise) -->
      <path d="M38 57 Q42 55 46 57 Q42 59 38 57 Z" fill="white"/>
      <path d="M54 57 Q58 55 62 57 Q58 59 54 57 Z" fill="white"/>
      <circle cx="42" cy="57" r="1.5" fill="#2F1B14"/>
      <circle cx="58" cy="57" r="1.5" fill="#2F1B14"/>
      
      <!-- Eyebrows (straight, dignified) -->
      <path d="M38 53 L46 53" stroke="#1C1C1C" stroke-width="2"/>
      <path d="M54 53 L62 53" stroke="#1C1C1C" stroke-width="2"/>
      
      <!-- Nose -->
      <path d="M50 62 L48 65 L52 65 Z" fill="#CD853F"/>
      
      <!-- Mouth (stoic expression) -->
      <path d="M46 71 L54 71" stroke="#8B4513" stroke-width="2"/>
      
      <!-- Mustache (thin, traditional) -->
      <path d="M44 69 Q50 68 56 69" stroke="#1C1C1C" stroke-width="1.5" fill="none"/>
      
      <!-- Small goatee -->
      <path d="M49 76 Q50 80 51 76" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      
      <!-- Traditional Chinese collar -->
      <rect x="40" y="88" width="20" height="8" fill="#8B0000"/>
      <path d="M40 88 Q50 85 60 88" stroke="#FFD700" stroke-width="1"/>
    </svg>
  `}function Nt(e=72){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Fiery red hair -->
      <path d="M25 35 Q30 28 38 32 Q45 25 50 28 Q55 25 62 32 Q70 28 75 35 Q78 42 75 48 Q70 52 62 50 Q55 55 50 52 Q45 55 38 50 Q30 52 25 48 Q22 42 25 35 Z" 
            fill="#B22222"/>
      <path d="M27 38 Q32 30 40 35" stroke="#DC143C" stroke-width="2" fill="none"/>
      <path d="M60 35 Q68 30 73 38" stroke="#DC143C" stroke-width="2" fill="none"/>
      <path d="M35 45 Q40 40 45 45" stroke="#FF4500" stroke-width="1" fill="none"/>
      <path d="M55 45 Q60 40 65 45" stroke="#FF4500" stroke-width="1" fill="none"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="62" rx="21" ry="25" fill="#FFE4E1"/>
      
      <!-- Freckles -->
      <circle cx="45" cy="60" r="0.5" fill="#D2691E" opacity="0.6"/>
      <circle cx="48" cy="58" r="0.4" fill="#D2691E" opacity="0.6"/>
      <circle cx="52" cy="58" r="0.4" fill="#D2691E" opacity="0.6"/>
      <circle cx="55" cy="60" r="0.5" fill="#D2691E" opacity="0.6"/>
      <circle cx="46" cy="65" r="0.3" fill="#D2691E" opacity="0.6"/>
      <circle cx="54" cy="65" r="0.3" fill="#D2691E" opacity="0.6"/>
      
      <!-- Eyes (bright green, determined) -->
      <ellipse cx="42" cy="57" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="57" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="57" r="2" fill="#228B22"/> <!-- Bright green eyes -->
      <circle cx="58" cy="57" r="2" fill="#228B22"/>
      <circle cx="43" cy="56" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="59" cy="56" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyebrows (red, expressive) -->
      <path d="M38 52 Q42 50 46 52" stroke="#B22222" stroke-width="2" fill="none"/>
      <path d="M54 52 Q58 50 62 52" stroke="#B22222" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 62 L48 66 L52 66 Z" fill="#F0C0C0"/>
      
      <!-- Mouth (determined smile) -->
      <path d="M44 71 Q50 73 56 71" stroke="#8B4513" stroke-width="2" fill="none"/>
      
      <!-- Irish shawl -->
      <path d="M28 85 Q35 82 42 85" stroke="#228B22" stroke-width="3" fill="none"/>
      <path d="M58 85 Q65 82 72 85" stroke="#228B22" stroke-width="3" fill="none"/>
      <path d="M30 88 Q50 85 70 88" stroke="#32CD32" stroke-width="2" fill="none"/>
    </svg>
  `}function $e(e,t=72){switch(e){case"P1":return Mt(t);case"P2":return Pt(t);case"P3":return Ot(t);case"C1":return Ze(t);case"C2":return Lt(t);case"C3":return Dt(t);case"C4":return Ht(t);case"C5":return Nt(t);default:return Ze(t)}}const Qt={S:"♠",H:"♥",D:"♦",C:"♣"},Rt={S:"#1d1d1f",C:"#1d1d1f",H:"#c0392b",D:"#c0392b"};function jt(e){return e<=10?String(e):{11:"J",12:"Q",13:"K",14:"A"}[e]??String(e)}function pe(e,t=60,n=84){const{suit:i,rank:r}=e,a=Qt[i]??"?",s=Rt[i]??"#000",o=jt(r),l=t,d=n,u=Math.max(8,Math.floor(l*.18)),g=Math.floor(Math.min(l,d)*.45),m=`${i}${r}${l}${d}`,c=`cardface-${m}`,f=`cardborder-${m}`;return`
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${d}" viewBox="0 0 ${l} ${d}" aria-label="${o}${a}">
  <defs>
    <linearGradient id="${c}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8f8f8"/>
    </linearGradient>
    <linearGradient id="${f}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0e0e0"/>
      <stop offset="100%" stop-color="#b8b8b8"/>
    </linearGradient>
  </defs>
  <!-- Full card background with border -->
  <rect x="0" y="0" rx="8" ry="8" width="${l}" height="${d}" fill="url(#${f})"/>
  <rect x="1" y="1" rx="7" ry="7" width="${l-2}" height="${d-2}" fill="url(#${c})"/>
  <!-- corners -->
  <g fill="${s}" font-family="Georgia, serif" font-weight="700" text-anchor="start">
    <text x="4" y="${u}" font-size="${u}">${o}</text>
    <text x="4" y="${u+12}" font-size="${u*.9}">${a}</text>
  </g>
  <g fill="${s}" font-family="Georgia, serif" font-weight="700" text-anchor="end" transform="translate(${l-4}, ${d-4}) rotate(180)">
    <text x="0" y="${u}" font-size="${u}">${o}</text>
    <text x="0" y="${u+12}" font-size="${u*.9}">${a}</text>
  </g>
  <!-- center suit -->
  <g fill="${s}" fill-opacity="0.12" text-anchor="middle" font-family="Georgia, serif" font-weight="700">
    <text x="${l/2}" y="${d/2+g/3}" font-size="${g}">${a}</text>
  </g>
</svg>`}function ze(e){if(!e.round||e.board.length===0)return[];const t=e.board,i=Object.values(e.players).filter(s=>!s.isFolded&&s.hand?.c1&&s.hand?.c2);if(i.length===0)return[];const r=new Map;i.forEach(s=>{const o=[s.hand.c1,s.hand.c2,...t];console.log(`🔍 Evaluating ${s.name}:`,{hole:`${s.hand.c1.rank}${s.hand.c1.suit} ${s.hand.c2.rank}${s.hand.c2.suit}`,board:t.map(d=>`${d.rank}${d.suit}`).join(" "),allSeven:o.map(d=>`${d.rank}${d.suit}`).join(" ")});const l=re(o);console.log(`🎯 ${s.name} result: ${l.category} [${l.tiebreak.join(", ")}]`),r.set(s.id,l)});const a=[];return e.pots.forEach((s,o)=>{if(s.amount<=0)return;const l=s.eligiblePlayerIds||i.map(k=>k.id),d=i.filter(k=>l.includes(k.id));if(d.length===0)return;const u=d.map(k=>({playerId:k.id,handEval:r.get(k.id)}));console.log(`🔍 Pot ${o} before sorting:`),u.forEach((k,p)=>{const y=e.players[k.playerId];console.log(`  ${p+1}. ${y?.name} - ${k.handEval.category} [${k.handEval.tiebreak.join(", ")}]`)}),u.sort((k,p)=>qe(k.handEval,p.handEval)).reverse(),console.log(`🔍 Pot ${o} after sorting (best first):`),u.forEach((k,p)=>{const y=e.players[k.playerId];console.log(`  ${p+1}. ${y?.name} - ${k.handEval.category} [${k.handEval.tiebreak.join(", ")}]`)});const g=u[0].handEval,m=u.filter(k=>qe(k.handEval,g)===0);console.log(`🔍 Winners for pot ${o}:`,m.map(k=>`${e.players[k.playerId]?.name} - ${k.handEval.category}`));const c=m.length,f=Math.floor(s.amount/c),v=s.amount%c;m.forEach((k,p)=>{const y=f+(p<v?1:0);a.push({playerId:k.playerId,amount:y,potIndex:o,handCategory:Wt(k.handEval)})})}),a}function qt(e,t){const n=new Map;for(let r=0;r<t.length;r++){const a=t[r],s=n.get(a.playerId)||0;n.set(a.playerId,s+a.amount)}for(const[r,a]of n){const s=e.players[r];s&&(s.chips+=a)}const i=t.reduce((r,a)=>r+a.amount,0);e.devLog.push(`🎰 Showdown complete - $${i} pot distributed`),e.handSummary||(e.handSummary={handNumber:e.handNumber,finalPot:i,winners:t.map(r=>({playerName:e.players[r.playerId]?.name||"Unknown",amount:r.amount,handCategory:r.handCategory||"Unknown"}))}),e.pots=[],t.forEach(r=>{const a=e.players[r.playerId];if(a){const s=r.handCategory?` with ${r.handCategory}`:"";e.devLog.push(`🏆 ${a.name} wins $${r.amount}${s}`)}}),Object.values(e.players).forEach(r=>{e.devLog.push(`💰 ${r.name}: $${r.chips}`)})}function Wt(e){return!e||!e.category?"Unknown":{HighCard:"High Card",OnePair:"Pair",TwoPair:"Two Pair",ThreeKind:"Three of a Kind",Straight:"Straight",Flush:"Flush",FullHouse:"Full House",FourKind:"Four of a Kind",StraightFlush:"Straight Flush"}[e.category]||e.category}function Kt(){return`
    <div class="hand-reference">
      <div class="hand-reference-header" onclick="toggleHandReference()">
        <h4>Poker Hand Rankings</h4>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="hand-rankings" id="hand-rankings-content">
        ${j(1,"Royal Flush",[{rank:b.Ace,suit:"S",id:"AS"},{rank:b.King,suit:"S",id:"KS"},{rank:b.Queen,suit:"S",id:"QS"},{rank:b.Jack,suit:"S",id:"JS"},{rank:b.Ten,suit:"S",id:"TS"}])}
        
        ${j(2,"Straight Flush",[{rank:b.Nine,suit:"H",id:"9H"},{rank:b.Eight,suit:"H",id:"8H"},{rank:b.Seven,suit:"H",id:"7H"},{rank:b.Six,suit:"H",id:"6H"},{rank:b.Five,suit:"H",id:"5H"}])}
        
        ${j(3,"Four of a Kind",[{rank:b.King,suit:"C",id:"KC"},{rank:b.King,suit:"D",id:"KD"},{rank:b.King,suit:"H",id:"KH"},{rank:b.King,suit:"S",id:"KS"},{rank:b.Three,suit:"C",id:"3C"}])}
        
        ${j(4,"Full House",[{rank:b.Ace,suit:"C",id:"AC"},{rank:b.Ace,suit:"D",id:"AD"},{rank:b.Ace,suit:"H",id:"AH"},{rank:b.Seven,suit:"S",id:"7S"},{rank:b.Seven,suit:"C",id:"7C"}])}
        
        ${j(5,"Flush",[{rank:b.King,suit:"D",id:"KD"},{rank:b.Nine,suit:"D",id:"9D"},{rank:b.Seven,suit:"D",id:"7D"},{rank:b.Four,suit:"D",id:"4D"},{rank:b.Two,suit:"D",id:"2D"}])}
        
        ${j(6,"Straight",[{rank:b.Jack,suit:"C",id:"JC"},{rank:b.Ten,suit:"H",id:"TH"},{rank:b.Nine,suit:"S",id:"9S"},{rank:b.Eight,suit:"D",id:"8D"},{rank:b.Seven,suit:"C",id:"7C"}])}
        
        ${j(7,"Three of a Kind",[{rank:b.Queen,suit:"C",id:"QC"},{rank:b.Queen,suit:"D",id:"QD"},{rank:b.Queen,suit:"H",id:"QH"},{rank:b.Eight,suit:"S",id:"8S"},{rank:b.Four,suit:"C",id:"4C"}])}
        
        ${j(8,"Two Pair",[{rank:b.Ace,suit:"C",id:"AC"},{rank:b.Ace,suit:"D",id:"AD"},{rank:b.Eight,suit:"H",id:"8H"},{rank:b.Eight,suit:"S",id:"8S"},{rank:b.Five,suit:"C",id:"5C"}])}
        
        ${j(9,"One Pair",[{rank:b.Jack,suit:"H",id:"JH"},{rank:b.Jack,suit:"S",id:"JS"},{rank:b.Nine,suit:"C",id:"9C"},{rank:b.Five,suit:"D",id:"5D"},{rank:b.Two,suit:"H",id:"2H"}])}
        
        ${j(10,"High Card",[{rank:b.Ace,suit:"S",id:"AS"},{rank:b.King,suit:"H",id:"KH"},{rank:b.Eight,suit:"C",id:"8C"},{rank:b.Six,suit:"D",id:"6D"},{rank:b.Two,suit:"S",id:"2S"}])}
      </div>
    </div>
  `}window.toggleHandReference=function(){const e=document.getElementById("hand-rankings-content"),t=document.querySelector(".hand-reference .toggle-icon");e&&t&&(e.style.display==="none"?(e.style.display="flex",t.textContent="▼",localStorage.setItem("hand-reference-collapsed","false")):(e.style.display="none",t.textContent="▶",localStorage.setItem("hand-reference-collapsed","true")))};function Gt(){const e=localStorage.getItem("hand-reference-collapsed")==="true",t=document.getElementById("hand-rankings-content"),n=document.querySelector(".hand-reference .toggle-icon");t&&n&&e&&(t.style.display="none",n.textContent="▶")}function j(e,t,n){const i=n.map(r=>pe(r,24,34)).join("");return`
    <div class="hand-rank-item">
      <div class="rank-number">${e}</div>
      <div class="rank-info">
        <div class="rank-name">${t}</div>
        <div class="rank-cards">
          ${i}
        </div>
      </div>
    </div>
  `}function rt(e,t){const n=e.players[t];if(!n||!n.hand?.c1||!n.hand?.c2)return null;const i=e.board,r=[n.hand.c1,n.hand.c2],a=[...r,...i];if(a.length<2||a.length>7)return null;const s=_t(a),o=Jt(r,i),l=Yt(r,i),u=1/Object.values(e.players).filter(c=>!c.isFolded).length,g=s/10;let m=u*(1+g);return m=Math.min(Math.max(m,.05),.95),{winProbability:m,tieProbability:.05,handStrengths:{current:s,possible:o},outs:l}}function _t(e){if(e.length<7){if(e.length<5)return Ut(e.slice(0,2));const n=e.map(l=>l.rank).sort((l,d)=>d-l),i=e.map(l=>l.suit),r=n.reduce((l,d)=>(l[d]=(l[d]||0)+1,l),{}),a=Object.values(r).sort((l,d)=>d-l),s=i.reduce((l,d)=>(l[d]=(l[d]||0)+1,l),{}),o=Math.max(...Object.values(s));return a[0]>=4?9:a[0]===3&&a[1]>=2?8:o>=5?7:a[0]===3?5:a[0]===2&&a[1]===2?4:a[0]===2?3:Math.max(n[0]/14*2,1)}switch(re(e).category){case"StraightFlush":return 9.5;case"FourKind":return 9;case"FullHouse":return 8;case"Flush":return 7;case"Straight":return 6;case"ThreeKind":return 5;case"TwoPair":return 4;case"OnePair":return 3;case"HighCard":return 2;default:return 1}}function Ut(e){if(e.length!==2)return 1;const[t,n]=e,i=t.rank,r=n.rank,a=t.suit===n.suit,s=i===r;let o=0;if(s)i>=14?o=9:i>=13?o=8.5:i>=12?o=8:i>=11?o=7.5:i>=10?o=7:i>=8?o=6:o=5;else{const l=Math.max(i,r),d=Math.min(i,r),u=l-d;l===14&&d>=12?o=7.5:l===14&&d>=11?o=7:l===14&&d>=10?o=6.5:l>=13&&d>=12?o=6:l>=13&&d>=11?o=5.5:l>=12&&d>=11?o=5:u<=4&&d>=7?o=4:l>=11?o=3:o=2,a&&(o+=.5)}return Math.min(o,10)}function Jt(e,t){const n=[];return t.length<5&&n.push({category:"High Card",probability:.4},{category:"One Pair",probability:.3},{category:"Two Pair",probability:.15},{category:"Three of a Kind",probability:.08},{category:"Straight",probability:.03},{category:"Flush",probability:.02},{category:"Full House",probability:.015},{category:"Four of a Kind",probability:.003},{category:"Straight Flush",probability:.001},{category:"Royal Flush",probability:1e-4}),n.filter(i=>i.probability>.001)}function Yt(e,t){const n=[];if(t.length>=5)return n;const i=5-t.length,r=50-t.length,a=[...e,...t].reduce((s,o)=>(s[o.suit]=(s[o.suit]||0)+1,s),{});return Object.entries(a).forEach(([s,o])=>{if(o===4){const l=Vt(9,r,i);n.push({description:`Flush (${s})`,cards:[],probability:l})}}),n}function Vt(e,t,n){if(n===1)return e/t;if(n===2){const i=(t-e)/t,r=(t-e-1)/(t-1);return 1-i*r}return 0}function Zt(e){return e>=.8?"Very Strong":e>=.6?"Strong":e>=.4?"Moderate":e>=.2?"Weak":"Very Weak"}function Xe(e){return`${(e*100).toFixed(1)}%`}let et=-1;function xe(){const e=localStorage.getItem("poker-auto-fold-enabled")==="true",t=localStorage.getItem("poker-auto-fold-threshold")||"25",n=document.querySelector(".auto-fold-indicator");n&&(e?(n.style.display="block",n.className="auto-fold-indicator",n.innerHTML=`🤖 Auto-fold: <span id="auto-fold-threshold-display">${t}</span>%`):(n.style.display="block",n.className="auto-fold-indicator disabled",n.innerHTML='🤖 Auto-fold: <span id="auto-fold-threshold-display">OFF</span>'),n.title=`Click to ${e?"disable":"enable"} auto-fold feature`)}function zt(e,t){if(!e.round||e.round.currentTurnSeatIndex!==0||e.phase==="Showdown"||e.phase==="GameOver"||e.phase==="Idle"||et===e.handNumber||!(localStorage.getItem("poker-auto-fold-enabled")==="true"))return;const i=parseInt(localStorage.getItem("poker-auto-fold-threshold")||"25"),r=Object.values(e.players).find(o=>o.seatIndex===0);if(!r||!r.hand?.c1||!r.hand?.c2)return;const a=rt(e,r.id);if(!a)return;const s=a.winProbability*100;s<i&&setTimeout(()=>{const o=V(e,0);if(o.has("Fold")){console.log("🤖 Executing auto-fold"),et=e.handNumber,t.dispatchAction?.("Fold");const l=t.getState?.();if(l&&t.setState){const d={...l,devLog:[`🤖 Auto-folded weak hand (${s.toFixed(1)}% win chance)`,"Auto-folded weak hand",...l.devLog].slice(0,50)};t.setState(d)}}else o.has("Check")&&(console.log("🤖 Can't fold, checking instead"),t.dispatchAction?.("Check"))},500)}function Xt(e,t){e.innerHTML="";const n=document.createElement("div");n.className="page";let i;new ResizeObserver(h=>{clearTimeout(i),i=window.setTimeout(()=>{const A=h[0];if(!A)return;const{width:w,height:I}=A.contentRect,B=Math.min(w,I);let M=1;B<600?M=Math.max(.6,B/600):B>1200&&(M=Math.min(1.2,B/1e3)),document.documentElement.style.setProperty("--ui-scale",M.toString())},100)}).observe(e);const a=document.createElement("div");a.className="topbar";const s=document.createElement("div");s.className="topbar-inner";const o=document.createElement("div");o.className="status",o.textContent="Texas Hold'em";const l=document.createElement("div");l.className="btns",l.innerHTML=`
    <div id="player-chips" class="player-chips"></div>
    <button id="t-restart" class="primary">Restart Game</button>
    <button id="t-sound">🔊 Sound</button>
    <span id="hands-counter" class="hands-counter">Hands: 0</span>
  `,s.appendChild(o),s.appendChild(l),a.appendChild(s);const d=document.createElement("div");d.className="auto-fold-indicator",d.style.display="block",d.innerHTML='🤖 Auto-fold: <span id="auto-fold-threshold-display">25</span>%',d.title="Click to toggle auto-fold feature",d.addEventListener("click",()=>{const A=!(localStorage.getItem("poker-auto-fold-enabled")==="true");localStorage.setItem("poker-auto-fold-enabled",A.toString()),xe(),console.log(`🤖 Auto-fold ${A?"enabled":"disabled"}`)}),setTimeout(xe,100);const u=document.createElement("div");u.className="table";const g=document.createElement("div");g.className="board";const m=document.createElement("div");m.className="seats",u.appendChild(g),u.appendChild(m);const c=document.createElement("div");c.className="log",c.innerHTML="<h3>Log</h3>";const f=document.createElement("div");f.className="probability-display",f.style.display="none";const v=document.createElement("div");v.innerHTML=Kt(),setTimeout(()=>Gt(),100);const k=document.createElement("div");k.className="content";const p=document.createElement("div");p.appendChild(u);const y=document.createElement("div");y.className="right-panel-container",y.appendChild(c),y.appendChild(f),y.appendChild(v),k.appendChild(p),k.appendChild(y),n.appendChild(a),n.appendChild(d),n.appendChild(k),e.appendChild(n);const $=document.createElement("div");$.className="modal-overlay",$.id="game-over-overlay",$.innerHTML=`
    <div class="modal">
      <h3 id="game-over-title">🏆 Tournament Complete!</h3>
      <div id="game-over-content"></div>
      <div class="actions">
        <button id="game-over-reset" class="primary">New Tournament</button>
        <button id="game-over-quit" class="danger">Quit to Main Menu</button>
      </div>
    </div>`,document.body.appendChild($);let C=!0;$.querySelector("#game-over-reset").onclick=()=>{T.playClick(),$.classList.remove("show"),t.resetTournament&&t.resetTournament()},$.querySelector("#game-over-quit").onclick=()=>{T.playClick(),$.classList.remove("show");const h=document.getElementById("app");Ve(async()=>{const{renderStartScreen:A}=await Promise.resolve().then(()=>on);return{renderStartScreen:A}},void 0).then(({renderStartScreen:A})=>{A(h,{onCharacterSelected:w=>{Ve(async()=>{const{startGame:I}=await Promise.resolve().then(()=>ln);return{startGame:I}},void 0).then(({startGame:I})=>I())}})})},l.querySelector("#t-restart").onclick=()=>{T.playClick(),t.newHand&&(t.newHand(),t.startGame&&t.startGame())},l.querySelector("#t-sound").onclick=()=>{C=!C,T.setEnabled(C);const h=l.querySelector("#t-sound");h.textContent=C?"🔊 Sound":"🔇 Muted",h.className=C?"":"danger",C&&T.playClick()},document.addEventListener("keydown",h=>{const A=t.getState&&t.getState();if(!A||!A.round||A.round.currentTurnSeatIndex!==0)return;const w=V(A,0);switch(h.key.toLowerCase()){case"f":(w.has("Fold")||w.has("Check"))&&(h.preventDefault(),T.playClick(),t.dispatchAction&&t.dispatchAction("Fold"));break;case"c":w.has("Check")?(h.preventDefault(),T.playClick(),t.dispatchAction&&t.dispatchAction("Check")):w.has("Call")&&(h.preventDefault(),T.playClick(),t.dispatchAction&&t.dispatchAction("Call"));break;case"r":if(w.has("Bet")){h.preventDefault();const B=document.querySelector("#action-amount"),M=Number(B?.value||"0");T.playClick(),t.dispatchAction&&t.dispatchAction("Bet",M)}else if(w.has("Raise")){h.preventDefault();const B=document.querySelector("#action-amount"),M=Number(B?.value||"0");T.playClick(),t.dispatchAction&&t.dispatchAction("Raise",M)}break;case"a":const I=Object.values(A.players).find(B=>B.seatIndex===0);if(I&&I.chips>0){h.preventDefault(),T.playClick();const B=I.id,M=I.chips,O=A.round.currentBet,U=A.round.committedThisStreet[B]||0,N=Math.max(0,O-U);if(O===0)t.dispatchAction&&t.dispatchAction("Bet",M);else if(N>0)if(M<=N)t.dispatchAction&&t.dispatchAction("Call");else{const W=M-N;t.dispatchAction&&t.dispatchAction("Raise",W)}else t.dispatchAction&&t.dispatchAction("Raise",M)}break}}),t.subscribe(h=>{const A=h.pots.reduce((S,F)=>S+F.amount,0);if(zt(h,t),h.phase==="Showdown"&&h.board.length===5&&!h.showdownProcessed){const S=ze(h);if(S.length>0){qt(h,S);let F={...h,showdownProcessed:!0};F=he(F),t.setState&&t.setState(F)}}const w=Object.values(h.players).find(S=>S.isHuman);h.round&&h.round.currentBet,w&&h.round&&h.round.committedThisStreet[w.id];let I=new Set;const B=new Map;h.phase==="Showdown"&&h.board.length===5&&(ze(h).forEach(x=>I.add(x.playerId)),Object.values(h.players).filter(x=>!x.isFolded&&x.hand?.c1&&x.hand?.c2).forEach(x=>{if(x.hand?.c1&&x.hand?.c2)try{const R=[x.hand.c1,x.hand.c2,...h.board];console.log(`🖥️ UI Evaluating ${x.name}:`,{hole:`${x.hand.c1.rank}${x.hand.c1.suit} ${x.hand.c2.rank}${x.hand.c2.suit}`,board:h.board.map(K=>`${K.rank}${K.suit}`).join(" "),allSeven:R.map(K=>`${K.rank}${K.suit}`).join(" ")});const J=re(R);console.log(`🖥️ ${x.name} UI result: ${J.category} [${J.tiebreak.join(", ")}]`),B.set(x.id,J)}catch(R){console.log(`❌ Error evaluating ${x.name}:`,R)}})),m.innerHTML="";const M=["s0","s1","s2","s3"];for(let S=0;S<4;S++){const F=document.createElement("div");F.className="seat",F.id=M[S]||`s${S}`;const x=Object.values(h.players).find(P=>P.seatIndex===S),R=x?.isBustedOut||!1;if(!x){F.innerHTML='<div class="empty-seat">Empty</div>',m.appendChild(F);continue}const J=x.name;isNaN(x.chips)||x.chips;const K=h.round?.currentTurnSeatIndex===S,Pe=h.buttonIndex===S,Oe=h.seats.find(P=>P.index===S)?.isSmallBlind||!1,Le=h.seats.find(P=>P.index===S)?.isBigBlind||!1,De=K&&h.phase!=="Idle"&&h.phase!=="Showdown";let G="seat";K&&(G+=" current-turn"),Pe&&(G+=" dealer"),Oe&&(G+=" small-blind"),Le&&(G+=" big-blind"),x.isFolded&&(G+=" folded"),x.isAllIn&&(G+=" all-in"),R&&(G+=" busted"),F.className=G;let oe="",be="";if(x&&x.hand?.c1&&x.hand?.c2){const P=h.phase==="Showdown"&&h.board.length===5,ne=P&&!x.isFolded;if(x.seatIndex===0||ne){const E=pe(x.hand.c1,48,68),Q=pe(x.hand.c2,48,68);oe=`<div class="hand"><div class="card">${E}</div><div class="card">${Q}</div></div>`}else oe='<div class="hand"><div class="card back"></div><div class="card back"></div></div>';if(P&&!x.isFolded){const E=B.get(x.id);E&&(be=`<div class="hand-category">${ot(E.category)}</div>`)}}let le="";if(x.seatIndex===0){const P=localStorage.getItem("poker-selected-character");le=$e(P||"C1",72)}else le=$e(x.id,72);const q=[];Pe&&q.push('<span class="badge dealer">Dealer</span>'),Oe&&q.push('<span class="badge sb">Small Blind</span>'),Le&&q.push('<span class="badge bb">Big Blind</span>'),De&&q.push('<span class="badge act">Acting</span>'),x.isFolded&&q.push('<span class="badge folded">Folded</span>'),x.isAllIn&&q.push('<span class="badge all-in">All In</span>'),R&&q.push('<span class="badge busted">ELIMINATED</span>');const He=De?'<span class="acting-indicator">→</span>':"";if(Y(h,x.id),S===0||S===2){let P="";if(S===0)if(h.round&&h.round.currentTurnSeatIndex===0){const E=V(h,0),Q=Object.values(h.players).find(Z=>Z.seatIndex===0),ce=Q&&Q.chips>0&&!Q.isAllIn&&!Q.isFolded&&(E.has("Call")||E.has("Bet")||E.has("Raise")),ie=Y(h,Q?.id||"P0");P=`
              <div class="integrated-action-controls">
                <div class="action-info">
                  <span class="action-prompt">Your Turn</span>
                  ${ie>0?`<span class="facing-amount">Need $${ie} to call</span>`:""}
                </div>
                <div class="action-grid">
                  <button id="action-fold" class="action-btn compact danger" ${!E.has("Fold")&&!E.has("Check")?"disabled":""}>
                    Fold
                  </button>
                  ${E.has("Check")?`
                    <button id="action-check" class="action-btn compact" ${E.has("Check")?"":"disabled"}>
                      Check
                    </button>
                  `:""}
                  ${E.has("Call")?`
                    <button id="action-call" class="action-btn compact" ${E.has("Call")?"":"disabled"}>
                      Call
                    </button>
                  `:""}
                  <div class="bet-section">
                    <input id="action-amount" type="number" min="1" step="1" value="10" ${!E.has("Bet")&&!E.has("Raise")?"disabled":""} />
                    ${E.has("Bet")?`
                      <button id="action-bet" class="action-btn compact primary" ${E.has("Bet")?"":"disabled"}>
                        Bet
                      </button>
                    `:""}
                    ${E.has("Raise")?`
                      <button id="action-raise" class="action-btn compact primary" ${E.has("Raise")?"":"disabled"}>
                        Raise
                      </button>
                    `:""}
                  </div>
                  ${ce?`
                    <button id="action-allin" class="action-btn compact all-in">
                      All In
                    </button>
                  `:""}
                </div>
              </div>
            `}else P="";F.innerHTML=`
          <div class="player-info">
            <div class="avatar">${le}</div>
            <div class="name">${J} ${q.join("")} ${He}</div>

            ${be}
          </div>
          <div class="cards-and-actions">
            ${oe}
            ${P}
          </div>
        `}else F.innerHTML=`
          <div class="player-info">
            <div class="avatar">${le}</div>
            <div class="name">${J} ${q.join("")} ${He}</div>

            ${be}
          </div>
          ${oe}
        `;if(m.appendChild(F),S===0){const P=F.querySelector("#action-fold"),ne=F.querySelector("#action-check"),E=F.querySelector("#action-call"),Q=F.querySelector("#action-bet"),ce=F.querySelector("#action-raise"),ie=F.querySelector("#action-allin"),Z=F.querySelector("#action-amount");P&&P.addEventListener("click",()=>t.dispatchAction?.("Fold")),ne&&ne.addEventListener("click",()=>t.dispatchAction?.("Check")),E&&E.addEventListener("click",()=>t.dispatchAction?.("Call")),Q&&Q.addEventListener("click",()=>{const H=Z?parseInt(Z.value):10;t.dispatchAction?.("Bet",H)}),ce&&ce.addEventListener("click",()=>{const H=Z?parseInt(Z.value):10;t.dispatchAction?.("Raise",H)}),ie&&ie.addEventListener("click",()=>{const H=Object.values(h.players).find(z=>z.seatIndex===0);if(H&&H.chips>0){const z=V(h,0),de=Y(h,H?.id||"P0");if(console.log(`🎰 All-in clicked: betting ALL ${H.chips} chips`),de>0&&z.has("Raise")){const Ne=Math.max(0,H.chips-de);console.log(`🎰 All-in Raise by $${Ne} (total: $${H.chips}, facing: $${de})`),t.dispatchAction?.("Raise",Ne)}else de>0&&z.has("Call")?(console.log(`🎰 All-in Call (engine will use correct amount from $${H.chips} chips)`),t.dispatchAction?.("Call")):z.has("Bet")?(console.log(`🎰 All-in Bet ALL $${H.chips} chips`),t.dispatchAction?.("Bet",H.chips)):console.log(`🎰 All-in: No valid betting action! Legal actions: [${Array.from(z).join(",")}]`)}})}}g.innerHTML="";let O=h.phase;h.phase==="Preflop"?O="Before the Flop":h.phase==="Flop"?O="After the Flop":h.phase==="Turn"?O="After the Turn":h.phase==="River"?O="After the River":h.phase==="Showdown"?O="Revealing Cards":h.phase==="Idle"&&(O="Waiting to Start");const U=`${O} • Pot: $${A} • Blinds: $${h.smallBlind}/$${h.bigBlind}`,N=document.createElement("div");N.className="board-status",N.textContent=U,g.appendChild(N);const W=document.createElement("div");W.className="board-cards";const dt=h.board.length;for(let S=0;S<5;S++){const F=document.createElement("div");S<dt?(F.className="card",F.innerHTML=pe(h.board[S],72,100)):F.className="back",W.appendChild(F)}g.appendChild(W);const Be=h.devLog.filter(S=>!S.includes("🤖")&&!S.includes("⚠️")&&!S.includes("🎯")&&!S.includes("💰")&&!S.includes("🏆")&&!S.startsWith("[")&&S.trim()!=="");let D="<h3>Game Log</h3>";h.phase==="Showdown"&&h.handSummary&&(D+='<div class="showdown-summary">',D+=`<h4>🏆 Hand #${h.handSummary.handNumber} Results</h4>`,D+=`<p><strong>Final Pot:</strong> $${h.handSummary.finalPot}</p>`,D+="<h5>Winners:</h5>",h.handSummary.winners.forEach(S=>{D+=`<p>• ${S.playerName} wins $${S.amount} with ${S.handCategory}</p>`}),D+='<div class="next-hand-controls">',D+='<button id="next-hand-btn" class="next-hand-btn primary">Next Hand →</button>',D+="</div>",D+="</div>"),Be.length===0&&(D+=`<div class="line">Welcome to Texas Hold'em! The game is ready to begin.</div>`,h.phase==="Preflop"&&(D+='<div class="line">Players have been dealt their hole cards.</div>')),D+=Be.map(S=>`<div class="line">${S}</div>`).join(""),c.innerHTML=D;const Ie=c.querySelector("#next-hand-btn");Ie&&Ie.addEventListener("click",()=>{console.log("🎯 Manual next hand clicked"),t.newHand?.()}),o.textContent="Texas Hold'em",h.round&&h.round.currentTurnSeatIndex>0&&h.phase!=="Showdown"&&h.phase!=="GameOver"&&h.phase!=="Idle"&&(console.log("🎯 UI detected bot turn, ensuring maybeRunBots is called"),setTimeout(()=>{if(t.getState&&t.setState){const S=t.getState();if(S.round&&S.round.currentTurnSeatIndex>0&&S.phase!=="Showdown"&&S.phase!=="GameOver"&&S.phase!=="Idle"){console.log("🎯 UI forcing maybeRunBots for stuck bot");const F=S.round.currentTurnSeatIndex,x=Object.values(S.players).find(R=>R.seatIndex===F);x&&!x.isFolded&&!x.isAllIn&&x.chips>0&&console.log(`🎯 UI detected ${x.name} needs to act, calling dispatchAction as failsafe`)}}},2e3)),tn(f,h);const Ee=document.getElementById("hands-counter");Ee&&(Ee.textContent=`Hands: ${h.handNumber}`),h.phase==="GameOver"&&nt(h);const Me=document.getElementById("player-chips");if(Me){const S=Object.values(h.players).sort((F,x)=>F.seatIndex-x.seatIndex).map(F=>{const x=isNaN(F.chips)?0:F.chips;return`<span class="player-chip-count${x<=0?" busted":""}">${F.name}: $${x}</span>`}).join("");Me.innerHTML=S}xe(),h.handSummary&&h.phase,h.phase==="GameOver"&&h.winner&&nt(h)}),document.addEventListener("keydown",h=>{if(!$.classList.contains("show"))return;const A=t.getState&&t.getState();if(A?.round&&A.round.currentTurnSeatIndex===0&&!(h.target instanceof HTMLInputElement))switch(h.key.toLowerCase()){case"f":h.preventDefault();const I=$.querySelector("#action-fold");I&&!I.disabled&&(I.click(),T.playClick());break;case"c":h.preventDefault();const B=$.querySelector("#action-check"),M=$.querySelector("#action-call");B&&!B.disabled?(B.click(),T.playClick()):M&&!M.disabled&&(M.click(),T.playClick());break;case"r":h.preventDefault();const O=$.querySelector("#action-raise"),U=$.querySelector("#action-bet");O&&!O.disabled?(O.click(),T.playClick()):U&&!U.disabled&&(U.click(),T.playClick());break;case"a":h.preventDefault();const N=$.querySelector("#action-allin");N&&!N.disabled&&(N.click(),T.playClick());break;case"escape":h.preventDefault();const W=$.querySelector("#game-over-reset");W&&(W.click(),T.playClick());break}})}function ot(e){return{HighCard:"High Card",OnePair:"Pair",TwoPair:"Two Pair",ThreeKind:"Three of a Kind",Straight:"Straight",Flush:"Flush",FullHouse:"Full House",FourKind:"Four of a Kind",StraightFlush:"Straight Flush"}[e]||e}function en(e,t){const n=e.players[t];if(!n?.hand?.c1||!n?.hand?.c2)return"No Cards";const i=[n.hand.c1,n.hand.c2],r=e.board;if(r.length===0){if(n.hand.c1.rank===n.hand.c2.rank)return`Pair of ${L(n.hand.c1.rank)}s`;{const l=L(n.hand.c1.rank),d=L(n.hand.c2.rank),u=n.hand.c1.suit===n.hand.c2.suit?" suited":"";return`${l}-${d}${u}`}}const a=[...i,...r];if(a.length<5||a.length!==7)return tt(i,r);const s=re(a),o=ot(s.category);if(s.category==="OnePair"&&s.tiebreak[0]!==void 0)return`Pair of ${L(s.tiebreak[0])}s`;if(s.category==="TwoPair"&&s.tiebreak[0]!==void 0&&s.tiebreak[1]!==void 0){const l=L(s.tiebreak[0]),d=L(s.tiebreak[1]);return`Two Pair: ${l}s over ${d}s`}else{if(s.category==="ThreeKind"&&s.tiebreak[0]!==void 0)return`Three ${L(s.tiebreak[0])}s`;if(s.category==="FullHouse"&&s.tiebreak[0]!==void 0&&s.tiebreak[1]!==void 0){const l=L(s.tiebreak[0]),d=L(s.tiebreak[1]);return`Full House: ${l}s over ${d}s`}else{if(s.category==="FourKind"&&s.tiebreak[0]!==void 0)return`Four ${L(s.tiebreak[0])}s`;if(s.category==="Straight"&&s.tiebreak[0]!==void 0)return`Straight to ${L(s.tiebreak[0])}`;if(s.category==="Flush"&&s.tiebreak[0]!==void 0)return`${L(s.tiebreak[0])}-high Flush`;if(s.category==="StraightFlush"&&s.tiebreak[0]!==void 0){const l=L(s.tiebreak[0]);return s.tiebreak[0]===14?"Royal Flush":`Straight Flush to ${l}`}else if(s.category==="HighCard"&&s.tiebreak[0]!==void 0)return`${L(s.tiebreak[0])} High`}}return o}function L(e){return{2:"Two",3:"Three",4:"Four",5:"Five",6:"Six",7:"Seven",8:"Eight",9:"Nine",10:"Ten",11:"Jack",12:"Queen",13:"King",14:"Ace"}[e]||String(e)}function tt(e,t){const r=[...e,...t].map(g=>g.rank).reduce((g,m)=>(g[m]=(g[m]||0)+1,g),{}),a=Object.entries(r).sort(([g,m],[c,f])=>{const v=Number(m),k=Number(f);return v!==k?k-v:Number(c)-Number(g)});if(a.length===0)return"No Cards";const s=a[0];if(!s)return"No Cards";const[o,l]=s,d=L(Number(o)),u=Number(l);if(u>=4)return`Four ${d}s`;if(u>=3)return`Three ${d}s`;if(u>=2&&a.length>1){const g=a[1];if(g){const[m,c]=g;if(Number(c)>=2){const v=L(Number(m));return`Two Pair: ${d}s and ${v}s`}}}return u>=2?`Pair of ${d}s`:`${d} High`}function tn(e,t){if(!(localStorage.getItem("poker-show-probabilities")!=="false")){e.style.display="none";return}const i=Object.values(t.players).find(s=>s.seatIndex===0);if(!i){e.style.display="none";return}if(!i.hand?.c1||!i.hand?.c2){e.style.display="none";return}if(t.phase==="Idle"||t.phase==="Showdown"||t.phase==="GameOver"){e.style.display="none";return}const r=rt(t,i.id);if(!r){e.style.display="none";return}const a=en(t,i.id);e.style.display="block",e.innerHTML=`
    <div class="probability-container">
      <div class="probability-header">
        <h4>Hand Analysis</h4>
        <button class="probability-toggle" onclick="toggleProbabilityDisplay()">×</button>
      </div>
      <div class="probability-content">
        <div class="probability-main">
          <div class="probability-item current-hand">
            <span class="probability-label">Current Hand:</span>
            <span class="probability-value current-hand-ranking">${a}</span>
          </div>
          <div class="probability-item">
            <span class="probability-label">Win Chance:</span>
            <span class="probability-value ${nn(r.winProbability)}">${Xe(r.winProbability)}</span>
          </div>
          <div class="probability-item">
            <span class="probability-label">Hand Strength:</span>
            <span class="probability-value">${Zt(r.winProbability)}</span>
          </div>
        </div>
        
        ${r.outs.length>0?`
          <div class="probability-outs">
            <h5>Potential Improvements:</h5>
            ${r.outs.map(s=>`
              <div class="out-item">
                <span class="out-description">${s.description}</span>
                <span class="out-probability">${Xe(s.probability)}</span>
              </div>
            `).join("")}
          </div>
        `:""}
      </div>
    </div>
  `}function nn(e){return e>=.7?"prob-very-strong":e>=.5?"prob-strong":e>=.3?"prob-moderate":e>=.15?"prob-weak":"prob-very-weak"}window.toggleProbabilityDisplay=function(){localStorage.setItem("poker-show-probabilities","false");const e=document.querySelectorAll(".probability-display");for(let t=0;t<e.length;t++)e[t].style.display="none"};function nt(e){const t=document.getElementById("game-over-overlay"),n=document.getElementById("game-over-title"),i=document.getElementById("game-over-content"),r=Object.values(e.players).find(s=>s.seatIndex===0),a=e.winner?Object.values(e.players).find(s=>s.id===e.winner):null;r?.isBustedOut?(n.textContent="💀 You Busted Out!",i.innerHTML=`
      <p>You've been eliminated from the tournament!</p>
      <p><strong>Winner:</strong> ${a?.name||"Unknown"}</p>
    `):(n.textContent="🏆 Tournament Complete!",i.innerHTML=`
      <p><strong>Winner:</strong> ${a?.name||"Unknown"}</p>
      <p>Congratulations on completing the tournament!</p>
    `),t.classList.add("show")}const sn=[{id:"first-hand",name:"First Hand",description:"Play your first hand of poker",icon:"🎰",condition:e=>e.handsPlayed>=1,unlocked:!1},{id:"big-winner",name:"Big Winner",description:"Win a hand with a pot of $200 or more",icon:"💰",condition:e=>e.largestPot>=200,unlocked:!1},{id:"royal-flush",name:"Royal Flush",description:"Get a royal flush (A, K, Q, J, 10 suited)",icon:"🃏",condition:e=>e.royalFlushes>=1,unlocked:!1},{id:"bluffer",name:"Bluffer",description:"Win a hand by bluffing with high card",icon:"🎯",condition:e=>e.bluffsWon>=1,unlocked:!1},{id:"hot-streak",name:"Hot Streak",description:"Win 5 hands in a row",icon:"🔥",condition:e=>e.longestStreak>=5,unlocked:!1},{id:"saloon-regular",name:"Saloon Regular",description:"Play 50 hands total",icon:"🤠",condition:e=>e.handsPlayed>=50,unlocked:!1},{id:"straight-shooter",name:"Straight Shooter",description:"Win with a straight",icon:"🎯",condition:e=>e.straights>=1,unlocked:!1},{id:"flush-master",name:"Flush Master",description:"Win with a flush",icon:"♠️",condition:e=>e.flushes>=1,unlocked:!1},{id:"full-house-hero",name:"Full House Hero",description:"Win with a full house",icon:"🏠",condition:e=>e.fullHouses>=1,unlocked:!1},{id:"quad-squad",name:"Quad Squad",description:"Win with four of a kind",icon:"4️⃣",condition:e=>e.quads>=1,unlocked:!1},{id:"all-in-ace",name:"All-In Ace",description:"Win a hand by going all in",icon:"🎲",condition:e=>e.allInsWon>=1,unlocked:!1},{id:"century-club",name:"Century Club",description:"Play 100 hands total",icon:"💯",condition:e=>e.handsPlayed>=100,unlocked:!1}];class an{stats;achievements;constructor(){this.stats=this.loadStats(),this.achievements=this.loadAchievements()}loadStats(){const t=localStorage.getItem("poker-game-stats");return t?JSON.parse(t):{handsPlayed:0,handsWon:0,totalWinnings:0,largestPot:0,currentStreak:0,longestStreak:0,handsWonByCategory:{StraightFlush:0,FourKind:0,FullHouse:0,Flush:0,Straight:0,ThreeKind:0,TwoPair:0,OnePair:0,HighCard:0},bluffsWon:0,allInsWon:0,royalFlushes:0,straightFlushes:0,quads:0,fullHouses:0,flushes:0,straights:0,trips:0,twoPairs:0,pairs:0,highCards:0}}loadAchievements(){const t=localStorage.getItem("poker-achievements"),n=t?JSON.parse(t):{};return sn.map(i=>({...i,unlocked:n[i.id]?.unlocked||!1,unlockedAt:n[i.id]?.unlockedAt?new Date(n[i.id].unlockedAt):void 0}))}saveStats(){localStorage.setItem("poker-game-stats",JSON.stringify(this.stats))}saveAchievements(){const t={};this.achievements.forEach(n=>{t[n.id]={unlocked:n.unlocked,unlockedAt:n.unlockedAt?.toISOString()}}),localStorage.setItem("poker-achievements",JSON.stringify(t))}onHandStart(){this.stats.handsPlayed++,this.saveStats(),this.checkAchievements()}onHandWon(t,n,i,r,a){switch(this.stats.handsWon++,this.stats.totalWinnings+=t,this.stats.currentStreak++,this.stats.longestStreak=Math.max(this.stats.longestStreak,this.stats.currentStreak),this.stats.largestPot=Math.max(this.stats.largestPot,i),this.stats.handsWonByCategory[n]++,n){case"StraightFlush":this.stats.straightFlushes++,this.stats.royalFlushes++;break;case"FourKind":this.stats.quads++;break;case"FullHouse":this.stats.fullHouses++;break;case"Flush":this.stats.flushes++;break;case"Straight":this.stats.straights++;break;case"ThreeKind":this.stats.trips++;break;case"TwoPair":this.stats.twoPairs++;break;case"OnePair":this.stats.pairs++;break;case"HighCard":this.stats.highCards++,a&&this.stats.bluffsWon++;break}r&&this.stats.allInsWon++,this.saveStats(),this.checkAchievements()}onHandLost(){this.stats.currentStreak=0,this.saveStats()}checkAchievements(){const t=[];return this.achievements.forEach(n=>{!n.unlocked&&n.condition(this.stats)&&(n.unlocked=!0,n.unlockedAt=new Date,t.push(n))}),t.length>0&&this.saveAchievements(),t}getStats(){return{...this.stats}}getAchievements(){return[...this.achievements]}getProgress(t){const n=this.achievements.find(i=>i.id===t);if(!n||n.unlocked)return 1;switch(t){case"saloon-regular":return Math.min(this.stats.handsPlayed/50,1);case"century-club":return Math.min(this.stats.handsPlayed/100,1);case"hot-streak":return Math.min(this.stats.longestStreak/5,1);case"big-winner":return Math.min(this.stats.largestPot/200,1);default:return 0}}}const Se=new an;let _="main",Ce=!0;function lt(e,t){e.innerHTML=ge(),me(e,t)}function ge(){return`
    <div class="start-screen">
      <div class="saloon-backdrop">
        <div class="desert-bg"></div>
        <div class="mountains"></div>
        <div class="saloon-building">
          <div class="saloon-roof"></div>
          <div class="saloon-front">
            <div class="saloon-doors"></div>
            <div class="saloon-windows"></div>
            <div class="saloon-sign">
              <div class="sign-board">
                <h1 class="game-title">POKER IN THE FRONT</h1>
                <p class="saloon-tagline">★ THE WILDEST SALOON IN THE WEST ★</p>
              </div>
            </div>
          </div>
        </div>
        <div class="dust-particles"></div>
      </div>
      
      <div class="start-content">
        <div class="start-view-content">
          ${rn()}
        </div>
        
        ${_!=="main"?'<button class="back-btn western-btn"><span class="btn-icon">🔙</span> Back to Saloon</button>':""}
      </div>
    </div>
  `}function rn(){switch(_){case"main":return`
        <div class="main-menu">
          <div class="saloon-entrance">
            <div class="swinging-doors" id="saloon-doors">
              <svg class="saloon-doors-svg" width="200" height="140" viewBox="0 0 200 140">
                <!-- Door Frame -->
                <rect x="10" y="10" width="180" height="120" fill="none" stroke="#8B4513" stroke-width="3" rx="5"/>
                
                <!-- Left Door -->
                <g class="door-left">
                  <!-- Door Panel -->
                  <rect x="15" y="15" width="85" height="110" fill="#D2691E" stroke="#8B4513" stroke-width="2" rx="3"/>
                  
                  <!-- Wood Grain Lines -->
                  <line x1="20" y1="25" x2="95" y2="25" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="20" y1="35" x2="95" y2="35" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="20" y1="45" x2="95" y2="45" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="20" y1="65" x2="95" y2="65" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="20" y1="85" x2="95" y2="85" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="20" y1="105" x2="95" y2="105" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="20" y1="115" x2="95" y2="115" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  
                  <!-- Slats -->
                  <rect x="20" y="50" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  <rect x="20" y="62" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  <rect x="20" y="74" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  
                  <!-- Door Handle -->
                  <circle cx="90" cy="70" r="3" fill="#DAA520" stroke="#B8860B" stroke-width="1"/>
                  <rect x="87" y="68" width="6" height="4" fill="#DAA520" stroke="#B8860B" stroke-width="1" rx="1"/>
                  
                  <!-- Hinges -->
                  <rect x="17" y="25" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                  <rect x="17" y="45" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                  <rect x="17" y="95" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                </g>
                
                <!-- Right Door -->
                <g class="door-right">
                  <!-- Door Panel -->
                  <rect x="100" y="15" width="85" height="110" fill="#D2691E" stroke="#8B4513" stroke-width="2" rx="3"/>
                  
                  <!-- Wood Grain Lines -->
                  <line x1="105" y1="25" x2="180" y2="25" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="105" y1="35" x2="180" y2="35" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="105" y1="45" x2="180" y2="45" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="105" y1="65" x2="180" y2="65" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="105" y1="85" x2="180" y2="85" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="105" y1="105" x2="180" y2="105" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="105" y1="115" x2="180" y2="115" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  
                  <!-- Slats -->
                  <rect x="105" y="50" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  <rect x="105" y="62" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  <rect x="105" y="74" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  
                  <!-- Door Handle -->
                  <circle cx="110" cy="70" r="3" fill="#DAA520" stroke="#B8860B" stroke-width="1"/>
                  <rect x="107" y="68" width="6" height="4" fill="#DAA520" stroke="#B8860B" stroke-width="1" rx="1"/>
                  
                  <!-- Hinges -->
                  <rect x="179" y="25" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                  <rect x="179" y="45" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                  <rect x="179" y="95" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                </g>
                
                <!-- "SALOON" text above doors -->
                <text x="100" y="8" text-anchor="middle" fill="#8B4513" font-family="serif" font-size="12" font-weight="bold">SALOON</text>
                
                <!-- Decorative elements -->
                <circle cx="30" cy="5" r="2" fill="#DAA520"/>
                <circle cx="170" cy="5" r="2" fill="#DAA520"/>
              </svg>
            </div>
            <p class="entrance-text">🤠 Click the saloon doors to enter the game! 🤠</p>
          </div>
          
          <div class="menu-buttons">
            <button class="western-btn menu-btn primary" data-action="character-select">
              <div class="btn-badge">★</div>
              <div class="btn-content">
                <span class="btn-icon">🤠</span>
                <span class="btn-text">SADDLE UP & PLAY</span>
                <span class="btn-desc">Choose your gunslinger and hit the tables</span>
              </div>
              <div class="btn-shine"></div>
            </button>
            
            <button class="western-btn menu-btn" data-action="about">
              <div class="btn-badge">?</div>
              <div class="btn-content">
                <span class="btn-icon">📜</span>
                <span class="btn-text">SALOON RULES</span>
                <span class="btn-desc">Learn the ways of the Old West poker</span>
              </div>
              <div class="btn-shine"></div>
            </button>
            
            <button class="western-btn menu-btn" data-action="options">
              <div class="btn-badge">⚙</div>
              <div class="btn-content">
                <span class="btn-icon">🔧</span>
                <span class="btn-text">SETTINGS</span>
                <span class="btn-desc">Adjust your gaming experience</span>
              </div>
              <div class="btn-shine"></div>
            </button>
            
            <button class="western-btn menu-btn" data-action="achievements">
              <div class="btn-badge">🏆</div>
              <div class="btn-content">
                <span class="btn-icon">🎖️</span>
                <span class="btn-text">HONORS & AWARDS</span>
                <span class="btn-desc">Your legendary poker achievements</span>
              </div>
              <div class="btn-shine"></div>
            </button>
          </div>
        </div>
      `;case"character-select":return`
        <div class="character-select">
          <div class="sheriff-notice">
            <div class="notice-board">
              <div class="notice-header">
                <h2 class="view-title">★ WANTED ★</h2>
                <p class="view-subtitle">POKER PLAYERS FOR HIGH STAKES GAME</p>
                <div class="notice-decoration">~ Choose Your Gunslinger ~</div>
              </div>
            </div>
          </div>
          
          <div class="character-grid">
            ${Object.entries(at).map(([n,i])=>`
              <div class="wanted-poster" data-character-id="${n}">
                <div class="poster-frame">
                  <div class="poster-header">
                    <div class="wanted-text">WANTED</div>
                    <div class="reward-text">FOR POKER</div>
                  </div>
                  
                  <div class="character-portrait">
                    <div class="portrait-frame">
                      ${$e(n,120)}
                    </div>
                  </div>
                  
                  <div class="character-details">
                    <h3 class="character-name">${i.name}</h3>
                    <p class="character-alias">"${i.description}"</p>
                    <div class="reward-amount">REWARD: GLORY</div>
                  </div>
                  
                  <div class="poster-footer">
                    <div class="select-text">CLICK TO RECRUIT</div>
                  </div>
                  
                  <div class="poster-nails">
                    <div class="nail nail-tl"></div>
                    <div class="nail nail-tr"></div>
                    <div class="nail nail-bl"></div>
                    <div class="nail nail-br"></div>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;case"about":return`
        <div class="rules-saloon">
          <div class="saloon-header">
            <svg width="80" height="80" viewBox="0 0 80 80" class="poker-badge">
              <!-- Poker Chip Badge -->
              <circle cx="40" cy="40" r="35" fill="#8B4513" stroke="#654321" stroke-width="3"/>
              <circle cx="40" cy="40" r="28" fill="#D2691E" stroke="#8B4513" stroke-width="2"/>
              <circle cx="40" cy="40" r="20" fill="#CD853F" stroke="#A0522D" stroke-width="1"/>
              
              <!-- Poker symbols around the edge -->
              <text x="40" y="20" text-anchor="middle" fill="#8B4513" font-size="8" font-weight="bold">♠</text>
              <text x="60" y="45" text-anchor="middle" fill="#8B4513" font-size="8" font-weight="bold">♥</text>
              <text x="40" y="65" text-anchor="middle" fill="#8B4513" font-size="8" font-weight="bold">♦</text>
              <text x="20" y="45" text-anchor="middle" fill="#8B4513" font-size="8" font-weight="bold">♣</text>
              
              <!-- Center text -->
              <text x="40" y="38" text-anchor="middle" fill="#8B4513" font-size="7" font-weight="bold">TEXAS</text>
              <text x="40" y="47" text-anchor="middle" fill="#8B4513" font-size="7" font-weight="bold">HOLD'EM</text>
            </svg>
            <h2 class="saloon-title">★ SALOON RULES & LORE ★</h2>
            <p class="saloon-subtitle">~ The Laws of the Wild West Poker Table ~</p>
          </div>

          <div class="rules-scroll">
            <div class="scroll-content">
              <div class="rule-section">
                <div class="section-header">
                  <h3 class="section-title">🤠 Welcome to the Frontier</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <p class="rule-text">Step through them swinging doors into an 1860s Western saloon where legends are made and fortunes won. Test your mettle against three cunning AI gunslingers in the most authentic Old West poker experience this side of the Mississippi.</p>
              </div>

              <div class="rule-section">
                <div class="section-header">
                  <h3 class="section-title">🎰 Game Features</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="features-grid">
                  <div class="feature-item">
                    <span class="feature-icon">🃏</span>
                    <span class="feature-text">Classic Texas Hold'em rules</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🤖</span>
                    <span class="feature-text">Three AI opponents with distinct personalities</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🎨</span>
                    <span class="feature-text">Hand-crafted Western SVG graphics</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🔊</span>
                    <span class="feature-text">Immersive frontier sound effects</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">📱</span>
                    <span class="feature-text">Responsive design for any device</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">📖</span>
                    <span class="feature-text">Built-in poker hand reference guide</span>
                  </div>
                </div>
              </div>

              <div class="rule-section">
                <div class="section-header">
                  <h3 class="section-title">🎯 How to Play</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="gameplay-steps">
                  <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h4>The Deal</h4>
                      <p>Each player receives two private "hole" cards. Keep 'em close to your vest, partner!</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h4>The Flop</h4>
                      <p>Three community cards are revealed. These belong to everyone at the table.</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h4>The Turn & River</h4>
                      <p>One more card each round, for a total of five community cards.</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-content">
                      <h4>The Showdown</h4>
                      <p>Make the best 5-card hand using any combination of your cards and the community cards. May the best hand win!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rule-section">
                <div class="section-header">
                  <h3 class="section-title">⭐ Frontier Code</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="frontier-code">
                  <p class="code-line">★ No accounts needed - just pure poker skill</p>
                  <p class="code-line">★ No real money - only bragging rights</p>
                  <p class="code-line">★ Respect your opponents - they're crafty varmints</p>
                  <p class="code-line">★ May fortune favor the bold!</p>
                </div>
              </div>

              <div class="version-badge">
                <span class="version-text">Version 1.0 • Authentic Western Experience</span>
              </div>
            </div>
          </div>
        </div>
      `;case"options":return`
        <div class="settings-saloon">
          <div class="saloon-header">
            <svg width="80" height="80" viewBox="0 0 80 80" class="settings-badge">
              <!-- Gear/Settings Badge -->
              <circle cx="40" cy="40" r="35" fill="#8B4513" stroke="#654321" stroke-width="3"/>
              <circle cx="40" cy="40" r="28" fill="#D2691E" stroke="#8B4513" stroke-width="2"/>
              
              <!-- Gear teeth -->
              <g fill="#CD853F" stroke="#8B4513" stroke-width="1">
                <rect x="36" y="10" width="8" height="12" rx="2"/>
                <rect x="58" y="36" width="12" height="8" rx="2"/>
                <rect x="36" y="58" width="8" height="12" rx="2"/>
                <rect x="10" y="36" width="12" height="8" rx="2"/>
                
                <rect x="55" y="18" width="8" height="8" rx="2" transform="rotate(45 59 22)"/>
                <rect x="55" y="54" width="8" height="8" rx="2" transform="rotate(45 59 58)"/>
                <rect x="17" y="54" width="8" height="8" rx="2" transform="rotate(45 21 58)"/>
                <rect x="17" y="18" width="8" height="8" rx="2" transform="rotate(45 21 22)"/>
              </g>
              
              <!-- Center circle -->
              <circle cx="40" cy="40" r="12" fill="#A0522D" stroke="#654321" stroke-width="2"/>
              <circle cx="40" cy="40" r="6" fill="#654321"/>
            </svg>
            <h2 class="saloon-title">★ SALOON SETTINGS ★</h2>
            <p class="saloon-subtitle">~ Customize Your Frontier Experience ~</p>
          </div>

          <div class="settings-scroll">
            <div class="scroll-content">
              
              <div class="settings-section">
                <div class="section-header">
                  <h3 class="section-title">🔊 Audio Preferences</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="setting-panel">
                  <div class="setting-item">
                    <div class="setting-header">
                      <label class="custom-checkbox">
                        <input type="checkbox" class="option-checkbox" id="sound-toggle" ${Ce?"checked":""}>
                        <span class="checkmark"></span>
                        <span class="setting-title">🎵 Sound Effects</span>
                      </label>
                    </div>
                    <p class="setting-desc">Enable atmospheric sounds from the Old West - card shuffling, chip clinking, and saloon ambiance</p>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <div class="section-header">
                  <h3 class="section-title">🎰 Gameplay Features</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="setting-panel">
                  <div class="setting-item">
                    <div class="setting-header">
                      <label class="custom-checkbox">
                        <input type="checkbox" class="option-checkbox" id="auto-fold-enable">
                        <span class="checkmark"></span>
                        <span class="setting-title">🤖 Auto-fold Weak Hands</span>
                      </label>
                    </div>
                    <p class="setting-desc">Let the house automatically fold hands with poor winning chances - saves time on obvious decisions</p>
                    <div class="slider-container" id="auto-fold-slider-container">
                      <div class="slider-header">
                        <span class="slider-icon">🎯</span>
                        <label class="slider-label">Fold hands with less than <span id="auto-fold-percentage">25</span>% win chance</label>
                      </div>
                      <div class="slider-wrapper">
                        <input type="range" class="option-slider" id="auto-fold-threshold" min="5" max="50" value="25" step="5">
                        <div class="slider-track">
                          <div class="slider-fill"></div>
                          <div class="slider-markers">
                            <span class="marker" style="left: 0%">5%</span>
                            <span class="marker" style="left: 50%">25%</span>
                            <span class="marker" style="left: 100%">50%</span>
                          </div>
                        </div>
                      </div>
                      <div class="slider-help">
                        <small>Conservative (5%) → Aggressive (50%)</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <div class="section-header">
                  <h3 class="section-title">📊 Display Options</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="setting-panel">
                  <div class="setting-item">
                    <div class="setting-header">
                      <label class="custom-checkbox">
                        <input type="checkbox" class="option-checkbox" id="show-probabilities">
                        <span class="checkmark"></span>
                        <span class="setting-title">🎲 Hand Probabilities</span>
                      </label>
                    </div>
                    <p class="setting-desc">Show your odds of winning with the current hand - helps make informed betting decisions</p>
                  </div>
                </div>
              </div>

              <div class="settings-footer">
                <div class="sheriff-notice-mini">
                  <p>🤠 Settings are automatically saved to your local saloon records</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      `;case"achievements":const e=Se.getAchievements(),t=Se.getStats();return`
        <div class="achievements-view">
          <div class="sheriff-hall">
            <div class="hall-header">
              <svg width="60" height="60" viewBox="0 0 60 60" class="sheriff-badge">
                <!-- Sheriff Star Badge -->
                <polygon points="30,5 35,20 50,20 38,30 43,45 30,37 17,45 22,30 10,20 25,20" 
                         fill="#DAA520" stroke="#B8860B" stroke-width="2"/>
                <circle cx="30" cy="30" r="8" fill="#B8860B" stroke="#8B4513" stroke-width="1"/>
                <text x="30" y="33" text-anchor="middle" fill="#8B4513" font-size="6" font-weight="bold">HONOR</text>
              </svg>
              <h2 class="view-title">★ HALL OF HONOR ★</h2>
              <p class="view-subtitle">~ Your Legendary Poker Achievements ~</p>
            </div>
            
            <div class="achievements-content">
              <div class="sheriff-notice">
                <div class="notice-scroll">
                  <p class="achievements-note">📜 Your deeds are recorded in the town ledger (stored locally) 📜</p>
                </div>
              </div>
              
              <div class="stats-saloon">
                <div class="saloon-bar">
                  <h3 class="bar-title">🍺 SALOON STATISTICS 🍺</h3>
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-icon">🎰</div>
                      <span class="stat-value">${t.handsPlayed}</span>
                      <span class="stat-label">Hands Played</span>
                    </div>
                    <div class="stat-item">
                      <div class="stat-icon">🏆</div>
                      <span class="stat-value">${t.handsWon}</span>
                      <span class="stat-label">Hands Won</span>
                    </div>
                    <div class="stat-item">
                      <div class="stat-icon">🔥</div>
                      <span class="stat-value">${t.longestStreak}</span>
                      <span class="stat-label">Best Streak</span>
                    </div>
                    <div class="stat-item">
                      <div class="stat-icon">💰</div>
                      <span class="stat-value">$${t.largestPot}</span>
                      <span class="stat-label">Largest Pot</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="achievement-wall">
                <h3 class="wall-title">🎖️ BADGES OF HONOR 🎖️</h3>
                <div class="achievement-grid">
                  ${e.map(n=>{const i=Se.getProgress(n.id),r=n.unlocked,a=Math.floor(i*100);return`
                      <div class="achievement-plaque ${r?"unlocked":"locked"}">
                        <div class="plaque-frame">
                          <div class="plaque-header">
                            <div class="achievement-icon ${r?"unlocked":""}">${n.icon}</div>
                            ${r?'<div class="gold-shine"></div>':""}
                          </div>
                          
                          <div class="achievement-info">
                            <h4 class="achievement-name">${n.name}</h4>
                            <p class="achievement-desc">${n.description}</p>
                            
                            ${r?`<div class="achievement-status unlocked">
                                   <div class="unlock-ribbon">EARNED</div>
                                   <div class="unlock-date">${n.unlockedAt?new Date(n.unlockedAt).toLocaleDateString():""}</div>
                                 </div>`:i>0?`<div class="achievement-progress">
                                     <div class="progress-barrel">
                                       <div class="progress-fill" style="width: ${a}%"></div>
                                       <div class="progress-text">${a}%</div>
                                     </div>
                                   </div>`:`<div class="achievement-status locked">
                                     <div class="lock-ribbon">LOCKED</div>
                                   </div>`}
                          </div>
                          
                          <!-- Decorative nail corners -->
                          <div class="plaque-nails">
                            <div class="nail nail-tl"></div>
                            <div class="nail nail-tr"></div>
                            <div class="nail nail-bl"></div>
                            <div class="nail nail-br"></div>
                          </div>
                        </div>
                      </div>
                    `}).join("")}
                </div>
              </div>
              
              <div class="achievement-summary">
                <div class="summary-scroll">
                  <p class="summary-text">
                    <span class="earned-count">${e.filter(n=>n.unlocked).length}</span> of 
                    <span class="total-count">${e.length}</span> honors earned
                  </p>
                  <div class="summary-decoration">★ ★ ★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;default:return""}}function me(e,t){const n=e.querySelector("#saloon-doors");n&&_==="main"&&n.addEventListener("click",()=>{const a=localStorage.getItem("poker-selected-character");a?t.onCharacterSelected(a):(_="character-select",e.innerHTML=ge(),me(e,t))}),e.querySelectorAll(".menu-btn").forEach(a=>{a.addEventListener("click",s=>{const o=s.currentTarget.dataset.action;o&&(_=o,e.innerHTML=ge(),me(e,t))})});const r=e.querySelector(".back-btn");if(r&&r.addEventListener("click",()=>{_="main",e.innerHTML=ge(),me(e,t)}),_==="character-select"){const a=e.querySelectorAll(".wanted-poster");a.forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.characterId;o&&(a.forEach(l=>l.classList.remove("selected")),s.classList.add("selected"),setTimeout(()=>{t.onCharacterSelected(o)},300))}),s.addEventListener("mouseenter",()=>{s.classList.add("hover")}),s.addEventListener("mouseleave",()=>{s.classList.remove("hover")})})}if(_==="options"){const a=e.querySelector("#sound-toggle");a&&a.addEventListener("change",()=>{Ce=a.checked,localStorage.setItem("poker-sound-enabled",Ce.toString())});const s=e.querySelector("#show-probabilities");if(s){const g=localStorage.getItem("poker-show-probabilities")!=="false";s.checked=g,localStorage.getItem("poker-show-probabilities")||localStorage.setItem("poker-show-probabilities","true"),s.addEventListener("change",()=>{localStorage.setItem("poker-show-probabilities",s.checked.toString())})}const o=e.querySelector("#auto-fold-enable"),l=e.querySelector("#auto-fold-threshold"),d=e.querySelector("#auto-fold-percentage"),u=e.querySelector("#auto-fold-slider-container");if(o&&l&&d&&u){const g=localStorage.getItem("poker-auto-fold-enabled")==="true",m=parseInt(localStorage.getItem("poker-auto-fold-threshold")||"25");o.checked=g,l.value=m.toString(),d.textContent=m.toString(),u.style.display=g?"block":"none",o.addEventListener("change",()=>{const v=o.checked;localStorage.setItem("poker-auto-fold-enabled",v.toString()),u.style.display=v?"block":"none"}),l.addEventListener("input",()=>{const v=parseInt(l.value);d.textContent=v.toString(),localStorage.setItem("poker-auto-fold-threshold",v.toString());const k=(v-5)/45*100,p=e.querySelector(".slider-fill");p&&(p.style.width=`${k}%`)});const c=(m-5)/45*100,f=e.querySelector(".slider-fill");f&&(f.style.width=`${c}%`)}}}const on=Object.freeze(Object.defineProperty({__proto__:null,renderStartScreen:lt},Symbol.toStringTag,{value:"Module"})),Fe=document.getElementById("app");let Te=null;console.log("Rendering start screen...");try{lt(Fe,{onCharacterSelected:e=>{console.log("Character selected:",e),Te=e,localStorage.setItem("poker-selected-character",e),ct()}}),console.log("Start screen rendered successfully")}catch(e){console.error("Error rendering start screen:",e)}function ct(){console.log("Starting game...");try{Fe.innerHTML="";const e=Bt();if(console.log("Store created"),Xt(Fe,e),console.log("App rendered"),Te&&e.getState){const t=e.getState(),n=Object.values(t.players).find(i=>i.seatIndex===0);if(n&&e.setState){const i=at[Te];e.setState({...t,players:{...t.players,[n.id]:{...n,name:i?.name||"Player"}}})}}e.startGame&&(e.startGame(),console.log("Game started"))}catch(e){console.error("Error starting game:",e)}}const ln=Object.freeze(Object.defineProperty({__proto__:null,startGame:ct},Symbol.toStringTag,{value:"Module"}));
