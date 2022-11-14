document.addEventListener("DOMContentLoaded", () => {
  let image = document.getElementById("preview");
  let accept = document.getElementById("accept-button");
  let reject = document.getElementById("reject-button");
  let skip = document.getElementById("skip-button");
  let prompt = document.getElementById("prompt");
  let style_int = document.getElementById("style_int");
  let left = document.getElementById("images_left");
  let left_var = 1;
  let r = fetch("http://localhost:8080/getleft").then((res) => {
    res.body
      .getReader()
      .read()
      .then((value) => {
        left.innerText = `Images Left:${new TextDecoder().decode(value.value)}`
        left_var = Number(new TextDecoder().decode(value.value));
      });
  });
  function refresh_img() {
    if (left_var > 0) {
      image.src = "http://localhost:8080/new";

      image.addEventListener("load", () => {
        fetch("http://localhost:8080/current/id").then((val) => {
          val.body
            .getReader()
            .read()
            .then((value) => {
              let textvalue = new TextDecoder().decode(value.value);
              let l = JSON.parse(atob(textvalue));
              style_int.innerText = `Style: ${l[1]}`;
              prompt.innerText = `Prompt: \"${l[0]}\"`;
              left.innerText = `Images Left: ${left_var}`;
            });
        });
      });
    }
  }
  r.then(() => {
    refresh_img();
  });
  accept.addEventListener("click", () => {
    fetch("http://localhost:8080/accept").then(() => {
      refresh_img();
      left_var -= 1;
    });
  });
  reject.addEventListener("click", () => {
    fetch("http://localhost:8080/reject").then(() => {
      refresh_img();
      left_var -= 1;
    });
  });
  skip.addEventListener("click", () => {
    refresh_img();
  });
});
