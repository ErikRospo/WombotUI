document.addEventListener("DOMContentLoaded", () => {
  let image = document.getElementById("preview");
  let accept = document.getElementById("accept-button");
  let reject = document.getElementById("reject-button");
  let skip = document.getElementById("skip-button");
  let genmore = document.getElementById("more-button");
  let status = document.getElementById("status_bar");
  let prompt = document.getElementById("prompt");
  let style_int = document.getElementById("style_int");
  let left = document.getElementById("images_left");
  let left_var = 1;
  const HOSTNAME = "localhost";
  const PORT = "8080";
  const baseADDR = `http://${HOSTNAME}:${PORT}`;
  let r = fetch(`${baseADDR}/getleft`).then((res) => {
    res.text().then((value) => {
      left.innerText = `Images Left:${value}`;
      left_var = Number(value);
    });
  });
  function refresh_img() {
    fetch(`${baseADDR}/getleft`).then((value) => {
      value
        .text()
        .then((value) => {
          return Number(value);
        })
        .then((value) => {
          left_var = value;
          if (left_var > 0) {
            image.src = `${baseADDR}/new`;

            image.addEventListener("load", () => {
              //FIXME: the server fails to connect to the host (net::ERR_CONNECTION_RESET)
              // may have something to do with multiple requests coming in at the same time?
              // Looking into it, this seems to be the case.
              fetch(`${baseADDR}/current/id`).then((val) => {
                val.text().then((value) => {
                  let l = JSON.parse(atob(value));

                  prompt.innerText = `Prompt: \"${l[0]}\"`;
                  left.innerText = `Images Left: ${left_var}`;
                  fetch(`${baseADDR}/style/` + l[1]).then((resvalue) => {
                    resvalue.text().then((strvalue) => {

                      console.log(strvalue)
                      style_int.innerText = `Style: ${strvalue} (${l[1]})`;
                    });
                  });
                });
              });
            });
          }
        });
    });
  }
  //http://127.0.0.1:5500/UI/
  r.then(() => {
    refresh_img();
  });
  accept.addEventListener("click", () => {
    fetch(`${baseADDR}/accept`).then(() => {
      refresh_img();
    });
  });
  reject.addEventListener("click", () => {
    fetch(`${baseADDR}/reject`).then(() => {
      refresh_img();
    });
  });
  skip.addEventListener("click", () => {
    refresh_img();
  });
  genmore.addEventListener("click", () => {
    fetch(`${baseADDR}/genmore`).then((val) => {
      val.text().then((value) => {
        status.innerText = value;
      });
    });
  });
});
