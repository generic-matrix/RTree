//POINT MUST NOT BE MOVABLE...

const Region=require("./Model/Region.js");
const Point=require("./Model/Point.js");

//Map Region ID to Region Object
let region_hash={}

//root id
let root=null;

//ramdom id , parent id,name of region,hexcode,an array of 4 elem
//O(1)
function NewRegion(id,parent_id,name,color,edges){
    if(region_hash[id]!=null){
        throw ("Id is already taken");
    }
    if(region_hash[parent_id]==null){
        throw ("The parent id "+parent_id+" Does not exists");
    }
    region_hash[id]=new Region(id,parent_id,name,color,edges);
    region_hash[parent_id].AddSubRegion(region_hash[id]);
}

// Add root region O(1)
function AddRootRegion(){
    root=new Region(1,null,"root","#ffffff",[0,0,10000,10000]);
    region_hash[1]=root;
}

//the edges is an array of 4 elem
//O(e) where e is the elements in all the A,B,C,D
function OnRectSizeChange(id,edges){
    if(region_hash[id]==null){
        throw ("Id does not exists");
    }
    region_hash[id].edges=edges;
}

//get number of elements in region_hash
//O(k) where k are the key in the object
function GetRegionCount(){
    return Object.keys(region_hash).length;
}

//Add point to the corrosponding region
function AddPoint(id,parent_region_id,name,x,y){
    if(region_hash[parent_region_id]==null){
        throw ("Id does not exists");
    }
    region_hash[parent_region_id].AddPoint(new Point(id,parent_region_id,name,x,y));
}

//the function takes target region start and end coord
function Search(target_region_coord){
    if(root!=null){
        return root.GetRegionsBasedOnTargetRegion(root,target_region_coord);
    }else{
        return [];
    }
}

function RegionHash(){
    return region_hash;
}

function IsLeaf(id){
    return region_hash[id].IsLeaf();
}

function PointsCount(id){
    return region_hash[id].points.length;
}

function RegionExists(id){
    if(region_hash[id]!=null){
        return true;
    }else{
        return false;
    }
}

module.exports={
    "NewRegion":NewRegion,
    "AddRootRegion":AddRootRegion,
    "OnRectSizeChange":OnRectSizeChange,
    "GetRegionCount":GetRegionCount,
    "AddPoint":AddPoint,
    "Search":Search,
    "RegionHash":RegionHash,
    "IsLeaf":IsLeaf,
    "PointsCount":PointsCount,
    "RegionExists":RegionExists
}