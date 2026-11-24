// Sa bàn dùng mét làm đơn vị, trục Y hướng lên. Mô hình là hình học cục bộ.
function createVillage(canvas) {
    const T = THREE;
    const vec = (x, y, z) => new T.Vector3(x, y, z);
    const renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    const scene = new T.Scene();
    const camera = new T.OrthographicCamera(-10, 10, 8, -8, .1, 120);
    scene.add(new T.HemisphereLight(0xffedd3, 0x8393bd, 2.0));
    const sun = new T.DirectionalLight(0xffe2ae, 2.2);
    sun.position.set(-5, 12, 8);
    scene.add(sun);
    const geometries = {
        box:new T.BoxGeometry(1,1,1), rod:new T.CylinderGeometry(.5,.5,1,12),
        cone:new T.ConeGeometry(.5,1,7), ball:new T.SphereGeometry(.5,18,12),
        stone:new T.DodecahedronGeometry(.5), panel:new T.PlaneGeometry(1,1),
    };
    const materials = new Map();
    const obstacles = [];
    const up = vec(0,1,0);
    function mat(color, lit = true) {
        const key = color + (lit ? 'lit' : '');
        if (!materials.has(key)) materials.set(key, lit
            ? new T.MeshStandardMaterial({color,flatShading:true,roughness:.86})
            : new T.MeshBasicMaterial({color,side:T.DoubleSide}));
        return materials.get(key);
    }
    function shape(parent, type, color, x,y,z, w,h,d, lit = true) {
        const mesh = new T.Mesh(geometries[type],mat(color,lit));
        mesh.position.set(x,y,z);
        mesh.scale.set(w,h,d);
        parent.add(mesh);
        return mesh;
    }
    function stick(parent, a, b, width, color, lit = true) {
        const length = a.distanceTo(b);
        const center = a.clone().lerp(b,.5);
        const mesh = shape(parent,'rod',color,center.x,center.y,center.z,width,length,width,lit);
        mesh.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());
        return mesh;
    }
    const village = new T.Group();
    scene.add(village);
    const block = (...args) => shape(village,'box',...args);
    // Bờ kè, mặt nước và đường đất quanh sân phơi.
    block('#23374d',0,-.72,0,14.4,1.02,9.7);
    block('#be915d',0,-.29,0,14.46,.09,9.76);
    block('#4e695d',-1.65,-.17,0,11.08,.34,9.6);
    block('#507179',4.95,-.24,0,4.32,.29,9.6);
    block('#226b83',4.97,-.08,0,4.28,.07,9.59);
    block('#a99169',2.75,-.05,0,.24,.2,9.6);
    block('#b19b76',-.55,.013,2.08,6.55,.035,1.17);
    block('#a18e72',-.48,.019,-.1,1.17,.035,4.7);
    for (let i=0;i<31;i++) {
        const x=3.13+(i*17%47)/13, z=-4.5+(i*31%93)/10.4;
        block(i%3===0?'#a7c9b8':'#67a8aa',x,-.038,z,.15+(i%5)*.13,.012,.026);
    }
    function groundShade(x,z,w,d){
        shape(village,'rod','#3d594f',x,.016,z,w,.015,d);
    }
    // Cọc tre, dây buộc và lối đá ven bến.
    for(let i=0;i<9;i++){
        const z=-4.15+i*.93;
        if(i===2 || i===3)continue;
        const x=2.6;
        shape(village,'rod','#bda070',x,.24,z,.084,.48,.084);
        if(i!==1 && i!==8) {
            const mid=vec(x,.22,z+.465);
            stick(village,vec(x,.34,z),mid,.033,'#d6bb82');
            stick(village,mid,vec(x,.34,z+.93),.033,'#d6bb82');
        }
    }
    for(let i=0;i<9;i++){
        const stone=shape(village,'rod','#c6b794',-.5+Math.sin(i)*.12,.05,-2+i*.43,.55,.028,.28);
        stone.rotation.y=i*.6;
    }
    for(const [x,z] of [[-3.6,3.7],[-5.6,-1.9],[.95,-3.55]]){
        groundShade(x,z,1.58,.99);
        for(let i=0;i<3;i++){
            const y=i===2?.41:.19, dz=i===2?0:(i-.5)*.38;
            const roll=shape(village,'rod','#d7b873',x,y,z+dz,.40,1.13,.40);
            roll.rotation.z=Math.PI/2;
            for(const dx of [-.36,.36]){
                const tie=shape(village,'rod','#947449',x+dx,y,z+dz,.415,.043,.415);
                tie.rotation.z=Math.PI/2;
            }
        }
    }
    function house(x,z,w,d) {
        const h=1.08;
        groundShade(x+.12,z+.22,w*1.18,d*1.48);
        obstacles.push(block('#d5ad78',x,h/2,z,w,h,d));
        block('#986e52',x,.16,z,w+.08,.26,d+.06);
        for(const sign of [-1,1]) {
            const slope=block('#ac624b',x,h+.22,z+sign*d*.26,w+.42,.16,d*.66);
            slope.rotation.x=sign*.49;
            obstacles.push(slope);
            for(let i=0;i<8;i++){
                const batten=block('#cc8161',x-w*.51+i*w*.145,h+.31,z+sign*d*.26,.045,.04,d*.66);
                batten.rotation.x=sign*.49;
            }
        }
        block('#684c45',x,h+.49,z,w+.48,.11,.15);
        const awning=block('#bd9f6f',x-.2,.98,z+d*.58,.85,.09,.49);
        awning.rotation.x=.22;
        block('#dbb57e',x-.2,.068,z+d*.57,.79,.13,.40);
        for(const post of [-.53,.13])block('#74563d',x+post,.46,z+d*.68,.052,.92,.052);
        block('#414752',x-.2,.43,z+d*.5+.013,.38,.83,.045);
        for(const side of [-1,1]){
            block('#5b5048',x+side*w*.34,.64,z+d*.5+.03,.39,.45,.05);
            block('#ffcb77',x+side*w*.34,.65,z+d*.5+.06,.30,.34,.03,false);
            block('#735b4d',x+side*w*.34,.63,z+d*.5+.08,.30,.026,.02);
            block('#735b4d',x+side*w*.34,.65,z+d*.5+.08,.035,.34,.02);
        }
    }
    house(-4.9,-3.05,2.9,1.55);
    house(-.52,-3.95,2.05,1.18);
    for(const [x,z] of [[-5.8,-.7],[-4.35,-.7],[-5.8,.25],[-4.35,.25]]){
        block('#e1c185',x,.075,z,1.26,.09,.70);
        for(let j=0;j<5;j++)block('#b68e59',x-.46+j*.23,.128,z,.028,.012,.66);
    }
    // Tuyến bến thấp hơn đèn hiệu; hàng cọc gỗ tạo mốc cao độ.
    for(let i=0;i<11;i++)block(i%2?'#be9461':'#cda776',2.73+i*.22,.18,-2.45,.20,.18,.97);
    for(const x of [2.78,4.86]) for(const z of [-2.96,-1.94])
        shape(village,'rod','#745341',x,.15,z,.16,.83,.16);
    function tree(x,z,s) {
        groundShade(x+.11*s,z+.04*s,1.25*s,.87*s);
        shape(village,'rod','#7a5a46',x,.48*s,z,.20*s,.96*s,.20*s);
        for(const [dx,dy,dz,w,c] of [[0,1.28,0,1.1,'#498276'],[-.32,1.08,.09,.7,'#679582'],[.24,1.52,0,.62,'#78a084']])
            shape(village,'stone',c,x+dx*s,dy*s,z+dz*s,w*s,w*1.18*s,w*s);
    }
    for(const [x,z,s] of [[-6.2,-3.9,1.2],[-3.1,-4.1,1.13],[1.55,-3.95,1],[-6.55,3.55,.8],[-5.7,4.03,.65],[1.84,3.98,.74]])tree(x,z,s);
    for(let i=0;i<35;i++){
        const x=1.7+(i*31%17)/17,z=.85+(i*19%31)/9;
        const blade=shape(village,'cone',i%3?'#a8a56c':'#6f9872',x,.21,z,.12,.53+(i%3)*.11,.11);
        blade.rotation.z=(i%5-2)*.11;
        if(i%3===0){
            const stalk=shape(village,'rod','#aa9363',x-.04,.40,z,.027,.75,.027);
            stalk.rotation.z=.09;
            shape(village,'rod','#bd9b65',x-.075,.78,z,.069,.20,.069);
        }
    }
    // Nhóm các chi tiết bất động theo vật liệu để cả làng chỉ cần ít lượt vẽ.
    const batches=new Map();
    village.updateMatrixWorld(true);
    for(const part of village.children){
        const key=part.geometry.uuid+part.material.uuid;
        if(!batches.has(key))batches.set(key,[]);
        batches.get(key).push(part);
    }
    for(const parts of batches.values()){
        const batch=new T.InstancedMesh(parts[0].geometry,parts[0].material,parts.length);
        parts.forEach((p,i)=>batch.setMatrixAt(i,p.matrixWorld));
        scene.add(batch);
    }
    scene.remove(village); // Giữ mesh gốc của mái và tường để dò tia.
    const boat=new T.Group();
    scene.add(boat);
    shape(boat,'ball','#704c3c',0,.12,0,.80,.46,1.92);
    shape(boat,'ball','#d6a46e',0,.23,0,.76,.26,1.84);
    for(const side of [-1,1]){
        stick(boat,vec(side*.35,.23,-.58),vec(side*.11,.34,-.93),.075,'#473d40');
        stick(boat,vec(side*.35,.23,.58),vec(side*.11,.34,.93),.075,'#473d40');
    }
    stick(boat,vec(-.39,.41,-.68),vec(.55,.65,.62),.043,'#795741');
    for(const offset of [-.32,0,.32]){
        const roll=shape(boat,'rod','#d4b16f',0,.45,offset,.29,.81,.29);
        roll.rotation.z=Math.PI/2;
        for(const tie of [-.22,.22]){
            const band=shape(boat,'rod','#836e50',tie,.45,offset,.30,.046,.30);
            band.rotation.z=Math.PI/2;
        }
    }
    const boatStart=vec(6.1,-.025,2.65), boatEnd=vec(5.02,-.025,-1.07);
    function moveBoat(t) {
        boat.position.lerpVectors(boatStart,boatEnd,t);
        boat.rotation.y=.28+.23*t;
    }
    moveBoat(0);

    const equipment=new T.Group(), lightPath=new T.Group();
    scene.add(equipment,lightPath);
    const raycaster=new T.Raycaster();
    const mirrors=[];
    let source,sensor,lamp,goalStand,selected=0,view='village';
    const mirrorFace=mat('#a4eef0',false);
    const glow=new T.MeshBasicMaterial({color:'#ffc44d',transparent:true,opacity:.24,depthWrite:false});
    function makeMirror(position) {
        const [x,y,z]=position;
        shape(equipment,'rod','#725332',x,.12,z,.85,.24,.85);
        shape(equipment,'rod','#e6b97a',x,y/2,z,.115,y,.115);
        const head=new T.Group();
        head.position.set(x,y,z);
        equipment.add(head);
        const frame=shape(head,'box','#886343',0,0,0,1.53,1.51,.13);
        const face=new T.Mesh(geometries.panel,mirrorFace);
        face.scale.set(1.44,1.42,1);
        head.add(face);
        // Phản xạ từ mặt phẳng giữa hai mặt kính, theo pháp tuyến của gương.
        for(const side of [-1,1]){
            shape(head,'box','#8ed6dd',0,0,side*.076,1.42,1.40,.024,false);
            const stripe=shape(head,'box','#d6f6e8',-.30,.23,side*.093,.11,.74,.014,false);
            stripe.rotation.z=-.52;
        }
        const ring=shape(equipment,'rod','#ffe09b',x,.263,z,.75,.026,.75,false);
        return {head,face,frame,ring,center:vec(x,y,z),normal:vec(1,0,0)};
    }
    function load(level) {
        equipment.clear();
        lightPath.clear();
        mirrors.length=0;
        selected=0;
        moveBoat(0);
        source=vec(...level.source);
        shape(equipment,'rod','#6a554a',source.x-.4,source.y*.48,source.z,.35,source.y,.35);
        shape(equipment,'box','#624e41',source.x-.43,source.y,source.z,.85,.60,.62);
        for(const x of [source.x-.7,source.x-.54]){
            shape(equipment,'box','#a8895f',x,source.y,source.z,.048,.64,.66);
        }
        const hood=shape(equipment,'rod','#be9969',source.x-.10,source.y,source.z,.65,.19,.65);
        hood.rotation.z=Math.PI/2;
        const lens=shape(equipment,'rod','#fff1a8',source.x-.013,source.y,source.z,.52,.14,.52,false);
        lens.rotation.z=Math.PI/2;
        level.mirrors.forEach(m=>mirrors.push(makeMirror(m.position)));
        const [x,y,z]=level.target;
        goalStand=shape(equipment,'rod','#bc8d5d',x,(y-.34)/2,z,.22,y-.34,.22);
        shape(equipment,'rod','#715241',x,.17,z,.72,.34,.72);
        sensor=shape(equipment,'ball','#90a5af',x,y,z,.74,.74,.74);
        lamp=shape(equipment,'cone','#88633d',x,y+.45,z,.91,.37,.91);
        shape(equipment,'rod','#ac8757',x,y-.37,z,.76,.12,.76);
        setView('village');
    }
    const radians=Math.PI/180;
    function orient(index,yaw,tilt) {
        const m=mirrors[index],a=yaw*radians,b=tilt*radians;
        m.normal.set(Math.cos(a)*Math.cos(b),Math.sin(b),Math.sin(a)*Math.cos(b));
        m.head.quaternion.setFromUnitVectors(vec(0,0,1),m.normal);
    }
    function choose(index){
        selected=index;
        mirrors.forEach((m,i)=>{m.ring.visible=i===index;m.frame.material=mat(i===index?'#f4b754':'#62798b')});
    }
    const bounds=new T.Box3(vec(-7.2,.02,-4.8),vec(7.2,7,4.8));
    function trace(measure) {
        lightPath.clear();
        scene.updateMatrixWorld(true);
        const surfaces=[sensor,goalStand,...mirrors.map(m=>m.face),...obstacles];
        const visited=new Set();
        const reflections=[];
        let origin=source.clone(), direction=vec(1,0,0), last=null, reached=false;
        for(let bounce=0;bounce<8;bounce++){
            raycaster.set(origin,direction);
            const edge=raycaster.ray.intersectBox(bounds,new T.Vector3());
            if(!edge)break;
            const hit=raycaster.intersectObjects(surfaces,false).find(h=>h.object!==last && h.distance>.005 && h.distance<=origin.distanceTo(edge));
            const end=hit?hit.point:edge;
            if(origin.distanceToSquared(end)<.00001)break;
            stick(lightPath,origin,end,.059,'#fff0a8',false);
            stick(lightPath,origin,end,.145,'#f4bc51',false).material=glow;
            if(!hit)break;
            if(hit.object===sensor){reached=true;break}
            const i=mirrors.findIndex(m=>m.face===hit.object);
            if(i<0)break;
            const n=mirrors[i].normal.clone();
            if(n.dot(direction)>0)n.negate();
            const incoming=direction.clone().negate();
            const outgoing=direction.clone().reflect(n).normalize();
            reflections.push({index:i,incidence:incoming.angleTo(n)/radians,reflection:outgoing.angleTo(n)/radians});
            if(measure && i===selected && !visited.has(i)){
                for(let step=-4;step<6;step++){
                    const a=end.clone().addScaledVector(n,step*.28);
                    stick(lightPath,a,a.clone().addScaledVector(n,.15),.044,'#83ffea',false);
                }
                for(const v of [incoming,outgoing]){
                    let prev=end.clone().addScaledVector(n,.52);
                    for(let k=1;k<=8;k++){
                        const next=end.clone().addScaledVector(n.clone().lerp(v,k/8).normalize(),.52);
                        stick(lightPath,prev,next,.032,'#fff6db',false);
                        prev=next;
                    }
                }
            }
            visited.add(i);
            origin=end.clone().addScaledVector(outgoing,.01);
            direction=outgoing;last=hit.object;
        }
        sensor.material=mat(reached?'#ffef95':'#a9bfce',!reached);
        lamp.material=mat(reached?'#ffca68':'#88633d',!reached);
        render();
        return {reached,reflections};
    }
    function setView(mode){view=mode;resize()}
    function resize(){
        const width=canvas.clientWidth,height=canvas.clientHeight;
        if(!width || !height)return;
        if(canvas.width!==Math.floor(width*renderer.getPixelRatio()) || canvas.height!==Math.floor(height*renderer.getPixelRatio())) renderer.setSize(width,height,false);
        camera.up.set(0,1,0);
        const center=vec(0,1,0);
        if(view==='top'){camera.position.set(0,22,0);camera.up.set(0,0,-1)}
        else if(view==='side')camera.position.set(.01,3.9,23);
        else camera.position.set(8.9,12.3,18);
        camera.lookAt(center);camera.updateMatrixWorld();
        const extent=vec(0,0,0);
        for(const x of [-7.35,7.35]) for(const y of [-1.3,4.35]) for(const z of [-4.95,4.95]){
            const v=vec(x,y,z).applyMatrix4(camera.matrixWorldInverse);
            extent.x=Math.max(extent.x,Math.abs(v.x));
            extent.y=Math.max(extent.y,Math.abs(v.y));
        }
        const aspect=width/height;
        const half=Math.max(extent.x/aspect*1.04,extent.y*1.12+1);
        camera.left=-half*aspect;camera.right=half*aspect;
        camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();
        render();
    }
    function render(){renderer.render(scene,camera)}
    function pick(clientX,clientY){
        const rect=canvas.getBoundingClientRect();
        raycaster.setFromCamera(new T.Vector2((clientX-rect.left)/rect.width*2-1,1-(clientY-rect.top)/rect.height*2),camera);
        const [hit]=raycaster.intersectObjects(mirrors.map(m=>m.frame),false);
        return hit?mirrors.findIndex(m=>m.frame===hit.object):-1;
    }
    function labelPositions(){
        return [...mirrors.map(m=>m.center.clone().add(vec(0,1.06,0))),sensor.position.clone().add(vec(0,.64,0))].map(p=>{
            p.project(camera);return {x:(p.x+1)*50,y:(1-p.y)*50};
        });
    }
    return {load,orient,choose,trace,resize,setView,pick,labelPositions,moveBoat,render};
}
