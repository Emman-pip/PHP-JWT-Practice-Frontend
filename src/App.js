import { useState } from "react";

export function Nav() {
  return (
    <>
      <nav class="sticky top-0 flex justify-between items-center text-lg h-16 p-3 bg-blue-400 ">
        <a class="font-bold text-white" href="">
          Home
        </a>
        <div class="flex gap-3">
          <a href="" class="text-white">
            link-1
          </a>
          <a href="" class="text-white">
            link-2
          </a>
          <a href="" class="text-white">
            link-3
          </a>
        </div>
      </nav>
    </>
  );
}

function fetchToken(link, body) {
  return fetch(link, body)
    .then((response) => {
      return response.headers.get("bearer");
    })
    .then((response) => {
      // response is the token..
      return response;
    })
    .catch((err) => {
      throw new Error("invalid credentials");
    });
}

function signUp(link, body) {
  return fetch(link, body).catch((err) => err);
}

export function FormTemplate({
  title,
  otherBtnLabel,
  link,
  errorMessage,
  otherBtnAction,
}) {
  async function handleRequest(event) {
    event.preventDefault();
    const username = document.getElementById(title + "username").value;
    const password = document.getElementById(title + "password").value;
    console.log(username, password);
    const body = new URLSearchParams();
    body.append("password", password);
    body.append("username", username);
    const data = {
      mode: "cors",
      body: body,
      method: "POST",
    };

    if (title.toLowerCase() === "Login".toLowerCase()) {
      const token = await fetchToken(link, data);
      if (!token) {
        // fix this error as well - just reload the page with error message
        //throw new Error("Invalid credentials");
        toggleHide();
      }
      // redirect to somewhere
      redirectToHome(token, username);
    } else {
      // action when sign up
      const signupRes = await signUp(link, data);
      !signupRes.ok ? toggleHide() : toggleHiddenSection();
    }
  }
  function toggleHide() {
    document.getElementById("warning" + title).classList.toggle("hidden");
  }
  return (
    <>
      <div
        id={"warning" + title}
        onClick={() => toggleHide()}
        class="warning z-50 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center hidden"
      >
        <div class="flex flex-col gap-2 p-3 border rounded-lg bg-red-200 hover:bg-red-400 shadow shadow-lg hover:scale-125 focus:scale-125 duration-100 transition-all w-full lg:w-fit">
          <h1>{errorMessage}</h1>
        </div>
      </div>
      <form
        onSubmit={handleRequest}
        class="flex flex-col gap-2 p-3 border rounded-lg bg-white shadow shadow-lg hover:scale-125 focus:scale-125 duration-100 transition-all w-full lg:w-fit"
      >
        <h1 class="font-bold text-3xl text-center">{title}</h1>
        <input
          placeholder="username"
          class="input-field"
          type="text"
          id={title + "username"}
          name="username"
        />
        <input
          placeholder="password"
          class="input-field"
          type="password"
          id={title + "password"}
          name="password"
        />
        <div class="buttons">
          <input
            type="submit"
            class="btn-blue w-full"
            id={title + "Btn"}
            value={title}
          />
          <a
            class="btn-red flex items-center justify-center"
            onClick={() => otherBtnAction()}
          >
            {otherBtnLabel}
          </a>
        </div>
      </form>
    </>
  );
}

function toggleHiddenSection() {
  const arr = ["loginSection", "signUpSection"];
  arr.forEach((e) => {
    document.getElementById(e).classList.toggle("hidden");
  });
}
function redirectToHome(token, username) {
  //window.location.assign("http://localhost:5001"); // change this, make this into react route shit
  console.log(token);
}
export default function Main() {
  const link = "http://localhost:5001/user-log";
  const link2 = "http://localhost:5001/user-new";
  const data = new URLSearchParams();
  data.append("username", "emman");
  data.append("password", "iloveyou");
  return (
    <>
      <Nav />
      <section class="bg-gray-100">
        <div class="form-container flex justify-center items-center h-[100dvh] ">
          <div id="loginSection">
            <FormTemplate
              title={"Login"}
              otherBtnLabel={"go to sign up"}
              link={link}
              body={{ method: "POST", mode: "cors", body: data }}
              errorMessage={"Invalid credentials"}
              otherBtnAction={() => toggleHiddenSection()}
            />
          </div>
          <div id="signUpSection" class="hidden">
            <FormTemplate
              title={"SignUp"}
              otherBtnLabel={"go to login"}
              link={link2}
              body={{ method: "POST", mode: "cors", body: data }}
              errorMessage={"Please choose another username."}
              otherBtnAction={() => toggleHiddenSection()}
            />
          </div>
        </div>
      </section>
    </>
  );
}
