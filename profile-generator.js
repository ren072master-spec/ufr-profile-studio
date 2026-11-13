(()=>{'use strict';
const G=id=>document.getElementById(id), rnd=(a,b)=>Math.round(a+Math.random()*(b-a)),pick=a=>a[rnd(0,a.length-1)];
const surnames=['成瀬','相沢','朝倉','篠原','藤崎','瀬戸','桐生','水瀬','白石','橘','佐倉','高瀬','神谷','宮原'];
const given=[['朱莉','あかり'],['凛','りん'],['玲奈','れいな'],['美緒','みお'],['莉子','りこ'],['紗季','さき'],['美月','みづき'],['結衣','ゆい'],['彩乃','あやの'],['千尋','ちひろ']];
const cities=['神奈川県川崎市','東京都世田谷区','大阪府大阪市','京都府京都市','愛知県名古屋市','福岡県福岡市','北海道札幌市','兵庫県神戸市','千葉県船橋市'];
const jobs=['アパレル販売員','図書館職員','編集者','Webデザイナー','事務職','研究補助員','ホテルスタッフ','美容師','翻訳者','書店員','花屋店員','カフェスタッフ','写真スタジオ職員'];
const ranks=['S','A','B','C','D'];
const dept=['中央登録局','第3地域管理課','統合記録審査室','広域行政監査部'];
const d=new Date(), today=d.toISOString().slice(0,10), datetime=today+'T09:00';
const pad=n=>String(n).padStart(2,'0');
const bridge=window.UFRBridge; if(!bridge)throw Error('UFR本体との連携を初期化できません');
const fields=bridge.fields, map=Object.fromEntries(fields.map(f=>[f.id,f]));
let locks={},currentTab=fields[0].category;
function key(){return 'ufr-gen-locks-v08-'+String(bridge.people[bridge.getIndex()]?.id||'draft')}
function loadLocks(){try{locks=JSON.parse(localStorage.getItem(key())||'{}')||{}}catch{locks={}}}
function persist(){try{localStorage.setItem(key(),JSON.stringify(locks))}catch{}}
function v(id){return bridge.people[bridge.getIndex()]?.values?.[id]}
function put(id,x){if(!bridge.people[bridge.getIndex()])return;bridge.people[bridge.getIndex()].values[id]=x;if(id==='01-001')bridge.people[bridge.getIndex()].id=String(x);if(id==='01-002')bridge.people[bridge.getIndex()].name=String(x);if(id==='01-006')bridge.people[bridge.getIndex()].age=Number(x)||18}
function dob(age){let year=d.getFullYear()-age-1;let month=rnd(1,12),day=rnd(1,28);return `${year}-${pad(month)}-${pad(day)}`}
function dateAfter18(){const born=v('01-005');if(!born)return today;let x=new Date(born);x.setFullYear(x.getFullYear()+18);return x.toISOString().slice(0,10)}
function history(type){const city=v('01-010')||'登録地域',job=v('04-006')||'一般職',office=pick(dept),start=dateAfter18();
 const lines={
 '01-004':`旧名変更：0件／現氏名を登録時より継続`,
 '01-011':`${start}｜成人登録時住所：${city}\n${today}｜居住地照合済み`,
 '01-013':`${start}｜生体照合・戸籍照合完了／照合符号 ID-${rnd(1000,9999)}`,
 '01-017':`世帯情報：保護者2名・きょうだい${rnd(0,2)}名／登録済み`,
 '02-016':`${today}｜定期身体計測実施／基準値更新`,
 '03-006':`${start}｜初回登録検査完了\n${today}｜定期健診：総合判定A`,
 '03-009':`定期処方：0件／照合済み`,
 '03-011':`手術歴：0件／照合済み`,
 '03-012':`入院歴：0件／照合済み`,
 '03-013':`${today}｜定期婦人科診察：受診済み`,
 '03-014':`${today}｜登録検査：実施済み／結果コード R-${rnd(100,999)}`,
 '03-015':`妊娠歴：${v('05-012')||0}件（架空設定）／登録照合済み`,
 '03-016':`出産歴：${v('05-012')||0}件（架空設定）／登録照合済み`,
 '04-002':`高校卒業｜${rnd(2015,2022)}年／地域教育局照合済み`,
 '04-005':`最終課程：総合評定${pick(['A','B','B+'])}／教育局記録`,
 '04-008':`${start}｜${job}として就業登録\n${today}｜就業記録更新`,
 '04-011':`交際歴：${rnd(0,3)}件／申告記録と行政照合を統合`,
 '04-012':`登録交友関係：${rnd(3,12)}名／記録更新済み`,
 '04-015':`SNS登録：${rnd(1,4)}アカウント／ID照合済み`,
 '04-017':`国内移動${rnd(2,12)}件・国外渡航${rnd(0,2)}件／出入域照合済み`,
 '05-005':`婚姻届出履歴：${v('05-001')==='既婚'?'1':'0'}件／照合済み`,
 '05-006':`離婚届出履歴：${v('05-001')==='離婚'?'1':'0'}件／照合済み`,
 '05-009':`保護登録変更：${v('05-007')==='有効'?'1':'0'}件／${office}`, 
 '05-014':`出生関連届出：${v('05-012')||0}件／登録照合済み`,
 '05-016':`親権管理変更：0件／行政記録確定`,
 '05-018':`${today}｜家族情報定期通知を発行`,
 '06-011':`${start}｜初回評価：${v('06-001')||'B'}\n${today}｜定期評価確定`,
 '07-007':`${start}｜成人登録・公開処理\n${today}｜記録同期完了`,
 '07-011':`${start}｜登録完了通知／送達済み`,
 '07-012':`${today}｜次回定期検査通知／送達済み`,
 '07-013':`行政処分：0件／照合済み`,
 '07-016':`閲覧集計：月間${rnd(10,160)}件／地域平均との比較登録済み`,
 '07-018':`${today}｜生活保障支給処理完了／金額照合済み`,
 '07-019':`${today}｜監査担当${office}／整合性確認済み`,
 'SI-006':`${today}｜国家認証情報を更新`,
 'BR-008':`${today}｜定期指数更新／審査済み`,
 'PM-011':`${today}｜閲覧評価履歴・更新済み`
 };return lines[type]||`${start}｜初回登録照合済み\n${today}｜${office}による定期更新完了`}
function value(f){const id=f.id,t=f.input_type;
 const age=Number(v('01-006'))||24,height=Number(v('02-001'))||162,weight=Number(v('02-002'))||52;
 const names={
 '01-001':()=>`UFR-JP-${rnd(100000,999999)}`,
 '01-002':()=>pick(surnames)+' '+pick(given)[0],
 '01-003':()=>given.find(x=>String(v('01-002')||'').endsWith(x[0]))?.[1]||'あかり',
 '01-005':()=>dob(rnd(18,42)),
 '01-006':()=>{let birth=new Date(v('01-005'));return isNaN(birth)?24:Math.max(18,d.getFullYear()-birth.getFullYear()-(d<new Date(d.getFullYear(),birth.getMonth(),birth.getDate())?1:0))},
 '01-007':()=> '日本','01-008':()=> '日本','01-009':()=>pick(cities),'01-010':()=>pick(cities),
 '01-014':()=>['日本語','日本語・英語'],
 '01-015':()=>`+81-90-${rnd(1000,9999)}-${rnd(1000,9999)}（架空）`,
 '01-016':()=>`緊急連絡コード EC-${rnd(100000,999999)}`,
 '01-018':()=>dateAfter18()+'T09:00','01-019':()=>datetime,
 '01-020':()=>['住民登録簿','医療統合台帳','教育履歴','行政照合'],
 '02-001':()=>rnd(150,175),
 '02-002':()=>Math.round(52+(height-162)*.52+rnd(-6,6)),
 '02-003':()=>+(weight/(height/100)**2).toFixed(1),
 '02-004':()=>rnd(78,102),'02-005':()=>rnd(59,81),'02-006':()=>rnd(84,105),
 '02-007':()=>pick(['標準','細身','運動型']),
 '02-008':()=>pick(['A','B','O','AB']),'02-009':()=>pick(['+','-']),
 '02-010':()=>pick(['右','左','両利き']),'02-011':()=>pick(['黒','栗色','アッシュベージュ','ダークブラウン']),
 '02-012':()=>pick(['茶色','暗褐色','黒褐色']),
 '02-013':()=>`識別特徴：左手首に小さなほくろ／照合精度${rnd(96,99)}%（架空）`,
 '02-014':()=>today,'02-015':()=>pick(dept),
 '02-017':()=>pick(ranks),'02-018':()=>rnd(2,98),'02-019':()=>today,
 '02-020':()=>pick(['外見登録を確定。登録者本人への記録開示は行わない。','身体記録は認可閲覧者向けに更新。本人による修正は不可。','服装・姿勢の影響を注記したうえで記録確定。閲覧権限は管理側に限定。']),
 '03-001':()=> '完了','03-002':()=>dateAfter18(),'03-003':()=> '実施済み','03-004':()=>`${d.getFullYear()+1}-05-15`,
 '03-005':()=>pick(['地域総合医療センター','中央検査機構','第2登録医療局']),
 '03-007':()=>['重大既往歴0件','登録済み'],'03-008':()=>['継続治療0件','定期診察済み'],
 '03-010':()=>['既知アレルギー0件','確認済み'],
 '03-017':()=>`定期健診結果：基準範囲内／追跡対象0件（架空）`,
 '03-018':()=>pick(['通常管理','定期審査区分A','定期審査区分B']),
 '03-019':()=> '猶予なし','03-020':()=> '国家検査確定',
 'UFR-EX-01':()=>pick(['未経験申告','経験申告','経験申告','記録不明']),
 'UFR-EX-02':()=>v('UFR-EX-01')==='記録不明'?'登録記録なし':'本人申告',
 'UFR-EX-03':()=>v('UFR-EX-01')==='記録不明'?0:pick([0,0,0,0,0,1,1,2]),
 'UFR-EX-04':()=>Number(v('UFR-EX-03'))>0?pick(['審査中','審査中','訂正済','登録維持']):v('UFR-EX-01')==='記録不明'?'未登録':'登録済',
 'UFR-EX-05':()=>{const start=dateAfter18(),status=v('UFR-EX-04')||'登録済',n=Number(v('UFR-EX-03'))||0;const lines=[`${start}｜成人登録：${v('UFR-EX-01')||'記録不明'}／${v('UFR-EX-02')||'本人申告'}`];if(n>0)lines.push(`${today}｜男性市民から異議${n}件を受付／処理状態：${status}`);else lines.push(`${today}｜異議申立て0件／状態：${status}`);return lines},
 '04-001':()=>pick(['高等学校卒','専門学校卒','大学卒']),
 '04-003':()=> '修了','04-004':()=>pick([['普通自動車免許'],['語学資格B2'],['販売士資格']]),
 '04-006':()=>pick(jobs),'04-007':()=>pick(['地域商業センター','都内専門店','中央サービス事業所','民間研究施設']),
 '04-009':()=>pick(['正規雇用','非正規雇用','自営業']),
 '04-010':()=>rnd(220,520)*10000,
 '04-013':()=>pick(['単身居住','家族同居','共同住宅']),
 '04-014':()=>[pick(['読書','映画','写真','料理']),pick(['散歩','音楽','旅行','園芸'])],
 '04-016':()=>true,'04-018':()=>['地域居住者登録会'],'04-019':()=>today,
 '04-020':()=>['教育記録','通信台帳','就業記録'],
 '05-001':()=>pick(['未婚','未婚','既婚','離婚']),
 '05-002':()=>v('05-001')==='既婚'?`${d.getFullYear()-rnd(1,4)}-06-18`:'該当なし',
 '05-003':()=>v('05-001')==='既婚'?`SP-${rnd(100000,999999)}`:'該当者なし',
 '05-004':()=>v('05-001')==='既婚'?'配偶者識別名：登録済み':'該当者なし',
 '05-007':()=>v('05-001')==='既婚'?pick(['有効','なし']):'対象外',
 '05-008':()=>v('05-007')==='有効'?today:'対象外',
 '05-010':()=>v('05-001')==='既婚'?'配偶者と同居':pick(['単身','家族と同居']),
 '05-011':()=>`HH-${rnd(100000,999999)}`,
 '05-012':()=>v('05-001')==='既婚'?rnd(0,2):0,
 '05-013':()=>Number(v('05-012'))?Array.from({length:Number(v('05-012'))},()=>`CH-${rnd(100000,999999)}`):['該当者0名'],
 '05-015':()=>Number(v('05-012'))?'世帯法定管理者：登録済み':'対象外',
 '05-017':()=>Number(v('05-012'))?'養育状況：定期照合済み':'対象外',
 '05-019':()=>pick(['世帯構成を確定。本人による閲覧・訂正は管理者承認制。','世帯記録を管理権限者へ共有。本人への変更通知は省略。','扶養関係を照合。異議申立ては記録のみ保全し、処理を継続。']),
 '05-020':()=>today,
 '06-001':()=>v('02-017')||pick(ranks),'06-002':()=>v('02-018')||rnd(2,98),
 '06-003':()=>pick(ranks),'06-004':()=>rnd(2,98),
 '06-005':()=>pick(['一般管理A','一般管理B','定期監査']),
 '06-006':()=>rnd(120,850)*10000,'06-007':()=> 'JPY','06-008':()=> 'UFR-2026.4',
 '06-009':()=>today,'06-010':()=>`${d.getFullYear()+1}-11-01`,
 '06-012':()=>pick(dept),'06-013':()=>['登録履歴','定期審査','行政照合'],
 '06-014':()=> '確定','06-015':()=>false,'06-016':()=>false,
 '06-017':()=>v('05-007')==='有効'?'保護登録反映済み':'通常管理',
 '06-018':()=>pick(['基礎生活保障A','基礎生活保障B']),
 '06-019':()=>rnd(8,16)*10000,
 '06-020':()=>pick([`行政評価${v('06-001')||'B'}を確定。本人による審査資料の閲覧は認められない。`,`生活保障と監督区分を管理側で決定。本人の希望は審査要件に含まれない。`,`記録は認可閲覧者へ公開。本人に訂正権限は付与されない。`]),
 '07-001':()=> '有効','07-002':()=>dateAfter18()+'T09:00','07-003':()=>dateAfter18()+'T09:05',
 '07-004':()=> '公開','07-005':()=> '全域公開','07-006':()=>datetime,
 '07-008':()=>rnd(2,30),'07-009':()=>['住民台帳','教育台帳','検査台帳'],
 '07-010':()=> '監査確定','07-014':()=>rnd(120,2600),
 '07-015':()=> '直近12か月','07-017':()=>rnd(1,80)*10000,
 '07-020':()=>pick(dept),
 'SI-001':()=>`SI-${rnd(100000,999999)}`,'SI-003':()=>dateAfter18(),
 'SI-004':()=>pick(dept),'SI-005':()=> '認証済',
 'SI-007':()=>`SEAL-${rnd(100000,999999)}`,
 'SI-008':()=>pick(['認証符号を確定。本人への原本交付は禁止。','認証台帳を更新。認可閲覧者への照会に対応。','本人の異議を受理せず、登録を継続。']),
 'BR-001':()=>`BR-${rnd(100000,999999)}`,'BR-002':()=>today,'BR-003':()=>pick(dept),
 'BR-004':()=>rnd(20,85),'BR-005':()=>pick(ranks),'BR-006':()=>rnd(2,98),
 'BR-007':()=> '確定','BR-009':()=>`BRM-${rnd(100,999)}`,
 'BR-010':()=>pick(['架空行政指数を確定。本人による評価根拠の照会は不可。','指数改定は管理局権限。本人の意見は採点対象外。','認可閲覧者向けの分類指数。医学的測定値ではない。']),
 'PM-001':()=>Math.min(99,Math.max(12,Math.round(60+((Number(v('02-004'))||88)-(Number(v('02-005'))||70))*0.65+((Number(v('02-006'))||92)-(Number(v('02-005'))||70))*0.45+rnd(-18,18)))),
 'PM-002':()=>Number(v('PM-001'))>=80?'高注目':Number(v('PM-001'))>=60?'標準以上':'一般',
 'PM-003':()=>pick(['細身シルエット','均整型シルエット','曲線型シルエット','スポーティ型シルエット']),
 'PM-004':()=>{const b=Number(v('02-004'))||88,w=Number(v('02-005'))||70;return b-w>=23?'上半身の輪郭が強調される構成':b-w>=13?'上半身の輪郭が明瞭':'直線的な上半身ライン'},
 'PM-005':()=>{const w=Number(v('02-005'))||70,h=Number(v('02-006'))||92,r=+(w/h).toFixed(2);return `WHR ${r}／${r<0.72?'くびれ強調型':r<0.82?'標準曲線型':'直線型'}`},
 'PM-006':()=>{const h=Number(v('02-001'))||162;return h>=170?'長身・縦長構成':h<=156?'小柄・コンパクト構成':'中背・均整構成'},
 'PM-007':()=>pick(['輪郭・シルエットへの関心が集中','全身バランスへの関心が優勢','衣装別の印象比較が多い','顔立ちと体型の総合評価が中心']),
 'PM-008':()=>{const a=[v('PM-003')||'均整型',v('PM-002')||'一般'];return [...a,pick(['衣装映え','高閲覧','都市部人気','クラシック志向'])]},
 'PM-009':()=>Math.max(10,Math.round((Number(v('07-014'))||300)*rnd(30,75)/100)),
 'PM-010':()=>`男性閲覧市場の公開評価：${v('PM-002')||'一般'}。${v('PM-003')||'均整型'}として分類。注目の中心は「${v('PM-007')||'全身バランス'}」。登録者本人の希望ではなく、閲覧者側の選好に基づく格付け。`,
 'PM-011':()=>[`${dateAfter18()}｜成人登録時の閲覧評価を開始`,`${today}｜注目指数 ${v('PM-001')||60}／${v('PM-002')||'一般'}として公開更新`]

 };
 if(names[id])return names[id]();
 if(t==='image')return v(id)||'';
 if(t==='history')return history(id).split('\n');
 if(t==='multi')return [`${f.name}：照合済み`,`${pick(dept)}管理記録`];
 if(t==='boolean')return false;
 if(t==='date')return today;
 if(t==='datetime')return datetime;
 if(t==='number')return rnd(1,100);
 if(t==='textarea')return `${f.name}：定期審査を実施。${pick(dept)}による確認完了。`;
 if(t==='select')return '確定';
 return `${f.name}：${pick(dept)}にて登録確定`;
}
const early=['01-001','01-002','01-005','01-006','02-001','02-002','02-003','02-005','02-006','04-006','05-001','05-007','05-012','02-017','02-018','02-004','02-005','02-006','07-014','PM-001','PM-002','PM-003','PM-007','UFR-EX-01','UFR-EX-02','UFR-EX-03','UFR-EX-04'];
function one(id){if(locks[id]||!map[id]||map[id].input_type==='image')return;if(id.startsWith('PM-')&&v(id)!==undefined&&v(id)!==null&&typeof v(id)==='number'){const legacy='legacy-v08-'+id;if(v(legacy)===undefined)put(legacy,v(id));}put(id,value(map[id]));if(id==='01-002'&&!locks['01-003'])put('01-003',value(map['01-003']));if(id==='01-005'&&!locks['01-006'])put('01-006',value(map['01-006']));if(id==='02-001'||id==='02-002'){if(!locks['02-003'])put('02-003',value(map['02-003']))}}
function all(newPerson){if(newPerson){const id='UFR-JP-'+rnd(100000,999999);bridge.people.unshift({id,name:'新規登録',age:24,values:{'01-001':id}});bridge.setIndex(0);locks={};}for(const id of early)one(id);for(const f of fields)if(!early.includes(f.id))one(f.id);bridge.save();bridge.render();paint();}
function paint(){const tabs=G('genTabs');tabs.replaceChildren();[...new Set(fields.map(f=>f.category))].forEach(g=>{const b=document.createElement('button');b.textContent=g;b.className=g===currentTab?'on':'';b.onclick=()=>{currentTab=g;paint()};tabs.append(b)});const box=G('genFields');box.replaceChildren();for(const f of fields.filter(x=>x.category===currentTab)){const wrap=document.createElement('div');wrap.className='gen-item'+(['history','textarea','multi'].includes(f.input_type)?' wide':'');const lab=document.createElement('label');lab.textContent=f.id+' · '+f.name;wrap.append(lab);let input;const t=f.input_type,cur=v(f.id);if(t==='textarea'||t==='history'||t==='multi'){input=document.createElement('textarea');input.rows=2;input.value=Array.isArray(cur)?cur.join('\n'):String(cur??'')}else if(t==='boolean'){input=document.createElement('input');input.type='checkbox';input.checked=!!cur}else{input=document.createElement('input');input.type=t==='number'||t==='computed'?'number':t==='date'?'date':t==='datetime'?'datetime-local':'text';input.value=cur??'';if(t==='image')input.placeholder='画像は本体の編集欄で登録';input.readOnly=t==='image'||t==='computed'}input.onchange=()=>{let x=t==='boolean'?input.checked:t==='number'?Number(input.value):t==='history'||t==='multi'?input.value.split('\n').filter(Boolean):input.value;put(f.id,x);locks[f.id]=true;persist();bridge.save();bridge.render();paint()};wrap.append(input);const row=document.createElement('div');row.className='gen-row';const roll=document.createElement('button');roll.textContent='↻ この項目';roll.disabled=!!locks[f.id]||t==='image'||t==='computed';roll.onclick=()=>{one(f.id);bridge.save();bridge.render();paint()};const lock=document.createElement('button');lock.className='subtle';lock.textContent=locks[f.id]?'🔒 固定中':'🔓 固定';lock.onclick=()=>{locks[f.id]=!locks[f.id];persist();paint()};row.append(roll,lock);wrap.append(row);box.append(wrap)}G('genSummary').textContent=`全${fields.length}項目／固定 ${Object.values(locks).filter(Boolean).length}項目／${bridge.people[bridge.getIndex()]?.name||''}（${bridge.people[bridge.getIndex()]?.age||''}歳）`;}
G('genOpen').onclick=()=>{loadLocks();G('genMask').classList.add('show');paint()};G('genClose').onclick=()=>G('genMask').classList.remove('show');G('genApply').onclick=()=>{bridge.save();bridge.render();G('genMask').classList.remove('show')};G('genAll').onclick=()=>{try{all(true);persist();G('genSummary').textContent+=' ／ 新規人物を生成しました';}catch(e){console.error('UFR generator:',e);G('genSummary').textContent='生成エラー：'+e.message;alert('生成に失敗しました：'+e.message)}};G('genUnlocked').onclick=()=>{try{all(false)}catch(e){console.error(e);G('genSummary').textContent='再生成エラー：'+e.message}};G('genUnlock').onclick=()=>{locks={};persist();paint()};
})();