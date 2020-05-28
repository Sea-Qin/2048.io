var board=new Array();
var hasConflicted=new Array();
var score=0;

$(document).ready(function(){newGame();});
function newGame(){
    /*初始化棋盘*/
    init();
    /*在随机两个格子生成数字 */
    produceOneNumber();
    produceOneNumber();
}
//新游戏初始化
function init(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++)
                {
                    var gridCell=$('#grid_cell_'+i+'_'+j);
                    gridCell.css('top',getPosTop(i,j));
                    gridCell.css('left',getPosLeft(i,j));
                }
    }
    //所有棋盘数置零
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    //调用函数对棋盘数进行更新
    updateBoardView();
    score=0;
}
function updateBoardView(){
    //先清除之前游戏留下的数字棋盘
    $(".number_cell").remove();
    //通过父容器添加重新添加数字棋盘并根据board数据更新棋盘
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            $("#container").append('<div class="number_cell" id="number_cell_'+i+'_'+j+'"></div>');
            var this_cell=$("#number_cell_"+i+"_"+j);
            if(board[i][j]==0){ //数值为零则不显示
                this_cell.css('width','0px');
                this_cell.css('height','0px');
                this_cell.css('top',getPosTop(i,j)+50);
                this_cell.css('left',getPosLeft(i,j)+50);
            }
            else{
                this_cell.css('width','100px');
                this_cell.css('height','100px');
                this_cell.css('top',getPosTop(i,j));//与grid_cell位置相同以盖住grid_cell,只显示数字方格
                this_cell.css('left',getPosLeft(i,j));
                //通过方格数值决定其背景色和字体色
                this_cell.css('background-color',getNumberBGC(board[i][j]));
                this_cell.css('color',getNumberC(board[i][j]));
                this_cell.text(board[i][j]);
            }
            //在此处为重置hasConflict数组，使得后续每个方向移动操作后不影响其他方向的移动
            hasConflicted[i][j]=false;
        }
}
function produceOneNumber(){
    if(noSpace(board)==true)
    return false;
    var times=0;
    //若存在空位，先通过随机数生一个的坐标直至此坐标为空
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    while(times<50){
        if(board[randx][randy]==0)
        break;
        //不可用则一直循环
        randx=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4));
        times++;
    }
    //50次后仍旧未生成一个随机位置，则人工设置
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            if(board[i][j]==0){
                randx=i;
                randy=j;
                break;
            }
        }
    //随机生成数字2或4
    var randNumber=Math.random()>0.5?2:4;
    board[randx][randy]=randNumber;

    //通过动画显示
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}
//数字移动逻辑
$(document).keydown(function(event){
    switch(event.keyCode){
        case 37://left，若可移动，则生成一个新的随机数并判断游戏是否结束
            if(moveLeft()){
                setTimeout("produceOneNumber()",230);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38://up
            if(moveUp()){
                setTimeout("produceOneNumber()",230);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39://right
            if(moveRight()){
                setTimeout("produceOneNumber()",230);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40://down
            if(moveDown()){
                setTimeout("produceOneNumber()",230);
                setTimeout("isGameOver()",300);
            }
            break;
        default:
            break;
    }
});

//判断游戏结束
function isGameOver(){
    if(noSpace(board)&&noMove(board))
        gameover();
}
function gameover(){
    alert("gameover!");
}
//移动函数
function moveLeft(){

    if(!canMoveLeft(board))
        return false;
    
    for(var i=0;i<4;i++)
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                         //move，先移动再改值
                         showMoveAnimation(i,j,i,k);
                         board[i][k]=board[i][j];
                         board[i][j]=0;
                         continue;
                    }
                   //要移动到的位置跟移动方块数值相同、中间无阻碍且未被“加成”
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        //add,score add
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board))
        return false;

    for(var i=1;i<4;i++)
        for(var j=0;j<4;j++){
            if(board[i][j]!=0)
                for(var k=0;k<i;k++){
                    if(board[k][j]==0&&noBlockVertical(k,i,j,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    //要移动到的位置跟移动方块数值相同、中间无阻碍且未被“加成”
                    else if(board[k][j]==board[i][j]&&noBlockVertical(k,i,j,board) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                
            }
        }

    setTimeout("updateBoardView()",200);
    return true;

}

function moveRight(){
    if(!canMoveRight(board))
        return false;
    //最右边先进行判断，防止“堵塞”
    for(var i=0;i<4;i++)
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0)
                for(var k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    //要移动到的位置跟移动方块数值相同、中间无阻碍且未被“加成”
                    else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board))
        return false;
    //move
    for(var j=0;j<4;j++)
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0)
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(i,k,j,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    //要移动到的位置跟移动方块数值相同、中间无阻碍且未被“加成”
                    else if(board[k][j]==board[i][j] && noBlockVertical(i,k,j,board) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}