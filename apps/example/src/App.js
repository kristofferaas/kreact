import { h } from "kreact";
import Counter from "./Counter";
import javascriptLogo from "./javascript.svg";

const App = () => {
  return h(
    "div",
    null,
    h(
      "a",
      {
        href: "https://vitejs.dev",
        target: "_blank",
      },
      h("img", {
        src: "/vite.svg",
        class: "logo",
        alt: "Vite logo",
      })
    ),
    h(
      "a",
      {
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        target: "_blank",
      },
      h("img", {
        src: javascriptLogo,
        class: "logo vanilla",
        alt: "JavaScript logo",
      })
    ),
    h("h1", null, "Hello Vite!"),
    h(
      "div",
      {
        class: "card",
      },
      h(Counter)
    ),
    h(
      "p",
      {
        class: "read-the-docs",
      },
      "Click on the Vite logo to learn more"
    )
  );
};

export default App;
