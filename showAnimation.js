function showNumberWithAnimation(i,j,randNumber){
    var numberCell=$("#number_cell_"+i+"_"+j);
    numberCell.css('background-color',getNumberBGC(randNumber));
    numberCell.css('color',getNumberC(randNumber));
    numberCell.text(randNumber);
    //设置动画效果，不同分号隔开而是用逗号
    numberCell.animate({
        width:"100px",
        height:'100px',
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);
}

//定义移动动画效果，为了函数能适用于四个方向的移动，使用四个参数
function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell=$("#number_cell_"+fromx+"_"+fromy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}
//分数更新
function updateScore(score){
    $("#score").text(score);
}