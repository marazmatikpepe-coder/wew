const $ = (s) => document.querySelector(s);
const screens = { intro: $('#intro'), menu: $('#mainMenu'), settings: $('#settingsScreen'), info: $('#infoScreen') };
const video = $('#introVideo');
const music = $('#menuMusic');
let currentScreen = 'intro';
let activeTab = 'Gameplay';
let selectedIndex = 0;
let toastTimer;
const tabs = ['Control Scheme','Controller','Gameplay','Display','UI','Camera','Audio','Accessibility'];
const defaults = {
  'Control Scheme': [
    ['On Foot Controls','Standard','Choose the control layout used while on foot.','cycle',['Standard','Alternate','Southpaw']],['Vehicle Controls','Standard','Choose the control layout used while driving.','cycle',['Standard','Alternate']],['Invert Look','Off','Invert the vertical camera axis.','toggle'],['Vibration','On','Enable controller vibration feedback.','toggle']
  ],
  'Controller': [
    ['Controller Type','Default','Select the active controller profile.','cycle',['Default','Classic','Custom']],['Look Sensitivity','5','Adjust camera look sensitivity.','range',1,10],['Aim Sensitivity','5','Adjust aiming sensitivity.','range',1,10],['Left Stick Deadzone','10','Adjust the left stick deadzone.','range',0,30],['Right Stick Deadzone','10','Adjust the right stick deadzone.','range',0,30],['Controller Speaker','On','Enable audio through the controller speaker.','toggle']
  ],
  'Gameplay': [
    ['Targeting','Partial','Choose your preference for aiming lock-on.','cycle',['Assisted','Partial','Free Aim']],['Aim Assist Strength','4','Adjust how strongly aim assist influences targeting.','range',0,10],['Shooting Assist','On','Enable assistance while shooting.','toggle'],['Drive-By Assist','On','Enable aiming assistance from vehicles.','toggle'],['Quick Draw','On','Enable quick draw assistance.','toggle'],['Cover Selection','Camera & Movement','Choose how cover positions are selected.','cycle',['Camera & Movement','Movement','Camera']],['Holster in Vehicle','Automatic','Choose when your weapon is holstered in a vehicle.','cycle',['Automatic','Always','Never']],['Tutorial Messages','On','Show contextual gameplay tips.','toggle'],['Subtitles','On','Display subtitles during dialogue.','toggle'],['Auto Save','On','Automatically save game settings and progress.','toggle']
  ],
  'Display': [
    ['Display Mode','Fullscreen','Choose how the application is displayed.','cycle',['Fullscreen','Windowed','Borderless']],['Resolution','1920 × 1080','Choose the display resolution.','cycle',['1280 × 720','1600 × 900','1920 × 1080','2560 × 1440']],['VSync','On','Synchronize frame output with your display.','toggle'],['Brightness','50','Adjust overall screen brightness.','range',0,100],['Safezone','90','Adjust the visible screen safe area.','range',70,100],['Frame Rate Limit','60 FPS','Set a target frame rate.','cycle',['30 FPS','60 FPS','120 FPS','Unlimited']],['Motion Blur','On','Enable cinematic motion blur.','toggle']
  ],
  'UI': [
    ['HUD','On','Show the heads-up display.','toggle'],['Radar','On','Show the navigation radar.','toggle'],['Radar Size','100','Adjust radar scale.','range',50,150],['Waypoint Route','On','Display route guidance.','toggle'],['Subtitle Size','100','Adjust subtitle size.','range',70,150],['Language','English','Choose interface language.','cycle',['English','Русский','한국어','Español']],['Button Prompts','Automatic','Choose displayed button prompt style.','cycle',['Automatic','PlayStation','Xbox','Keyboard']]
  ],
  'Camera': [
    ['Third Person FOV','50','Adjust third-person field of view.','range',35,75],['First Person FOV','60','Adjust first-person field of view.','range',40,100],['Camera Shake','50','Adjust camera movement intensity.','range',0,100],['Vehicle Camera Height','Default','Adjust the vehicle camera height.','cycle',['Low','Default','High']],['Auto Center Camera','On','Automatically center the camera while moving.','toggle'],['First Person Head Bob','On','Enable first-person head movement.','toggle']
  ],
  'Audio': [
    ['Master Volume','85','Adjust overall application volume.','range',0,100],['Music Volume','75','Adjust menu soundtrack volume.','range',0,100],['Effects Volume','80','Adjust sound effect volume.','range',0,100],['Dialogue Volume','85','Adjust dialogue volume.','range',0,100],['Output Device','Default','Choose the audio output device.','cycle',['Default','System Default']],['Dynamic Range','Full','Choose the audio dynamic range.','cycle',['Night','TV','Full']],['Menu Music','On','Enable or disable the menu soundtrack.','toggle']
  ],
  'Accessibility': [
    ['Colorblind Mode','Off','Apply an alternate color presentation.','cycle',['Off','Type 1','Type 2','Type 3']],['Text Size','100','Adjust interface text size.','range',75,150],['High Contrast','Off','Increase contrast between interface elements.','toggle'],['Camera Shake','50','Adjust camera shake intensity.','range',0,100],['Hold to Skip','Off','Require a hold action to skip cinematic scenes.','toggle'],['Reduce Flashes','Off','Reduce intense flashing visual effects.','toggle']
  ]
};
let settings = loadSettings();
function loadSettings(){try{return JSON.parse(localStorage.getItem('gta6sim-settings'))||structuredClone(defaults)}catch{return structuredClone(defaults)}}
function saveSettings(){localStorage.setItem('gta6sim-settings',JSON.stringify(settings));const state=$('#savedState');state.textContent='● SETTINGS SAVED';state.classList.remove('unsaved')}
function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function show(name){Object.values(screens).forEach(s=>s.classList.add('hidden'));screens[name].classList.remove('hidden');currentScreen=name}
function startMenu(){show('menu');music.volume=0.42;music.play().catch(()=>showToast('Нажмите любую кнопку, чтобы включить музыку.'))}
function beginIntro(){show('intro');video.currentTime=0;video.muted=false;const p=video.play();if(p) p.catch(()=>{showToast('Автовоспроизведение заблокировано — нажмите любую клавишу.');});}
video.addEventListener('ended',startMenu);
video.addEventListener('error',startMenu);
function skipIntro(){if(currentScreen==='intro'){video.pause();startMenu()}}
$('#intro').addEventListener('pointerdown',skipIntro);
document.addEventListener('keydown',e=>{if(currentScreen==='intro'){skipIntro();return}if(currentScreen==='settings'){if(e.key==='Escape'||e.key==='Backspace'){show('menu');return}if(e.key==='ArrowDown'){e.preventDefault();selectSetting(1)}if(e.key==='ArrowUp'){e.preventDefault();selectSetting(-1)}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){changeSelected(e.key==='ArrowRight'?1:-1)}if(e.key==='Enter'){activateSelected()}return}if(currentScreen==='info'){if(e.key==='Escape'||e.key==='Enter')show('menu');return}if(currentScreen==='menu'){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();moveMenu(e.key==='ArrowDown'?1:-1)}if(e.key==='Enter')activateMenu();if(e.key==='Escape')showToast('Вы уже на главном экране.')}});
let menuIndex=0;const menuItems=[...document.querySelectorAll('.nav-item')];
function moveMenu(dir){menuIndex=(menuIndex+dir+menuItems.length)%menuItems.length;menuItems.forEach((b,i)=>b.classList.toggle('active',i===menuIndex))}
menuItems.forEach((b,i)=>{b.addEventListener('mouseenter',()=>{menuIndex=i;moveMenu(0)});b.addEventListener('click',()=>{menuIndex=i;activateMenu()})});
function activateMenu(){const action=menuItems[menuIndex].dataset.action;if(action==='settings'){renderSettings();show('settings')}else if(action==='quit'){showToast('Закрытие приложения…');setTimeout(()=>window.desktop?.quit(),350)}else if(action==='start'){showToast('Сюжетный режим недоступен в Menu Simulator. Это интерактивная демонстрация интерфейса.')}else if(action==='online'){showInfo('GTA ONLINE','VICE CITY NETWORK','ONLINE SERVICES UNAVAILABLE','Сетевые сервисы не подключены. Этот фанатский симулятор работает локально.')}else if(action==='social'){showInfo('SOCIAL CLUB','ROCKSTAR ACCOUNT','WELCOME BACK','Профиль GTAVI_01 активен локально. Подключение к настоящим сервисам Rockstar не выполняется.')}}
function showInfo(eyebrow,title,heading,body){$('#infoEyebrow').textContent=eyebrow;$('#infoTitle').textContent=heading;$('#infoText').textContent=body;show('info')}
$('#infoBack').addEventListener('click',()=>show('menu'));
$('#backBtn').addEventListener('click',()=>show('menu'));
$('#closeBtn').addEventListener('click',()=>window.desktop?.quit());$('#minimizeBtn').addEventListener('click',()=>window.desktop?.minimize());$('#fullscreenBtn').addEventListener('click',()=>window.desktop?.toggleFullscreen());
function renderTabs(){const root=$('#tabs');root.innerHTML='';tabs.forEach(tab=>{const b=document.createElement('button');b.className='tab'+(tab===activeTab?' active':'');b.textContent=tab.toUpperCase();b.addEventListener('click',()=>{activeTab=tab;selectedIndex=0;renderSettings()});root.appendChild(b)})}
function renderSettings(){renderTabs();$('#sectionLabel').textContent=activeTab==='Gameplay'?'COMBAT':activeTab.toUpperCase();const list=$('#settingsList');list.innerHTML='';const rows=settings[activeTab]||[];rows.forEach((row,i)=>{const [name,value,desc,type='cycle',a,b]=row;const el=document.createElement('div');el.className='setting-row'+(i===selectedIndex?' selected':'');el.tabIndex=0;el.dataset.index=i;el.innerHTML=`<div class="setting-name"></div><div class="setting-value"></div>`;el.querySelector('.setting-name').textContent=name;const val=el.querySelector('.setting-value');if(type==='toggle'){const btn=document.createElement('button');btn.className='switch '+(value==='On'?'on':'');btn.setAttribute('aria-label',name+' '+value);btn.addEventListener('click',()=>updateValue(i,value==='On'?'Off':'On'));val.append(btn)}else if(type==='range'){const input=document.createElement('input');input.type='range';input.className='range';input.min=a;input.max=b;input.value=Number(value);input.addEventListener('input',()=>{settings[activeTab][i][1]=input.value;$('#savedState').textContent='● UNSAVED CHANGES';$('#savedState').classList.add('unsaved');updateDescription(i)});input.addEventListener('change',saveSettings);const number=document.createElement('span');number.className='value-text';number.textContent=value;input.addEventListener('input',()=>number.textContent=input.value);val.append(input,number)}else{const left=document.createElement('button');left.className='value-button';left.textContent='‹';left.addEventListener('click',()=>changeValue(i,-1));const text=document.createElement('span');text.className='value-text';text.textContent=value;const right=document.createElement('button');right.className='value-button';right.textContent='›';right.addEventListener('click',()=>changeValue(i,1));val.append(left,text,right)}el.addEventListener('click',()=>{selectedIndex=i;renderSettings()});list.append(el)});updateDescription(selectedIndex);}
function updateDescription(i){const row=settings[activeTab][i];if(!row)return;$('#descriptionTitle').textContent=row[0].toUpperCase();$('#descriptionText').textContent=row[2];$('#descriptionDetail').textContent=row[3]==='toggle'?`Current setting: ${row[1]}. Select to switch this option on or off.`:row[3]==='range'?`Current value: ${row[1]}. Use the slider to adjust this setting.`:`Current selection: ${row[1]}. Use the arrows to cycle through available options.`}
function updateValue(i,v){settings[activeTab][i][1]=v;saveSettings();renderSettings()}
function changeValue(i,dir){const row=settings[activeTab][i];if(row[3]==='toggle'){updateValue(i,row[1]==='On'?'Off':'On');return}const opts=row[4]||[];if(!opts.length)return;const idx=opts.indexOf(row[1]);updateValue(i,opts[(idx+dir+opts.length)%opts.length])}
function selectSetting(dir){const max=settings[activeTab].length;selectedIndex=(selectedIndex+dir+max)%max;renderSettings();const selected=$('.setting-row.selected');selected?.scrollIntoView({block:'nearest'})}
function changeSelected(dir){const row=settings[activeTab][selectedIndex];if(row)changeValue(selectedIndex,dir)}
function activateSelected(){const row=settings[activeTab][selectedIndex];if(row?.[3]==='toggle')updateValue(selectedIndex,row[1]==='On'?'Off':'On')}
$('#restoreDefault').addEventListener('click',()=>{settings=structuredClone(defaults);saveSettings();selectedIndex=0;renderSettings();showToast('Настройки восстановлены по умолчанию.')});
$('#restoreAll').addEventListener('click',()=>{settings=structuredClone(defaults);saveSettings();selectedIndex=0;renderSettings();showToast('Все настройки сброшены.')});
// Keep audio settings connected to the actual soundtrack playback.
const originalSave=saveSettings;
saveSettings=function(){originalSave();const audio=settings.Audio;if(audio){music.volume=Number(audio.find(r=>r[0]==='Music Volume')?.[1]??75)/100*.6;const enabled=audio.find(r=>r[0]==='Menu Music')?.[1]!=='Off';if(enabled&&currentScreen==='menu')music.play().catch(()=>{});else if(!enabled)music.pause()}};
window.addEventListener('beforeunload',()=>{try{localStorage.setItem('gta6sim-settings',JSON.stringify(settings))}catch{}});
// Start with the supplied cinematic intro; a click or key skips directly to the menu.
beginIntro();
