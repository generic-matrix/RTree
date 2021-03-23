import React from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import Canvas from "./Components/Canvas";
import TreeView from "./Components/Tree";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import './App.css';
const RTreeAdapter=require("./RTreeAdapter");
RTreeAdapter.AddRootRegion();
const initialState = { 
  IsDarkTheme: true,
  IsCanvasView:true,
  Rectangles:[],
  Points:[],
  FoundPoints:[],
  ms:0,
  dialogClosed:false
};
const { useGlobalState } = createGlobalState(initialState);

const Main = () => {
  const [IsDarkTheme, SetDarkTheme] = useGlobalState('IsDarkTheme');
  const [IsCanvasView, SetCanvasView] = useGlobalState('IsCanvasView');
  const [GetRectangles, SetRectangles] = useGlobalState('Rectangles');
  const [Getpoints, SetPoints] = useGlobalState('Points');
  const [FoundPoints, SetFoundPoints] = useGlobalState('FoundPoints');
  const [Ms, SetMs] = useGlobalState('ms');
  const [DialogClosed, SetdialogClosed] = useGlobalState('dialogClosed');
  const AddNewRect = () => {
    let color= (Math.floor(Math.random()*0xffffff)|0x0f0f0f).toString(16);
    const rects = GetRectangles.slice();
    let name=prompt("Type in the region name ");
    rects.push({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fill: "#"+color,
      id: name
    });
    // Add by ID
    //[x,y+h]
    //let bottom_left=[0,100]
    //[x+w,y]
    //let top_right=[100,0]
    if(name==="" || name===null){
      alert("Invalid region name");
    }else{
      if(GetRectangles.length===0){
        RTreeAdapter.NewRegion(name,1,name,"#"+color,[0,-100,100,0]);
        SetRectangles(rects);
      }else{
        //Add for the parent id
        let parent=prompt("Type in parent region name ");
        if(parent==="" || parent===null){
          alert("Invalid Parent name");
        }else{
          //Check if the parent exists
          if(RTreeAdapter.RegionExists(parent)==true && RTreeAdapter.RegionExists(name)==false){
            if(RTreeAdapter.PointsCount(parent)<1){
              RTreeAdapter.NewRegion(name,parent,name,"#"+color,[0,-100,100,0]);
              SetRectangles(rects);
            }else{
              alert("Region cannot be added on a region which already contains points");
            }
          }else{
            alert("No Such Region with the parent id exists or region id is already taken");
          }
        }
      }
    }
  }

  return (
    <div className="App" style={{"background-color":(IsDarkTheme)?"#282c34":"white"}}>
       <div className="App-header">
        <h2 style={{"text-align":"center","color":(IsDarkTheme)?"white":"black"}} >R Tree</h2>
        <p style={{"font-size":"10px","text-align":"center","color":(IsDarkTheme)?"white":"black"}}>{Ms} MS time taken</p>
        {/*Options button*/}
        <div style={{"width":"100%","display":"flex","justify-content": "center"}}>
          {(IsCanvasView)?<div>&nbsp;<Button variant="outlined" color="secondary" onClick={()=>(AddNewRect())}>Add Region</Button>&nbsp;</div>:<div></div>}
          <Button variant="outlined" color="secondary" onClick={()=>(SetdialogClosed(!DialogClosed))}>Show Points ({FoundPoints.length})</Button>&nbsp;
          <Button variant="outlined" color="secondary" onClick={()=>(SetDarkTheme(!IsDarkTheme))}>{(IsDarkTheme)?"Day Theme":"Night Theme"}</Button>&nbsp;
        </div>
        {IsCanvasView?
        <Canvas 
            GetRectangles={GetRectangles} 
            SetRectangles={SetRectangles} 
            SetFoundPoints={SetFoundPoints}
            FoundPoints={FoundPoints}
            Getpoints={Getpoints} 
            SetPoints={SetPoints} 
            IsDarkTheme={IsDarkTheme} 
            RTreeAdapter={RTreeAdapter}
            SetMs={SetMs}
        />:<TreeView/>}
      </div>
      <Dialog 
        open={DialogClosed}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContentText >
        <div style={{ width: '100%' }}>
        {FoundPoints.map((point, i) => {
          return (
            <div>
            &nbsp;&nbsp;&nbsp;<Badge badgeContent={""} color="primary"></Badge>
            <Box component="div" display="inline" p={1} m={1} >
              {point.name+" In region "+point.parent_region_id}
            </Box><br/>
          </div>
          );
        })}
        </div>
        </DialogContentText>
        <DialogActions>
          <Button  color="primary" onClick={()=>(SetdialogClosed(!DialogClosed))}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const App = () => (
    <Main />
);

export default App;
