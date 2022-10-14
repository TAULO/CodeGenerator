/*
* 入口文件
*   -负责读文件,渲染和交互
*/

const svg = d3.select("svg");
const width = 1200, height = 800;   //svg的长和宽
const padding = {top: 70, bottom: 70};    //为防止树溢出上下边界，设置padding
const nodeWid = 11.024, nodeHei = 18;   //svg中节点的宽和高

let tree;   // 树对象
let layers;   //绘制该树的层数
let separation;   //svg中层与层之前的高度
let numOfEachLayer = [];  //每层的节点个数
const gap = 2.3*2;     // 节点和边之间的间隔大小
const familyGap = 0.5;    // 不同父母的节点之间的gap，gap*节点宽度为实际的间隔
let attrRect;     // 显示属性的矩形框
let valueY;       // Y = valueY 这条直线 也是之后的边的Y值
let abstractTree = [];   // 抽象树，在这个树中，节点由点来表示，边长使用节点之间的边表示

let Gradient;   // 颜色渐变器
let links;     // 边元素
let nodes;    //节点元素（包括分割线）

// 初始化绘制树
function renderInit(){
  // 移走之前绘制的边和点
  svg.selectAll("path").remove();
  svg.selectAll("rect").remove();
  svg.selectAll("line").remove();

  // 颜色渐变器
  Gradient = svg.append('defs').append('linearGradient')
      .attr('id', 'grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
  Gradient.append('stop')
      .attr('offset', '0%')
      .style('stop-color', 'orange')
      .style('stop-opacity', '0.35');
  Gradient.append('stop')
      .attr('offset', '100%')
      .style('stop-color', 'orange')
      .style('stop-opacity', '0.03');

  // 绘制边
  links = svg.selectAll(".links").data(tree.links).enter().append("g")
      .classed("linkG", "true")
      .each(function (d, i){
        //绘制边
        d3.select(this).append("path")
            .attr("stroke", "none")
            .attr("stroke-width", "0")
            //.attr("fill", "url(#grad)")
            .attr("fill", "#F1F1F1")
            .attr("fill", "#E8E9EE")
            .attr("fill", "#EFEEED")
            .attr("id", "line"+d.target.index)
            // .attr("fill", "#999")
            .attr("fill-opacity", "1")
            .attr("d", d => d.getLinkPath())
            .on("=", function (){
              highlightLine(d, true);
            })
            .on("", function (){
              highlightLine(d, false);
            });
      });

  // 绘制节点
  nodes = svg.selectAll(".nodes").data(tree.nodes).enter().append("g")
      .classed("nodeG", "true")
      .each(function (d, i){
        // 绘制节点
        /**
         * 如果是虚点，填充部分为空
         * 如果是虚点对应的实点，边框是虚线
         */
        d3.select(this).append("rect")
            .attr("x", d.x-nodeWid*d.extension/2)
            .attr("y", d.y-nodeHei/2)
            .attr("width", nodeWid*d.extension)
            .attr("height", nodeHei)
            .attr("fill", "#5F89A5")
            .attr("fill-opacity", "1")
            .attr("stroke", "#E8E9EE")
            .attr("stroke-width", "0.3")
            .attr("stroke-opacity", "1")
            .attr("id", d => "node"+d.index)    // 为每个节点分配ID
            .on("", function (){
              console.log("rect单击事件")
              /*
               * 当鼠标停留在某一个节点上的时候该节点就会被拉长
               */
              if(d.extension <= 1){
                focusNodeEnter(d.index, 10);
              }
              else{
                focusNodeEnter(d.index, 1);
              }
            })
            .on("click", function (){
              nodeClickListener(d);
            })
            .on("mouseover",function (){
              console.log("鼠标放在了上面");
              // 鼠标放到label上时，边框加粗，改颜色，在下方显示label
              revealLabel(d.index);
            })
            .on("mouseout", function (){
              // 鼠标移出到label时，边框复原，恢复颜色，label消失
              removeLabel(d.index);
            });
      });

  // 绘制虚实节点的边框
  let VRBorders = svg.selectAll(".VRBorders").data(tree.VRNodes).enter().append("rect")
      .classed("VRBorders", true)
      .attr("x", d => d.x - nodeWid/2)
      .attr("y", d => d.y - nodeHei/2)
      .attr("width", nodeWid)
      .attr("height", nodeHei)
      .attr("fill", "none")
      .attr("stroke", "#353635")
      .attr("stroke-dasharray", d => {
        if (d.virtualStatus === 1){
          return "3,1.5";
        }
        else{
          return null;
        }
      })
      .attr("stroke-width", 2);
}

/**
 * 更新tree
 *  -节点
 *  -分割线
 *  -边
 */
function renderUpdate(){
  let nodesUpdate = d3.selectAll(".nodeG").selectAll("rect");
  let linksUpdate = d3.selectAll(".linkG").selectAll("path");
  let VRNodesUpdate = d3.selectAll(".VRBorders");
  // let linksSeparationUpdate = d3.selectAll(".linkG").selectAll("line");

  // 节点过渡
  nodesUpdate.transition()
      .duration(800)
      .attr("fill", d => {
        if (d.status === 0){
          return "#5F89A5";
        }
        else {
          if (tree.status === 2 || tree.status === 3){
            // 此时就要使用label代替节点了
            return "#EFEEED";
          }
          else{
            return "orange";
          }
        }
      })
      .attr("x", d => d.x - nodeWid/2*d.extension)
      .attr("y", d => d.y - nodeHei/2)
      .attr("width", d => nodeWid*d.extension)
      .attr("fill-opacity", function (d){
        if (d.status === 0){
          return 1;
        }
        else {
          if (tree.status === 2 || tree.status === 3){
            // 此时就要使用label代替节点了
            return "0.3";
          }
          else{
            return "1";
          }
        }
  })
      .attr("stroke", function (d){
        if (d.status !== 0 && (tree.status === 2 || tree.status === 3)){
          // 此时就要使用label代替节点了
          return "orange";
        }
        else{
          return "#EFEEED";
        }
      })
      .attr("stroke-width", function (d){
        if (d.status !== 0 && (tree.status === 2 || tree.status === 3)){
          // 此时就要使用label代替节点了
          return 1;
        }
        else{
          return 0.3;
        }
      })
      .end()
      .then(function (){
        // 如果状态为2，显示label
        if (tree.status === 2){
          // 父代，自己，以及子代节点 都要显示出label
          let labelNodes = [tree.focus];
          for (let i = 0; i < tree.focus.parent.length; i++){
            labelNodes.push(tree.nodes[ tree.focus.parent[i]]);
          }
          for (let i = 0; i < tree.focus.children.length; i++){
            labelNodes.push(tree.nodes[ tree.focus.children[i]]);
          }
          svg.selectAll(".labelNodes").data(labelNodes).enter().append("text")
              .classed("labelNodes", true)
              .attr("x", d => d.x)
              .attr("y", d => d.y)
              .attr("dy", "0.4em")
              .attr("text-anchor", "middle")
              .attr("font-family", "helvetica")
              .attr("font-size", "12px")
              .attr("opacity", "0")
              .attr("fill", "#353635")
              .on("click", function (e, d){
                if (tree.status === 2 && tree.focus.index === d.index){
                  /**
                   * 展开子节点，成为一个矩形，周围的边绕开
                   */
                  tree.status = 3;    // 显示矩形属性框
                  showChildrenAttributes(d.index);
                  // 重新绘制
                  renderUpdate();
                }
                if (tree.focus.index !== d.index){
                  nodeClickListener(d);
                }

              })
              .text("Tom")
              .transition()
              .duration(300)
              .attr("opacity", "0.9");
        }
      });

  // 边过渡
  linksUpdate.transition()
      .duration(800)
      .attr("fill-opacity", d=>{
        if (d.target.status === 1 || d.target.status === 2 || d.target.status === 4){
          return "0.3";
        }
        else {
          return "1";
        }
      })
      .attr("fill", d=>{
        if (d.target.status === 1 || d.target.status === 2 || d.target.status === 4){
          return "orange";
        }
        else{
          return "#EFEEED";
        }
      })
      .attr("d", d=>{
        let path;
        if (tree.status === 3 && d.target.status === 2){
          let temp = d.target.y;
          d.target.y = valueY + nodeHei/2 + gap;
          path = d.getLinkPath();
          d.target.y = temp;
        }
        else{
          path = d.getLinkPath();
        }
        return path;
      });

  //虚拟现实边框过渡
  VRNodesUpdate.transition().duration(800)
      .attr("x", d => d.x - nodeWid/2*d.extension)
      .attr("y", d => d.y - nodeHei/2)
      .attr("width", d => nodeWid*d.extension);

  // 显示矩形框 子节点的边上拉
  if (tree.status === 3){
    // 用来显示属性信息的面板，
    let attrG = svg.append("g")
        .attr("id", "attrG");
    let attrRectUpdate = attrG.append("rect")
        .attr("x", attrRect[0])
        .attr("y", attrRect[1] + attrRect[3])
        .attr("width", attrRect[2])
        .attr("height", 0)
        .attr("stroke", "none")
        .attr("fill", "#EFEEED")
        .attr("opacity", "0")
        .attr("id", "attrRect")
        .transition().duration(800)
        .attr("y", attrRect[1])
        .attr("opacity", 0.3)
        .attr("height", attrRect[3]);

    // 绘制柱状图以及文本
    // 根据节点的数量随机生成数量文本
    let numText = [];
    for (let i = 0 ; i < tree.focus.children.length; i++){
      numText.push(parseInt(Math.random()*20)+30);
    }
    // 生成Y方向上的比例尺
    let scaleY = d3.scaleLinear().domain([15, 55]).range([0, attrRect[3]]);
    // 绘制矩形
    attrG.selectAll(".bar").data(tree.focus.children).enter().append("rect")
        .attr("x", (d, i)=> tree.nodes[d].x - nodeWid*0.6)
        .attr("y", attrRect[1]+attrRect[3])
        .attr("width", nodeWid*1.2)
        .attr("height", 0)
        .attr("fill", "orange")
        .attr("opacity", 0.8)
        .classed("bar", true)
        .transition()
        .delay(800)
        .duration(500)
        .attr("y", (d, i)=>attrRect[1]+attrRect[3]-scaleY(numText[i]))
        .attr("height", (d, i)=>scaleY(numText[i]));
    // #5F89A5
    // 绘制文本
    attrG.selectAll("barText").data(tree.focus.children).enter().append("text")
        .attr("x", d => tree.nodes[d].x)
        .attr("y", (d, i)=>attrRect[1]+attrRect[3]-scaleY(numText[i]))
        .attr("dy", "-2")
        .attr("text-anchor", "middle")
        .text((d, i)=>numText[i])
        .attr("font-family", "helvetica")
        .attr("font-size", "12px")
        .attr("opacity", "0")
        .attr("fill", "#353635")
        .classed("bar", true)
        .transition()
        .delay(1200)
        .duration(500)
        .attr("opacity", "1");
  }
}

/**
 * 改变关注节点之后的动画
 * @param node
 * 新focus点
 */
function renderFocusChangeUpdate(node){
  // 如果树处于显示属性状态,第一步将柱状图和文本消失
  if (tree.status === 3){
    tree.status = 2;    // 修改状态
    d3.select("#attrG").selectAll(".bar")
        .transition()
        .duration(500)
        .attr("opacity", "0")
        .remove()
        .end()
        .then(()=>{
          // 第二步属性框消失，短线恢复原长，折线恢复原始状态
          d3.select("#attrRect").transition().duration(500)
              .attr("y", attrRect[1]+attrRect[3])
              .attr("height", 0)
              .remove()
              .end().then(function (){
                d3.select("#attrG").remove();
          });
          d3.selectAll(".linkG").selectAll("path").transition()
              .duration(500)
              .attr("fill-opacity", d=>{
                if (d.target.status === 1 || d.target.status === 2){
                  return "0.3";
                }
                else {
                  return "1";
                }
              })
              .attr("fill", d=>{
                if (d.target.status === 1 || d.target.status === 2){
                  return "orange";
                }
                else{
                  return "#EFEEED";
                }
              })
              .attr("d", d=>{
                d.plot = [];
                return d.getLinkPath();
              })
              .end().then(function (){
                state2Update();
          })
    })

  }
  else if (tree.status === 2){
    state2Update();
  }
  else if (tree.status === 1){
    tree.status = 0;
    tree.recover();
    d3.selectAll(".nodeG").selectAll("rect").transition()
        .delay(500)
        .duration(500)
        .attr("fill", "#5F89A5");
    d3.selectAll(".linkG").selectAll("path").transition()
        .delay(500)
        .duration(500)
        .attr("fill-opacity", 1)
        .attr("fill", "#EFEEED")
        .end()
        .then(function (){
          updateNodesStatus(node);
          tree.status = 1;
          renderUpdate();
        });
  }

  function state2Update(){
    // 第三步鱼眼复原 与 label恢复一致
    tree.status = 0;
    tree.recover();
    d3.selectAll(".nodeG").selectAll("rect").transition()
        .duration(500)
        .attr("fill", "#5F89A5")
        .attr("x", d =>{
          return d.x - nodeWid/2*d.extension
        })
        .attr("y", d => {
          return d.y - nodeHei/2;
        })
        .attr("width", d => nodeWid*d.extension)
        .attr("stroke", "#EFEEED")
        .attr("stroke-width", "0.3");
    d3.selectAll(".linkG").selectAll("path").transition()
        .duration(500)
        .attr("fill-opacity", 1)
        .attr("fill", "#EFEEED")
        .attr("d", d=>{
          return d.getLinkPath();
        });
    d3.selectAll(".VRBorders").transition().duration(500)
        .attr("x", d => d.x - nodeWid/2*d.extension)
        .attr("y", d => d.y - nodeHei/2)
        .attr("width", d => nodeWid*d.extension)
        .end()
        .then(function (){
          updateNodesStatus(node);
          tree.status = 1;
          renderUpdate();
        });
    d3.selectAll(".labelNodes").transition()
        .duration(500)
        .attr("fill-opacity", "0")
        .remove();
  }
}

/**
 * 当节点d接收到点击事件之后的响应函数
 * @param d
 */
function nodeClickListener(d){
  /**
   * 双击节点显示出节点的父亲和孩子
   */
  // 如果点击的是虚点，设置为实点
  if (d.virtualStatus === 1){
    d = tree.nodes[d.counterpart];
  }
  // 点击事件发生后，先把节点边框取消
  removeLabel(d.index);
  // 如果focus点不存在或者此次点击的点与focus一致，则继续 反之替换focus节点
  if (!tree.focus || tree.focus.index === d.index){
    if (!tree.focus){
      tree.focus = d;
    }
    if (tree.status === 0){
      // 默认状态下点击节点，更改节点的状态和树的状态
      updateNodesStatus(d);
      tree.status = 1;
      renderUpdate();
    }
    else if (tree.status === 1){
      // 展开三代
      detailDisplayEnter(d.index);
      // 鱼眼变换
      tree.fishEye(d.index, 3.0);
      tree.status = 2;
      // 更改节点的extension值 在自动渲染中会有label
      d.extension = 2.3;
      tree.nodes[d.parent[0]].extension = 2.3;
      for (let i = 0; i < d.children.length; i++){
        tree.nodes[d.children[i]].extension = 2.3;
      }
      // 如果是虚拟节点的实点，父代也要展开
      if (d.virtualStatus === 2){
        tree.focusNode(d.parent[1], 2.3);
      }
      // 重新绘制
      renderUpdate();
    }
    else if (tree.status === 2){
      /**
       * 展开子节点，成为一个矩形，周围的边绕开
       */
      tree.status = 3;    // 显示矩形属性框
      showChildrenAttributes(d.index);
      // 重新绘制
      renderUpdate();
    }
  }
  else {
    // focus节点替换
    tree.focus = d;
    renderFocusChangeUpdate(d);
  }
}
/***
 * 更新显示文本信息
 * @param index
 * 所在的节点的ID
 * @param update
 * false=》新出现一个文本
 * true=》删除该文本
 */
function textUpdate(index, update){
  if(update){
    // 删除该文本
    svg.select("#text"+index)
        .transition()
        .duration(200)
        .attr("opacity", "0")
        .remove();
  }
  else{
    // 出现一个新的文本
    svg.append("text")
        .attr("x", tree.nodes[index].x)
        .attr("y", tree.nodes[index].y)
        .attr("dy", "0.5em")
        .attr("text-anchor", "middle")
        .attr("id", "text"+index)
        .text("Tom Jerry")
        .attr("family-size", "1em")
        .attr("opacity", "0")
        .on("dblclick", function (){
            focusNodeEnter(index, 1);
        })
        .transition()
        .duration(200)
        .attr("opacity", "1");
  }

}

/**
 * 鼠标经过一条边时，高亮或者恢复边以及其节点的颜色
 * @param line
 * @param highlight
 */
function highlightLine(line, highlight){
  let lineSvg = d3.select("#line"+line.target.index);
  let parentSvg = d3.select("#node"+line.source.index);
  let childSvg = d3.select("#node"+line.target.index);
  if (highlight){
    lineSvg.transition().duration(100)
        .attr("opacity", "0.3")
        .attr("fill", "orange");

    parentSvg.transition().duration(100)
        .attr("fill", "orange");
    if (!childSvg.empty()){
      childSvg.transition().duration(100)
          .attr("fill", "orange");
    }
  }
  else{
    lineSvg.transition().duration(100)
        .attr("opacity", "1")
        .attr("fill", d=>{
          if (d.target.status === 1 || d.target.status === 2){
            return "orange";
          }
          else{
            return "#EFEEED";
          }
        });
    parentSvg.transition().duration(100)
        .attr("fill", d => {
          if (d.status === 0){
            return "#5F89A5";
          }
          else{
            return "orange";
          }
        });
    if (!childSvg.empty()){
      childSvg.transition().duration(100)
          .attr("fill", d => {
            if (d.status === 0){
              return "#5F89A5";
            }
            else{
              return "orange";
            }
          });
    }
  }

}
/**
 * 更改当前节点，以及其父亲孩子节点的状态
 * @param node
 */
function updateNodesStatus(node){
  node.status = 1;
  for (let i = 0; i < node.children.length; i++){
    tree.nodes[node.children[i]].status = 2;
  }
  for (let i = 0; i < node.parent.length; i++){
    tree.nodes[node.parent[i]].status = 3;
  }
}

/***
 * 鼠标点击或者悬浮于某一个节点
 *  -数据处理
 *    -根据当前节点的伸展比例改变该行其他节点的显示比例
 *  -重新绘制节点和边
 *    -仅仅改变当前行节点的绘制和上下边的绘制
 * @param index
 */
function focusNodeEnter(index, extent){
  if(extent <= 1){
    textUpdate(index, true);
  }
  tree.focusNode(index, extent);
  renderUpdate();
  if(extent > 1){
    textUpdate(index, false);
  }
}

/**
 * 鼠标悬浮在一个普通状态下的节点时，该节点的边框加粗且改变颜色，该节点的下面显示出节点的名字
 *  -如果这个方法是循环第二次调用的，不再继续循环
 * @param index
 */
function revealLabel(index, iterate = false){
  let curNode = tree.nodes[index];
  let fontSize = 12;
  // 看该节点是否存在
  let nodeSvg = d3.select("#nodeBorder"+index)
  // 选中该节点 改边框和颜色
  if(nodeSvg.empty()){
    nodeSvg = svg.append("rect");
  }
  nodeSvg
      .attr("x", curNode.x - nodeWid*curNode.extension/2)
      .attr("y", curNode.y - nodeHei/2)
      .attr("width", nodeWid*curNode.extension)
      .attr("height", nodeHei)
      .attr("stroke", function (){
        if (curNode.virtualStatus === 0){
          return "#353635"
        }
        else{
          return "orange";
        }
      })
      .attr("fill", "none")
      .attr("stroke-width", 2.2)
      .attr("stroke-dasharray", function (){
        if (curNode.virtualStatus === 1){
          return "3,1.5";
        }
        else{
          return null;
        }
      })
      .attr("id", "nodeBorder"+index)
      .attr("opacity", 0).transition().duration(200)
      .attr("opacity", 1);

  // 在该节点的下方，显示出label
  // 看label是否存在
  let labelSvg = d3.select("#nodeText"+index);
  if (labelSvg.empty()){
    labelSvg = svg.append("text");
  }
  labelSvg
      .attr("x", curNode.x )
      .attr("y", curNode.y + nodeHei/2+fontSize+3)
      .attr("text-anchor", "middle")
      .attr("fill", function (){
        if (curNode.virtualStatus === 0){
          return "#353635";
        }
        else{
          return "orange";
        }
      })
      .attr("font-family", "helvetica")
      .attr("font-size", fontSize+"px")
      .attr("opacity", 0)
      .attr("id", "nodeText"+index)
      .text("Tom")
      .transition().duration(200)
      .attr("opacity", 1);

  // 如果是虚拟节点，对应的节点也应该显示出来
  if (curNode.virtualStatus !== 0 && !iterate){
    for (let i = 0; i < curNode.counterpart.length; i++){
      revealLabel(curNode.counterpart[i], true);
    }
  }
}

/**
 * 鼠标离开在一个显示了label的节点时，边框和label淡出并删除
 * @param index
 */
function removeLabel(index, iterate = false){
  let curNode = tree.nodes[index];
  d3.select("#nodeBorder"+index).transition().duration(100)
      .attr("opacity", "0")
      .remove();
  d3.select("#nodeText"+index).transition().duration(100)
      .attr("opacity", "0")
      .remove();

  // 如果是虚拟节点，对应的节点也应该显示出来
  if (curNode.virtualStatus !== 0 && !iterate){
    for (let i = 0; i < curNode.counterpart.length; i++){
      removeLabel(curNode.counterpart[i], true);
    }
  }
}


/***
 * 展开当前节点, 及其父亲，孩子
 * @param index
 * focus节点的index
 */
function detailDisplayEnter(index){
  let extension = 5;    // 展开的节点与周围的间隔
  let focus = [index];
  let parents = tree.nodes[index].parent, children = tree.nodes[index].children;


  let parent = [];
  if (parents.length > 0){
    parent = [parents[0]];
  }

  // 分别计算三代
  tree.detailDisplay(tree.nodes[index].depth, focus, extension*2);
  if(parents.length !== 0){
    tree.detailDisplay(tree.nodes[index].depth-1, parent, extension);
  }
  if(children.length !== 0){
    tree.detailDisplay(tree.nodes[index].depth+1, children, extension);
  }

  // 在此基础上尽可能使得三代的中点在同一条直线上
  // 计算三代的中点 和 每代的中点
  let center = 0;
  let cFocus = tree.nodes[index].x, cParents = 0, cChildren = 0;
  for (let i =0; i < parent.length; i++){
    cParents += tree.nodes[parent[i]].x;
  }
  for (let i = 0; i < children.length; i++){
    cChildren += tree.nodes[children[i]].x;
  }

  let sum = 1;
  if (parent.length !== 0){
    cParents /= parent.length;
    sum++;
  }
  if (children.length !== 0){
    cChildren /= children.length;
    sum++;
  }
  center = (cFocus+cParents+cChildren)/sum;

  // 计算每一行的位移偏移量，作为参数传递
  // 分别计算三代
  tree.centering(tree.nodes[index].depth, focus, (center-cFocus)/nodeWid);
  if(parents.length !== 0){
    tree.centering(tree.nodes[index].depth-1, parent, (center-cParents)/nodeWid);
  }
  if(children.length !== 0){
    tree.centering(tree.nodes[index].depth+1, children, (center-cChildren)/nodeWid);
  }

}

/**
 * 显示子节点的属性
 *  - 子节点集合上方出现容纳属性的矩形
 *  - 左右的边为矩形的显示绕开
 * @param index
 */
function showChildrenAttributes(index){
  // 所显示矩形的左上角坐标x,y 以及长和宽;
  attrRect = [0, 0, 0, 80];
  let focusNode = tree.nodes[index];  // 当前节点
  let fNode = tree.nodes[focusNode.children[0]],
      lNode = tree.nodes[focusNode.children[focusNode.children.length-1]];    // 第一个和最后一个节点
  valueY = fNode.y - nodeHei/2 - attrRect[3] - gap*2;       // y = valueY 这条直线
  let separation = fNode.y - focusNode.y - nodeHei;
  attrRect[0] = fNode.x - fNode.extension*nodeWid/2 - familyGap*nodeWid;
  attrRect[1] = fNode.y - attrRect[3] - nodeHei/2 - gap;
  attrRect[2] = lNode.x + lNode.extension*nodeWid/2 - (fNode.x - fNode.extension*nodeWid/2)+2*familyGap*nodeWid;

  // 得到与index节点位于同一层的左右两边节点，并处理节点，使开头结尾节点是有孩子节点
  let focusLayer = focusNode.depth;
  let focusLayerNodes = tree.getNodesByLayer(focusLayer);
  let focusLeftNodes = [], focusRightNodes = [];
  for (let i = 0; i < focusNode.layerID; i++){
    focusLeftNodes.push(focusLayerNodes[i]);
  }
  for (let i = focusNode.layerID + 1; i < focusLayerNodes.length; i++){
    focusRightNodes.push(focusLayerNodes[i]);
  }
  while(focusLeftNodes[0].children.length === 0){
    focusLeftNodes.shift();
  }
  while(focusLeftNodes[focusLeftNodes.length-1].children.length === 0){
    focusLeftNodes.pop();
  }
  while(focusRightNodes[0].children.length === 0){
    focusRightNodes.shift();
  }
  while(focusRightNodes[focusRightNodes.length-1].children.length === 0){
    focusRightNodes.pop();
  }

  // 计算该节点最右or最左的边，进一步计算出需要预留的空间


  // 计算出最右的边 与 矩形左上角的交点
  let insectLeftX = getInsectX(focusLeftNodes[focusLeftNodes.length-1],
      tree.nodes[focusLeftNodes[focusLeftNodes.length-1].children[focusLeftNodes[focusLeftNodes.length-1].children.length-1]], 0, valueY);

  let reserveRoom = insectLeftX - (attrRect[0]-familyGap*nodeWid);
  if (reserveRoom > 0){
    // 需要预留出空间
    // 再次遍历左右节点的每一个空隙，看是否满足所需要的预留的空间，并标记每个边需要平移的大小
    let accRoom = 0;
    let lastNode;    // 标记上一个具有孩子节点的节点
    let shiftNodes = [];        // 需要进行变形的边的父亲节点
    let shiftDistance = [];     // 每个边需要平移的位移大小
    for (let i = focusLeftNodes.length - 1; i >= 0; i--){
      if (focusLeftNodes[i].children.length === 0){
      }
      else{
        // 非叶子节点
        if (lastNode && (lastNode.index + -1) !== focusLeftNodes[i].index){
          // 如果是非叶子节点 并且这两个节点不相邻，那么说明两个节点之间有叶子节点，计算预留空间
          let room = ((lastNode.x - lastNode.extension*nodeWid/2)
              -(focusLeftNodes[i].x + focusLeftNodes[i].extension*nodeWid/2)-familyGap*nodeWid)*(100/separation);
          if (accRoom+room>reserveRoom){
            // 预留的空间已经够用了
            // 为已经遍历过的实节点的的位移加满
            for (let j = 0; j < shiftDistance.length; j++){
              shiftDistance[j] += (accRoom+room-reserveRoom);
            }
            // 跳出循环
            break;
          }
          else{
            // 预留的空间不够用
            accRoom += room;
            // 为已经遍历过的实节点的的位移加上room
            for (let j = 0; j < shiftDistance.length; j++){
              shiftDistance[j] += room;
            }
          }
        }
        lastNode = focusLeftNodes[i];
        shiftNodes.push(lastNode);
        shiftDistance.push(0);
      }
    }
    // 如果所有的可用空隙都填满了，那就继续外移
    if (accRoom < reserveRoom){
      for (let j = 0; j < shiftDistance.length; j++){
        shiftDistance[j] += (reserveRoom-accRoom);
      }
    }

    // 为每个边加上两个额外的点
    for (let i = 0; i < shiftNodes.length; i++){
      let curNode = shiftNodes[i];
      for (let j = 0; j < curNode.children.length; j++){
        // 对于每一条边，计算左右两个点
        let left = getInsectX(curNode, tree.nodes[curNode.children[j]], 0, valueY);
        let right = getInsectX(curNode, tree.nodes[curNode.children[j]], 1, valueY);
        // 根据节点把边对应起来
        tree.links[curNode.children[j] -1].plot = [[left-shiftDistance[i], valueY], [right - shiftDistance[i], valueY]];
      }
    }
  }
  else{
    // 目前的空间足够矩形展示 则不变
  }

  // 计算出最左的边 与 矩形左上角的交点
  let insectRightX = getInsectX(focusRightNodes[0],
      tree.nodes[focusRightNodes[0].children[0]], 0, valueY);

  reserveRoom = (attrRect[0] + attrRect[2] + familyGap*nodeWid) - insectRightX;
  if (reserveRoom > 0){
    // 需要预留出空间
    // 再次遍历左右节点的每一个空隙，看是否满足所需要的预留的空间，并标记每个边需要平移的大小
    let accRoom = 0;
    let lastNode;    // 标记上一个具有孩子节点的节点
    let shiftNodes = [];        // 需要进行变形的边的父亲节点
    let shiftDistance = [];     // 每个边需要平移的位移大小
    for (let i = 0; i < focusRightNodes.length; i++){
      if (focusRightNodes[i].children.length === 0){
      }
      else{
        // 非叶子节点
        if (lastNode && (lastNode.index + 1) !== focusRightNodes[i].index){
          // 如果是非叶子节点 并且这两个节点不相邻，那么说明两个节点之间有叶子节点，计算预留空间
          let room = (-(lastNode.x + lastNode.extension*nodeWid/2)
              +(focusRightNodes[i].x - focusRightNodes[i].extension*nodeWid/2)-familyGap*nodeWid)*(100/separation);
          if (accRoom+room>reserveRoom){
            // 预留的空间已经够用了
            // 为已经遍历过的实节点的的位移加满
            for (let j = 0; j < shiftDistance.length; j++){
              shiftDistance[j] += (accRoom+room-reserveRoom);
            }
            // 跳出循环
            break;
          }
          else{
            // 预留的空间不够用
            accRoom += room;
            // 为已经遍历过的实节点的的位移加上room
            for (let j = 0; j < shiftDistance.length; j++){
              shiftDistance[j] += room;
            }
          }
        }
        lastNode = focusRightNodes[i];
        shiftNodes.push(lastNode);
        shiftDistance.push(0);
      }
    }
    // 如果所有的可用空隙都填满了，那就继续外移
    if (accRoom < reserveRoom){
      for (let j = 0; j < shiftDistance.length; j++){
        shiftDistance[j] += (reserveRoom-accRoom);
      }
    }

    // 为每个边加上两个额外的点
    for (let i = 0; i < shiftNodes.length; i++){
      let curNode = shiftNodes[i];
      for (let j = 0; j < curNode.children.length; j++){
        // 对于每一条边，计算左右两个点
        let left = getInsectX(curNode, tree.nodes[curNode.children[j]], 0, valueY);
        let right = getInsectX(curNode, tree.nodes[curNode.children[j]], 1, valueY);
        // 根据节点把边对应起来
        tree.links[curNode.children[j] -1].plot = [[left+shiftDistance[i], valueY], [right + shiftDistance[i], valueY]];
      }
    }

  }
  else{
    // 目前的空间足够矩形展示 则不变
  }

}

/**
 * 得到两个直线与 Y = y 这条直线的交点的x值
 * @param parent
 * 父亲节点
 * @param child
 * p2是p1的一个孩子节点，也只有这种情况，该函数成立
 * @param d
 * 我们所求的边，这两个节点有左右两条边，d为0求左边的边，d为1求右边的边
 * @param y
 * @returns {*}
 * 返回x值
 */
function getInsectX(parent, child, d, y){
  let p1, p2;   // p1孩子节点坐标， p2父亲节点坐标
  let band = parent.extension*nodeWid/child.broNum;

  if (d === 0){
    p1 = [child.x - child.extension*nodeWid/2, child.y - nodeHei/2];
    p2 = [parent.x - parent.extension*nodeWid/2+band*child.broID, parent.y + nodeHei/2];
  }
  else if (d === 1){
    p1 = [child.x + child.extension*nodeWid/2, child.y - nodeHei/2]
    p2 = [parent.x - parent.extension*nodeWid/2+band*(child.broID+1), parent.y + nodeHei/2];
  }

  return (p2[0]-p1[0])/(p1[1]-p2[1])*(p1[1]-y)+p1[0];
}

/**
 * 压缩整棵树
 *  -如果该节点没有孩子节点那么全部压缩到最小
 */
function compressTreeEnter(){
  tree.compressTree();
  renderUpdate();
}

/**
 * 整棵树恢复为初始状态
 */
function recoverTreeEnter(){
  tree.recover();
  renderUpdate();
}

/***
 * 显示两点之间的最短路径
 *  -参数代表这条路径的起始点 index
 * @param src
 * @param des
 */
function shortestPathEnter(src, des){
  let paths = tree.getShortestPath(src, des);

  // 更改节点的状态
  for (let i = 0; i < paths.length; i++){
    for (let j = 0; j < paths[i].length; j++){
      tree.nodes[paths[i][j]].status = 4;
    }
    tree.nodes[paths[0][paths[0].length-1]].status = 5;
  }

  // for (let i = 0; i < path.length; i++){
  //   tree.detailDisplay(tree.nodes[path[i]].depth, [path[i]], 8);
  // }
  // let center = 0;
  // for (let i = 0; i < path.length; i++){
  //   center += tree.nodes[path[i]].x;
  // }
  // center /= path.length;
  // for(let i = 0; i < path.length; i++){
  //   // tree.centering(tree.nodes[path[i]].depth, [path[i]], (center-tree.nodes[path[i]].x)/nodeWid);
  // }
  renderUpdate();
}

/***
 * 重新调整每一层节点的坐标
 * @param tree
 */
function reConstructCoordi(tree){
  // 每一行重新计算位置
  for (let i = 0; i < layers; i++){
    let nodeSet = tree.getNodesByLayer(i);
    // 该方法改变的是initialxy 和 xy
    reInitialComputeLayerCoordinate(nodeSet, 0);
  }
}

/**
 * 初始化抽象树
 * AbstractTree 是一个数组，其中每个值代表的是每个节点的Y值，第一个值和最后一个值代表屏幕的边缘值
 * @param tree
 */
function initAbstractTree(tree){
  abstractTree[0] = 0;
  abstractTree[1] = tree.nodes[0].y - nodeHei/2;
  let edgeLen = separation - 2*gap;     // 这里写下边的长度
  for (let i = 1; i < tree.height; i++){
    abstractTree.push(abstractTree[i] + edgeLen);
  }
  abstractTree.push(abstractTree[abstractTree.length-1]+ height - tree.nodes[tree.nodes.length-1].y -nodeHei/2);
}

//读取文件
d3.csv("./data/reConstructData/301_Friedrich-Wieck_200.csv").then(function (data){
  // 得到d3中tree的格式
  let treeTemp = d3.stratify().id(d=>d.name).parentId(d=>d.parent)(data);
  let rootTemp = d3.tree()(treeTemp);

  // 初始化
  layers = rootTemp.height + 1;
  separation = (height - padding.top - padding.bottom) / (layers - 1);
  for(let i = 0; i < layers; i++){
    numOfEachLayer.push(0);
  }
  for(let i =0; i < rootTemp.descendants().length; i++){
    numOfEachLayer[rootTemp.descendants()[i].depth]++;
  }

  console.log(rootTemp);
  // 节点预处理：为每个节点计算坐标，索引，并标注其在兄弟姐妹中的位置
  let rootNode = preprocessing(rootTemp);     // rootTemp和rootNode指向的是同一个对象

  // 初始化树，并调整每一层的节点位置，使不同父母接节点之间有间隙
  tree = new Tree(rootNode);
  reConstructCoordi(tree);
  console.log(tree);

  // 初始化抽象树结构
  initAbstractTree(tree);
  console.log(abstractTree);

  /**
   * 重新计算节点坐标
   *  -原来的节点不同父母的节点是靠在一起的
   *  -更新为不同父母节点的孩子之间有一个空隙
   */

  // svg添加双击compress树事件
  svg.on("", function (){
    console.log("svg单击事件");
    if(!tree.isFold){
      compressTreeEnter();
      tree.isFold = true;
    }
    else{
      recoverTreeEnter();
      tree.isFold = false;
    }
  })
  // 初始化绘制树
  renderInit();

  // 触发某个节点，focus节点展开，其余节点压缩
  // focusNodeEnter(10);

  // 压缩整棵树
  // compressTreeEnter();

  //显示两点之间的最短路径
  // shortestPathEnter(93, 83);
  shortestPathEnter(100, 190);
})


