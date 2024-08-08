import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
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
    else if (key === "Enter") {
      setUserInd((prev) => {
        const span = document.createElement("span");
        span.textContent = " ";
        span.style.width = "100%";
        text.current?.insertBefore(span, cursor.current);
        return prev + 1;
      });
    } else if (/^[a-zA-Z,.?;:'"&!-@#$%*()^{} ]$/.test(key) && !e.ctrlKey) {
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

  const changeFont = (font: string) => {
    if (text.current) text.current.style.fontFamily = font;
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

  const getSelectionDirection = (
    selection: Selection
  ): "forward" | "backward" => {
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    const isTextNode = (node: Node): node is Text =>
      node.nodeType === Node.TEXT_NODE;

    if (startContainer === endContainer) {
      return startOffset <= endOffset ? "forward" : "backward";
    }

    const startNode = isTextNode(startContainer)
      ? startContainer.parentNode
      : startContainer;
    const endNode = isTextNode(endContainer)
      ? endContainer.parentNode
      : endContainer;

    if (startNode === endNode) {
      return startOffset <= endOffset ? "forward" : "backward";
    }

    const startPos = startNode.compareDocumentPosition(endNode);
    return startPos & Node.DOCUMENT_POSITION_FOLLOWING ? "forward" : "backward";
  };

  const handleSelect = () => {
    const selection = document.getSelection();
    if (selection) {
      const direction = getSelectionDirection(selection);

      // not able to get direction
      let lastNode: Node | null | ParentNode = selection.focusNode;
      if (!(lastNode instanceof HTMLSpanElement) && lastNode)
        lastNode = lastNode.parentNode;
      if (lastNode instanceof HTMLSpanElement && cursor.current) {
        if (direction === "forward")
          text.current?.insertBefore(cursor.current, lastNode.nextSibling);
        else
          text.current?.insertBefore(cursor.current, lastNode.previousSibling);
      }
      console.log(selection.toString());
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
    <Flex
      width="100vw"
      justify="center"
      overflow="hidden"
      direction="column"
      margin={10}
    >
      <Menu>
        <MenuButton
          px={4}
          py={2}
          width={200}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: "gray.400" }}
          _expanded={{ bg: "blue.400" }}
          _focus={{ boxShadow: "outline" }}
          as={Button}
          rightIcon={<ChevronDownIcon />}
        >
          Change Fonts
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => changeFont("Verdana")}>Verdana</MenuItem>
          <MenuItem onClick={() => changeFont("Sans-serif")}>
            Sans-serif
          </MenuItem>
          <MenuItem onClick={() => changeFont("Monospace")}>Monospace</MenuItem>
          <MenuItem onClick={() => changeFont("Cursive")}>Cursive</MenuItem>
          <MenuItem onClick={() => changeFont("Fantasy")}>Fantasy</MenuItem>
        </MenuList>
      </Menu>
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
