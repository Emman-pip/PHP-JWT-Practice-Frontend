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

export function FormTemplate({ title, otherBtnLabel, link }) {
  async function handleRequest(event) {
    event.preventDefault();
    const username = document.getElementById(title + "username").value;
    const password = document.getElementById(title + "password").value;
    console.log(username, password);
    const body = new URLSearchParams();
    body.append("password", password);
    body.append("username", username);

    if (title.toLowerCase() === "Login".toLowerCase()) {
      const data = {
        mode: "cors",
        body: body,
        method: "POST",
      };

      const token = await fetchToken(link, data);
      if (!token) {
        // fix this error as well - just reload the page with error message
        throw new Error("Invalid credentials");
      }
      // redirect to somewhere
      redirectToHome(token, username);
    }
  }
  return (
    <>
      <form
        onSubmit={handleRequest}
        class="flex flex-col gap-2 p-3 border rounded-lg bg-white shadow shadow-lg hover:scale-125 focus:scale-125 duration-100 transition-all"
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
          <a class="btn-red flex items-center justify-center">
            {otherBtnLabel}
          </a>
        </div>
      </form>
    </>
  );
}

function redirectToHome(token, username) {
  //window.location.assign("http://localhost:5001"); // change this, make this into react route shit
  console.log(token);
}
export default function Main() {
  const link = "http://localhost:5001/user-log";
  const data = new URLSearchParams();
  data.append("username", "emman");
  data.append("password", "iloveyou");
  return (
    <>
      <Nav />
      <section class="bg-gray-100">
        <div class="form-container flex justify-center items-center h-[100dvh] ">
          <FormTemplate
            title={"Login"}
            otherBtnLabel={"go to sign up"}
            link={link}
            body={{ method: "POST", mode: "cors", body: data }}
          />
        </div>
      </section>
    </>
  );
}
