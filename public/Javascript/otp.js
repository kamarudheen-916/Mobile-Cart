// document.addEventListener('DOMContentLoaded', function() {
//     function startTimer(duration, display) {
//       let timer = duration;
//       let minutes, seconds;
  
//       const countdown = setInterval(function () {
//         minutes = parseInt(timer / 60, 10);
//         seconds = parseInt(timer % 60, 10);
  
//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;
  
//         // Update the text content directly on the 'display' element
//         display.textContent = minutes + ":" + seconds;
  
//         if (--timer < 0) {
//           display.textContent = "";
//           const resendOTP = document.getElementById("resendOTP");
//           if (resendOTP) {
//             resendOTP.style.display = "block"; // Show the resend link
//           }
//           clearInterval(countdown);
//         }
//       }, 1000);
//     }
  
//     window.onload = function () {
//       const oneMinute = 60;
//       const display = document.getElementById("timer");
//       startTimer(oneMinute, display);
//     };
//   });
  