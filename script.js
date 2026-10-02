const DOCTORS=[{n:"Dr. Anna Cruz",s:"Family Medicine",e:"👩‍⚕️"},{n:"Dr. Ramon Reyes",s:"Cardiology",e:"👨‍⚕️"}];
const CARE=[{id:1,n:"Laura Martinez",sk:"Cleaning & housekeeping",r:4,c:23,p:20,e:"👩"},{id:2,n:"Mark Stevens",sk:"Companionship for seniors",r:5,c:31,p:20,e:"👨"}];
const SLOTS=["9:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM"];
const STORE=[["Rice (5 kg)",12],["Fresh vegetables",8],["Milk (1 L)",2],["Bread",3],["Eggs (dozen)",4]];
const ACTS=[["Morning Walk Group","Mon, 8:00 AM"],["Bingo Afternoon","Wed, 3:00 PM"],["Coffee & Chat (Online)","Fri, 10:00 AM"],["Garden Club","Sat, 9:00 AM"]];
const S={user:null,tab:"Home",appts:[],orders:[],n:0,profile:{username:"",name:"",email:"",phone:"",birth:"",address:"",ename:"",ephone:"",photo:""},bookings:[],doc:0,care:null,date:nextWed(),slot:"2:00 PM",hours:3,cart:{},joined:{}};
const KEY="senior_platform_v1";
function save(){try{localStorage.setItem(KEY,JSON.stringify({appts:S.appts,orders:S.orders,bookings:S.bookings,joined:S.joined,n:S.n,profile:S.profile}))}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||"null");if(d)Object.assign(S,{appts:d.appts||[],orders:d.orders||[],bookings:d.bookings||[],joined:d.joined||{},n:d.n||0});if(d&&d.profile)Object.assign(S.profile,d.profile)}catch(e){}}
load();
const $=s=>document.querySelector(s);
function nextWed(){const d=new Date();d.setDate(d.getDate()+((3-d.getDay()+7)%7||7));return d.toISOString().slice(0,10)}
function fmt(d){return new Date(d+"T12:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric",year:"numeric"})}
function endT(t,h){let [x,ap]=t.split(" ");let hr=+x.split(":")[0]%12+(ap=="PM"?12:0)+h;let a=hr>=12?"PM":"AM";return (hr%12||12)+":00 "+a}
function stars(n){return "★".repeat(n)+"☆".repeat(5-n)}
function modal(h){save();$("#box").innerHTML=h;$("#modal").classList.add("show")}
function closeM(){$("#modal").classList.remove("show")}

function doLogin(){
 const em=$("#em").value.trim();let u=em.split("@")[0]||"William";u=u[0].toUpperCase()+u.slice(1);
 if(!S.profile.username)S.profile.username=u;
 if(!S.profile.email)S.profile.email=em;
 S.user=S.profile.username;show();
}
function logout(){S.user=null;show()}
function show(){
 save();
 $("#login").classList.toggle("hide",!!S.user);$("#app").classList.toggle("hide",!S.user);
 if(!S.user)return;
 $("#hello").innerHTML=avatar("avs")+"<span>"+esc(S.user)+"</span>";
 $("#nav").innerHTML=["Home","Telemedicine","Grocery Delivery","Caregiver Help","Social Activities","My Schedule","Profile"].map(t=>`<button class="${t==S.tab?"on":""}" onclick="go('${t}')">${t}</button>`).join("");
 const v={Home,Telemedicine,"Grocery Delivery":Grocery,"Caregiver Help":Caregiver,"Social Activities":Social,"My Schedule":Schedule,Profile}[S.tab];
 $("#view").innerHTML=v();
}
function go(t){S.tab=t;show();scrollTo(0,0)}

function Home(){
 const up=S.appts[0]||{doc:"Dr. Anna Cruz",when:"Today, 3:00 PM"};
 return `<div class="row" style="margin-bottom:10px">${avatar("avm")}<h2 style="margin:0">Welcome back, ${esc(S.user)}!</h2></div>
 <div class="grid">
  <button class="tile t1" onclick="go('Telemedicine')">🩺 Telemedicine<small>Video consultations with doctors</small></button>
  <button class="tile t2" onclick="go('Grocery Delivery')">🛍️ Grocery Delivery<small>Order groceries online</small></button>
  <button class="tile t3" onclick="go('Caregiver Help')">🤝 Caregiver Help<small>Find trusted caregivers near you</small></button>
  <button class="tile t4" onclick="go('Social Activities')">🎉 Social Activities<small>Meet friends and join events</small></button>
 </div>
 <h2 style="margin-top:26px">Upcoming Appointment</h2>
 <div class="card row"><div class="av">👩‍⚕️</div><div class="grow"><b>${up.doc}</b><div class="muted">Family Medicine · ${up.when}</div></div><button class="btn" onclick="go('Telemedicine')">Open</button></div>
 <h2>Featured Caregivers</h2>${CARE.map(careCard).join("")}
 <h2>Recent Schedule</h2>${recent()}`;
}
function careCard(c){return `<div class="card row"><div class="av">${c.e}</div><div class="grow"><b>${c.n}</b> <span class="stars">${stars(c.r)}</span> <span class="muted">(${c.c})</span><div class="muted">${c.sk}</div></div><b>$${c.p}/hr</b><button class="btn" onclick="pickCare(${c.id})">Book Now</button></div>`}

function Telemedicine(){
 const d=DOCTORS[S.doc];
 return `<h2>Book a Doctor</h2>
 <div class="card"><label for="ds">Choose a doctor</label>
 <select id="ds" onchange="S.doc=+this.value;show()">${DOCTORS.map((x,i)=>`<option value="${i}" ${i==S.doc?"selected":""}>${x.n} – ${x.s}</option>`).join("")}</select>
 <div class="row" style="margin-top:16px"><div class="av">${d.e}</div><div class="grow"><b style="font-size:22px">${d.n}</b><div class="muted">${d.s}</div></div></div>
 <label for="dd">Date</label><input id="dd" type="date" value="${S.date}" onchange="S.date=this.value">
 <label>Time</label><div class="slots">${SLOTS.map(t=>`<button class="slot ${t==S.slot?"on":""}" onclick="S.slot='${t}';show()">${t}</button>`).join("")}</div>
 <button class="btn" onclick="confirmAppt()">Confirm Appointment</button></div>
 ${S.appts.length?`<h2>My Appointments</h2>`+S.appts.map((a,i)=>`<div class="card row"><div class="grow"><b>${a.doc}</b><div class="muted">${a.when}</div></div><button class="btn g" onclick="startCall(${i})">Join Video Call</button><button class="btn o" onclick="askCancel('appts','${a.id}')">Cancel</button></div>`).join(""):""}
 <div id="call"></div>`;
}
function confirmAppt(){
 S.date=$("#dd").value||S.date;
 S.appts.unshift({id:++S.n,ts:Date.now(),doc:DOCTORS[S.doc].n,when:fmt(S.date)+" · "+S.slot});
 modal(`<div class="ok">✓</div><h3>Appointment Confirmed</h3><p>${DOCTORS[S.doc].n}<br>${fmt(S.date)} at ${S.slot}</p><div class="stack"><button class="btn" onclick="closeM();show()">OK</button></div>`);
}
function startCall(i){
 $("#call").innerHTML=`<h2>Consultation with ${S.appts[i].doc}</h2><div class="video">👩‍⚕️ "Let's discuss your health concerns."<div class="me">You</div></div><div class="stack"><button class="btn o" onclick="show()">End Call</button></div>`;
 $("#call").scrollIntoView({behavior:"smooth"});
}

function Grocery(){
 const tot=STORE.reduce((s,[n,p])=>s+p*(S.cart[n]||0),0);
 return `<h2>Grocery Delivery</h2><div class="card">`+STORE.map(([n,p])=>`<div class="cart"><span>${n} – $${p}</span><span><button class="slot" onclick="cartAdj('${n}',-1)" aria-label="Remove one ${n}">−</button> <b>${S.cart[n]||0}</b> <button class="slot" onclick="cartAdj('${n}',1)" aria-label="Add one ${n}">+</button></span></div>`).join("")+`<p><b>Total: $${tot}.00</b></p><button class="btn g" onclick="order(${tot})">Place Order</button></div>`+secList("orders","My Orders");
}
function cartAdj(n,d){S.cart[n]=Math.max(0,(S.cart[n]||0)+d);show()}
function order(t){if(!t){modal(`<h3>Cart is empty</h3><p>Please add some items first.</p><div class="stack"><button class="btn" onclick="closeM()">OK</button></div>`);return}
 S.orders.unshift({id:++S.n,ts:Date.now(),total:t,items:STORE.filter(([n])=>S.cart[n]).map(([n])=>S.cart[n]+"× "+n).join(", ")});S.cart={};modal(`<div class="ok">✓</div><h3>Order Placed</h3><p>Total $${t}.00. Delivery arrives tomorrow morning.</p><div class="stack"><button class="btn" onclick="closeM();show()">OK</button></div>`)}

function Social(){
 return `<h2>Social Activities</h2>`+ACTS.map(([n,w],i)=>`<div class="card row"><div class="grow"><b>${n}</b><div class="muted">${w}</div></div>${S.joined[i]?`<button class="btn g" onclick="askCancel('joined','${i}')">Joined ✓ · Cancel</button>`:`<button class="btn" onclick="joinAct(${i})">Join</button>`}</div>`).join("");
}
function joinAct(i){S.joined[i]=Date.now();show()}

function Caregiver(){
 if(!S.care)return `<h2>Caregiver Help</h2><p class="muted">Find trusted caregivers near you.</p>`+CARE.map(careCard).join("")+secList("bookings","My Caregiver Bookings");
 const c=CARE.find(x=>x.id==S.care);
 return `<h2>Book Caregiver</h2><div class="card">
 <div class="row"><div class="av">${c.e}</div><div class="grow"><b style="font-size:22px">${c.n}</b> <span class="stars">${stars(c.r)}</span> <span class="muted">(${c.c})</span><div class="muted">${c.sk}</div></div><b>$${c.p}/hr</b></div>
 <ul><li>Assist with cleaning and organizing</li><li>Help with meal preparation</li><li>Offer companionship and support</li></ul>
 <label for="cd">Date</label><input id="cd" type="date" value="${S.date}" onchange="S.date=this.value">
 <label>Start time</label><div class="slots">${SLOTS.map(t=>`<button class="slot ${t==S.slot?"on":""}" onclick="S.slot='${t}';show()">${t}</button>`).join("")}</div>
 <label for="hr">Hours</label><select id="hr" onchange="S.hours=+this.value">${[1,2,3,4,5,6,7].map(h=>`<option ${h==S.hours?"selected":""}>${h}</option>`).join("")}</select>
 <div class="stack" style="justify-content:flex-start"><button class="btn o" onclick="toPay()">Book Now</button><button class="btn l" onclick="S.care=null;show()">Back</button></div></div>`;
}
function pickCare(id){S.care=id;S.tab="Caregiver Help";show();scrollTo(0,0)}
function cur(){const c=CARE.find(x=>x.id==S.care);return{c,total:c.p*S.hours,end:endT(S.slot,S.hours)}}
function toPay(){
 S.date=$("#cd").value||S.date;S.hours=+$("#hr").value;const{c,total}=cur();
 modal(`<h3>Complete Your Booking</h3><p class="muted">${c.n} · ${fmt(S.date)} · ${S.slot}</p>
 <div style="text-align:left"><label for="cn">Card Number</label><input id="cn" inputmode="numeric" placeholder="1234 5678 9012 3456">
 <label for="ex">Expiration Date</label><input id="ex" placeholder="MM/YY">
 <label for="cv">CVV</label><input id="cv" inputmode="numeric" placeholder="123">
 <label for="ba">Billing Address</label><input id="ba" placeholder="Street, City"></div>
 <div class="stack"><button class="btn g" onclick="pay()">Confirm &amp; Pay $${total}.00</button><button class="btn l" onclick="closeM()">Cancel</button></div>
 <p class="muted">Demo only. No real payment is made. Do not enter real card numbers.</p>`);
}
let last=null;
function pay(){
 const{c,total,end}=cur();
 last={id:++S.n,ts:Date.now(),n:c.n,svc:"Companionship & Cleaning",date:S.date,slot:S.slot,end,total};S.bookings.unshift(last);
 modal(`<div class="ok">✓</div><h3>Payment Successful!</h3><p>You've booked ${c.n} for companionship on ${fmt(S.date)} at ${S.slot}. $${total}.00 paid.</p>
 <div class="stack"><button class="btn g" onclick="details()">View Booking Details</button><button class="btn l" onclick="calAdd()">Add to Calendar</button></div>`);
}
function details(){
 modal(`<h3>Your Booking Details</h3><div class="ok">✓</div><div class="kv"><b>Caregiver:</b> ${last.n}<br><b>Service:</b> ${last.svc}<br><b>Date &amp; Time:</b> ${fmt(last.date)} at ${last.slot}<br><b>Total Paid:</b> $${last.total}.00</div>
 <div class="stack"><button class="btn l" onclick="calAdd()">Add to Calendar</button><button class="btn" onclick="msg()">Message ${last.n.split(" ")[0]}</button></div>`);
}
function msg(){modal(`<h3>Message ${last.n}</h3><textarea rows="4" style="width:100%;font:inherit;padding:10px;border-radius:10px;border:2px solid var(--line)" placeholder="Type your message..."></textarea><div class="stack"><button class="btn" onclick="sent()">Send</button><button class="btn l" onclick="closeM()">Cancel</button></div>`)}
function sent(){modal(`<div class="ok">✓</div><h3>Message Sent</h3><div class="stack"><button class="btn" onclick="closeM();S.care=null;go('Home')">Close</button></div>`)}
function calAdd(){
 modal(`<h3>Add to Calendar</h3><div class="kv" style="text-align:left"><b>Event Title:</b> Caregiver Visit - ${last.n}<br><b>Date:</b> ${fmt(last.date)}<br><b>Time:</b> ${last.slot} - ${last.end}<br><b>Calendar:</b> Google Calendar</div>
 <div class="stack"><button class="btn" onclick="calSave()">Save to Calendar</button><button class="btn l" onclick="copyLink()">Copy Link</button></div>`);
}
function gcalUrl(){const d=last.date.replace(/-/g,"");const t=s=>{let[x,a]=s.split(" ");let h=+x.split(":")[0]%12+(a=="PM"?12:0);return String(h).padStart(2,"0")+"0000"};
 return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent("Caregiver Visit - "+last.n)+"&dates="+d+"T"+t(last.slot)+"/"+d+"T"+t(last.end)}
function calSave(){
 window.open(gcalUrl(),"_blank");
 modal(`<div class="ok">✓</div><h3>Event Added to Calendar</h3><p>Your visit with ${last.n} has been saved to your Google Calendar.</p><div class="kv" style="text-align:left"><b>Service:</b> ${last.svc}<br><b>Date:</b> ${fmt(last.date)}<br><b>Time:</b> ${last.slot} - ${last.end}</div><div class="stack"><button class="btn" onclick="closeM();S.care=null;go('Home')">Close</button></div>`);
}
function copyLink(){try{navigator.clipboard.writeText(gcalUrl())}catch(e){}modal(`<div class="ok">✓</div><h3>Link Copied</h3><div class="stack"><button class="btn" onclick="closeM()">OK</button></div>`)}


/* ---------- My Schedule: recent activity + cancel ---------- */
function items(){
 const L=[];
 S.appts.forEach(a=>L.push({t:"appts",id:a.id,ts:a.ts,icon:"🩺",type:"Telemedicine",title:a.doc,sub:a.when}));
 S.orders.forEach(o=>L.push({t:"orders",id:o.id,ts:o.ts,icon:"🛍️",type:"Grocery Delivery",title:"Order · $"+o.total+".00",sub:o.items+" · Delivery tomorrow morning"}));
 S.bookings.forEach(b=>L.push({t:"bookings",id:b.id,ts:b.ts,icon:"🤝",type:"Caregiver Help",title:b.n+" · "+b.svc,sub:fmt(b.date)+" · "+b.slot+" - "+b.end+" · $"+b.total+".00"}));
 Object.keys(S.joined).filter(k=>S.joined[k]).forEach(k=>L.push({t:"joined",id:k,ts:S.joined[k],icon:"🎉",type:"Social Activities",title:ACTS[k][0],sub:ACTS[k][1]}));
 return L.sort((a,b)=>b.ts-a.ts);
}
function itemCard(x){
 return `<div class="card row"><div class="av">${x.icon}</div><div class="grow"><span class="tag">${x.type}</span><div><b>${x.title}</b></div><div class="muted">${x.sub}</div></div><button class="btn o" onclick="askCancel('${x.t}','${x.id}')">Cancel</button></div>`;
}
function secList(t,title){
 const L=items().filter(x=>x.t==t);
 return L.length?`<h2>${title}</h2>`+L.map(itemCard).join(""):"";
}
function recent(){
 const L=items();
 if(!L.length)return `<div class="card muted">No recent activity yet. Book a doctor, order groceries, hire a caregiver or join an activity.</div>`;
 return L.slice(0,4).map(itemCard).join("")+(L.length>4?`<p><button class="btn l" onclick="go('My Schedule')">See all (${L.length})</button></p>`:"");
}
function Schedule(){
 const L=items();
 let h=`<h2>My Schedule</h2><p class="muted">Your recent bookings and orders. Changed your mind? Tap Cancel.</p>`;
 if(!L.length)return h+`<div class="card muted">Nothing scheduled yet.</div>`;
 [["appts","🩺 Telemedicine Appointments"],["orders","🛍️ Grocery Orders"],["bookings","🤝 Caregiver Bookings"],["joined","🎉 Social Activities"]].forEach(([t,title])=>{
  const g=L.filter(x=>x.t==t);
  if(g.length)h+=`<h2 style="font-size:22px">${title}</h2>`+g.map(itemCard).join("");
 });
 return h;
}
function askCancel(t,id){
 const x=items().find(i=>i.t==t&&String(i.id)==String(id));
 if(!x)return;
 modal(`<h3>Cancel this?</h3><div class="kv" style="text-align:left"><span class="tag">${x.type}</span><br><b>${x.title}</b><br>${x.sub}</div><div class="stack"><button class="btn o" onclick="doCancel('${t}','${id}')">Yes, Cancel It</button><button class="btn l" onclick="closeM()">No, Keep It</button></div>`);
}
function doCancel(t,id){
 if(t=="appts")S.appts=S.appts.filter(a=>String(a.id)!=String(id));
 if(t=="orders")S.orders=S.orders.filter(o=>String(o.id)!=String(id));
 if(t=="bookings")S.bookings=S.bookings.filter(b=>String(b.id)!=String(id));
 if(t=="joined")delete S.joined[id];
 modal(`<div class="ok">✓</div><h3>Cancelled</h3><p>It has been removed from your schedule.</p><div class="stack"><button class="btn" onclick="closeM();show()">OK</button></div>`);
}


/* ---------- Profile ---------- */
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function avatar(cls){
 const p=S.profile.photo||"";
 if(p.startsWith("data:image/"))return `<img class="${cls}" src="${p}" alt="Profile picture">`;
 return `<span class="${cls}" aria-hidden="true">${p.startsWith("emoji:")?p.slice(6):"👤"}</span>`;
}
function Profile(){
 const p=S.profile;
 const f=(id,l,v,type,ph)=>`<div><label for="${id}">${l}</label><input id="${id}" type="${type||"text"}" value="${esc(v)}" placeholder="${ph||""}" maxlength="80"></div>`;
 return `<h2>My Profile</h2>
 <div class="card">
  <div class="row" style="gap:22px">${avatar("avl")}
   <div class="grow"><b style="font-size:24px">${esc(p.name||p.username)}</b><div class="muted">@${esc(p.username)}</div>
    <div class="stack" style="justify-content:flex-start">
     <input id="pf" type="file" accept="image/*" class="sr" onchange="upPhoto(this)">
     <label class="btn" for="pf" style="margin:0">📁 Upload from my files</label>
     <button class="btn l" onclick="S.profile.photo='';show()">Remove Photo</button>
    </div></div></div>
  <label>Or choose a picture</label>
  <div class="slots">${["👴","👵","🧓","😊","🙂","😎"].map(e=>`<button class="slot ${p.photo=="emoji:"+e?"on":""}" onclick="pickEmoji('${e}')" aria-label="Choose avatar ${e}">${e}</button>`).join("")}</div>
 </div>
 <div class="card"><div class="grid2">
  ${f("pu","Username",p.username,"text","Your username")}
  ${f("pn","Full Name",p.name,"text","e.g. William Reyes")}
  ${f("pe","Email",p.email,"email")}
  ${f("pp","Phone Number",p.phone,"tel")}
  ${f("pb","Birth Date",p.birth,"date")}
  ${f("pa","Home Address",p.address)}
  ${f("pc","Emergency Contact Name",p.ename)}
  ${f("pq","Emergency Contact Phone",p.ephone,"tel")}
 </div>
 <div class="stack" style="justify-content:flex-start"><button class="btn g" onclick="saveProfile()">Save Profile</button></div></div>`;
}
function saveProfile(){
 const g=id=>$("#"+id).value.trim();
 if(!g("pu")){modal(`<h3>Username needed</h3><p>Please enter a username.</p><div class="stack"><button class="btn" onclick="closeM()">OK</button></div>`);return}
 Object.assign(S.profile,{username:g("pu"),name:g("pn"),email:g("pe"),phone:g("pp"),birth:g("pb"),address:g("pa"),ename:g("pc"),ephone:g("pq")});
 S.user=S.profile.username;
 modal(`<div class="ok">✓</div><h3>Profile Updated</h3><p>Your information has been saved.</p><div class="stack"><button class="btn" onclick="closeM();show()">OK</button></div>`);
}
function pickEmoji(e){S.profile.photo="emoji:"+e;show()}
function upPhoto(inp){
 const file=inp.files&&inp.files[0];if(!file)return;
 const bad=m=>modal(`<h3>Could not use that file</h3><p>${m}</p><div class="stack"><button class="btn" onclick="closeM()">OK</button></div>`);
 if(!file.type.startsWith("image/"))return bad("Please choose an image file (JPG, PNG, etc.).");
 if(file.size>15*1024*1024)return bad("That image is too large. Please choose one under 15 MB.");
 const r=new FileReader();
 r.onerror=()=>bad("The file could not be read.");
 r.onload=()=>{
  const im=new Image();
  im.onerror=()=>bad("That image could not be opened.");
  im.onload=()=>{
   const s=Math.min(im.width,im.height),c=document.createElement("canvas");c.width=c.height=256;
   c.getContext("2d").drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,256,256);
   S.profile.photo=c.toDataURL("image/jpeg",0.85);show();
  };
  im.src=r.result;
 };
 r.readAsDataURL(file);
}

$("#modal").addEventListener("click",e=>{if(e.target.id=="modal")closeM()});
show();