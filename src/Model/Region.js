class Region {

    constructor(id,parent_id,name,color,edges) {
      this.id=id;
      this.parent_id=parent_id;
      this.name=name;
      this.points=[];
      this.color=color;
      //[0,1,2,3]
      this.edges=edges;
      this.regions=[];
    }

    // Add Sub Region ... based on the direction
    AddSubRegion(region){
      this.regions.push(region);
    }


    rectanglesOverlap(target_bottom_left,target_top_right,bottom_left,top_right) {
      let x1=target_bottom_left[0];
      let y1=target_bottom_left[1];
      let x2=target_top_right[0];
      let y2=target_top_right[1];

      let x3=bottom_left[0];
      let y3=bottom_left[1];
      let x4=top_right[0];
      let y4=top_right[1];

      return (x1 < x4) && (x3 < x2) && (y1 < y4) && (y3 < y2);
    }

    IsPointInsideRegion(target_bottom_left,target_top_right,x,y){
      let x1=target_bottom_left[0];
      let x2=target_top_right[0];
      let y1=target_bottom_left[1];
      let y2=target_top_right[1];
      if(x > x1 && x < x2 &&  y > y1 && y < y2){
        return true;
      }else{
        return false;
      }
    }

    //O(r.log(n)) where r is the region searched for each child region
    GetRegionRecursive(target_bottom_left,target_top_right,c_region,result){
      if(c_region.IsLeaf()){
        for(var i=0;i<c_region.points.length;i++){
          if(this.IsPointInsideRegion(target_bottom_left,target_top_right,c_region.points[i].x,c_region.points[i].y)){
            result.push(c_region.points[i]);
          }
        }
      }else{
        for(var i=0;i<c_region.regions.length;i++){
          let edges=c_region.regions[i].edges;
          let bottom_left=[edges[0],edges[1]];
          let top_right=[edges[2],edges[3]];
          //check if target and current region overlap and target contains fully current region
          //console.log("Is region "+bottom_left+" "+top_right+" Inside target "+target_bottom_left+" "+target_top_right);
          if(this.rectanglesOverlap(target_bottom_left,target_top_right,bottom_left,top_right)){
            this.GetRegionRecursive(target_bottom_left,target_top_right,c_region.regions[i],result)
          }
        }
      }
    }
    // returns array of region based on target region coordinates
    GetRegionsBasedOnTargetRegion(root_region,target_region_coord){
      var target_bottom_left=[target_region_coord[0],target_region_coord[1]];
      var target_top_right=[target_region_coord[2],target_region_coord[3]];
      var result=[];
      this.GetRegionRecursive(target_bottom_left,target_top_right,root_region,result)
      return result;
    }

    //returns boolean value based on points count
    IsLeaf(){
      if(this.regions.length==0){
        return true;
      }else{
        return false;
      }
    }

    //Add point to the region
    AddPoint(point){
      this.points.push(point);
    }
  }

export default Region