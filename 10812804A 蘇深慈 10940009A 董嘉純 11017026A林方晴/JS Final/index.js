const canvas = document.querySelector('canvas'); // 選取元素中的 canvas
const c = canvas.getContext('2d'); // 取得 2D 繪圖環境

console.log(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;

//Variable
const x=canvas.width/2;// adjust player to x middle
const y=canvas.height/2;// adjust player to y middle
const Oriwid=canvas.width;
const Oriheigh=canvas.height;
//摩擦力
const friction=0.99;
// 建立 Player 類別
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 繪製圓形
    c.fillStyle = this.color;
    c.fill();
  }
}
//建立點擊的軌跡class
class ProjectTile{
  constructor(x,y,radius,color,velocity){

    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 繪製圓形
    c.fillStyle = this.color;
    c.fill();
  }
  //每禎更新畫與力
  update(){
    this.draw();
    this.x=this.x + this.velocity.x//x的力
    this.y=this.y + this.velocity.y//y的力
  }
}
//Enemy class
class Enemy{
  constructor(x,y,radius,color,velocity){

    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 繪製圓形
    c.fillStyle = this.color;
    c.fill();
  }
  //每禎更新畫與力
  update(){
    this.draw();
    this.x=this.x + this.velocity.x//x的力
    this.y=this.y + this.velocity.y//y的力
  }
}
// particles class
class Particles{
  constructor(x,y,radius,color,velocity){

    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
    this.alpha=1;//transparency
  }
  draw() {
    c.save();
    c.globalAlpha=this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 繪製圓形
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  //每禎更新畫與力
  update(){
    this.draw();
    this.velocity.x*=friction;
    this.velocity.y*=friction;
    this.x=this.x + this.velocity.x//x的力
    this.y=this.y + this.velocity.y//y的力
    this.alpha-= 0.003;// 透明度逐漸--;
    if (this.alpha <= 0) {
      this.alpha = 0;     
    }
  }
}
//VARIABLES
// 創建新的 player 物件
const player = new Player(x, y, 30, 'LightBlue'); 
//先建立project tile,後面才能被並定義 const無法初始化後無法更動
const projectTile = new ProjectTile(x,y,5,'LightYellow',{x:1,y:1});//{x:1,y:1}從class建立物件的力
const projectTiles = [projectTile];//放置不同生成軌跡
//put enemy here
const Enemies=[];
//particle array
const particles=[];
//Enymy重生再生prefab
function SpawnEnemy( ){ 
setInterval(()=>{
  const radius=Math.random()*(60-8)+8;//隨機大小Math.random() * (max - min) + min;
  let Ex;
  let Ey;
  //平衡隨機位置
  if(Math.random()<0.5){
    Ex=Math.random()<0.5? 0-radius: Oriwid + radius;
    Ey=Math.random()*Oriheigh;
  }
  else{
    Ex=Math.random()*Oriwid;
    Ey=Math.random()<0.5? 0-radius:Oriheigh+radius;
  }
  
  const color=`hsl(${Math.random()*360},50%,50%)`; 
  const angle=Math.atan2(
   y-Ey , x-Ex);//滑鼠移動中心tan 
   
  const speed=3;
  const velocity={//only(x: ,y: ) don't change name
    x : Math.cos(angle)*speed,
    y : Math.sin(angle)*speed
  }

 Enemies.push(new Enemy(Ex,Ey,radius,color,velocity));
  console.log(Enemies);
 },1000);
}
//軌跡動畫//敵人動畫
let animationID;
//爆炸速度
const exploSpeed=5;

function animate(){
  animationID=requestAnimationFrame(animate);
  //clear 2D canvas projectTiles// c.clearRect(0,0,Oriwid,Oriheigh);
  c.fillStyle='rgba(0,0,0,0.1)';
  c.fillRect(0,0,Oriwid,Oriheigh);
  //畫出player 放在外面只會被做一次,消失就沒了
  player.draw();
  //劃出粒子效果陣列的動畫,呼叫class的方法
  particles.forEach(particles=>{
    if(this.alpha<=0){
      particles.splice(index,1);//remove /desyory particles
    }
    else{
      particles.update();
    }
    
  })
  //更新繪製所有軌跡陣列,超出邊界WASD就消失
  projectTiles.forEach((projectTile, index)=>{
     projectTile.update();
     if(projectTile.x-projectTile.radius<0 || projectTile.x-projectTile.radius> Oriwid||
      projectTile.y+ projectTile.radius<0 || projectTile.y-projectTile.radius>Oriheigh ){
        setTimeout(()=>{
        projectTiles.splice(index,1);
      },0);
     }
  }) 
  //更新繪製所有軌跡陣列 
  Enemies.forEach((Enemy,index)=>{
    Enemy.update();
    //End game
    const P_dist= Math.hypot(player.x-Enemy.x, player.y-Enemy.y)
    //敵人與玩家碰撞處理
    if(P_dist-Enemy.radius-player.radius<1)
    {
      cancelAnimationFrame(animationID);
       console.log("End");    
    }

    projectTiles.forEach((projectTile,proIndex)=>{
    const dist= Math.hypot(projectTile.x-Enemy.x, projectTile.y-Enemy.y) //平方和函數,計算距離    
    //enemy collide with projectTile
     if(dist-Enemy.radius-projectTile.radius < 1){//兩物體距離-敵人-我的軌跡<1 (相撞)  

        //particles effect
  for(let i=0; i<Enemy.radius; i++)
  {
      particles.push(new Particles(
      projectTile.x,
      projectTile.y,
      3,
      Enemy.color,
      {x:(Math.random()-0.5)*(Math.random())*exploSpeed, y:(Math.random()-0.5)*(Math.random())*exploSpeed}
      ));
  }
       setTimeout(()=>{
        Enemies.splice(index,1);
      },0);
     }
   }) 
 })  
}

window.addEventListener('click',(event)=>{


 //滑鼠移動中心tan  
  const angle=Math.atan2(
    event.clientY-y,
    event.clientX-x);
//set up velocity
  let speed=5;
  const velocity=
  {
    //only(x: ,y: ) don't change name 
    x : Math.cos(angle)*speed,
    y : Math.sin(angle)*speed
  }
  projectTiles.push(new ProjectTile(x,y,5,'LightYellow',velocity)); //C# list 創建新軌跡以及初始化後加入到陣列 
  console.log(angle);
})

animate();
SpawnEnemy();