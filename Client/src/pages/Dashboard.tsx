import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { color } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Dashboard = () => {
  console.log("re-rendered");
  const { colorMode } = useColorMode();
  const text = useRef<HTMLParagraphElement | null>(null);
  const cursor = useRef<HTMLSpanElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  // const [userInput, setUserInput] = useState<string>("");
  const [userInd, setUserInd] = useState<number>(0);

  const applyBold = () => {
    const selections = document.getSelection();
    if (selections) {
      const range = selections.getRangeAt(0);
      let startContainer: Node | ParentNode | null = range.startContainer;
      let endContainer: Node | ParentNode | null = range.endContainer;
      if (!(startContainer instanceof HTMLSpanElement))
        startContainer = startContainer.parentNode;

      if (!(endContainer instanceof HTMLSpanElement))
        endContainer = endContainer.parentNode;

      if (
        startContainer instanceof HTMLSpanElement &&
        endContainer instanceof HTMLSpanElement
      ) {
        let currentNode: HTMLSpanElement = startContainer;
        while (currentNode && currentNode !== endContainer) {
          if (currentNode.style.fontWeight.toString() === "bolder")
            currentNode.style.fontWeight = "normal";
          else currentNode.style.fontWeight = "bolder";
          currentNode = currentNode.nextSibling;
        }
      }

      selections.removeAllRanges();
    }
  };

  const applyItalic = () => {
    const selections = document.getSelection();
    if (selections) {
      const range = selections.getRangeAt(0);
      let startContainer: Node | ParentNode | null = range.startContainer;
      let endContainer: Node | ParentNode | null = range.endContainer;
      if (!(startContainer instanceof HTMLSpanElement))
        startContainer = startContainer.parentNode;
      if (!(endContainer instanceof HTMLSpanElement))
        endContainer = endContainer.parentNode;

      if (
        startContainer instanceof HTMLSpanElement &&
        endContainer instanceof HTMLSpanElement
      ) {
        let currentNode: HTMLSpanElement = startContainer;
        while (currentNode && currentNode !== endContainer) {
          if (currentNode.style.fontStyle.toString() === "italic")
            currentNode.style.fontStyle = "normal";
          else currentNode.style.fontStyle = "italic";
          currentNode = currentNode.nextSibling;
        }
      }
      selections.removeAllRanges();
    }
  };

  const applyHighlight = () => {
    const selections = document.getSelection();
    const BGColor = "gray";
    if (selections) {
      const range = selections.getRangeAt(0);
      let startContainer: Node | ParentNode | null = range.startContainer;
      let endContainer: Node | ParentNode | null = range.endContainer;
      if (!(startContainer instanceof HTMLSpanElement))
        startContainer = startContainer.parentNode;
      if (!(endContainer instanceof HTMLSpanElement))
        endContainer = endContainer.parentNode;
      if (
        startContainer instanceof HTMLSpanElement &&
        endContainer instanceof HTMLSpanElement
      ) {
        let currentNode: HTMLSpanElement = startContainer;
        while (currentNode && currentNode !== endContainer) {
          console.log(currentNode.style.backgroundColor);

          if (currentNode.style.backgroundColor.toString() === "gray")
            currentNode.style.backgroundColor = "transparent";
          else currentNode.style.backgroundColor = "gray";
          currentNode = currentNode.nextSibling;
        }
      }
      selections.removeAllRanges();
    }
  };

  const handleBackSpace = () => {
    const selections = document.getSelection();
    if (selections && !selections.isCollapsed) {
      console.log(selections);
      selections.getRangeAt(0).deleteContents();
    } else if (cursor.current?.previousSibling)
      text.current?.removeChild(cursor.current.previousSibling);
    setUserInd((prev) => prev - 1);
  };

  const handleDelete = () => {
    console.log("delete Pressed");
    if (cursor.current?.nextSibling) {
      text.current?.removeChild(cursor.current.nextSibling);
      setUserInd((prev) => prev - 1);
    }
  };

  const handleControl = (e: KeyboardEvent) => {
    if (e.key === "b") {
      applyBold();
    } else if (e.key === "i") {
      applyItalic();
    } else if (e.key === "h") {
      applyHighlight();
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    // console.log(e);

    if (key === "Backspace") handleBackSpace();
    else if (key === "Delete") handleDelete();
    else if (e.ctrlKey) handleControl(e);
    else if (/^[a-zA-Z,.?;:'"&!-@#$%*()^{} ]$/.test(key) && !e.ctrlKey) {
      setUserInd((prev) => {
        //  creating letter span
        const span = document.createElement("span");
        span.textContent = key;
        span.setAttribute("id", prev.toString());
        // console.log(span);
        if (key === " ") span.style.width = "10px";
        text.current?.insertBefore(span, cursor.current);
        return prev + 1;
      });
    }
  };

  const handleClick = (e: MouseEvent) => {
    const target = e.target;
    if (target === container.current && cursor.current) {
      text.current?.appendChild(cursor.current);
    } else if (target instanceof HTMLSpanElement && cursor.current) {
      text.current?.insertBefore(cursor.current, target.nextSibling);
    } else {
      console.log(e);
    }
  };

  const handleSelect = () => {
    const selection = document.getSelection();
    if (selection) {
      let lastNode: Node | null | ParentNode = selection.focusNode;
      if (!(lastNode instanceof HTMLSpanElement) && lastNode)
        lastNode = lastNode.parentNode;
      if (lastNode instanceof HTMLSpanElement && cursor.current)
        text.current?.insertBefore(cursor.current, lastNode.nextSibling);

      console.log(selection);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleClick);
    document.addEventListener("mouseup", handleSelect);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mouseup", handleSelect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex width="100vw" justify="center" overflow="hidden">
      <Box
        alignSelf="center"
        margin="4em"
        width="100%"
        textAlign="center"
        height="60vh"
        overflow="hidden scroll"
        ref={container}
      >
        <Text
          fontFamily="RobotoMono"
          ref={text}
          fontSize="1.7em"
          lineHeight="2em"
          display="flex"
          flexWrap="wrap"
          justifyContent="flex-start"
          color={colorMode === "light" ? "gray.800" : "gray.200"}
        >
          <span
            ref={cursor}
            style={{
              margin: "0px",
              color: colorMode === "light" ? "Blue" : "Yellow",
              padding: "0px",
              width: "3px",
              transform: "translateX(-6px)",
            }}
          >
            |
          </span>
        </Text>
      </Box>
    </Flex>
  );
};

export default Dashboard;
// "#202020"
// "#b3b3b3"
// colorMode === "light" ? "#202020":"#b3b3b3"
