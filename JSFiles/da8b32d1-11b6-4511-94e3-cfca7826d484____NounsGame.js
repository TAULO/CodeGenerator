import React from "react";
import { connect } from "react-redux";
import { addScores } from "../../redux/API/API.actions";
import { useDispatch, useSelector } from "../../redux/react-redux-hooks";
import {
  calculateCategoryX,
  calculateCategoryY,
  selectRandomFromArray,
  shuffle,
} from "./util";

const NounsGame = ({ addScore }) => {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const createjs = window.createjs;
  const categories = [
    "Animals",
    "Countries",
    // "Colors",
    // "three",
    // "four",
    // "five",
  ];
  const gameData = {
    Animals: [
      "Bat",
      "Bear",
      "Beaver",
      "Bird",
      "Camel",
      "Cat",
      "Chicken",
      "Cow",
      "Crab",
      "Dog",
      "Elephant",
      "Monkey",
      "Pig",
      "Fish",
      "Lion",
      "Sheep",
      "Whale",
      "Fox",
    ],
    Countries: [
      "England",
      "Spain",
      "France",
      "Italy",
      "America",
      "Japan",
      "China",
      "Germany",
      "Russia",
      "Australia",
      "Brazil",
      "Ireland",
      "Vietnam",
    ],
  };
  const animals = [];
  let selectedCategory;
  let stage, phone, loader;
  let gameState = "LOADING";
  let manifest = [
    {
      id: "Vietnam",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/vietnam.jpg",
    },
    {
      id: "Ireland",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/ireland.jpg",
    },
    {
      id: "Brazil",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/brazil.png",
    },
    {
      id: "Australia",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/australia.png",
    },
    {
      id: "Russia",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/russia.png",
    },
    {
      id: "Germany",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/germany.png",
    },
    {
      id: "Fox",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/fox.png",
    },
    {
      id: "Whale",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/whale.png",
    },
    {
      id: "Sheep",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/sheep.png",
    },
    {
      id: "Lion",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/lion.png",
    },
    {
      id: "Fish",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/fish.png",
    },
    {
      id: "Pig",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/pig.png",
    },
    {
      id: "Monkey",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/monkey.jpg",
    },
    {
      id: "Elephant",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/elephant.png",
    },
    {
      id: "Dog",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/dog.png",
    },
    {
      id: "tree",
      type: createjs.Types.IMAGE,
      src: "https://db3pap007files.storage.live.com/y4mVq1Hesme1E8q6BkOZ_nHE6N2Oa7SItuOgI113jBRzI-_rQB9zIKvL7v2pKKZnoGsPrMiIUQI8DYUl_bQQz77-1NQzZdxVUwDFwImsu1MBvUGtE50EcJsaAX7K33EYM-1ZPnfa7X2IaE1xx9WohyW43LywM3Yap2PIbL-NBEP74Sw8vqfde0pVd2J7ALCFxau?width=356&height=400&cropmode=none",
    },
    {
      id: "plane",
      type: createjs.Types.IMAGE,
      src: "https://db3pap007files.storage.live.com/y4m7y0fQKNnYjL-5PztzRM5B6Ar1sNjHkZsq0rLc4L_Mvpy0pX6Raudqr1UpXb7xiG44tHSglPEN6piU0K-hSHSqhbNE_KyQyQe6JiK0GG-H2VLN4SLWGujQxVnUVHgF-KzMQYvTanr1TQnwujI54OImhyHJJZDTDiNf1WPXR9aQdFixJnPDNwZuzqxktpSoDuA?width=400&height=400&cropmode=none",
    },
    {
      id: "france",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/flag_pics/3-2-france-flag-png-image-thumb+(1).png",
    },
    {
      id: "unitedkingdom",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/flag_pics/7-2-united-kingdom-flag-png-image_400x400.png",
    },
    {
      id: "spain",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/flag_pics/5-2-spain-flag-picture_400x400+(1)+(1).png",
    },
    {
      id: "germany",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/flag_pics/germany_flag.png",
    },
    {
      id: "home",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/n1612275.png",
    },
    {
      id: "Bat",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/bat.png",
    },
    {
      id: "Bear",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/bear.png",
    },
    {
      id: "Beaver",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/Beaver.png",
    },
    {
      id: "Bird",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/bird.png",
    },
    {
      id: "Camel",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/camel.png",
    },
    {
      id: "Cat",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/cat.png",
    },
    {
      id: "Chicken",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/chicken.png",
    },
    {
      id: "Cow",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/cow.png",
    },
    {
      id: "Crab",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/crab.png",
    },
    {
      id: "America",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/america.png",
    },
    {
      id: "France",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/france.png",
    },
    {
      id: "China",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/china.png",
    },
    {
      id: "England",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/england.png",
    },
    {
      id: "pointer",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/cursor-png-transparent-7.png",
    },
    {
      id: "Italy",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/italy.png",
    },
    {
      id: "Japan",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/japan.png",
    },
    {
      id: "Spain",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/spain.png",
    },
    {
      id: "AnimalsCat",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/animalcat.png",
    },
    {
      id: "CountriesCat",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/countriesCat+(1).png",
    },
    {
      id: "Francemp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/france+(2).mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Americamp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/america.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Chinamp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/china.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Englandmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/england+(2).mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Italymp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/italy.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Japanmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/japan.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Spainmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/spain+(2).mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Batmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/bat.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Bearmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/bear.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Beavermp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/beaver.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Birdmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/bird.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Camelmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/camel.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Catmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/cat.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Chickenmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/chicken.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Cowmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/cow.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Crabmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/crab.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Dogmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Dogmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Elephantmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Elephantmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Fishmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Fishmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Foxmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Foxmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Lionmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Lionmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Monkeymp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Monkeymp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Pigmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Pigmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Sheepmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Sheepmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Whalemp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/animals/Whalemp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Australiamp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/australiamp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Brazilmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/brazilmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Germanymp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/germanymp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Irelandmp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/irelandmp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Russiamp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/russiamp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
    {
      id: "Vietnammp3",
      type: createjs.Types.SOUND,
      src: {
        mp3: "https://f000.backblazeb2.com/file/audio1262/nouns/sounds/countries/vietnammp3.mp3",
        ogg: "noExtensionOggFile",
      },
    },
  ];

  let loadingProgress = 0;
  let score = 0;
  let wrong = 0;

  const init = () => {
    stage = new createjs.Stage(canvasRef.current);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage, false, true);
    createjs.Ticker.framerate = 30;
    createjs.Ticker.addEventListener("tick", stage);

    createjs.Sound.volume = 0.5;
    loader = new createjs.LoadQueue(false, null, true);
    loader.installPlugin(createjs.Sound);
    loader.loadManifest(manifest);
    loader.addEventListener("error", function (e) {
      console.log(e);
    });
    loader.on("progress", (e) => {
      loadingProgress = Math.round(loader.progress * 100);
      runLoadingScreen();
    });
    loader.on("complete", (e) => {
      gameState = "OPTIONS";
      runGameLoop();
    });
    window.addEventListener("resize", handleResize);
    resizeCanvas();
    runGameLoop();
  };

  const handleResize = (e) => {
    window.innerWidth < 900 ? (phone = true) : (phone = false);
    stage.removeAllEventListeners("click");
    stage.removeAllChildren();
    resizeCanvas();
    runGameLoop();
  };

  // const showCurrentTimeOnScreen = () => {
  //   let time = parseInt(Math.floor(e.target.getTime() / 1000));
  //   let text = new createjs.Text(time, "20px Open Sans", "black");
  //   text.x = 400;
  //   text.y = 0;
  // };

  const runLoadingScreen = () => {
    let loadingScreen = new LoadingScreen(stage, "lightgreen", loadingProgress);
    loadingScreen.createLoadingScreen();
  };

  const runOptionsScreen = () => {
    new CategoriesScreen(stage).createCategoriesScreen();
  };
  let levelStatus, levelTarget, levelOptions;
  const runLevelScreen = () => {
    if (score >= 10) {
      gameState = "RUNENDLEVEL";
      addScore(calculateError(score, wrong), "Nouns");
      runGameLoop();
      return;
    }
    if (!levelStatus) {
      selectRandomWord();
    }

    new LevelScreen(stage, levelTarget, levelOptions).createLevel();
  };

  const selectRandomWord = () => {
    let randomItem =
      gameData[selectedCategory][
        Math.floor(Math.random() * gameData[selectedCategory].length)
      ];
    let filteredOptions = gameData[selectedCategory].filter(
      (item) => item !== randomItem
    );
    let shuffled = shuffle(filteredOptions);
    let sliced = shuffled.slice(0, 3);
    sliced.push(randomItem);
    let final = shuffle(sliced);

    levelTarget = randomItem;
    levelOptions = final;
    levelStatus = true;
  };

  const runEndLevel = () => {
    let screen = new Screen();
    screen.createBackground();

    let text = new createjs.Text(
      "Score: " + Math.round(calculateError(score, wrong)) + "%",
      "30px Open Sans",
      "black"
    );
    text.x = stage.canvas.width / 2 - text.getMeasuredWidth() / 2;
    text.y = stage.canvas.width * 0.2;

    let container = new createjs.Container();
    container.x = 15;
    container.y = 15;
    let image = new createjs.Bitmap(loader.getResult("home"));
    image.scaleX = 50 / image.image.width;
    image.scaleY = 50 / image.image.height;
    container.addChild(image);
    container.on("click", (e) => {
      score = 0;
      levelStatus = false;
      gameState = "OPTIONS";
      runGameLoop();
    });
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
    buttonContainer.y = stage.canvas.height * 0.7;
    //buttonContainer.alpha = 0;

    //createjs.Tween.get(buttonContainer).to({ alpha: 1 }, 300);

    buttonContainer.on("mouseover", (e) => {
      e.currentTarget.children[0].color.style = "red";
    });

    buttonContainer.on("mouseout", (e) => {
      e.currentTarget.children[0].color.style = "lightblue";
    });
    buttonContainer.on("click", (e) => {
      score = 0;
      levelStatus = false;
      gameState = "OPTIONS";
      runGameLoop();
    });
    buttonContainer.addChild(buttonShape, buttonText);
    stage.addChild(container, buttonContainer, text);
  };

  const calculateError = (s, w) => {
    return (s / (score + w)) * 100;
  };

  const runGameLoop = () => {
    stage.removeAllChildren();
    switch (gameState) {
      case "LOADING":
        runLoadingScreen();
        break;
      case "OPTIONS":
        runOptionsScreen();
        break;
      case "RUNLEVEL":
        runLevelScreen();
        break;
      case "RUNENDLEVEL":
        runEndLevel();
        break;
      default:
        console.log("default ran");
    }
  };

  // SCREEN CLASSES

  class Screen {
    constructor(stage, color) {
      this.categories = categories;
      this.color = color;
      this.stage = stage;
    }
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
    createHomeButton() {
      let container = new createjs.Container();
      container.x = 15;
      container.y = 15;
      let image = new createjs.Bitmap(loader.getResult("home"));
      image.scaleX = 50 / image.image.width;
      image.scaleY = 50 / image.image.height;
      container.addChild(image);
      container.on("click", (e) => {
        levelStatus = false;
        gameState = "OPTIONS";
        runGameLoop();
      });
      this.stage.addChild(container);
    }
  }

  class LoadingScreen extends Screen {
    constructor(stage, color, percentLoaded) {
      super(stage, color);
      this.percentLoaded = percentLoaded;
    }
    createLoadingStatusText() {
      let progressContainer = new createjs.Container();
      progressContainer.x = stage.canvas.width / 2 - (25 * 10.5) / 2 - 15;
      progressContainer.y = stage.canvas.height / 2 - 30 / 2;
      let progressBox = new createjs.Shape();
      progressBox.graphics.beginFill("");
      progressBox.graphics.setStrokeStyle(5).beginStroke("black");
      progressBox.graphics.drawRect(20, 0, 25 * 10.5, 30);

      progressContainer.addChild(progressBox);
      let progressStage = Math.floor(this.percentLoaded / 10);
      for (let i = 1; i <= progressStage; i++) {
        let block = new createjs.Shape();
        block.graphics.beginFill("black").drawRect(i * 25, 5, 20, 20);
        progressContainer.addChild(block);
      }

      let text = new createjs.Text(
        `${this.percentLoaded}%`,
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
      this.stage.addChild(text, messageText, progressContainer);
    }
    createLoadingScreen() {
      this.createBackground();
      this.createLoadingStatusText();
      //this.percentLoaded >= 100 && this.createCategories(); //new Buttons("Continue", "lightblue", "black", "40").createPlayButton();
    }
  }
  class CategoriesScreen extends Screen {
    constructor(stage) {
      super(stage);
      this.stage = stage;
    }
    createCategories() {
      score = 0;
      wrong = 0;
      for (let i = 0; i < categories.length; i++) {
        let container = new createjs.Container();
        container.name = categories[i];
        let shape = new createjs.Shape();
        shape.graphics.setStrokeStyle(5).beginStroke("black");
        shape.graphics.beginFill("white").drawRect(0, 0, 150, 150);
        let bitmap = new createjs.Bitmap(
          loader.getResult(categories[i] + "Cat")
        );
        let text = new createjs.Text(categories[i], "20px Open Sans", "black");
        text.x = 150 / 2 - text.getMeasuredWidth() / 2;
        text.y = 10;
        let imgWidth = bitmap.image.width;
        bitmap.scaleX = 100 / bitmap.image.width;
        bitmap.scaleY = 100 / bitmap.image.height;
        bitmap.x = 150 / 2 - 50;
        bitmap.y = 75 - 40;
        container.y =
          calculateCategoryY(this.stage.canvas.height, i + 1) - 150 / 2;
        container.x =
          calculateCategoryX(this.stage.canvas.width, i + 1) - 150 / 2;

        container.on("mouseover", (e) => {
          container.scaleX = 1.2;
          container.scaleY = 1.2;
          container.x = container.x - 150 * 0.1;
          container.y = container.y - 150 * 0.1;
        });

        container.on("mouseout", (e) => {
          container.scaleX = 1;
          container.scaleY = 1;
          container.x = container.x + 150 * 0.1;
          container.y = container.y + 150 * 0.1;
        });

        container.on("click", (e) => {
          selectedCategory = container.name;
          gameState = "RUNLEVEL";
          runGameLoop();
        });

        container.addChild(shape, text, bitmap);
        this.stage.addChild(container);
      }
    }
    createInstructions() {
      const text = new createjs.Text();
      text.text = "Choose One";
      text.font = "25px Open Sans";
      text.x = stage.canvas.width / 2 - text.getMeasuredWidth() / 2;
      text.y = 20;
      stage.addChild(text);
    }
    createCategoriesScreen() {
      this.createBackground();
      this.createInstructions();
      this.createCategories();
    }
  }

  class LevelScreen extends Screen {
    constructor(stage, targetItem, itemOptions) {
      super(stage);
      this.stage = stage;
      this.targetItem = targetItem;
      this.itemOptions = itemOptions;
    }
    createLevel() {
      this.createBackground();
      this.createInstructions();
      this.createHomeButton();
      this.createTextBox();
      this.createChoices();
      this.createScore();
    }
    createInstructions() {
      if (score === 0) {
        let img = new createjs.Bitmap(loader.getResult("pointer"));
        img.scaleX = 30 / img.image.width;
        img.scaleY = 30 / img.image.height;
        img.x = phone ? 100 : 250;
        img.y = phone ? stage.canvas.height / 2 : stage.canvas.height * 0.55;

        let text = new createjs.Text();
        text.text = "点击图片对应的字在框中";
        text.font = "25px Open Sans";
        text.x = this.stage.canvas.width / 2 + 20 - text.getMeasuredWidth() / 2;
        text.y = phone
          ? this.stage.canvas.height / 2
          : this.stage.canvas.height * 0.55;
        this.stage.addChild(img, text);
      }
    }
    createScore() {
      let text = new createjs.Text(score + "/10", "20px Open Sans", "black");
      text.set({
        x: 100,
        y: 10,
      });
      this.stage.addChild(text);
    }
    createTextBox() {
      let container = new createjs.Container();
      container.name = this.targetItem;
      let shape = new createjs.Shape();
      shape.graphics.setStrokeStyle(5).beginStroke("black");
      let text = new createjs.Text(
        this.targetItem,
        "25px Open Sans",
        "lightblack"
      );
      container.x = this.stage.canvas.width * 0.2;
      container.y = this.stage.canvas.height * 0.1;
      shape.graphics
        .beginFill("white")
        .drawRect(0, 0, this.stage.canvas.width * 0.6, 50);
      container.addChild(shape, text);
      this.stage.addChild(container);
      text.x =
        (this.stage.canvas.width * 0.6) / 2 - text.getMeasuredWidth() / 2;
      text.y = 50 / 2 - text.getMeasuredHeight() / 2;
    }
    createChoices() {
      // Audio is played.
      createjs.Sound.play(this.targetItem + "mp3");
      // For each choice, an image is placed on the screen.
      for (let i = 0; i < this.itemOptions.length; i++) {
        // A container to hold the image is placed
        let container = new createjs.Container();
        // The container is named so it can be identified later
        container.name = this.itemOptions[i];
        // A block is created to sit inside the container.
        let shape = new createjs.Shape();
        shape.color = shape.graphics.beginFill("white").command;
        shape.graphics.drawRect(0, 0, 100, 100);
        // An image from a list of pre-loaded assets is created and sized.
        let bitmap = new createjs.Bitmap(loader.getResult(this.itemOptions[i]));
        bitmap.scaleX = 150 / bitmap.image.width;
        bitmap.scaleY = 100 / bitmap.image.height;
        // image is added to the container and the container is placed on the canvas
        
        

        if (phone) {
          container.y =
            i === 0 || i === 1
              ? this.stage.canvas.height * 0.33 - 50
              : this.stage.canvas.height * 0.66 - 50;
          container.x =
            i === 0 || i === 2
              ? this.stage.canvas.width * 0.25 - 75
              : this.stage.canvas.width * 0.75 - 75;
        } else {
          container.y =
            i === 0 || i === 1
              ? this.stage.canvas.height * 0.4 - 50
              : this.stage.canvas.height * 0.8 - 50;
          container.x =
            i === 0 || i === 2
              ? this.stage.canvas.width * 0.25 - 75
              : this.stage.canvas.width * 0.75 - 75;
        }
        container.on("mouseover", (e) => {
          // e.currentTarget.children[0].scaleX = 1.1;
          // e.currentTarget.children[0].scaleY = 1.1;
          // e.currentTarget.x = e.currentTarget.x - 10;
          // e.currentTarget.y = e.currentTarget.y - 10;
          // e.currentTarget.children[1].scaleX = bitmapRatio;
          // e.currentTarget.children[1].scaleY = bitmapRatio;
        });
        container.on("mouseout", (e) => {
          // e.currentTarget.children[0].scaleX = 1;
          // e.currentTarget.children[0].scaleY = 1;
          // e.currentTarget.x = e.currentTarget.x + 10;
          // e.currentTarget.y = e.currentTarget.y + 10;
          // e.currentTarget.children[1].scaleX = bitmapRatio - 0.1;
          // e.currentTarget.children[1].scaleY = bitmapRatio - 0.1;
        });
        container.on("click", (e) => {
          if (e.currentTarget.name === this.targetItem) {
            score++;
            createjs.Sound.play(e.currentTarget.name + "mp3");
            createjs.Tween.get(e.currentTarget).to(
              {
                // scaleX: 1,
                // scaleY: 1,
                x: stage.canvas.width / 2 - 75,
                y: stage.canvas.height / 2 - 50,
              },
              200
            );
            // stage.children.forEach((child) => {
            //   if (child.name !== e.currentTarget.name) {
            //     child.alpha = 0;
            //   }
            // });
            for (let i = stage.numChildren - 1; i >= 0; i--) {
              let child = stage.getChildAt(i);
              if (
                child.name !== e.currentTarget.name &&
                child.name !== "background"
              ) {
                stage.removeChild(child);
              }
            }
            container.removeAllEventListeners();
            new Buttons(
              "Continue",
              "white",
              "black",
              20
            ).createNextLevelButton();
          } else {
            wrong++;
            createjs.Tween.get(e.currentTarget).to({ alpha: 0 }, 1000);
          }
          levelStatus = false;
        });

        container.addChild(bitmap);
        this.stage.addChild(container);
      }
    }
  }

  // BUTTONS CLASS
  class Buttons {
    constructor(text, shapeColor, textColor, fontSize) {
      this.stage = stage;
      this.text = text;
      this.shapeColor = shapeColor;
      this.textColor = textColor;
      this.fontSize = fontSize;
    }
    createPlayButton() {
      let container = new createjs.Container();
      let shape = new createjs.Shape();
      let text = new createjs.Text(this.text, `50px Open Sans`, this.textColor);

      let textWidth = text.getMeasuredWidth();
      let textHeight = text.getMeasuredHeight();
      text.x = 0;
      text.y = 0;
      container.x = this.stage.canvas.width / 2 - textWidth / 2;
      container.y = this.stage.canvas.height / 2 - textHeight / 2;

      shape.color = shape.graphics.beginFill("lightblue").command;
      shape.graphics.drawRect(0, 0, textWidth, textHeight);

      container.on("mouseover", (e) => {
        shape.color.style = "red";
      });
      container.on("mouseout", (e) => {
        shape.color.style = "lightblue";
      });
      container.on("click", (e) => {
        gameState = "RUNLEVEL";
        runGameLoop();
      });

      container.addChild(shape, text);
      this.stage.addChild(container);
    }
    createNextLevelButton() {
      const container = generateButtonContainer(
        this.text,
        this.shapeColor,
        this.textColor
      );
      container.on("click", (e) => {
        stage.children.forEach((child) => {
          if (child.name !== "background") {
            createjs.Tween.get(child)
              .to({ alpha: 0 }, 300)
              .call(() => {
                runGameLoop();
              });
          }
        });
      });
      stage.addChild(container);
    }
  }

  const generateButtonContainer = (textContent, shapeColor, textColor) => {
    const container = new createjs.Container();
    const shape = new createjs.Shape();
    const text = new createjs.Text(textContent, "20px Open Sans", "black");
    text.x = 200 / 2 - text.getMeasuredWidth() / 2;
    text.y = 50 / 2 - text.getMeasuredHeight() / 2;
    shape.color = shape.graphics.beginFill("lightgreen").command;
    shape.graphics.drawRect(0, 0, 200, 50);

    container.x = stage.canvas.width / 2 - 100;
    container.y = phone ? 200 : 130;
    container.alpha = 0;
    createjs.Tween.get(container).to({ alpha: 1 }, 500);
    container.addChild(shape, text);
    return container;
  };

  function resizeCanvas() {
    if (window.innerWidth >= window.innerHeight) {
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
    init();
    return () => {
      window.removeEventListener("resize", handleResize);
      createjs.Sound.removeAllSounds();
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
}))(NounsGame);
