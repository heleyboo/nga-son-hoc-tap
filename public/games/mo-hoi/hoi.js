(() => {
    const $ = id => document.getElementById(id);
    const chapters = [
        {id:'math',subject:'Toán học',title:'Lát sân phiên chợ',place:'Sân hội',goal:'Phủ kín sân 4 × 4 bằng bốn tấm chiếu 1 × 3. Chừa bồn hoa 2 × 2 ở giữa.'},
        {id:'chem',subject:'Hóa học',title:'Xưởng muối sau mưa',place:'Bàn làm muối',goal:'Mẻ muối lẫn hạt cát. Chọn dụng cụ và giữ đúng phần để thu được tinh thể muối sạch.'},
        {id:'physics',subject:'Vật lý',title:'Cẩu kiện cói',place:'Bãi chuyển hàng',goal:'Chọn móc cho đối trọng để cần nằm ngang. Khi cân bằng, hạ kiện cói xuống xe.'},
    ];
    const rewards = [
        ['Sân hội đã lát kín!','Bồn hoa chiếm 4 ô. Bốn tấm chiếu phủ đủ 16 − 4 = 12 ô còn lại, mỗi ô đúng một lớp.','“Sân đã sẵn sàng! Qua xưởng muối giúp tớ một tay nhé.”'],
        ['Đã thu được muối sạch!','Muối tan trong nước, cát nằm lại trên giấy lọc. Khi cô cạn phần nước lọc, nước bay hơi và muối kết tinh trong khay.','“Xong mẻ muối rồi! Còn kiện cói cần chuyển lên xe.”'],
        ['Làng Cói mở hội!','Sân đã trải chiếu, muối đã sạch, kiện cói đã lên xe. Hai bên cần cùng có mômen lực 300 N·m: bên trái 300 N × 1 m, bên phải 100 N × 3 m.','“Cảm ơn cậu! Mình cùng đón khách vào phiên chợ nhé.”'],
    ];
    let stage,section='intro',index=0,busy=false;
    let startCell=0,vertical=false,laid=[];
    let sample,labPhase,lastTool;
    let hook=0,armAngle=0,balanced=false;
    const cellName=i=>'ABCD'[Math.floor(i/4)]+(i%4+1);
    function page(name){
        section=name;
        for(const id of ['intro','task','done','error']) $(id).hidden=id!==name;
        $('angle').hidden=name!=='task' || index!==0;
        $('panel').scrollTop=0;
        [...document.querySelectorAll('header li')].forEach((li,i)=>{
            const active=name==='task' && i===index;
            li.classList.toggle('active',active);
            li.classList.toggle('passed',(name==='task'||name==='done') && (i<index || (i===index && name==='done')));
            if(active)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');
        });
    }
    function message(text,tone=''){
        $('message').textContent=text;
        $('message').parentElement.dataset.tone=tone;
    }
    function win(){
        busy=false;page('done');
        $('stamp').textContent=index===2?'Hoàn thành ba thử thách':'Hoàn thành màn '+(index+1)+'/3';
        const [title,detail,quote]=rewards[index];
        $('done-title').textContent=title;$('explain').textContent=detail;$('farewell').textContent=quote;
        $('next').textContent=['Đến xưởng muối →','Ra bãi chuyển hàng →','Chơi lại từ sân hội →'][index];
        if(index===2){stage.setup('market');$('location').textContent='Phiên chợ Nga Sơn'}
        $('done-title').focus({preventScroll:true});
        window.nsGame&&nsGame.result({game:'lang-coi-mo-hoi',level:index+1,victory:true});
    }
    function footprint(start,down){
        const row=Math.floor(start/4),col=start%4;
        if(down?row>1:col>1)return [];
        return [start,start+(down?4:1),start+(down?8:2)];
    }
    function checkMat(cells){
        if(!cells.length)return 'Đầu chiếu vượt mép sân. Đổi ô bắt đầu hoặc xoay chiếu.';
        if(cells.some(c=>[5,6,9,10].includes(c)))return 'Tấm chiếu sẽ đè lên bồn hoa ở giữa. Hãy chọn một cạnh sân.';
        if(laid.some(m=>m.cells.some(c=>cells.includes(c))))return 'Hai tấm sẽ chồng lên nhau. Có thể thu lại tấm vừa trải.';
        return '';
    }
    function matView(preview=true){
        const cells=footprint(startCell,vertical);
        $('cell').value=String(startCell);$('rotate').textContent=vertical?'Dọc ↓':'Ngang →';
        $('covered').textContent=(laid.length*3)+' / 12 ô';$('stock').textContent=(4-laid.length)+' chiếu trong kho';
        $('undo').disabled=!laid.length;
        stage.showMats(laid,preview?(cells.length?cells:[startCell]):[],!checkMat(cells));
    }
    function chooseCell(i){
        startCell=i;matView();
        const cells=footprint(i,vertical);
        const warning=checkMat(cells);
        message(warning || 'Chiếu sẽ phủ '+cells.map(cellName).join(', ')+'.',warning?'warn':'');
    }
    function place(){
        const cells=footprint(startCell,vertical),warning=checkMat(cells);
        if(warning){message(warning,'warn');return}
        laid.push({start:startCell,vertical,cells});
        if(laid.length===4){stage.showMats(laid,[],true);win();return}
        matView(false);message('Đã trải '+laid.length+' tấm. Chọn ô đầu của tấm tiếp theo.','good');
    }
    function sampleName(){
        if(sample.water && !sample.salt && !sample.sand)return 'Nước';
        if(sample.water)return sample.sand?'Nước muối và cát':'Nước muối';
        if(sample.sand && sample.salt)return 'Muối trộn cát';
        if(sample.sand)return 'Cát';
        if(sample.salt)return 'Tinh thể muối';
        return 'Cốc trống';
    }
    function labView(){
        $('sample').textContent=labPhase==='choose'?'Hai phần sau lọc':sampleName();
        $('tools').hidden=labPhase!=='work';$('fractions').hidden=labPhase!=='choose';
        stage.salt(sample,labPhase,lastTool);
    }
    function newBatch(){
        sample={salt:true,sand:true,water:false};labPhase='work';lastTool='';
        labView();message('Cả hạt muối và cát đều đang ở trong cốc pha. Em muốn thử dụng cụ nào?');
    }
    function tool(action){
        if(busy || labPhase!=='work')return;
        if(action==='water' && sample.water){message('Trong cốc đã có đủ nước. Quan sát chất lắng dưới đáy trước khi chọn dụng cụ khác.');return}
        if(action==='heat' && !sample.water){message('Mẻ này đang khô. Cô cạn chỉ tách được phần nước đang có.','warn');return}
        busy=true;
        $('chem').inert=true;
        stage.labAction(action,()=>{
            $('chem').inert=false;busy=false;lastTool=action;
            if(action==='water'){
                sample.water=true;
                message('Khuấy xong: hạt muối đã tan, hạt cát vẫn lắng ở đáy cốc.');
            }else if(action==='filter'){
                labPhase='choose';
                message(sample.water?'Chất lỏng đã qua giấy và chảy xuống cốc. Em sẽ giữ phần nào?':'Hai loại hạt khô cùng nằm trên giấy, cốc hứng vẫn trống. Em sẽ giữ phần nào?',sample.water?'':'warn');
            }else{
                sample.water=false;
                if(!sample.sand && sample.salt){labView();win();return}
                message('Nước đã bay hơi, muối và cát cùng nằm trong khay. Có thể thêm nước rồi tách lại.','warn');
            }
            labView();
        });
    }
    function keep(which){
        if(busy || labPhase!=='choose')return;
        if(which==='cup'){
            sample.sand=false;
            if(!sample.water)sample.salt=false;
        }else{
            if(sample.water)sample.salt=false;
            sample.water=false;
        }
        lastTool='';labPhase=sample.salt?'work':'lost';
        labView();
        if(!sample.salt)message(which==='paper'?(sample.sand?'Trên giấy còn cát. ':'Giấy lọc trống. ')+'Muối đã tan và đi theo phần nước em vừa bỏ. Lấy mẻ mới để thử lại.':'Cốc hứng trống vì em đã lọc khi hỗn hợp còn khô. Lấy mẻ mới để thử lại.','warn');
        else message(sample.water?'Đã giữ phần nước lọc trong cốc pha. Muối còn hòa tan trong đó.':'Đã đưa cả muối và cát từ giấy về cốc pha. Chúng vẫn còn trộn lẫn.');
    }
    function chooseHook(n){
        if(busy)return;
        hook=n;balanced=false;armAngle=0;
        for(const b of $('hooks').children)b.setAttribute('aria-pressed',String(Number(b.dataset.hook)===hook));
        $('try').disabled=false;$('try').textContent='Thử cân';stage.crane(hook,0,0);
        message('Đã treo đối trọng cách trục '+hook+' m. Thả cần để quan sát nó nghiêng về bên nào.');
    }
    function weigh(){
        if(busy || !hook)return;
        busy=true;$('physics').inert=true;
        const release=()=>{busy=false;$('physics').inert=false};
        if(balanced){
            stage.animate(650,t=>stage.crane(hook,0,t),()=>{release();win()});return;
        }
        const left=30*10, right=10*10*hook; // Lấy g ≈ 10 N/kg, bỏ qua khối lượng cần.
        const target=(left-right)/left*.37;
        const from=armAngle;
        stage.animate(450,t=>stage.crane(hook,from+(target-from)*t,0),()=>{
            release();armAngle=target;balanced=left===right;
            $('try').textContent=balanced?'Hạ kiện lên xe':'Thử cân';
            message(balanced?'Cần ngang! Hai mômen đều bằng 300 N·m. Em có thể hạ kiện lên xe.':'Phía kiện cói hạ xuống: 300 N·m lớn hơn '+right+' N·m. Hãy đổi khoảng cách đối trọng.',balanced?'good':'warn');
        });
    }
    function enter(i){
        index=i;busy=false;
        const c=chapters[i];page('task');
        for(const ch of chapters)$(ch.id).hidden=ch!==c;
        $('chapter').textContent='Màn '+(i+1)+'/3 · '+c.subject;$('title').textContent=c.title;
        $('goal').textContent=c.goal;$('location').textContent=c.place;$('angle').textContent='Nhìn từ trên';
        stage.setup(c.id);
        if(i===0){startCell=0;vertical=false;laid=[];matView();message('Chạm ô đầu trên sân hoặc chọn trong danh sách. Chiếu trải sang phải hoặc xuống dưới.')}
        if(i===1)newBatch();
        if(i===2){
            hook=0;balanced=false;armAngle=0;stage.crane(0,0,0);
            for(const b of $('hooks').children)b.setAttribute('aria-pressed','false');
            $('try').disabled=true;$('try').textContent='Thử cân';
            message('Kiện treo bên trái. Hãy chọn một trong ba móc bên phải. Coi cần nhẹ, lấy g ≈ 10 N/kg.');
        }
        $('title').focus({preventScroll:true});
    }
    function pick(action){
        if(section!=='task' || busy)return;
        if(index===0)chooseCell(action);
        if(index===1){
            if(labPhase==='choose' && action==='filter')keep('paper');
            else if(labPhase==='choose' && action==='receiver')keep('cup');
            else if(action!=='receiver')tool(action);
        }
        if(index===2)chooseHook(action);
    }
    function unavailable(){stage?.stop();page('error');$('angle').hidden=true}
    try{stage=createFair($('world'),$('labels'),pick);stage.setup('math');stage.showMats([{start:0,vertical:false},{start:3,vertical:true}],[],true)}
    catch(err){console.warn('Sa bàn 3D:',err.message);unavailable();return}
    $('world').addEventListener('webglcontextlost',e=>{e.preventDefault();unavailable()});
    for(let i=0;i<16;i++)$('cell').add(new Option(cellName(i),String(i)));
    $('start').disabled=false;$('start').onclick=()=>enter(0);
    $('next').onclick=()=>enter((index+1)%3);
    $('angle').onclick=()=>{$('angle').textContent=stage.angle()?'Nhìn nghiêng':'Nhìn từ trên'};
    $('cell').onchange=()=>chooseCell(Number($('cell').value));
    $('rotate').onclick=()=>{vertical=!vertical;chooseCell(startCell)};
    $('lay').onclick=place;
    $('undo').onclick=()=>{const m=laid.pop();if(m){startCell=m.start;vertical=m.vertical;matView();message('Đã thu chiếu. Có thể chọn lại ô đầu hoặc đổi hướng.')}};
    for(const b of $('tools').children)b.onclick=()=>tool(b.dataset.tool);
    for(const b of document.querySelectorAll('[data-keep]'))b.onclick=()=>keep(b.dataset.keep);
    $('new-sample').onclick=newBatch;
    for(const b of $('hooks').children)b.onclick=()=>chooseHook(Number(b.dataset.hook));
    $('try').onclick=weigh;
    $('world').addEventListener('keydown',e=>{
        if(section!=='task' || busy)return;
        if(index===0){
            if(e.key.toLowerCase()==='r')$('rotate').click();
            if(e.key==='Enter')place();
            const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowDown:[0,1],ArrowUp:[0,-1]};
            if(directions[e.key]){
                e.preventDefault();const [dx,dy]=directions[e.key];
                chooseCell(Math.max(0,Math.min(3,Math.floor(startCell/4)+dy))*4+Math.max(0,Math.min(3,startCell%4+dx)));
            }
        }
        if(index===2 && ['1','2','3'].includes(e.key))chooseHook(Number(e.key));
    });
})();
