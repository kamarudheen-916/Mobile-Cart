function startTimer(duration, display) {
    let timer = duration;
    let minutes, seconds;

    const countdown = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.querySelector("#timer").textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        display.querySelector("#timer").textContent = "";
        display.querySelector("#resendOTP").style.display = "block"; // Show the resend link
        clearInterval(countdown);
      }
    }, 1000);
  }

  window.onload = function () {
    const oneMinute = 60;
    const display = document.querySelector(".timer.Div");
    startTimer(oneMinute, display);
  };