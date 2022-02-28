// Define user editable parameters:
function getParameterDefinitions() {
  return [
    { name: 'od1', type: 'float', initial: 31.75, caption: "Outer diameter of notched tube:" },
    { name: 't2', type: 'float', initial: 2.413, caption: "Wall thickness of notched tube:" },
 { name: 'od2', type: 'float', initial: 31.75, caption: "Outer diameter of mating tube (must be equal to or larger than notched tube):" },
 { name: 'angle', type: 'float', initial: 59.7, caption: "Angle between tubes:" },
 { name: 't1', type: 'float', initial: 2.00, caption: "Wall thickness of template:" },
 { name: 'h', type: 'float', initial: 50.0, caption: "Height of template from base to intersection point of tube center lines:" },
 { name: 'clearance', type: 'float', initial: 1.000, caption: "Radial clearance between tube and template:" },
  ];
}
function main(params) {
  // tube diameter error checking
  if(params.od2 < params.od1) throw new Error("Mating tube must be the same size or larger than notched tube");
  //define variables
  var r1 = params.od1/2 + params.clearance; //inner radius of template
  var t2 = params.t2; //wall thickness of notched tube
  var r2 = params.od2/2; //outer radius of mating tube
  var theta = params.angle - 90; //angle from perpendicular
  var t1 = params.t1; //thickness of template
  var h = params.h; //height of notched tubing
  var vertices = []; //array to hold xyz coordinates of each vertex
  var nv = 4 * 360; //used for convenience in calculation, equal to number of vertices
  var indices = []; //array to index vertices in each polyhedron
  //define cross sectional vertices at each 1 degree of resolution
  for (i = 0; i < 360; i++){
 vertices[4*i] = [(r1+t1)*cos(i), (r1+t1)*sin(i), 0],
 vertices[4*i + 1] = [(r1+t1)*cos(i), (r1+t1)*sin(i), h + (r1*cos(i)*tan(theta)) - sqrt(pow(r2,2)-pow((r1-t2)*sin(i),2))/cos(theta)],
 vertices[4*i + 2] = [(r1)*cos(i), (r1)*sin(i), h + (r1*cos(i)*tan(theta)) - sqrt(pow(r2,2)-pow((r1-t2)*sin(i),2))/cos(theta)],
 vertices[4*i + 3] = [(r1)*cos(i), (r1)*sin(i), 0];
 }
  //define vertex indices for each quadrilateral facet bounding the resulting polyhedron
  for (i = 0; i < 360; i++){
 indices[4*i] = [(4*i+0)%nv, (4*i+1)%nv, (4*i+5)%nv, (4*i+4)%nv],
 indices[4*i + 1] = [(4*i+1)%nv, (4*i+2)%nv, (4*i+6)%nv, (4*i+5)%nv],
 indices[4*i + 2] = [(4*i+2)%nv, (4*i+3)%nv, (4*i+7)%nv, (4*i+6)%nv],
 indices[4*i + 3] = [(4*i+3)%nv, (4*i+0)%nv, (4*i+4)%nv, (4*i+7)%nv];
  }
  //build polyhedron based on vertices and indices
  return polyhedron({
  points: vertices,                                  
  polygons: indices
});
}
