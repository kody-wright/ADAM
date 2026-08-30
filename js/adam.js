const authPage = document.getElementById('authPage');
const appPage = document.getElementById('appPage');
const sidebar = document.getElementById('sidebar');
const mobileMenu = document.getElementById('mobileMenu');
const titles = {
  dashboard:'Dashboard', residents:'Residents', residentProfile:'Resident Profile',
  staff:'Staff', schedule:'Schedule', compliance:'Compliance', facilities:'Facilities',
  billing:'Billing', expenses:'Expenses', settings:'Settings'
};

function showApp(){
  authPage.style.display='none';
  appPage.style.display='block';
  showPage('dashboard');
}
function logout(){
  localStorage.removeItem('adamAuthenticated');
  appPage.style.display='none';
  authPage.style.display='grid';
}
function closeSidebar(){
  sidebar?.classList.remove('show');
  document.getElementById('sidebarBackdrop')?.classList.remove('show');
}
function openSidebar(){
  sidebar?.classList.add('show');
  document.getElementById('sidebarBackdrop')?.classList.add('show');
}
function showPage(name){
  const page=document.getElementById(name);
  if(!page) return;
  document.querySelectorAll('.app-page-section').forEach(p=>p.classList.remove('active'));
  page.classList.add('active');
  document.querySelectorAll('.sidebar .nav-link').forEach(n=>n.classList.toggle('active',n.dataset.page===name));
  const title=document.getElementById('topbarTitle');
  if(title) title.textContent=titles[name]||'ADAM';
  closeSidebar();
  window.scrollTo({top:0,behavior:'smooth'});
}

const loginForm=document.getElementById('loginForm');
loginForm?.addEventListener('submit',e=>{
  e.preventDefault();
  localStorage.setItem('adamAuthenticated','true');
  showApp();
});
document.getElementById('logoutButton')?.addEventListener('click',logout);
mobileMenu?.addEventListener('click',openSidebar);
document.getElementById('sidebarBackdrop')?.addEventListener('click',closeSidebar);

document.addEventListener('click',e=>{
  const target=e.target.closest('[data-page]');
  if(target){
    e.preventDefault();
    showPage(target.dataset.page);
  }
});

const residentSearch=document.getElementById('residentSearch');
residentSearch?.addEventListener('input',e=>{
  const q=e.target.value.trim().toLowerCase();
  document.querySelectorAll('#residentTable tbody tr').forEach(row=>{
    row.style.display=row.dataset.resident.toLowerCase().includes(q)?'':'none';
  });
});

function initials(name){
  return name.split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase();
}
function openResident(name,id='AD-1001',room='101'){
  document.getElementById('profileName').textContent=name;
  const avatar=document.querySelector('.profile-avatar');
  if(avatar) avatar.textContent=initials(name);
  const sub=document.querySelector('#residentProfile .profile-header .text-muted');
  if(sub) sub.textContent=`Resident ID #${id} · Room ${room}`;
  showPage('residentProfile');
}

document.querySelectorAll('.resident-open').forEach(button=>{
  button.addEventListener('click',()=>{
    const row=button.closest('tr');
    openResident(row.dataset.resident,row.dataset.id,row.children[1]?.textContent.trim()||'—');
  });
});

document.querySelectorAll('.profile-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.profile-tab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.profile-content').forEach(x=>x.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`profile-${tab.dataset.tab}`)?.classList.add('active');
  });
});

const addResidentForm=document.getElementById('addResidentForm');
addResidentForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const first=document.getElementById('newFirst').value.trim();
  const last=document.getElementById('newLast').value.trim();
  const room=document.getElementById('newRoom').value.trim();
  const care=document.getElementById('newCare').value;
  const payer=document.getElementById('newPayer').value;
  const name=`${first} ${last}`.trim();
  const id=`AD-${1001+document.querySelectorAll('#residentTable tbody tr').length}`;
  const row=document.createElement('tr');
  row.dataset.resident=name; row.dataset.id=id;
  row.innerHTML=`<td><strong>${name}</strong><div class="small text-muted">ID #${id}</div></td><td>${room}</td><td>${care}</td><td>${payer}</td><td><span class="status-badge status-active">Active</span></td><td><button class="btn btn-sm btn-light resident-open">Open</button></td>`;
  document.querySelector('#residentTable tbody').appendChild(row);
  row.querySelector('.resident-open').addEventListener('click',()=>openResident(name,id,room));
  const modalEl=document.getElementById('residentModal');
  if(window.bootstrap && modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).hide();
  e.target.reset();
});

if(localStorage.getItem('adamAuthenticated')==='true') showApp();
else { authPage.style.display='grid'; appPage.style.display='none'; }

const togglePassword=document.getElementById("togglePassword");
if(togglePassword){togglePassword.addEventListener("click",()=>{const input=document.getElementById("password");const icon=togglePassword.querySelector("i");const visible=input.type==="text";input.type=visible?"password":"text";icon.className=visible?"bi bi-eye":"bi bi-eye-slash";togglePassword.setAttribute("aria-label",visible?"Show password":"Hide password")})}
