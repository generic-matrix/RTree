import React from 'react';
import reactDom from 'react-dom';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Transformer ,Text,Circle} from 'react-konva';

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange,AddPoint,Getpoints,SetPoints,IsLeaf}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        opacity={0.4}
        onDblClick={onSelect}
        onDblTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onClick={
            (e)=>{
                if(e.evt.button===1){
                    // Add the point 
                    const stage = e.target.getStage();
                    const pointerPosition = stage.getPointerPosition();
                    const offset = {x:pointerPosition.x, y: pointerPosition.y};
                    const parentid=shapeProps.id;
                    //(90,3,"vase",50,50);
                    const pointId=prompt("Add the point name");
                    if(pointId===null || pointId===""){
                    }else{
                        if(IsLeaf(parentid)){
                            //Add the point in the UI
                            let json=Getpoints.slice();
                            json.push({
                                x:offset.x,
                                y:offset.y
                            });
                            AddPoint(pointId,parentid,pointId,offset.x,offset.y*-1);
                            SetPoints(json);
                        }else{
                            alert("Cannot add points in Non leaf region ");
                        }
                    }
                }
            }
        }
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};


const Canvas = (props) => {
  const [selectedId, selectShape] = React.useState(null);
  const [TargetCoord, SetTargetCoord] = React.useState([20,50]);
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {props.GetRectangles.map((rect, i) => {
          return (
            <>
            <Text text={rect.id} x={rect.x} y={rect.y}  fill={(props.IsDarkTheme)?"white":"black"}/>
                <Rectangle
                key={i}
                shapeProps={rect}
                AddPoint={props.RTreeAdapter.AddPoint}
                IsLeaf={props.RTreeAdapter.IsLeaf}
                Getpoints={props.Getpoints} 
                SetPoints={props.SetPoints} 
                isSelected={rect.id === selectedId}
                onSelect={() => {
                    selectShape(rect.id);
                }}
                onChange={(newAttrs) => {
                    const rects = props.GetRectangles.slice();
                    rects[i] = newAttrs;
                    //change by id 
                    let x=newAttrs.x;
                    let y=newAttrs.y;
                    let h=newAttrs.height;
                    let w=newAttrs.width;
                    props.RTreeAdapter.OnRectSizeChange(rect.id,[x,-1*(y+h),x+w,y*-1]);
                    props.SetRectangles(rects);
                }}
                />
            </>
          );
        })}
        {/*Point ID comes here */}
        {props.Getpoints.map((dot, i) => {
            return(
                <Circle key={i} x={dot.x} y={dot.y} radius={3} fill="black" shadowBlur={30} />
            );
        })}
        <Text text="Target" x={TargetCoord[0]} y={TargetCoord[1]}  fill={(props.IsDarkTheme)?"white":"black"}/>
        <Rect
          x={TargetCoord[0]}
          y={TargetCoord[1]}
          width={300}
          height={300}
          stroke='yellow'
          strokeWidth={1}
          dash={[1, 1]}
          shadowBlur={10}
          draggable
          onDragEnd={(e) => {
            //Find the points in the region [x,y+h,x+w,y]
            var t0 = performance.now()
            //[e.target.x(),(e.target.y()+100)*-1,e.target.x()+100,e.target.x()*-1]
            let points=props.RTreeAdapter.Search([e.target.x(),(e.target.y()+300)*-1,e.target.x()+300,e.target.y()*-1]);
            var t1 = performance.now()
            //update in state (the array) FoundPoints
            let json=props.FoundPoints.splice();
            for(var i=0;i<points.length;i++){
                json.push({
                    parent_region_id:points[i].parent_region_id,
                    name:points[i].name
                });
            }
            console.log([e.target.x(),(e.target.y()+300)*-1,e.target.x()+300,e.target.y()*-1]);
            console.log(JSON.stringify(props.RTreeAdapter.RegionHash()));
            props.SetFoundPoints(json);
            SetTargetCoord([e.target.x(),e.target.y()])
            props.SetMs(t1-t0);
          }}
        />
      </Layer>
    </Stage>
  );
};



export default Canvas;