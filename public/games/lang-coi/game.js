(() => {
    const levels = [
        {
            place:'Sân phơi cói', title:'Thắp đèn sân phơi',
            goal:'Xoay gương cho tia vàng chạm vào quả cầu cảm biến trên đèn sân.',
            source:[-5.18,1.35,2], target:[.75,1.35,-2.5],
            mirrors:[{position:[.75,1.35,2],yaw:25,tilt:0}],
        },
        {
            place:'Bến thuyền', title:'Đưa thuyền về bến',
            goal:'Dẫn tia qua hai gương đến quả cầu trên đỉnh cột đèn hiệu.',
            source:[-5.18,1.35,2], target:[4.2,3.70,-2.45],
            mirrors:[{position:[-2,1.35,2],yaw:25,tilt:0},{position:[-2,1.35,-2],yaw:45,tilt:0}],
        },
    ];
    const $ = id => document.getElementById(id);
    const canvas = $('world');
    let world,levelIndex=0,selected=0,angles=[],phase='intro',animation=0;
    function show(id){
        for(const name of ['intro','play','result','unavailable']) $(name).hidden=name!==id;
        $('views').hidden=id!=='play' && id!=='result';
        $('panel').scrollTop=0;
        phase=id;
    }
    function labels(){
        const nodes=$('markers').children;
        world.labelPositions().forEach((p,i)=>{
            if(!nodes[i])return;
            nodes[i].style.left=p.x+'%';nodes[i].style.top=p.y+'%';
            nodes[i].classList.toggle('selected',phase==='play' && i===selected);
        });
    }
    function camera(view){
        world.setView(view);
        for(const button of $('views').children)button.setAttribute('aria-pressed',String(button.dataset.view===view));
        labels();
    }
    function dock(){
        const instant=matchMedia('(prefers-reduced-motion: reduce)').matches;
        const start=performance.now();
        function advance(now){
            const t=instant?1:Math.min(1,(now-start)/1850);
            world.moveBoat(t*t*(3-2*t));world.render();
            if(t<1)animation=requestAnimationFrame(advance);
        }
        advance(start);
    }
    function finish(reflections){
        show('result');labels();
        const last=reflections[reflections.length-1];
        const value=last.incidence.toLocaleString('vi',{maximumFractionDigits:1});
        $('result-tag').textContent=levelIndex===0?'Hoàn thành màn 1/2':'Hoàn thành 2/2 màn';
        $('result-title').textContent=levelIndex===0?'Sân phơi đã sáng!':'Đèn hiệu đã sáng!';
        $('result-text').textContent='Tại gương '+(last.index+1)+', góc tới và góc phản xạ cùng bằng '+value+'°. Hai góc đều được đo từ pháp tuyến, đường vuông góc với mặt gương.';
        $('result-coi').textContent=levelIndex===0?'“Đèn hiệu ở bến cao hơn đèn sân. Mình sẽ cần thêm một gương!”':'“Nhờ em chỉnh cả hướng lẫn độ nghiêng, bác lái thuyền đã thấy đèn hiệu!”';
        $('next').textContent=levelIndex===0?'Ra bến thuyền →':'Chơi lại từ sân phơi →';
        $('result-title').focus({preventScroll:true});
        if(levelIndex===1)dock();
        window.nsGame&&nsGame.result({game:'duong-sang-lang-coi',level:levelIndex+1,victory:true});
    }
    function update(){
        const a=angles[selected];
        const measure=$('normal').checked;
        const {reached,reflections}=world.trace(measure);
        $('yaw').textContent=a.yaw+'°';$('tilt').textContent=a.tilt+'°';
        const reflection=reflections.find(r=>r.index===selected);
        $('angles').hidden=!measure;
        if(measure){
            const format=n=>n.toLocaleString('vi',{maximumFractionDigits:1})+'°';
            $('angles').textContent=reflection?'Góc tới '+format(reflection.incidence)+' · Góc phản xạ '+format(reflection.reflection):'Tia tới chưa gặp gương đang chọn.';
        }
        for(const button of document.querySelectorAll('[data-axis]')){
            const {axis,delta}=button.dataset;
            const value=a[axis]+Number(delta);
            button.disabled=axis==='tilt' && (value < -35 || value > 35);
        }
        if(phase==='play'){
            const usedAll = angles.every((_,i)=>reflections[i]?.index===i);
            if(reached && usedAll){finish(reflections);return}
            let hint='Thử xoay gương sang phải từng nấc. Nhìn từ trên để thấy đường đi của tia.';
            if(levelIndex===1){
                if(reached)hint='Tia đã chạm đèn. Hãy đưa tia qua cả hai gương theo thứ tự G1, G2 để hoàn thành nhiệm vụ.';
                else if(!reflections.some(r=>r.index===1))hint='Chọn gương 1. Nhìn từ trên, đưa tia tới giữa gương 2 ở phía xưởng.';
                else if(selected===0)hint='Tia đã gặp gương 2. Chọn gương 2 rồi nhìn ngang để so độ cao với đèn.';
                else hint='Đích là quả cầu trên cột. Tăng độ nghiêng của gương 2 để nâng tia lên.';
            }else if(a.tilt!==0)hint='Đèn và gương ở cùng độ cao. Hãy thử đặt độ nghiêng về 0°.';
            if($('hint').textContent!==hint)$('hint').textContent=hint;
        }
        labels();
    }
    function select(index){
        if(index<0 || index>=angles.length)return;
        selected=index;
        world.choose(index);
        [...$('mirrors').children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
        update();
    }
    function turn(axis,delta){
        if(phase!=='play')return;
        const a=angles[selected];
        a[axis]=axis==='yaw'?(a.yaw+delta+360)%360:Math.max(-35,Math.min(35,a.tilt+delta));
        world.orient(selected,a.yaw,a.tilt);
        update();
    }
    function prepare(index,screen){
        cancelAnimationFrame(animation);
        levelIndex=index;
        const level=levels[index];
        angles=level.mirrors.map(({yaw,tilt})=>({yaw,tilt}));
        world.load(level);
        const buttons=angles.map((_,i)=>{
            const button=document.createElement('button');
            button.textContent='Gương '+(i+1);
            button.onclick=()=>select(i);
            return button;
        });
        $('mirrors').replaceChildren(...buttons);
        const names=angles.map((_,i)=>'G'+(i+1));
        names.push(index===0?'Đèn sân':'Đèn hiệu');
        $('markers').replaceChildren(...names.map(name=>{
            const pin=document.createElement('span');
            pin.className='pin';pin.textContent=name;return pin;
        }));
        $('place').textContent=level.place;
        $('chapter').textContent='Màn '+(index+1)+'/2 · '+level.place;
        $('mission').textContent=level.title;
        $('objective').textContent=level.goal;
        $('normal').checked=false;
        show(screen);
        angles.forEach((a,i)=>world.orient(i,a.yaw,a.tilt));
        camera('village');
        select(0);
        if(screen==='play')$('mission').focus({preventScroll:true});
    }
    function unavailable(){
        cancelAnimationFrame(animation);
        $('markers').replaceChildren();
        $('place').textContent='Đường Sáng Làng Cói';
        show('unavailable');
    }
    try {world=createVillage(canvas);prepare(0,'intro')}
    catch(error){console.warn('WebGL 2:',error.message);unavailable();return}
    $('start').disabled=false;
    $('start').onclick=()=>prepare(0,'play');
    $('reset').onclick=()=>prepare(levelIndex,'play');
    $('next').onclick=()=>prepare((levelIndex+1)%levels.length,'play');
    $('normal').onchange=update;
    for(const button of document.querySelectorAll('[data-axis]'))button.onclick=()=>turn(button.dataset.axis,Number(button.dataset.delta));
    for(const button of $('views').children)button.onclick=()=>camera(button.dataset.view);
    canvas.addEventListener('pointerup',e=>{
        if(phase==='play')select(world.pick(e.clientX,e.clientY));
    });
    const keys={ArrowLeft:['yaw',-5],ArrowRight:['yaw',5],ArrowUp:['tilt',5],ArrowDown:['tilt',-5]};
    window.addEventListener('keydown',e=>{
        if(phase!=='play' || e.altKey || e.ctrlKey || e.metaKey)return;
        if(keys[e.key]){e.preventDefault();turn(...keys[e.key])}
        if(e.key==='1' || e.key==='2')select(Number(e.key)-1);
    });
    new ResizeObserver(()=>{world.resize();labels()}).observe($('stage'));
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();unavailable()});
})();
