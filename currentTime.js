module.exports=currentTime;
const affirmations=require(__dirname+"/affirmations.js");
function currentTime(){
  const date = new Date();
  const hours = date.getHours();
  let greeting;
  let collectid;
  let affirmation;
  if (hours < 12) {
    greeting = "Good Morning";
    collectid="88033465";
    affirmation=affirmations.Morning[Math.floor(Math.random() * affirmations.Morning.length)];
  } else if (hours < 17) {
    greeting = "Good Afternoon";
    collectid="40079605";
    affirmation=affirmations.Afternoon[Math.floor(Math.random() * affirmations.Afternoon.length)];
  } else if (hours < 20) {
    greeting = "Good Evening";
    collectid="64216084";
    affirmation=affirmations.Evening[Math.floor(Math.random() * affirmations.Evening.length)];
  } else {
    greeting = "Good Night";
    collectid="47532958";
    affirmation=affirmations.Night[Math.floor(Math.random() * affirmations.Night.length)];
  }
  let time={
    greeting:greeting,
    collectid:collectid,
    affirmation:affirmation
  };
  return time;
}
