import React from "react";
import { connect } from "react-redux";
import { addScores } from "../../redux/API/API.actions";
import {
  calcKeyYPosition,
  computerKeyboard,
  phoneKeyboard,
  selectRandomFromArray,
} from "./util";

const Spelling = ({ addScore }) => {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const createjs = window.createjs;
  const manifest = [
    {
      id: "rabbitmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/rabbitmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "bluemp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/bluemp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "mongoosemp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/mongoosemp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "redmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/redmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "redIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/redIMG.jpg",
    },
    {
      id: "blueIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/blueIMG.jpg",
    },
    {
      id: "audioIcon",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/audioIcon.png",
    },
    {
      id: "home",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/n1612275.png",
    },
    {
      id: "speech",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/rijKkeX7T.png",
    },
    {
      id: "yellowIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/yellowIMG.png",
    },
    {
      id: "greenIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/greenIMG.png",
    },
    {
      id: "brownIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/brownIMG.png",
    },
    {
      id: "greyIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/greyIMG.png",
    },
    {
      id: "purpleIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/purpleIMG.png",
    },

    {
      id: "pinkIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/pinkIMG.png",
    },
    {
      id: "orangeIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/orangeIMG.png",
    },
    {
      id: "blackIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/blackIMG.png",
    },
    {
      id: "whiteIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/whiteIMG.bmp",
    },
    {
      id: "yellowmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/yellowmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "greenmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/greenmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "brownmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/brownmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "greymp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/greymp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "purplemp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/purplemp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "pinkmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/pinkmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "orangemp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/orangemp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "blackmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/blackmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "whitemp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/whitemp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "batIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/batIMG.png",
    },
    {
      id: "bearIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/bearIMG.png",
    },
    {
      id: "beaverIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/beaverIMG.png",
    },
    {
      id: "birdIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/birdIMG.png",
    },
    {
      id: "camelIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/camelIMG.png",
    },
    {
      id: "catIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/catIMG.png",
    },
    {
      id: "chickenIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/chickenIMG.png",
    },
    {
      id: "cowIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/cowIMG.png",
    },
    {
      id: "crabIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/crabIMG.png",
    },
    {
      id: "dogIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/dogIMG.png",
    },
    {
      id: "elephantIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/elephantIMG.png",
    },
    {
      id: "monkeyIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/monkeyIMG.jpg",
    },
    {
      id: "pigIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/pigIMG.png",
    },
    {
      id: "fishIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/fishIMG.png",
    },
    {
      id: "lionIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/lionIMG.png",
    },
    {
      id: "sheepIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/sheepIMG.png",
    },
    {
      id: "whaleIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/whaleIMG.png",
    },
    {
      id: "foxIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/spelling/images/foxIMG.png",
    },
    {
      id: "batmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Batmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "bearmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Bearmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "beavermp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Beavermp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "birdmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Birdmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "camelmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Camelmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "catmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Catmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "chickenmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Chickenmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "cowmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Cowmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "crabmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Crabmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "dogmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Dogmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "elephantmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Elephantmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "monkeymp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Monkeymp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "pigmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Pigmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "fishmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Fishmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "lionmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Lionmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "sheepmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Sheepmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "whalemp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Whalemp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "foxmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/spelling/sounds/Foxmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    }
  ];
  let phone, stage, loader;
  let percentLoaded = 0;
  let gameState = "LOADING";
  let categories = ["Animals", "Colours"];
  let words = {
    Animals: [
      "bat",
      "bear",
      "beaver",
      "bird",
      "camel",
      "cat",
      "chicken",
      "cow",
      "crab",
      "dog",
      "elephant",
      "monkey",
      "pig",
      "fish",
      "lion",
      "sheep",
      "whale",
      "fox",
    ],
    Colours: [
      "blue",
      "red",
      "yellow",
      "green",
      "brown",
      "grey",
      "purple",
      "pink",
      "orange",
      "black",
      "white",
    ],
  };
  let incorrectGuesses = 0;
  let correctGuesses = 0;
  let currentLevel = 9;

  let selectedCategory;
  const init = () => {
    stage = new createjs.Stage(canvasRef.current);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage, false, true);
    createjs.Ticker.framerate = 30;
    createjs.Ticker.addEventListener("tick", stage);

    createjs.Sound.volume = 0.5;
    loader = new createjs.LoadQueue(false, null, true);
    loader.loadManifest(manifest);
    loader.installPlugin(createjs.Sound);
    loader.addEventListener("error", function (e) {
      console.log(e);
    });
    loader.on("progress", (e) => {
      let loadingProgress = Math.round(loader.progress * 100);
      percentLoaded = loadingProgress;
      runLoadingScreen();
    });
    loader.on("complete", (e) => {
      gameState = "LOADED";
      runGameLoop();
    });
    window.addEventListener("resize", handleResize);
    resizeCanvas();
  };

  // screen functions
  const runLoadingScreen = () => {
    let loadingScreen = new LoadingScreen(percentLoaded);
    loadingScreen.runLoadingScreen();
  };
  const runCategoriesScreen = () => {
    let categoriesScreen = new CategoriesScreen();
    categoriesScreen.runCategoriesScreen();
  };
  const runLevelScreen = () => {
    let levelScreen = new LevelScreen();
    levelScreen.runLevelScreen();
  };

  const runEndScreen = () => {
    let endGameScreen = new EndGameScreen();
    endGameScreen.runEndGame();
  };

  // screen classes
  class Screen {
    createBackground() {
      let background = new createjs.Shape();
      background.name = "background";
      background.graphics
        .beginLinearGradientFill(
          ["#36d1dc ", "#5b86e5"],
          [0, 0.5, 1],
          0,
          200,
          0,
          600
        )
        .drawRect(0, 0, stage.canvas.width, stage.canvas.height);
      stage.addChild(background);
    }
  }

  class LoadingScreen extends Screen {
    createLoadingStatusText() {
      let progressContainer = new createjs.Container();
      progressContainer.x = stage.canvas.width / 2 - (25 * 10.5) / 2 - 15;
      progressContainer.y = stage.canvas.height / 2 - 30 / 2;
      let progressBox = new createjs.Shape();
      progressBox.graphics.beginFill("");
      progressBox.graphics.setStrokeStyle(5).beginStroke("black");
      progressBox.graphics.drawRect(20, 0, 25 * 10.5, 30);

      progressContainer.addChild(progressBox);
      let progressStage = Math.floor(percentLoaded / 10);
      for (let i = 1; i <= progressStage; i++) {
        let block = new createjs.Shape();
        block.graphics.beginFill("black").drawRect(i * 25, 5, 20, 20);
        progressContainer.addChild(block);
      }

      let text = new createjs.Text(
        `${percentLoaded}%`,
        "50px Open Sans",
        "black"
      );
      text.x = stage.canvas.width / 2 - text.getMeasuredWidth() / 2;
      text.y = stage.canvas.height * 0.55;

      const messageText = new createjs.Text();
      messageText.text = "Loading / 加载中";
      messageText.font = "25px Open Sans";
      messageText.x =
        stage.canvas.width / 2 - messageText.getMeasuredWidth() / 2;
      messageText.y = stage.canvas.height * 0.4;
      stage.addChild(text, messageText, progressContainer);
    }
    runLoadingScreen() {
      this.createBackground();
      this.createLoadingStatusText();
    }
  }
  class CategoriesScreen extends Screen {
    constructor() {
      super();
      this.categories = categories;
    }
    showCategories() {
      let categoryContainers = [];
      let categoryCoordinates = [
        {
          x: phone ? stage.canvas.width * 0.1 : stage.canvas.width * 0.05,
          y: stage.canvas.height * 0.4,
        },
        {
          x: phone ? stage.canvas.width * 0.55 : stage.canvas.width * 0.375,
          y: stage.canvas.height * 0.4,
        },
        {
          x: phone ? stage.canvas.width * 0.325 : stage.canvas.width * 0.7,
          y: phone ? stage.canvas.height * 0.525 : stage.canvas.height * 0.4,
        },
      ];
      for (let i = 0; i < this.categories.length; i++) {
        let categoryContainer = new createjs.Container();
        let categoryShape = new createjs.Shape();
        let categoryText = new createjs.Text();

        // Styling the text
        categoryText.text = categories[i];
        categoryText.font = "27px Open Sans";
        categoryText.x = 200 / 2 - categoryText.getMeasuredWidth() / 2;
        categoryText.y = 50 / 2 - categoryText.getMeasuredHeight() / 2;

        // Styling the shape
        categoryShape.color =
          categoryShape.graphics.beginFill("lightblue").command;
        categoryShape.graphics.setStrokeStyle(3).beginStroke("black");
        categoryShape.graphics.drawRect(0, 0, 200, 50);

        // Positioning and naming the container
        categoryContainer.x = categoryCoordinates[i].x;
        categoryContainer.y = categoryCoordinates[i].y;
        categoryContainer.name = categories[i];
        categoryContainer.alpha = 0;
        createjs.Tween.get(categoryContainer).to({ alpha: 1 }, 300);

        // Mouseover event listeners
        categoryContainer.on("mouseover", (e) => {
          categoryShape.color.style = "red";
        });

        categoryContainer.on("mouseout", (e) => {
          categoryShape.color.style = "lightblue";
        });

        categoryContainer.on("click", (e) => {
          gameState = "RUN_LEVEL";
          selectedCategory = categoryContainer.name;
          fadeOutChildren(300);
          setTimeout(() => {
            runGameLoop();
          }, 300);
        });

        categoryContainer.addChild(categoryShape, categoryText);
        stage.addChild(categoryContainer);
      }
    }
    showCategoriesText() {
      const text = new createjs.Text();
      text.text = "Choose a category";
      text.font = "30px Open Sans";
      text.x = stage.canvas.width / 2 - text.getMeasuredWidth() / 2;
      text.y = stage.canvas.height * 0.25;

      stage.addChild(text);
    }
    runCategoriesScreen() {
      this.createBackground();
      this.showCategoriesText();
      this.showCategories();
    }
  }

  class LevelScreen extends Screen {
    constructor() {
      super();
      this.correctWord = selectRandomFromArray(words[selectedCategory]);
      this.letterHolders = [];
      this.selectedIndex = 0;
      this.keyboard = phone ? phoneKeyboard : computerKeyboard;
    }
    displayEmptyLetters() {
      for (let i = 0; i < this.correctWord.length; i++) {
        const letterContainer = new createjs.Container();
        letterContainer.name = this.correctWord[i];
        letterContainer.y = stage.canvas.height / 2;
        const letterShape = new createjs.Shape();
        letterShape.stroke = letterShape.graphics
          .setStrokeStyle(2)
          .beginStroke("black").command;
        letterShape.graphics.beginStroke("red");
        letterShape.graphics.moveTo(0, 50);
        letterShape.graphics.lineTo(30, 50);
        letterContainer.addChild(letterShape);
        this.letterHolders.push(letterContainer);
      }
      let y_co = stage.canvas.width / 2 - (this.letterHolders.length * 50) / 2;
      this.letterHolders.forEach((letter) => {
        letter.x = y_co;
        stage.addChild(letter);
        y_co += 50;
      });
    }
    createHomeButton() {
      let container = new createjs.Container();
      container.x = 5;
      container.y = 35;
      let image = new createjs.Bitmap(loader.getResult("home"));
      image.scaleX = 50 / image.image.width;
      image.scaleY = 50 / image.image.height;
      container.addChild(image);
      container.on("click", (e) => {
        gameState = "LOADED";
        correctGuesses = 0;
        incorrectGuesses = 0;
        currentLevel = 1;
        runGameLoop();
      });
      stage.addChild(container);
    }
    displayInstructions() {
      if (currentLevel == 1) {
        let img = new createjs.Bitmap(loader.getResult("speech"));
        let container = new createjs.Container();
        img.scaleX = 250 / img.image.width;
        img.scaleY = 120 / img.image.height;
        container.x = phone
          ? stage.canvas.width * 0.5 - 125
          : stage.canvas.width * 0.65;
        container.y = phone
          ? stage.canvas.height * 0.35
          : stage.canvas.height * 0.2;

        let text_one = new createjs.Text();
        text_one.text = "听单词然后拼写";
        text_one.font = "20px Open Sans";
        text_one.lineWidth = 170;
        text_one.x = 60;
        text_one.y = 50;
        container.addChild(img, text_one);
        stage.addChild(container);
      }
    }
    displayKeyBoard() {
      let y_co = phone ? 100 : 150;
      for (let i = 0; i < this.keyboard.length; i++) {
        const keyContainer = new createjs.Container();
        keyContainer.x = y_co;
        keyContainer.y = calcKeyYPosition(phone, this.keyboard[i]);
        const keyShape = new createjs.Shape();
        keyShape.color = keyShape.graphics.beginFill("lightblue").command;
        keyShape.graphics.drawRect(0, 0, 50, 50);
        const keyLetter = new createjs.Text();
        keyLetter.text = this.keyboard[i].key;
        keyLetter.font = "25px Open Sans";
        keyLetter.x = 50 / 2 - keyLetter.getMeasuredWidth() / 2;
        keyLetter.y = 50 / 2 - keyLetter.getMeasuredHeight() / 2;
        this.keyboard[i].break ? (y_co = phone ? 100 : 150) : (y_co += 55);
        const tempText = new createjs.Text(
          this.keyboard[i].key,
          "20px Open Sans",
          "black"
        );
        keyContainer.on("mouseover", (e) => {
          this.letterHolders[this.selectedIndex].addChild(tempText);
        });
        keyContainer.on("mouseout", (e) => {
          this.letterHolders[this.selectedIndex].removeChild(tempText);
        });
        keyContainer.on("click", (e) => {
          if (
            this.letterHolders[this.selectedIndex].name == this.keyboard[i].key
          ) {
            this.displayMessage("correct", 500);
            const text = new createjs.Text(
              this.keyboard[i].key,
              "20px Open Sans",
              "black"
            );
            this.letterHolders[this.selectedIndex].addChild(text);
            if (this.selectedIndex < this.letterHolders.length - 1) {
              this.selectedIndex++;
              correctGuesses++;
            } else {
              stage.children.forEach((child) =>
                child.removeAllEventListeners()
              );
              setTimeout(() => {
                incorrectGuesses++;
                this.runLevelComplete();
              }, 1500);
            }
          } else {
            this.displayMessage("wrong", 300);
          }
        });
        keyContainer.addChild(keyShape, keyLetter);
        stage.addChild(keyContainer);
      }
    }
    displayListenButton() {
      const imageContainer = new createjs.Container();

      const iconShape = new createjs.Shape();
      iconShape.graphics.beginFill("lightblue").drawRect(0, 0, 65, 65);

      const image = new createjs.Bitmap(loader.getResult("audioIcon"));
      image.scaleX = 50 / image.image.width;
      image.scaleY = 50 / image.image.height;
      image.x = 65 / 2 - 25;
      image.y = 65 / 2 - 25;
      imageContainer.x = 60;
      imageContainer.y = stage.canvas.height * 0.4;

      const sound = () => {
        this.playSound();
        imageContainer.removeEventListener("click", sound);
        setTimeout(() => {
          imageContainer.addEventListener("click", sound);
        }, 1000);
      };

      imageContainer.addEventListener("click", sound);
      imageContainer.addChild(iconShape, image);
      stage.addChild(imageContainer);
    }
    displayMessage(messageText, time) {
      const message = new createjs.Text();
      message.text = messageText;
      message.font = "20px Open Sans";
      message.x = stage.canvas.width / 2 - message.getMeasuredWidth() / 2;
      message.y = phone ? stage.canvas.width * 0.65 : stage.canvas.width * 0.3;
      message.alpha = 0;
      createjs.Tween.get(message).to({ alpha: 1 }, time);
      stage.addChild(message);
      setTimeout(() => {
        createjs.Tween.get(message)
          .to({ alpha: 0 }, time)
          .call(() => stage.removeChild(message));
      }, 700);
    }
    displayCurrentLevel() {
      const levelText = new createjs.Text(
        currentLevel + "/10",
        "25px Open Sans",
        "black"
      );
      levelText.x = 0;
      levelText.y = 0;
      stage.addChild(levelText);
    }
    runLevelComplete() {
      fadeOutChildren(300);
      setTimeout(() => {
        stage.children.forEach(
          (child) => child.name !== "background" && stage.removeChild(child)
        );
        this.playSound();
        this.displayImage();
        const text = new createjs.Text(
          this.correctWord,
          "35px Open Sans",
          "black"
        );
        text.x = stage.canvas.width / 2 - text.getMeasuredWidth() / 2;
        text.y = stage.canvas.height * 0.5;
        text.alpha = 0;

        let buttonContainer = new createjs.Container();
        let buttonShape = new createjs.Shape();
        let buttonText = new createjs.Text();

        // Styling the text
        buttonText.text = "Next level";
        buttonText.font = "27px Open Sans";
        buttonText.x = 200 / 2 - buttonText.getMeasuredWidth() / 2;
        buttonText.y = 50 / 2 - buttonText.getMeasuredHeight() / 2;

        // Styling the shape
        buttonShape.color = buttonShape.graphics.beginFill("lightblue").command;
        buttonShape.graphics.drawRect(0, 0, 200, 50);

        // Positioning the container
        buttonContainer.x = stage.canvas.width * 0.5 - 100;
        buttonContainer.y = stage.canvas.height * 0.6;
        buttonContainer.alpha = 0;

        createjs.Tween.get(text).to({ alpha: 1 }, 300);
        createjs.Tween.get(buttonContainer).to({ alpha: 1 }, 300);

        buttonContainer.on("mouseover", (e) => {
          e.currentTarget.children[0].color.style = "red";
        });

        buttonContainer.on("mouseout", (e) => {
          e.currentTarget.children[0].color.style = "lightblue";
        });

        buttonContainer.on("click", (e) => {
          if (currentLevel === 10) {
            gameState = "RUN_END_SCREEN";
          } else {
            currentLevel++;
          }
          runGameLoop();
        });

        buttonContainer.addChild(buttonShape, buttonText);

        stage.addChild(text, buttonContainer);
      }, 300);
    }
    runGameComplete() {
      console.log("ran");
    }
    playSound() {
      createjs.Sound.play(this.correctWord + "mp3");
    }
    displayImage() {
      const imageContainer = new createjs.Container();
      console.log(this.correctWord);
      const image = new createjs.Bitmap(
        loader.getResult(this.correctWord + "IMG")
      );
      image.scaleX = 200 / image.image.width;
      image.scaleY = 200 / image.image.height;
      imageContainer.x = stage.canvas.width * 0.5 - 200 / 2;
      imageContainer.y = phone ? 75 : 30;
      imageContainer.addChild(image);
      stage.addChild(imageContainer);
    }
    runLevelScreen() {
      this.createBackground();
      this.displayInstructions();
      this.createHomeButton();
      this.displayCurrentLevel();
      this.displayEmptyLetters();
      this.displayKeyBoard();
      this.displayImage();
      this.displayListenButton();
      this.playSound();
    }
  }

  class EndGameScreen extends Screen {
    constructor() {
      super();
    }
    showScore() {
      fadeOutChildren(300);
      setTimeout(() => {
        stage.children.forEach(
          (child) => child.name !== "background" && stage.removeChild(child)
        );
        const scoreText = new createjs.Text(
          "Score: " + calculateError() + "%",
          "30px Open Sans",
          "black"
        );
        scoreText.x = stage.canvas.width / 2 - scoreText.getMeasuredWidth() / 2;
        scoreText.y = stage.canvas.height * 0.4;
        addScore(calculateError(), "Spelling");
        stage.addChild(scoreText);

        // play again button
        let buttonContainer = new createjs.Container();
        let buttonShape = new createjs.Shape();
        let buttonText = new createjs.Text();

        // Styling the text
        buttonText.text = "Play again";
        buttonText.font = "27px Open Sans";
        buttonText.x = 200 / 2 - buttonText.getMeasuredWidth() / 2;
        buttonText.y = 50 / 2 - buttonText.getMeasuredHeight() / 2;

        // Styling the shape
        buttonShape.color = buttonShape.graphics.beginFill("lightblue").command;
        buttonShape.graphics.drawRect(0, 0, 200, 50);

        // Positioning the container
        buttonContainer.x = stage.canvas.width * 0.5 - 100;
        buttonContainer.y = stage.canvas.height * 0.6;

        buttonContainer.addChild(buttonShape, buttonText);

        buttonContainer.on("mouseover", (e) => {
          e.currentTarget.children[0].color.style = "red";
        });

        buttonContainer.on("mouseout", (e) => {
          e.currentTarget.children[0].color.style = "lightblue";
        });

        buttonContainer.on("click", (e) => {
          currentLevel = 1;
          incorrectGuesses = 0;
          correctGuesses = 0;
          gameState = "RUN_LEVEL";
          runGameLoop();
        });

        stage.addChild(buttonContainer);
      }, 300);
    }
    runEndGame() {
      this.showScore();
    }
  }

  // Main game loop
  const runGameLoop = () => {
    switch (gameState) {
      case "LOADING":
        runLoadingScreen();
        break;
      case "LOADED":
        runCategoriesScreen();
        break;
      case "RUN_LEVEL":
        runLevelScreen();
        break;
      case "RUN_END_SCREEN":
        runEndScreen();
        break;
      default:
        console.log("default_ran");
    }
  };

  const calculateError = () => {
    const score = (correctGuesses / (correctGuesses + incorrectGuesses)) * 100;
    return Math.round(score);
  };

  const fadeOutChildren = (time) => {
    stage.children.forEach((child) => {
      child.name !== "background" &&
        createjs.Tween.get(child).to({ alpha: 0 }, time);
    });
  };

  const handleResize = (e) => {
    window.innerWidth < 900 ? (phone = true) : (phone = false);
    stage.removeAllEventListeners("click");
    stage.removeAllChildren();
    resizeCanvas();
    runGameLoop();
  };

  function resizeCanvas() {
    if (window.innerWidth >= 800) {
      phone = false;
      canvasRef.current.width = 800;
      canvasRef.current.height = 550;

      let widthToHeight = 800 / 550;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight - 200;
      let newWidthToHeight = newWidth / newHeight;
      if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        containerRef.current.style.height = newHeight + "px";
        containerRef.current.style.width = newWidth + "px";
      } else {
        newHeight = newWidth / widthToHeight;
        containerRef.current.style.height = newHeight + "px";
        containerRef.current.style.width = newWidth + "px";
      }
    } else {
      phone = true;
      canvasRef.current.width = canvasRef ? 550 : null;
      canvasRef.current.height = canvasRef ? 800 : null;
      let widthToHeight = 550 / 800;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight - 200;
      let newWidthToHeight = newWidth / newHeight;
      if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        containerRef.current.style.height = newHeight + "px";
        containerRef.current.style.width = newWidth + "px";
      } else {
        newHeight = newWidth / widthToHeight;
        containerRef.current.style.height = newHeight + "px";
        containerRef.current.style.width = newWidth + "px";
      }
    }
  }
  React.useEffect(() => {
    console.log(window);
    init();
    return () => {
      createjs.Sound.removeAllSounds();
      window.removeEventListener("resize", handleResize);
    };
  });
  return (
    <div ref={containerRef} className="canvas-holder">
      <canvas
        id="canvas2"
        ref={canvasRef}
        width="800px"
        height="550px"
      ></canvas>
    </div>
  );
};

export default connect(null, (dispatch) => ({
  addScore: (score, gameName) => dispatch(addScores(score, gameName)),
}))(Spelling);
