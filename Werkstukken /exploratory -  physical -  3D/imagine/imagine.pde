//Make a 3D object of data from musical notes
//Errors shown when running are not important 
import nervoussystem.obj.*;

String notes="EGEGBBA,EGEGBBA,EGBBAEG,EGBBA,ACACEEDCA,BBBCDEGEDC,EGEGBBA,EGEGBBA,EGEGBBA,EGEGBBA,ACACEEDCA,BBBCDEGEDC,BCBCBAABCCAG,ACBBAADE,AACBAABCCAG,BCDEDC,DECC";
// Notes from Imagine- John Lennon

String[]list=split(notes,',');

boolean record = true;

void setup(){
  size(400,400,P3D);
stroke(255,255,255);
};

void draw(){
   if (record) {//Start the recording of the object Maker
    beginRecord("nervoussystem.obj.OBJExport", "imagine3DObject.obj"); 
  }  
 drawFigure();//Draw the Data as a 3D object
  if (record) {
    endRecord();//End the recording and save as a .obj file
    record = false;
  }
}


void drawFigure(){
translate(150,120,100); // Make the drawing fit 
shapeMode(CORNERS);
//rotateX(-1);
rotateY(frameCount/20);
for(int y=0;y<list.length;y++){// seperate the notes in to lines of the song
for(int x=0;x<list[y].length();x++){ // seperate the lines in to individual notes
  int heightBox= 50; //default height of the box
  int Yindex = 0;
  int oldHeight;
 char chr = list[y].charAt(x); //One note
 print();
  oldHeight = heightBox;
  
  // CHange height of the box according to the note
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
  fill(map(heightBox, 10, 40, 50, 200)); //Change color (not important because code is only used for real life Object)
 Yindex = (oldHeight -heightBox);
   pushMatrix();
  translate(10*x,Yindex/2,10*y);//change center of the box to the correct point 
  box(10,heightBox,10);
 popMatrix();
 
}
}
  };