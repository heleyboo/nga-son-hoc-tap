// Ba bàn chơi cùng hệ trục: Y hướng lên, Z hướng về phía người chơi.
function createFair(canvas, labels, onPick) {
    const T = THREE;
    const renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    const scene = new T.Scene(), camera = new T.OrthographicCamera(-6,6,5,-5,.1,80);
    scene.add(new T.HemisphereLight(0xffefd7,0x8a9db0,1.9));
    const keyLight = new T.DirectionalLight(0xffdbac,2.15);
    keyLight.position.set(-5,10,6);
    scene.add(keyLight);
    const setting = new T.Group(), pieces = new T.Group(), scenery = new T.Group();
    scene.add(setting,pieces,scenery);
    const ray = new T.Raycaster(), up = new T.Vector3(0,1,0);
    const vec = (x,y,z)=>new T.Vector3(x,y,z);
    const shapes = {
        box:new T.BoxGeometry(1,1,1), round:new T.CylinderGeometry(.5,.5,1,20),
        bowl:new T.CylinderGeometry(.5,.31,1,18), funnel:new T.ConeGeometry(.5,1,18),
        leaf:new T.DodecahedronGeometry(.5), ball:new T.SphereGeometry(.5,14,10),
        flag:new T.ConeGeometry(.5,1,3),
    };
    const mats = new Map();
    function material(color) {
        if (!mats.has(color)) mats.set(color,new T.MeshStandardMaterial({color,roughness:.85,flatShading:true}));
        return mats.get(color);
    }
    function part(group,type,color,x,y,z,w,h,d) {
        const mesh = new T.Mesh(shapes[type],material(color));
        mesh.scale.set(w,h,d);mesh.position.set(x,y,z);group.add(mesh);
        return mesh;
    }
    function beam(group,a,b,diam,color) {
        const mid=a.clone().lerp(b,.5);
        const mesh=part(group,'round',color,mid.x,mid.y,mid.z,diam,a.distanceTo(b),diam);
        mesh.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());return mesh;
    }
    function board(group,color,x,y,z,w,h,d){return part(group,'box',color,x,y,z,w,h,d)}
    function disk(group,color,x,y,z,w,h,d=w){return part(group,'round',color,x,y,z,w,h,d)}
    function textureMat(group,x,y,z,vertical,color) {
        const rug=new T.Group();group.add(rug);rug.position.set(x,y,z);rug.rotation.y=vertical?Math.PI/2:0;
        board(rug,color,0,0,0,2.95,.095,.89);
        for(const dx of [-1.32,-1.23,1.23,1.32]) board(rug,'#8f5440',dx,.051,0,.044,.012,.89);
        for(let j=0;j<8;j++)board(rug,'#f1cf8d',0,.05,(j-3.5)*.105,2.89,.006,.014);
    }
    let mode='math', overhead=false, targets=[], anchors=[], frameId=0;
    function pin(text,x,y,z,axis=false){
        const el=document.createElement('span');el.className='pin'+(axis?' axis':'');el.textContent=text;
        labels.append(el);anchors.push({el,pos:vec(x,y,z)});return el;
    }
    function positionLabels(){
        for(const a of anchors){
            const v=a.pos.clone().project(camera);
            a.el.style.left=(v.x+1)*50+'%';a.el.style.top=(1-v.y)*50+'%';
        }
    }
    function render(){renderer.render(scene,camera);positionLabels()}
    function resize(){
        const w=canvas.clientWidth,h=canvas.clientHeight;if(!w || !h)return;
        renderer.setSize(w,h,false);
        const center=vec(0,mode==='physics'?1.05:.70,0);
        camera.up.set(0,1,0);
        if(overhead){camera.position.set(0,18,.01);camera.up.set(0,0,-1)}
        else if(mode==='math') camera.position.set(3.7,11.6,10.4);
        else camera.position.set(4,7.3,13.5);
        camera.lookAt(center);camera.updateMatrixWorld();
        const aspect=w/h;
        let half=0;
        for(const x of [-4.95,4.95]) for(const z of [-3.45,3.45]) for(const y of [-.65,3.05]){
            const p=vec(x,y,z).applyMatrix4(camera.matrixWorldInverse);
            half=Math.max(half,Math.abs(p.x)/aspect,Math.abs(p.y));
        }
        half*=1.06;
        camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;
        camera.updateProjectionMatrix();render();
    }
    function tree(x,z,scale){
        disk(setting,'#546e59',x+.08,.045,z,1.0*scale,.045,.78*scale);
        disk(setting,'#826447',x,.6*scale,z,.16*scale,1.2*scale);
        for(const [dx,dy,dz,size,c] of [[0,1.4,0,1.16,'#729875'],[-.29,1.16,.04,.79,'#8bab7a'],[.22,1.69,.05,.65,'#9ba969']])
            part(setting,'leaf',c,x+dx*scale,dy*scale,z+dz*scale,size*scale,size*scale*1.15,size*scale);
        for(const [dx,dy] of [[-.34,1.3],[.21,1.53],[0,1.17]])
            part(setting,'ball','#e2a05a',x+dx*scale,dy*scale,z+.39*scale,.16*scale,.17*scale,.16*scale);
    }
    function stall(x,z,scale){
        const group=new T.Group();setting.add(group);group.position.set(x,0,z);group.scale.setScalar(scale);
        for(const sx of [-1,1])for(const sz of [-.48,.48])disk(group,'#896847',sx,.82,sz,.10,1.64);
        for(let i=0;i<7;i++){
            const awning=board(group,i%2?'#e5ce9c':'#a65c48',(i-3)*.34,1.72,0,.35,.13,1.52);
            awning.rotation.x=.19;board(group,i%2?'#e5ce9c':'#a65c48',(i-3)*.34,1.47,.72,.34,.26,.08);
        }
        board(group,'#bc955e',0,.54,0,2.18,.20,1.18);
        for(let i=0;i<6;i++)board(group,'#c8a373',(i-2.5)*.33,.28,.52,.31,.48,.075);
        for(const sx of [-.62,.55]){
            disk(group,'#ae8453',sx,.74,0,.62,.2,.47);
            for(let i=0;i<5;i++)part(group,'ball',sx<0?'#e8a94d':'#c5634c',sx+(i%3-1)*.14,.87+Math.floor(i/3)*.08,(i%2)*.13,.19,.19,.19);
        }
    }
    function bunting(){
        const left=vec(-4.34,2.71,-2.92),right=vec(4.4,2.71,-2.92);
        for(const a of [left,right])disk(setting,'#ae8051',a.x,1.35,a.z,.105,2.7);
        for(let i=0;i<13;i++){
            const point=t=>vec(left.x+(right.x-left.x)*t,2.72-.40*Math.sin(t*Math.PI),left.z);
            const a=point(i/13),b=point((i+1)/13);
            beam(setting,a,b,.027,'#c1a485');
            const flag=part(setting,'flag',['#d57253','#e5ba69','#78a99e'][i%3],a.x+.22,a.y-.16,a.z,.30,.34,.08);
            flag.rotation.z=Math.PI;
        }
    }
    function crate(x,z,goods){
        const box=new T.Group();setting.add(box);box.position.set(x,0,z);
        board(box,'#886447',0,.12,0,.81,.17,.63);
        for(const sign of [-1,1]){
            for(const y of [.19,.32])board(box,'#c49a66',0,y,sign*.32,.88,.10,.06);
            board(box,'#ad8257',sign*.42,.24,0,.07,.30,.69);
        }
        for(let i=0;i<6;i++){
            const px=(i%3-1)*.23,pz=(Math.floor(i/3)-.5)*.24;
            if(goods==='muoi'){
                part(box,'leaf','#f6ead3',px,.36,pz,.26,.27,.26);
            }else{
                part(box,'leaf',i%2?'#77a276':'#9eb884',px,.39,pz,.29,.30,.29);
                part(box,'leaf','#b1c18a',px-.05,.47,pz-.035,.16,.20,.16);
            }
        }
    }
    function goose(x,z,scale){
        const g=new T.Group();setting.add(g);g.position.set(x,.04,z);g.scale.setScalar(scale);
        disk(g,'#586951',.02,.014,0,.50,.018,.71);
        for(const side of [-1,1])part(g,'ball','#ce955b',side*.095,.062,.06,.11,.06,.19);
        part(g,'ball','#eae6ce',0,.23,0,.34,.30,.55);
        part(g,'ball','#fff2d5',0,.40,.18,.15,.33,.16);
        part(g,'ball','#f7ecd2',0,.55,.20,.20,.19,.20);
        part(g,'ball','#d99853',0,.53,.33,.13,.065,.18);
        part(g,'ball','#3e433f',.088,.57,.22,.038,.04,.037);
        const wing=part(g,'leaf','#d6d4b9',.12,.26,-.04,.14,.19,.34);wing.rotation.x=-.24;
    }
    function lantern(x,y,z){
        disk(setting,'#78593f',x,y+.21,z,.16,.06);
        part(setting,'ball','#ffd083',x,y,z,.35,.40,.35);
        disk(setting,'#9b7148',x,y-.20,z,.16,.05);
        disk(setting,'#daad6c',x,y-.28,z,.04,.12);
    }
    function cacheScenery(){
        setting.updateMatrixWorld(true);
        const groups=new Map();
        setting.traverse(obj=>{
            if(!obj.isMesh || obj.material.transparent)return;
            const key=obj.geometry.uuid+obj.material.uuid;
            if(!groups.has(key))groups.set(key,[]);
            groups.get(key).push(obj);
        });
        for(const parts of groups.values()){
            const first=parts[0], batch=new T.InstancedMesh(first.geometry,first.material,parts.length);
            parts.forEach((p,i)=>{batch.setMatrixAt(i,p.matrixWorld);p.visible=false});
            scenery.add(batch);
        }
    }
    function base(){
        board(setting,'#30494b',0,-.43,0,9.6,.68,6.45);
        board(setting,'#c29866',0,-.17,0,9.67,.075,6.52);
        board(setting,'#74876b',0,-.055,0,9.6,.16,6.45);
        tree(-4.03,-1.66,.88);tree(4.0,-1.97,.83);
        crate(2.23,-2.45,'rau');crate(3.12,-2.50,'rau');
        goose(-3.78,1.8,1.12);goose(-4.12,1.26,.73);
        lantern(-3.15,1.07,-1.85);lantern(-1.50,1.07,-1.85);
        for(let i=0;i<6;i++){
            disk(setting,'#bbab83',-2.68+.14*Math.sin(i),.036,-1.17+i*.46,.43,.026,.29);
        }
        for(const x of [-4.32,4.35]){
            for(let i=0;i<4;i++){
                const z=-.74+i*.46;
                part(setting,'leaf',i%2?'#68855d':'#92a56d',x,.18,z,.35,.32,.36);
                part(setting,'ball','#edc581',x+.06,.31,z+.07,.105,.09,.105);
            }
        }
        stall(-2.32,-2.48,.85);bunting();
        for(let i=0;i<11;i++){
            const z=.4+(i%4)*.37,x=3.8+Math.sin(i*3)*.38;
            const grass=part(setting,'funnel',i%3?'#9ca56d':'#b5ae78',x,.25,z,.17,.55+(i%3)*.11,.16);
            grass.rotation.z=(i%3-1)*.12;
        }
        for(let i=0;i<5;i++){
            disk(setting,'#aa845e',-4+i*.32,.28,2.55,.10,.56);
            if(i<4)board(setting,'#c19e73',-3.84+i*.32,.35,2.55,.34,.075,.065);
        }
    }
    const cellCenter=(i)=>vec(i%4-1.5,.18,Math.floor(i/4)-1.3);
    function flower(x,z,h,c){
        disk(setting,'#59805b',x,.27+h/2,z,.035,h);
        for(let i=0;i<5;i++){
            const a=i*Math.PI*2/5;
            part(setting,'ball',c,x+Math.cos(a)*.065,.27+h,z+Math.sin(a)*.065,.115,.065,.115);
        }
        part(setting,'ball','#e9b350',x,.29+h,z,.075,.07,.075);
    }
    function courtyard(){
        board(setting,'#a68866',0,.061,.2,4.3,.12,4.3);
        for(let i=0;i<16;i++){
            const p=cellCenter(i);
            const cell=board(setting,(i+Math.floor(i/4))%2?'#d8be8f':'#e8d3a9',p.x,.134,p.z,.967,.11,.967);
            cell.userData.action=i;targets.push(cell);
        }
        board(setting,'#926448',0,.275,.2,1.94,.28,1.94);
        board(setting,'#789967',0,.433,.2,1.86,.065,1.86);
        for(let i=0;i<16;i++)flower(-.69+(i%4)*.46,-.49+Math.floor(i/4)*.46,.31+(i%3)*.095,['#ed906b','#ffdfa0','#e9ae98'][i%3]);
        for(let i=0;i<4;i++){pin(String(i+1),i-1.5,.25,-2.03,true);pin('ABCD'[i],-2.26,.22,i-1.3,true)}
        for(let i=0;i<3;i++){
            const roll=disk(setting,'#d4af71',-3.22,.20+i*.11,.56+i*.27,.31,1.2);roll.rotation.x=Math.PI/2;
            const band=disk(setting,'#a06146',-3.22,.20+i*.11,.56+i*.27,.32,.10);band.rotation.x=Math.PI/2;
        }
    }
    function showMats(mats,preview,valid){
        pieces.clear();
        mats.forEach((m,i)=>{
            const p=cellCenter(m.start);
            textureMat(pieces,p.x+(m.vertical?0:1),.246,p.z+(m.vertical?1:0),m.vertical,['#dcb56c','#e6c382','#cdaa70','#dbbc84'][i]);
        });
        for(const i of preview){
            const p=cellCenter(i);
            for(const side of [-1,1]){
                board(pieces,valid?'#42826d':'#ab5746',p.x+side*.44,.315,p.z,.055,.025,.92);
                board(pieces,valid?'#42826d':'#ab5746',p.x,.315,p.z+side*.44,.91,.025,.055);
            }
        }
        render();
    }
    const glass= new T.MeshStandardMaterial({color:'#b3e0e5',transparent:true,opacity:.24,depthWrite:false,roughness:.28});
    let filtrateLabel, paperLabel;
    function saltTable(){
        for(const x of [-2.95,2.95])for(const z of [-.9,1.1])board(setting,'#89654d',x,.53,z,.19,1.05,.19);
        for(let i=0;i<6;i++)board(setting,i%2?'#b18b64':'#c39a6a',0,1.06,-1.08+i*.49,7.1,.23,.47);
        for(const x of [-2.23,.0]){
            const cup=disk(setting,'#abc8ca',x,1.74,.23,1.16,1.1);cup.material=glass;
            disk(setting,'#c0dedc',x,1.21,.23,1.17,.08);
            for(let i=0;i<3;i++)board(setting,'#689ca2',x+.26,1.5+i*.21,.73,.23,.026,.02);
        }
        const funnel=part(setting,'funnel','#f9eaca',0,2.48,.23,1.28,.75,1.28);
        funnel.rotation.z=Math.PI;
        disk(setting,'#ccc3a9',0,2.10,.23,.11,.35);
        const pan=part(setting,'bowl','#ac7762',2.20,1.51,.23,1.55,.37,1.55);
        disk(setting,'#e5caa3',pan.position.x,1.704,.23,1.46,.028);
        for(let i=0;i<3;i++)disk(setting,'#78614e',2.20+Math.cos(i*2.09)*.49,1.28,.23+Math.sin(i*2.09)*.49,.11,.28);
        disk(setting,'#566660',-.72,1.23,.10,.42,.085);
        disk(setting,'#69786e',-.72,2.03,.10,.055,1.52);
        beam(setting,vec(-.72,2.55,.10),vec(0,2.55,.23),.05,'#69786e');
        for(const cx of [-2.23,0]){
            for(let i=0;i<20;i++){
                const a=i*Math.PI/10,b=(i+1)*Math.PI/10;
                beam(setting,vec(cx+.57*Math.cos(a),2.29,.23+.57*Math.sin(a)),vec(cx+.57*Math.cos(b),2.29,.23+.57*Math.sin(b)),.024,'#92bdc0');
            }
        }
        for(const [action,x,y] of [['water',-2.23,1.82],['filter',0,2.63],['receiver',0,1.57],['heat',2.20,1.61]]){
            const pick=part(setting,'box','#fff',x,y,.23,1.37,action==='receiver'?.78:1.05,1.35);
            pick.material=pickMaterial;pick.userData.action=action;targets.push(pick);
        }
        pin('Cốc pha',-2.23,2.44,.23);paperLabel=pin('Giấy lọc',0,2.94,.23);filtrateLabel=pin('Trong cốc',.43,1.75,.90);pin('Khay cô cạn',2.20,2.0,.23);
    }
    function grains(x,y,z,salt,sand){
        for(let i=0;i<(salt?15:0)+(sand?15:0);i++){
            const angle=i*2.4,r=.36*Math.sqrt((i%15+1)/15);
            const g=part(pieces,'leaf',salt && (!sand || i%2===0)?'#fff6d7':'#9a7149',x+Math.cos(angle)*r,y+.019*(i%3),z+Math.sin(angle)*r,.10,.088,.10);
            g.rotation.y=i;
        }
    }
    function salt(sample,step,last){
        pieces.clear();
        const filter=step==='choose',pan=last==='heat';
        filtrateLabel.hidden=!filter;paperLabel.textContent=filter?'Trên giấy':'Giấy lọc';
        const x=filter?0:pan?2.20:-2.23, z=.23, bottom=pan?1.74:1.27;
        if(sample.water)disk(pieces,'#83bbc3',x,bottom+.17,z,pan?1.15:1.04,.34);
        if(filter){
            grains(0,2.88,z,!sample.water && sample.salt,sample.sand);
        } else grains(x,bottom+(sample.water?.035:.02),z,!sample.water && sample.salt,sample.sand);
        render();
    }
    function labAction(tool,after){
        const x=tool==='water'?-2.23:tool==='filter'?0:2.2;
        const baseY=tool==='filter'?2.86:tool==='water'?2.07:1.72;
        const drops=new T.Group();pieces.add(drops);
        for(let i=0;i<9;i++){
            const drop=part(drops,'ball',tool==='heat'?'#dce7db':'#7fbdcf',x,baseY,.23,.10,.16,.10);
            drop.position.x+=Math.sin(i*2.4)*.25;
        }
        animate(550,t=>{
            drops.children.forEach((drop,i)=>{
                const progress=(t*1.6+i/9)%1;
                drop.position.y=baseY+(tool==='heat'?progress:1-progress)*.8;
                drop.scale.setScalar(.045+.095*Math.sin(Math.PI*progress));
            });
            render();
        },()=>{pieces.remove(drops);after()});
    }
    const pivotY=2.28,unit=1.05;
    function dock(){
        board(setting,'#ae976c',0,.05,.34,8.5,.10,2.9);
        for(const z of [-.17,.63]){
            beam(setting,vec(-.70,.12,z),vec(0,pivotY,z),.19,'#a4744e');
            beam(setting,vec(.70,.12,z),vec(0,pivotY,z),.19,'#b88958');
        }
        const axle=disk(setting,'#68544d',0,pivotY,.20,.37,1.1);axle.rotation.x=Math.PI/2;
        board(setting,'#996844',-unit,.38,.20,1.23,.17,1.14);
        for(const x of [-unit-.41,-unit+.41])for(const z of [-.38,.78]){
            const wheel=disk(setting,'#514e4b',x,.23,z,.4,.13);wheel.rotation.x=Math.PI/2;
        }
    }
    function crane(hook,tilt,drop){
        pieces.clear();targets=[];anchors=[];labels.replaceChildren();
        const at=(distance)=>vec(distance*unit*Math.cos(tilt),pivotY+distance*unit*Math.sin(tilt),.20);
        const left=at(-1.36),right=at(3.24),middle=left.clone().lerp(right,.5);
        const arm=board(pieces,'#be9361',middle.x,middle.y,.20,left.distanceTo(right),.16,.28);
        arm.rotation.z=tilt;
        for(let i=-1;i<=3;i++){
            const p=at(i);
            part(pieces,'ball',i===hook?'#f3b953':'#688b87',p.x,p.y,.39,.27,.27,.27);
            if(i>0){
                const pick=part(pieces,'ball','#fff',p.x,p.y,.42,.72,.72,.72);
                pick.material=pickMaterial;pick.userData.action=i;targets.push(pick);
                pin(i+' m',p.x,p.y+.22,.20,true);
            }
            if(i===0)pin('Trục',p.x,p.y+.32,.20);
        }
        const load=at(-1),loadY=load.y-.74-drop*.64;
        beam(pieces,load,vec(load.x,loadY,.20),.055,'#c6ae82');
        for(let i=0;i<3;i++){
            const reed=disk(pieces,'#d2ab72',load.x,loadY-.20+(i===2?.17:0),.20+(i-1)*.17,.33,.90);
            reed.rotation.z=Math.PI/2;
            for(const sign of [-1,1]){
                const tie=disk(pieces,'#936347',load.x+sign*.27,reed.position.y,reed.position.z,.34,.048);
                tie.rotation.z=Math.PI/2;
            }
        }
        pin('30 kg',load.x,loadY+.04,.70);
        if(hook){
            const p=at(hook);
            beam(pieces,p,vec(p.x,p.y-.52,.20),.052,'#bca27b');
            part(pieces,'box','#537c83',p.x,p.y-.71,.20,.49,.46,.43);
            pin('10 kg',p.x,p.y-.57,.67);
        }else{
            part(pieces,'box','#537c83',3.07,.37,1.25,.49,.46,.43);
            pin('10 kg',3.07,.69,1.25);
        }
        render();
    }
    function market(){
        courtyard();
        for(const [start,down] of [[0,false],[3,true],[13,false],[4,true]]){
            const p=cellCenter(start);textureMat(setting,p.x+(down?0:1),.246,p.z+(down?1:0),down,'#dfba79');
        }
        stall(2.96,.37,.80);crate(2.93,1.49,'muoi');
        for(const x of [-3.59,3.52]){
            disk(setting,'#94734f',x,.99,2.15,.09,1.94);
            lantern(x,2.11,2.15);
        }
        for(const [x,z,c] of [[-1.28,2.52,'#648e83'],[-.71,2.61,'#ba704f'],[2.35,1.21,'#7185a2'],[-2.74,-1.74,'#a95f53']]){
            part(setting,'bowl',c,x,.32,z,.38,.52,.32);
            part(setting,'ball','#d7a67e',x,.73,z,.27,.30,.27);
            part(setting,'funnel','#e3bf83',x,.93,z,.53,.24,.53);
        }
    }
    const pickMaterial=new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});
    function setup(name){
        cancelAnimationFrame(frameId);
        mode=name;overhead=false;
        for(const batch of scenery.children)batch.dispose();
        scenery.clear();setting.clear();pieces.clear();labels.replaceChildren();targets=[];anchors=[];
        base();
        if(name==='math')courtyard();
        if(name==='chem')saltTable();
        if(name==='physics')dock();
        if(name==='market'){market();anchors=[];labels.replaceChildren();targets=[]}
        cacheScenery();resize();
    }
    function animate(ms,draw,end){
        cancelAnimationFrame(frameId);
        if(matchMedia('(prefers-reduced-motion: reduce)').matches){draw(1);end();return}
        const start=performance.now();
        function step(now){
            const t=Math.min(1,(now-start)/ms);
            draw(t*t*(3-2*t));
            if(t<1)frameId=requestAnimationFrame(step);else end();
        }
        frameId=requestAnimationFrame(step);
    }
    canvas.addEventListener('pointerup',e=>{
        const r=canvas.getBoundingClientRect();
        ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),camera);
        const [hit]=ray.intersectObjects(targets,false);
        if(hit)onPick(hit.object.userData.action);
    });
    new ResizeObserver(resize).observe(canvas);
    return {setup,showMats,salt,labAction,crane,animate,stop(){cancelAnimationFrame(frameId)},angle(){overhead=!overhead;resize();return overhead}};
}
