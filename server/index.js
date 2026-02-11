import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const timerImage = "/assets/timerimg-BEji_ZtR.png";
function ValentinesApp() {
  const [pos, setPos] = useState({ x: 700, y: 500 });
  const targetPos = useRef({ x: 700, y: 500 });
  const [firstQuestion, setFirstQuestion] = useState(true);
  const [secondQuestion, setSecondQuestion] = useState(false);
  const [thirdQuestion, setThirdQuestion] = useState(false);
  const noBtnRef = useRef(null);
  const onFirstQuestionClick = () => {
    setFirstQuestion(false);
    setSecondQuestion(true);
  };
  const onSecondQuestionClick = () => {
    setSecondQuestion(false);
    setThirdQuestion(true);
  };
  const [noBtnActive, setNoBtnActive] = useState(false);
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (noBtnActive) {
        setPos((prev) => {
          const lerp = 0.12;
          return {
            x: prev.x + (targetPos.current.x - prev.x) * lerp,
            y: prev.y + (targetPos.current.y - prev.y) * lerp
          };
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [noBtnActive]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!noBtnRef.current) return;
      const rect = noBtnRef.current.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;
      const dx = e.clientX - btnX;
      const dy = e.clientY - btnY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) {
        setNoBtnActive(true);
        const angle = Math.atan2(dy, dx);
        const newX = btnX - Math.cos(angle) * 200;
        const newY = btnY - Math.sin(angle) * 200;
        const clampedX = Math.max(0, Math.min(window.innerWidth - rect.width, newX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - rect.height, newY));
        targetPos.current = { x: clampedX, y: clampedY };
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const handleNoHover = () => {
    if (!noBtnRef.current) return;
    setNoBtnActive(true);
    const rect = noBtnRef.current.getBoundingClientRect();
    const randomX = Math.random() * (window.innerWidth - rect.width);
    const randomY = Math.random() * (window.innerHeight - rect.height);
    setPos({ x: randomX, y: randomY });
  };
  const [showFirstQuestionPopup, setShowFirstQuestionPopup] = useState(false);
  const handleShowFirstQuestionPopup = () => setShowFirstQuestionPopup(true);
  const hanndleHideFirstQuestionPopup = () => setShowFirstQuestionPopup(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const startTimer = () => {
    setTimeLeft(3);
    setShowTimer(true);
  };
  const [finalAnswer, setFinalAnswer] = useState(false);
  const onLastButtonClick = () => {
    setThirdQuestion(false);
    setFinalAnswer(true);
  };
  const [noBtnReady, setNoBtnReady] = useState(false);
  useEffect(() => {
    if (thirdQuestion && noBtnRef.current && !noBtnReady) {
      const rect = noBtnRef.current.getBoundingClientRect();
      setPos({ x: rect.left, y: rect.top });
      setNoBtnReady(true);
    }
  }, [thirdQuestion, noBtnReady]);
  return /* @__PURE__ */ jsxs("div", { style: { height: "100vh", display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsx(HeartsBanner, {}),
    /* @__PURE__ */ jsxs("div", { className: `mainContainer ${finalAnswer ? "finalAnswer" : ""}`, style: styles.container, children: [
      firstQuestion && /* @__PURE__ */ jsxs("div", { className: "questionContainer", children: [
        /* @__PURE__ */ jsx("h1", { children: "I have a really important question to ask you..." }),
        /* @__PURE__ */ jsxs("div", { style: { width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsx(Button, { style: styles.yesBtn, onClick: onFirstQuestionClick, children: "Okay... 😍" }),
          /* @__PURE__ */ jsx(Button, { style: styles.yesBtn, onClick: handleShowFirstQuestionPopup, children: "I don't care AHA 😈" })
        ] }),
        /* @__PURE__ */ jsxs(Modal, { show: showFirstQuestionPopup, onHide: hanndleHideFirstQuestionPopup, children: [
          /* @__PURE__ */ jsx(Modal.Header, { children: "Wrong Answer. Yes you do. Go try again." }),
          /* @__PURE__ */ jsx(Modal.Body, { children: /* @__PURE__ */ jsx("img", { src: timerImage, alt: "Timer", style: { width: "100%" } }) }),
          /* @__PURE__ */ jsx(Modal.Footer, { children: /* @__PURE__ */ jsx(Button, { onClick: hanndleHideFirstQuestionPopup, children: "Close" }) })
        ] })
      ] }),
      secondQuestion && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "questionContainer", children: [
        /* @__PURE__ */ jsx("h1", { children: "Are you ready for me to ask you the really important question?" }),
        /* @__PURE__ */ jsxs("div", { style: { width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsx(Button, { style: styles.yesBtn, onClick: onSecondQuestionClick, children: "Yes, I'm ready" }),
          /* @__PURE__ */ jsx(Button, { style: styles.yesBtn, onClick: startTimer, children: "No, I need a few seconds..." })
        ] }),
        /* @__PURE__ */ jsx(
          SecondQuestionTimer,
          {
            showTimer,
            setShowTimer,
            timeLeft,
            setTimeLeft
          }
        )
      ] }) }),
      thirdQuestion && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "questionContainer", children: [
        /* @__PURE__ */ jsx("h1", { style: { marginTop: "20px" }, children: "Will you be my valentine?" }),
        /* @__PURE__ */ jsxs("div", { style: { width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsx(Button, { onClick: onLastButtonClick, style: styles.yesBtn, children: "Yes" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              ref: noBtnRef,
              onMouseEnter: handleNoHover,
              style: noBtnReady ? { ...styles.noBtn, position: "absolute", left: pos.x, top: pos.y } : { ...styles.noBtn, position: "static" },
              children: "No"
            }
          )
        ] })
      ] }) }),
      finalAnswer && /* @__PURE__ */ jsx("div", { className: "questionContainer", children: /* @__PURE__ */ jsxs("div", { className: "finalAnswerContainer", children: [
        /* @__PURE__ */ jsx("h1", { className: "finalAnswerText", children: "YAY!!!🩷🩷🩷" }),
        /* @__PURE__ */ jsx("img", { src: "../../HappySoExcitedGIF.gif" })
      ] }) })
    ] })
  ] });
}
function SecondQuestionTimer({ showTimer, setShowTimer, setTimeLeft, timeLeft }) {
  useEffect(() => {
    if (!showTimer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [showTimer]);
  return /* @__PURE__ */ jsx(Fragment, { children: showTimer && /* @__PURE__ */ jsx(Modal, { centered: true, show: showTimer, onHide: () => setShowTimer(false), children: /* @__PURE__ */ jsxs(Modal.Body, { children: [
    timeLeft > 0 ? /* @__PURE__ */ jsxs("div", { children: [
      timeLeft,
      " seconds remaining…"
    ] }) : /* @__PURE__ */ jsx("div", { children: "Time’s up! Try again!" }),
    timeLeft === 0 && /* @__PURE__ */ jsx("img", { style: { width: "100%" }, src: "../../BreakingDespicableMeGif.gif" })
  ] }) }) });
}
const styles = {
  yesBtn: {
    backgroundColor: "#E887BB",
    borderColor: "#E81A66",
    padding: "5px 20px",
    fontSize: "18px",
    marginRight: "20px"
  },
  noBtn: {
    backgroundColor: "#E887BB",
    borderColor: "#E81A66",
    padding: "5px 20px",
    fontSize: "18px",
    cursor: "pointer"
  }
};
const HeartsBanner = () => {
  const hearts = Array.from({ length: 12 });
  return /* @__PURE__ */ jsxs("div", { className: "banner", children: [
    /* @__PURE__ */ jsx("div", { className: "banner-text", children: "Bappy Balentines Bay Baby" }),
    /* @__PURE__ */ jsx("div", { className: "hearts-layer", children: hearts.map((_, i) => /* @__PURE__ */ jsx("span", { className: `heart heart-${i + 1}`, children: " ♥ " }, i)) })
  ] });
};
function meta({}) {
  return [{
    title: "Ultimate Valentines Test"
  }, {
    name: "description",
    content: "This is the ultimate test!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(ValentinesApp, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-ctGs4AXE.js", "imports": ["/assets/chunk-EPOLDU6W-BWIQxkdw.js", "/assets/index-gZGKjYUA.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-CiLZ18wM.js", "imports": ["/assets/chunk-EPOLDU6W-BWIQxkdw.js", "/assets/index-gZGKjYUA.js"], "css": ["/assets/root-YYlbYJsj.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CSE39qbR.js", "imports": ["/assets/chunk-EPOLDU6W-BWIQxkdw.js", "/assets/index-gZGKjYUA.js"], "css": ["/assets/home-kjMyytxK.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-7a482cd3.js", "version": "7a482cd3", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
