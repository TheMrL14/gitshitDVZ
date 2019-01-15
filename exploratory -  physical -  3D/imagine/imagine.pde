import nervoussystem.obj.*;

String notes="EGEGBBA,EGEGBBA,EGBBAEG,EGBBA,ACACEEDCA,BBBCDEGEDC,EGEGBBA,EGEGBBA,EGEGBBA,EGEGBBA,ACACEEDCA,BBBCDEGEDC,BCBCBAABCCAG,ACBBAADE,AACBAABCCAG,BCDEDC,DECC";
String[]list=split(notes,',');

boolean record = true;

void setup(){
  

size(400,400,P3D);
println(list[0]);
println(list[1]);
stroke(255,255,255);
};

void draw(){
   if (record) {
    beginRecord("nervoussystem.obj.OBJExport", "filename.obj"); 
  }  
 drawFigure();
  if (record) {
    endRecord();
    record = false;
  }
}


void drawFigure(){
translate(150,120,100);
shapeMode(CORNERS);
//rotateX(-1);
rotateY(frameCount/20);
for(int y=0;y<list.length;y++){
for(int x=0;x<list[y].length();x++){
  int heightBox= 50;
  int Yindex = 0;
  int oldHeight;
 char chr = list[y].charAt(x);
 print();
  oldHeight = heightBox;
 if(str(chr).equals("D")){
   heightBox = 10;
   fill(heightBox);
 }else if(str(chr).equals("E")){
   heightBox = 15;
   fill(204, 102, 0);
 }else if(str(chr).equals("F")){
   heightBox = 20;
   fill(204, 102, 0);
 }else if(str(chr).equals("G")){
   heightBox = 25;
   fill(204, 102, 0);
 }else if(str(chr).equals("A")){
   heightBox = 30;
   fill(204, 102, 0);
 }else if(str(chr).equals("B")){
   heightBox = 35;
   fill(204, 102, 0);
 }else if(str(chr).equals("C")){
   heightBox = 40;
   fill(204, 102, 0);
 }else {
   heightBox = 0;
    fill(0, 0, 0);
 }
  fill(map(heightBox, 10, 40, 50, 200));
 Yindex = (oldHeight -heightBox);
   pushMatrix();
  translate(10*x,Yindex/2,10*y);
  box(10,heightBox,10);
 popMatrix();
 
}
}
  };