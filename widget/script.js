async function updateAmount(){
 try{
  const r=await fetch("/api/balance",{cache:"no-store"});
  const j=await r.json();
  document.getElementById("amount").innerText=j.value||"$0.00";
 }catch{
  document.getElementById("amount").innerText="$0.00";
 }
}
updateAmount();
setInterval(updateAmount,30000);
