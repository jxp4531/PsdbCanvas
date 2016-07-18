/**
 * Created by ww on 2015/8/5.
 */

/**
 * 定义全局命名空间
 * @type {{}|*}
 */
// namespace:
this.PsdbCanvas = this.PsdbCanvas||{};


(function(){
    "use strict";
    /**
     * 类LineAnchorPoint的构造方法。
     * @constructor
     */
    function LineAnchorPoint(x,y,channel){

        this.PsdbAnchorPoint_constructor();
        /**
         * 对应节点
         */
        this.channel=channel;
        this.shape_width=4;
        this.shape_height=10;
        /**
         * 描点的x轴的初始坐标
         * @type {number}
         */
        this.initX= x;
        /**
         * 描点的y轴的初始坐标
         * @type {number}
         */
        this.initY= y;

        /**
         * 描点的x轴坐标
         * @type {number}
         */
        this.anchaX=x;
        /**
         * 描点的y轴坐标
         * @type {number}
         */
        this.anchaY=y;


        this.initAnchorEvent();
    }


    //指定类的继承关系
    var p = createjs.extend(LineAnchorPoint, PsdbCanvas.PsdbAnchorPoint);

    p.initLineAnchorPoint = function(){
        var me=this;
        /**
         *
         * @type {null}
         */
        me.anchorShape=null;

    };

    /**
     * 绘制节点的描点
     */
    p.drawAnchorPoint=function(){
        var me=this;
        me.anchorShape=me.drawShape(me.anchaX,me.anchaY,new PsdbCanvas.PsdbShape().set({cursor:"move",type:"shape_north_left"}) );
        me.addChild(me.anchorShape);
    };
    /**
     * 初始化描点坐标
     * @param x
     * @param y
     */
    p.initCoord= function(x,y){
        var me=this;
        me.initX=x;
        me.initY=y;
        me.anchaX=x;
        me.anchaY=y;
    };
    /**
     * 绘制描点
     * @param x 绘制描点的x轴坐标
     * @param y  绘制描点的y轴坐标
     * @param shape 对象PsdbCanvas.PsdbShape的一个实例
     * @returns {PsdbCanvas.PsdbShape}
     */
    p.drawShape=function(x,y,shape){
        var me=this;
        //初始化节点坐标系
        me.initCoord(x,y);

        shape.graphics.beginStroke("#000000");
        shape.graphics.setStrokeStyle(2)

        shape.graphics.drawCircle(x,y,me.shape_width);
        shape.graphics.endStroke();
        shape.alpha=0.5;
        shape.graphics.beginFill("#FF0000");
        shape.graphics.drawCircle(x,y,me.shape_width);
        shape.graphics.endFill();
        //shape
        return shape;
    };

    p.initAnchorEvent=function(){
        var me=this,
            scene=me.channel.scene;
        /**
         * 鼠标按下事件
         * 1.鼠标按下时记录当前移动目标的偏移量
         * 2.阻止当前事件向下传递
         */
        me.addEventListener("mousedown", function (evt) {
            //定义鼠标右键事件
            var o=me,
                scale=1/scene.scale;
            o.offset = {x: o.x - evt.stageX*scale, y: o.y - evt.stageY*scale};
            evt.stopPropagation();
        });
        /**
         * 鼠标按下移动事件
         * 1.鼠标按下移动时改变节点的形状
         * 2.阻止当前事件向下传递
         */
        me.addEventListener("pressmove", function (evt) {
            var o = me,
                scale=1/scene.scale;
            //计算当前移动的偏移量
            o.x = (evt.stageX*scale + o.offset.x);
            o.y = (evt.stageY*scale + o.offset.y);
            me.anchaX= o.x+me.initX;
            me.anchaY= o.y+me.initY;
            scene.updateScene();
            evt.stopPropagation();
        });
        me.addEventListener("dblclick", function (evt) {
            var pointContainer=me.channel.anchorPointContainer;
            pointContainer.removeChild(me);
            scene.updateScene();
            evt.stopPropagation();
        });
    };
    //添加前缀创，创建父类的构造函数Stage_constructor
    PsdbCanvas.LineAnchorPoint = createjs.promote(LineAnchorPoint, "PsdbAnchorPoint");
})();

