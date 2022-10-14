// Program | All Media | Scans local media files for Movies, TV Shows, Books, and Music.
// Comment Formatting: Main Function Focus I.E. Directory. | Media Types Used in Function. I.E. Books, Movies. | Function Purpose.
const fs = require("fs");
const { readdirSync } = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");
const sizeOf = require("image-size");
const { databaseAction } = require("../database/mongodb");
const { saveToDatabase } = require("../database/saveToDatabase");
const { logger } = require("../logger/logger");

// Arrays Used for Media.
let initialFolderPaths = []; //Initial First Level Folders
let finalFolderPaths = []; //Final Book Path
let mediaArr = []; // Final Array for All Media to resolve
let tvShow = []; // Sort TV Shows by Name
let tvSeason = []; // Sort TV Shows By Name > Season > Episode
let episodeObj = []; // TV Show Episodes
let seasonObj = []; // TV Seasons
let showObj = []; // TV Shows with Seasons and Episodes

//File Extensions For Media.
const extensionepub = ".epub"; // Extension for book type
const extensionpdf = ".pdf"; // Extension for book type
const extensiondoc = ".doc"; // Extension for book type

const extensionmp4 = ".mp4"; // Extension for Movies
const extensionmkv = ".mkv"; // Extension for Movies
const extensionm2ts = ".m2ts"; // Extension for Movies

const extensionjpeg = ".jpeg"; // Extension for Photos
const extensionjpg = ".jpg"; // Extension for Photos
const extensiongif = ".gif"; // Extension for Photos
const extensionpng = ".png"; // Extension for Photos
const extensiontiff = ".tiff"; // Extension for Photos

const extensionmp3 = ".mp3"; // Extension for Music
const extensionm4a = ".m4a"; // Extension for Music
const extensionflac = ".flac"; // Extension for Music

// Strings to Remove From Titles
const remove4k = "2160p";
const removeHd = "1080p";
const remove720 = "720p";

// Counters Used
let resultNumber = 1;
let counter = 1;
let fixedTitles = 0;
let fixedTitles1 = 1;
let fixedTitles2 = 1;
let fixedTitles3 = 1;
let fixedTitles4 = 1;
let fixedTitles5 = 1;
let fixedTitles6 = 1;
let fixedTitles7 = 1;
let scanTime = 0;
let seasonsKey = 1;
let mediaType;
let loop = true;

// Scan Timer
let scan = setInterval(() => {
  scanTime++;
}, 1000);

//////////// Main Program Loop
// Program | All Media | Starts Scan
async function startScan(response, mediaCategory, mediaPath) {
  setCategory(mediaCategory);
  logger.info(
    `Starting Local Media Scan: Media Type ${mediaType}. Media Category ${mediaCategory}.`
  );
  resetGlobalVariables();
  saveScanTime("start");
  res = response;

  //TODO: Remove Previous Records only if Deleted. Only Insert New Records.
  // Drop Collection for New Entries.
  let cmd = {
    cmd: "dropCollection",
    collection: mediaType,
    key: "key",
  };
  await databaseAction(cmd);

  return new Promise(async (resolve, reject) => {
    // Path | All Media | Make Sure Path ends with forward slash.
    mediaPath = await checkPathEnding(mediaPath);
    saveScanTime("checkPathEnding");
    let initDir = mediaPath;
    logger.info(`Directory Path to Scan: ${mediaPath}`);

    // Directories | All Media | Read Root Directories. If they contain directories matching media name use those directories.
    let superDirectoriesCheck = false;
    await findMediaDirectories(mediaPath, superDirectoriesCheck, res, initDir);
    saveScanTime("findMediaDirectories");

    //No Root Directories were found look up one level in super directory.
    if (initialFolderPaths.length === 0) {
      let superDirectoriesCheck = true;
      const dir = path.join(mediaPath, "../");

      // Directories | All Media | Read Super Directories. If they contain directories matching media name use those directories.
      await findMediaDirectories(dir, superDirectoriesCheck, res);
      saveScanTime("findMediaDirectories 2nd Time");
    }

    // If initial paths found is 0 we failed to find a directory to use, stop execution.
    if (initialFolderPaths.length === 0) {
      res.write(
        `${counter++}. Error: No suitable directories found To scan. Please read scan information in settings.\n`
      );
      reject("No Suitable Directories Found To Scan.");
      return;
    }

    for (let i = 0; i < initialFolderPaths.length; i++) {
      logger.info(
        `Initial Folder Path ${i + 1}. ${initialFolderPaths[i].directory}`
      );
    }
    logger.info(`Verifying Final Folder Paths from Initial Folder Paths`);
    // Directories | All Media | Scan All Sub Directories Recursively and verify there are no more sub directories
    let paths = await verifyFinalDirectory(initialFolderPaths);
    saveScanTime("verifyFinalDirectory");

    // Directories | All Media | Read Files in Final Directories
    await readDirectoryContents(paths, mediaCategory, reject);
    saveScanTime("readDirectoryContents");

    // Sanitize - Create JSON | Books | Sanitize Titles for API Calls
    if (mediaCategory === "updatebooks") {
      // Sanitize | Books | Sanitizes Book Titles
      await removeAuthorFromTitle();
      saveScanTime("removeAuthorFromTitle");

      await saveToDB();
      saveScanTime("saveToDB");
    }
    // Sanitize - Create JSON | Movies | Sanitize Movie Titles
    else if (mediaCategory === "updatemovies") {
      // Sanitize | Movies | Sanitizes Movies for API Call
      await sanitizeMovieTvTitles();
      saveScanTime("sanitizeMovieTitles");

      await saveToDB();
      saveScanTime("saveToDB");
    }
    // Sanitize - Create JSON | TV Shows
    else if (mediaCategory === "updatetv") {
      // Sanitize | TV Shows | Sanitizes TV Titles for API Call
      await sanitizeMovieTvTitles();
      saveScanTime("sanitizeMovieTitles");

      // Prevent Dupe Titles - Use Shortest Title Available
      await deDupeTitles();
      saveScanTime("deDupeTitles");

      // Prevent Episodes Being Used as Title - Check Folder Name against Title
      await preventEpisodeAsTitle();
      saveScanTime("preventEpisodeAsTitle");

      // Order TV Shows by Show > Season > Episodes
      await orderBySeason();
      saveScanTime("OrderBySeason");

      // Save Records to DB.
      await saveToDB();
      saveScanTime("saveToDB");
    }
    // Sanitize - Create JSON | Music | Sanitize Music Data for API
    else if (mediaCategory === "updatemusic") {
      // Sanitize Music Titles for API
      await sanitizeMusic();
      saveScanTime("sanitizeMusic");

      // Set Music Artist Based on Folder Name
      await setMusicArtist();
      saveScanTime("setMusicArtist");

      //Sort Music By Album. Based on Folder Name
      await setMusicAlbum();
      saveScanTime("setMusicAlbum");

      // Sort Music Artist A-Z
      await sortMusic();
      saveScanTime("setMusicAlbum");

      // Save Music Album > Tracks to Database
      await saveMusicToDb();
      saveScanTime("saveMusicToDb");
    }
    // Sanitize - Get Image Info | Photos | Get Image Properties
    else if (mediaCategory === "updatephotos") {
      // Set Image Resolution
      await getImageSize();
      saveScanTime("getImageSize");

      await getFileCreatedDate();
      saveScanTime("getFileCreatedDate");

      // Save Photos Data to DB
      await saveToDB();
      saveScanTime("savePhotosToDb");
    }

    //// Finish | All Media | Scan Media Completes.
    // Data | All Media | Log Categories Fixed to Browser Window
    await sendCategoryFixes(res);
    saveScanTime("sendCategoryFixes");

    // Write Final Stats
    res.write(
      `Finished: Found ${mediaArr.length} media items. Media Path Searched: ${mediaPath}.\nChecked Root Directories: true Checked Super Directories: ${superDirectoriesCheck}`
    );
    logger.info(
      `Finished: Found ${mediaArr.length} media items. Media Path Searched: ${mediaPath}.\nChecked Root Directories: true Checked Super Directories: ${superDirectoriesCheck}`
    );

    // Clear Scan Time
    saveScanTime("end");
    clearInterval(scan);
    resolve(mediaArr);
  });
}
//////////// End Main Program Loop

async function saveToDB() {
  // Save Individual Records to DB.
  for (let i = 0; i < mediaArr.length; i++) {
    await saveToDatabase(mediaType, mediaArr[i].name, mediaArr[i]);
  }
}
//////////// Directory / File Scans | All Media | Scans Directories and Files. Pushes to array.
// Path | All Media | Account for needing forward slash in path even though it is already verified when saved.
function checkPathEnding(mediaPath) {
  let lastChar = mediaPath.slice(-1);
  if (lastChar !== "/") {
    mediaPath = mediaPath + "/";
    return mediaPath;
  } else {
    return mediaPath;
  }
}

// Directories | All Media | Recursively Look for Directory Names with Media Type Name
async function findMediaDirectories(dir, superDirectoriesCheck, res, initDir) {
  try {
    // Todo: Add OS Root Directories.
    if (dir === "/" || dir === "Macintosh HD") {
      res.write(
        `${counter++}. Error: Directory "${dir}" is an OS root directory. This program will NOT scan OS root directories.\n`
      );
      return;
    }
    const folders = fs.readdirSync(dir);
    await removeObjProps(folders);
    for (const folder of folders) {
      if (folder !== undefined) {
        // Scan is Type Movies | Scan for directories with "movie" in name
        if (mediaType === "Movies" && folder.toLowerCase().includes("movie")) {
          initialFolderPaths.push({ media: folder, directory: dir + folder });
          res.write(` ${counter++}: INFO: Found Folder: ${dir + folder}\n`);
        }
        // Scan is Type TV Shows | Scan for directories with "tv" in name
        else if (
          mediaType === "TV Shows" &&
          folder.toLowerCase().includes("tv show")
        ) {
          initialFolderPaths.push({ media: folder, directory: dir + folder });
          res.write(
            ` ${counter++}: INFO: Found ${mediaType} Folder: ${dir + folder}\n`
          );
        }
        // Scan is Type Books | Scan for directories with "book" in name
        else if (mediaType === "Books") {
          // If found folder has "book", is is root directory. Recursively scan again with new initDir.
          if (folder.toLowerCase().includes("book")) {
            let newScanDir = dir + folder + "/";
            await findMediaDirectories(
              newScanDir,
              superDirectoriesCheck,
              res,
              newScanDir
            );
          }
          // If initDir has "book" use sub dirs for books initial folders.
          else if (
            initDir.toLowerCase().includes("book")
            //&& !initDir.toLowerCase().includes("tv" || "movie")
          ) {
            initialFolderPaths.push({ media: folder, directory: dir + folder });
            res.write(` ${counter++}: INFO: Found Folder: ${dir + folder}\n`);
          }
        }
        // Scan is Type Music | Scan directories with "music" in name
        else if (
          mediaType === "Music" &&
          folder.toLowerCase().includes("music")
        ) {
          initialFolderPaths.push({
            media: folder,
            directory: dir + folder,
          });
          res.write(` ${counter++}: INFO: Found Folder: ${dir + folder}\n`);
        }
        // Scan is Type Photos | Scan directories with "photos" in name
        else if (mediaType === "Photos") {
          if (
            folder.toLowerCase().includes("photo") ||
            folder.toLowerCase().includes("picture") ||
            folder.toLowerCase().includes("image")
          ) {
            initialFolderPaths.push({
              media: folder,
              directory: dir + folder,
            });
            res.write(` ${counter++}: INFO: Found Folder: ${dir + folder}\n`);
          }
        }
      }
    }
    if (initialFolderPaths.length === 0) {
      for (const folder of folders) {
        if (folder !== undefined) {
          let newDir = dir + folder + "/";
          // Do not scan more than 1 level down for scan performance.
          if (newDir.split("/").length - 1 <= initDir.split("/").length) {
            await findMediaDirectories(
              newDir,
              superDirectoriesCheck,
              res,
              initDir
            );
          }
        }
      }
    }
  } catch (err) {
    //Most Errors Generated will be solved with recursive useDirectories Call.
  }
}

//TODO: Define Windows, Linux root dirs. Define other unwanted dirs.
// Objects | All Media | Removes unwanted common directories or root directories from scan.
async function removeObjProps(o) {
  try {
    let v = [
      ".DS_Store",
      "Macintosh HD",
      "System Volume Information",
      "$RECYCLE.BIN",
      "GoogleDrive-100577955551284593046",
      mediaType === "Movies" ? "TV" : "",
    ];
    for (let i = 0; i < v.length; i++) {
      if (Object.values(o).includes(v[i])) {
        delete o[Object.keys(o).splice(Object.values(o).indexOf(v[i]), 1)]
          ? o
          : 0;
      }
    }
  } catch (err) {
    logger.error(err);
  }
}

// Directories | All Media | Verify there are no more sub directories
async function verifyFinalDirectory(path) {
  try {
    for (let i = 0; i < path.length; i++) {
      let directory = readdirSync(path[i].directory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => ({
          // Directory Path:
          directory: path[i].directory + "/" + dirent.name,
          // Media | Books: Authors | Movies & TV: Title |
          media: path[i].media,
          fileName: dirent.name,
        }));
      if (directory.length >= 1) {
        res.write(
          `${counter++}. INFO: Verified Final Directory: ${path[i].directory}\n`
        );
        finalFolderPaths.push(...directory);

        // Recursively Check if more sub directories are found for TV, Photos, Music.
        if (
          mediaType === "TV Shows" ||
          mediaType === "Photos" ||
          mediaType === "Music"
        ) {
          verifyFinalDirectory(directory);
        }
      }
    }
    return finalFolderPaths;
  } catch (err) {
    logger.error(`Error Verifying Directories ${err}`);
  }
}

// Directories | All Media Types | Read Files in Verified Directories
async function readDirectoryContents(paths, mediaCategory, reject) {
  if (loop) {
    logger.info("Reading Directory Files");
  }
  let path = await paths;
  try {
    for (let i = 0; i < path.length; i++) {
      const files = await readdir(path[i].directory);
      // Check Every File in Directory for correct file extension.
      for (const file of files) {
        await verifyFileExtension(
          file,
          !loop ? initialFolderPaths[i] : finalFolderPaths[i],
          mediaCategory,
          reject
        );
      }
    }
    if (mediaType === "Photos" && loop) {
      loop = false;
      await readDirectoryContents(initialFolderPaths, mediaCategory, reject);
    }
  } catch (err) {
    logger.error(`Error Reading File Contents of Directory ${err}`);
    reject(err);
  }
}

// Files | All Media Types | Verify File Extensions Used
// Book Extensions: .epub, .pdf, .doc
// Movie Extensions: .mp4 .mkv
// TV Extensions: .mp4 .mkv
// Photos Extensions: .jpeg .jpg .png .tiff .gif
async function verifyFileExtension(files, paths, mediaCategory, reject) {
  try {
    let title = files
      .replace(".epub", "")
      .replace(".pdf", "")
      .replace(".doc", "")
      .replace(".mp4", "")
      .replace(".mkv", "")
      .replace(".m2ts", "")
      .replace(".jpeg", "")
      .replace(".jpg", "")
      .replace(".png", "")
      .replace(".tiff", "")
      .replace(".gif", "")
      .replace(".mp3", "")
      .replace(".m4a", "")
      .replace(".flac", "");
    // For Books Push Results to Final Array
    if (mediaCategory === "updatebooks") {
      if (path.extname(files) === extensionepub) {
        res.write(
          ` ${counter++}:  Found Book: ${title}, Author: ${
            paths.media
          }, Extension Type ${extensionepub}\n`
        );
        mediaArr.push({
          result: resultNumber++,
          name: title,
          path: paths.directory + "/" + files,
          author: paths.media,
          ext: extensionepub,
        });
      } else if (path.extname(files) === extensionpdf) {
        res.write(
          ` ${counter++}:  Found Book: ${title}, Author: ${
            paths.media
          }, Extension Type ${extensionpdf}\n`
        );
        mediaArr.push({
          result: resultNumber++,
          name: title,
          path: paths.directory + "/" + files,
          author: paths.media,
          ext: extensionpdf,
        });
      } else if (path.extname(files) === extensiondoc) {
        res.write(
          ` ${counter++}:  Found Book: ${title}, Author: ${
            paths.media
          }, Extension Type ${extensiondoc}\n`
        );
        mediaArr.push({
          result: resultNumber++,
          name: title,
          path: paths.directory + "/" + files,
          author: paths.media,
          ext: extensiondoc,
        });
      }
    }
    // For Movies / TV Push Results to Final Array
    if (mediaCategory === "updatemovies" || mediaCategory === "updatetv") {
      if (path.extname(files) === extensionmp4) {
        res.write(
          `${counter++}:  Found ${mediaType}: ${title}, Extension Type ${extensionmp4}\n`
        );
        mediaArr.push({
          result: resultNumber++,
          name: title,
          path: paths.directory + "/" + files,
          ext: extensionmp4,
          season: null,
        });
      } else if (path.extname(files) === extensionmkv) {
        res.write(
          `${counter++}:  Found ${mediaType}: ${title}, Extension Type ${extensionmkv}\n`
        );
        mediaArr.push({
          result: resultNumber++,
          name: title,
          path: paths.directory + "/" + files,
          ext: extensionmkv,
          season: null,
        });
      } else if (path.extname(files) === extensionm2ts) {
        res.write(
          `${counter++}:  Found ${mediaType}: ${title}, Extension Type ${extensionm2ts}\n`
        );
        mediaArr.push({
          result: resultNumber++,
          name: title,
          path: paths.directory + "/" + files,
          ext: extensionm2ts,
          season: null,
        });
      }
    }
    // For Photos | Push Results to Final Array
    if (mediaCategory === "updatephotos") {
      if (path.extname(files) === extensionjpg) {
        mediaArr.push({
          result: resultNumber++,
          name: title,
          Path: paths.directory + "/" + files,
          Ext: extensionjpg,
          Title: title,
          Description: `Image Type: JPG`,
          Creator: `Photographer: N/A`,
          ImageURL: `${paths.directory}/${files}`,
          Length: "N/A",
          Year: null,
        });
      } else if (path.extname(files) === extensionjpeg) {
        mediaArr.push({
          result: resultNumber++,
          name: title,
          Path: paths.directory + "/" + files,
          Ext: extensionjpg,
          Title: title,
          Description: `Image Type: JPEG`,
          Creator: `Photographer: N/A`,
          ImageURL: paths.directory + "/" + files,
          Length: "N/A",
          Year: null,
        });
      } else if (path.extname(files) === extensiongif) {
        mediaArr.push({
          result: resultNumber++,
          name: title,
          Path: paths.directory + "/" + files,
          Ext: extensionjpg,
          Title: title,
          Description: `Image Type: GIF`,
          Creator: `Photographer: N/A`,
          ImageURL: paths.directory + "/" + files,
          Length: "N/A",
          Year: null,
        });
      } else if (path.extname(files) === extensionpng) {
        mediaArr.push({
          result: resultNumber++,
          name: title,
          Path: paths.directory + "/" + files,
          Ext: extensionjpg,
          Title: title,
          Description: `Image Type: PNG`,
          Creator: `Photographer: N/A`,
          ImageURL: paths.directory + "/" + files,
          Length: "N/A",
          Year: null,
        });
      } else if (path.extname(files) === extensiontiff) {
        mediaArr.push({
          result: resultNumber++,
          name: title,
          Path: paths.directory + "/" + files,
          Ext: extensionjpg,
          Title: title,
          Description: `Image Type: TIFF`,
          Creator: `Photographer: N/A`,
          ImageURL: paths.directory + "/" + files,
          Length: "N/A",
          Year: null,
        });
      }
    }

    if (mediaCategory === "updatemusic") {
      if (path.extname(files) === extensionflac) {
        mediaArr.push({
          result: resultNumber++,
          name: title,
          artist: "",
          album: "",
          path: paths.directory + "/" + files,
          ext: extensionflac,
        });
      } else if (path.extname(files) === extensionmp3) {
        mediaArr.push({
          result: resultNumber++,
          name: title,
          artist: "",
          album: "",
          path: paths.directory + "/" + files,
          ext: extensionmp3,
        });
      } else if (path.extname(files) === extensionm4a) {
        mediaArr.push({
          result: resultNumber++,
          name: title,
          artist: "",
          album: "",
          path: paths.directory + "/" + files,
          ext: extensionm4a,
        });
      }
    }
  } catch (err) {
    logger.error(`Error Verifying File Extensions ${err}`);
    reject(err);
  }
}
//////////// End Directory / File Scans

/////////// SANITIZE DATA | ALL MEDIA | Sanitize Titles for API
// Sanitize | Music | Sanitize Music Titles for API
async function sanitizeMusic() {
  logger.info(`Sanitizing Music Titles`);
  return new Promise(async (resolve, reject) => {
    let done = false;
    let musicSanitize = setInterval(() => {
      if (done === true) {
        clearInterval(musicSanitize);
        resolve(done);
      }
    }, 500);
    musicSanitize;
    for (let i = 0; i < mediaArr.length; i++) {
      // Remove Track Numbers
      let firstLetter = mediaArr[i].name.match("[a-zA-Z]");
      let indexOfFirstLetter = mediaArr[i].name.indexOf(firstLetter);
      if (indexOfFirstLetter !== 0) {
        mediaArr[i].name = mediaArr[i].name.slice(indexOfFirstLetter).trim();
      }
      // Replace All & Signs
      else if (mediaArr[i].name.indexOf("&") !== -1) {
        mediaArr[i].name.replaceAll("&", "and");
      }
      //Replace all underscores to space.
      else if (mediaArr[i].name.indexOf("_") !== -1) {
        mediaArr[i].name.replaceAll("_", " ");
      }
      if (i === mediaArr.length - 1) {
        done = true;
      }
    }
  });
}

// Sanitize | Music | Set Music Artist Based on Folder Name
async function setMusicArtist() {
  logger.info(`Setting Music Artist`);
  for (let i = 0; i < mediaArr.length; i++) {
    let lastIndexPath = mediaArr[i].path.lastIndexOf(
      "/",
      mediaArr[i].path.lastIndexOf("/") - 1
    );
    let newPath = mediaArr[i].path.slice(0, lastIndexPath);
    let lastIndexAgain = newPath.lastIndexOf("/");
    let artist = newPath.slice(lastIndexAgain + 1);
    mediaArr[i].artist = artist;
  }
}

// Sanitize | Music | Set Music Album Based on Folder Name
async function setMusicAlbum() {
  logger.info(`Setting Music Album`);
  for (let i = 0; i < mediaArr.length; i++) {
    // Get Album
    let lastIndexPath = mediaArr[i].path.lastIndexOf("/");
    let newPath = mediaArr[i].path.slice(0, lastIndexPath);
    let lastIndexAgain = newPath.lastIndexOf("/");
    let albumNameDirty = newPath.slice(lastIndexAgain + 1);

    // Clean Album
    mediaArr[i].artist = mediaArr[i].artist.replaceAll("&", "and");
    mediaArr[i].artist = mediaArr[i].artist.replaceAll("_", "");
    mediaArr[i].album = albumNameDirty.replaceAll("&", "and");
    mediaArr[i].album = mediaArr[i].album.replaceAll("_", "");
    mediaArr[i].album = mediaArr[i].album.replaceAll("-", " ").trim();
  }
}

// Sanitize | Music | Sort Music By Artist > Album > Songs
async function sortMusic() {
  logger.info(`Sorting Music`);
  let songArray = [];
  let albumArray = [];
  let artistArray = [];
  let trackCount = 0;
  let albumCount = 0;
  let artistCount = 0;
  for (let i = 0; i < mediaArr.length; i++) {
    if (i === mediaArr.length - 1) {
      break;
    }
    // Album has Multiple Songs
    if (mediaArr[i].album === mediaArr[i + 1].album) {
      trackCount++;
      songArray.push({
        TrackNumber: trackCount,
        Track: mediaArr[i].name,
        Path: mediaArr[i].path,
      });
    }
    // Album has One Song
    else {
      trackCount++;
      songArray.push({
        TrackNumber: trackCount,
        Track: mediaArr[i].name,
        Path: mediaArr[i].path,
      });
    }
    // New Album is Found. Push Song Array into Album
    if (mediaArr[i].album !== mediaArr[i + 1].album) {
      albumCount++;
      let lastIndexPath = mediaArr[i].path.lastIndexOf("/");
      let albumPath = mediaArr[i].path.slice(0, lastIndexPath);
      albumArray.push({
        Album: mediaArr[i].album,
        Artist: mediaArr[i].artist,
        Attributes: "",
        Genres: "",
        Year: "",
        Path: albumPath,
        TrackCount: "",
        LocalTrackCount: trackCount,
        HasAllTracks: "",
        Description: "",
        id: "",
        Tracks: songArray,
      });
      songArray = [];
      trackCount = 0;
    }
    // New Artist is Found. Push Albums into Artist
    if (mediaArr[i].artist !== mediaArr[i + 1].artist) {
      let lastIndexPath = mediaArr[i].path.lastIndexOf(
        "/",
        mediaArr[i].path.lastIndexOf("/") - 1
      );
      let artistPath = mediaArr[i].path.slice(0, lastIndexPath);
      artistArray.push({
        Result: artistCount++,
        Artist: mediaArr[i].artist,
        Path: artistPath,
        "Album Count": albumCount,
        Albums: albumArray,
      });
      albumArray = [];
      albumCount = 0;
    }
  }
  mediaArr = artistArray;
}

async function saveMusicToDb() {
  logger.info(`Saving Music To Database`);
  let x = 0;
  let albumSongs = [];
  let songs = [];
  let cmd = {
    cmd: "createIndex",
    collection: "Music Tracks",
    key: "key",
  };
  // Create Database Index on Key
  await databaseAction(cmd);

  for (let i = 0; i < mediaArr.length; i++) {
    if (i === mediaArr.length) {
      break;
    }
    do {
      if (mediaArr[i].Albums.length >= 1) {
        // Save Music Album Info
        await saveToDatabase(
          mediaType,
          mediaArr[i].Albums[x].Album,
          mediaArr[i].Albums[x]
        );
        for (let y = 0; y < mediaArr[i].Albums[x].Tracks.length; y++) {
          // Push Songs / Track Numbers
          songs.push({
            TrackNumber: mediaArr[i].Albums[x].Tracks[y].TrackNumber,
            Song: mediaArr[i].Albums[x].Tracks[y].Track,
            Path: mediaArr[i].Albums[x].Tracks[y].Path,
          });
        }
        albumSongs.push({
          Album: mediaArr[i].Albums[x].Album,
          Artist: mediaArr[i].Artist,
          Songs: JSON.stringify(songs),
        });
        let cmd = {
          cmd: "insertOne",
          collection: "Music Tracks",
          key: mediaArr[i].Albums[x].Album,
          data: albumSongs,
        };
        // Save Music Album Tracks
        await databaseAction(cmd);
        songs = [];
        albumSongs = [];
      }
      x = x + 1;
    } while (x <= mediaArr[i].Albums.length - 1);

    // Reset X
    if (i < mediaArr.length - 1) {
      if (mediaArr[i].Result !== mediaArr[i + 1].Result) {
        x = 0;
      }
    }
  }
}

// Sanitize | Books | Sanitize book titles and removes junk.
async function removeAuthorFromTitle() {
  logger.info(`Removing Author From Title`);
  try {
    for (let i = 0; i < mediaArr.length; i++) {
      let authorReversedLowerCase =
        mediaArr[i].author
          .substring(mediaArr[i].author.indexOf(" "))
          .trim()
          .toLowerCase() +
        " " +
        mediaArr[i].author
          .split(" ", 1)
          .toString()
          .toLowerCase()
          .replace(",", "");

      let authorReversed =
        mediaArr[i].author.substring(mediaArr[i].author.indexOf(" ")).trim() +
        " " +
        mediaArr[i].author.split(" ", 1).toString();

      if (mediaArr[i].name.includes(`${mediaArr[i].author} - `)) {
        // Category 1: Replace Author Name with Dash In Title
        let author = mediaArr[i].author;
        let newTitle = mediaArr[i].name.replace(`${author} - `, "").trim();
        res.write(
          `${counter++}. Sanitized book title. Total sanitized titles: ${fixedTitles++}. Category 1. Total category 1 fixes: ${fixedTitles1++}. 
          New title: ${newTitle}. \n`
        );
        mediaArr[i].name = newTitle;
      }
      // Category 2 Replace Author Name In Title
      else if (mediaArr[i].name.includes(`${mediaArr[i].author}`)) {
        let author = mediaArr[i].author;
        let newTitle = mediaArr[i].name.replace(author, "").trim();
        res.write(
          `${counter++}. Sanitized book title. Total sanitized titles: ${fixedTitles++}. Category 2. Total category 2 fixes: ${fixedTitles2++}. 
          New title: ${newTitle}. \n`
        );
        mediaArr[i].name = newTitle;
      }
      // Category 3 Replace Lower Case Author Name In Title if Reversed
      else if (mediaArr[i].name.includes(authorReversedLowerCase[i])) {
        let author = authorReversedLowerCase;
        let newTitle = mediaArr[i].name.replace(` - ${author}`, "").trim();
        res.write(
          `${counter++}. Sanitized book title. Total sanitized titles: ${fixedTitles++}. Category 3. Total category 3 fixes: ${fixedTitles3++}. 
          New title: ${newTitle}. \n`
        );
        mediaArr[i].name = newTitle;
      }
      // Category 4 Replace Author Name In Title if Reversed
      else if (mediaArr[i].name.includes(authorReversed[i])) {
        let newTitle = mediaArr[i].name
          .replace(` - ${authorReversed}`, "")
          .trim();
        mediaArr[i].name = newTitle;
        res.write(
          `${counter++}. Sanitized book title. Total sanitized titles: ${fixedTitles++}. Category 4. Total category 4 fixes: ${fixedTitles4++}. 
          New title: ${newTitle}. \n`
        );
      }
      // Category 5 Bool Replace Author Name In Title
      else if (
        mediaArr[i].name.includes(
          mediaArr[i].author.substring(mediaArr[i].author.indexOf(" ")).trim() +
            " " +
            mediaArr[i].author.split(" ", 1).toString().replace(",", "")
        )
      ) {
        let author =
          mediaArr[i].author.substring(mediaArr[i].author.indexOf(" ")).trim() +
          " " +
          mediaArr[i].author.split(" ", 1).toString().replace(",", "");
        let newTitle = mediaArr[i].name.replace(author, "").trim();
        res.write(
          `${counter++}. Sanitized book title. Total sanitized titles: ${fixedTitles++}. Category 5. Total category 5 fixes: ${fixedTitles5++}. 
          New title: ${newTitle}. \n`
        );
        mediaArr[i].name = newTitle;
      }
      // Category 6 Remove Converted String In Title
      else if (mediaArr[i].name.includes("(converted from epub)")) {
        let newTitle = mediaArr[i].name.replace("(converted from epub)", "");
        mediaArr[i].name = newTitle;
        res.write(
          `${counter++}. Sanitized book title. Total sanitized titles: ${fixedTitles++}. Category 6. Total category 6 fixes: ${fixedTitles6++}. 
          New title: ${newTitle}. \n`
        );
      }
      // Category 7 Dumb Replace Name
      else if (mediaArr[i].name.includes(" - ray bradbury")) {
        // TODO: Check why this isn't removed earlier... probably space or something dumb..
        let newTitle = mediaArr[i].name.replace(" - ray bradbury", "");
        mediaArr[i].name = newTitle;
        res.write(
          `${counter++}. Sanitized book title. Total sanitized titles: ${fixedTitles++}. Category 7. Total category 7 fixes: ${fixedTitles7++}. 
          New title: ${newTitle}. \n`
        );
      }
    }
  } catch (err) {
    logger.error("Error Adjusting Titles: ", err);
  }
}

// Sanitize | Photos | Set Image Resolution.
async function getImageSize() {
  for (let i = 0; i < mediaArr.length; i++) {
    let dimensions = await sizeOf(mediaArr[i].Path);
    mediaArr[i].Length = `Resolution: ${dimensions.width}x${dimensions.height}`;
  }
}

async function getFileCreatedDate() {
  return new Promise(async (resolve, reject) => {
    let done = false;
    setInterval(() => {
      if (done === true) {
        resolve(done);
      }
    }, 500);

    for (let i = 0; i < mediaArr.length; i++) {
      fs.stat(mediaArr[i].Path, async (err, stats) => {
        if (err) {
          logger.error("Error Getting File Stats: ", err);
          reject(err);
        } else {
          mediaArr[i].Year = `Created: ${stats.birthtime
            .toString()
            .slice(0, 15)}`;
        }
        if (i === mediaArr.length - 1) {
          done = true;
        }
      });
    }
  });
}

let notfound = 0;
// Sanitize | Movies | Removes unwanted characters from titles
async function sanitizeMovieTvTitles() {
  for (let i = 0; i < mediaArr.length; i++) {
    let movieName = mediaArr[i].name;
    let replaceExtra = await movieName
      .replaceAll(".", " ")
      .replace("INTERNAL", "")
      .replace("WEBRip", "")
      .replace("REMASTERED", "")
      .replace("PROPER", "")
      .replace("DUBBED", "")
      .replace("BluRay", "")
      .replace("Directors Cut", "")
      .replace("UHD", "")
      .replace("The Final Cut", "")
      .replace("DC", "")
      .replace("Redux", "")
      .replace("UNCUT", "")
      .replace("MULTI", "")
      .replace("RERIP", "")
      .replace("RERiP", "")
      .replace("THEATRICAL", "")
      .replace("hdr", "")
      .replace("EXTE", "")
      .replace("KO", "")
      .replace("SWE", "")
      .replace("HDR10Plus", "")
      .replace("GE", "")
      .replace("DVDRip", "")
      .replace("dvdrip x264-bipolar", "")
      .replace("WwW SeeHD PL_", "")
      .replace(" - Film Noir 1950 Eng", "")
      .trim();

    // Create Final Media Name For TV Shows
    if (mediaType === "TV Shows") {
      let titleWasBlank = replaceExtra;
      // Index Season 0-9
      let sliceTvTitle =
        replaceExtra.indexOf("S0") === -1
          ? replaceExtra.indexOf("s0")
          : replaceExtra.indexOf("S0");

      // Index Season 10-19
      let sliceTvTitleSeason1 =
        replaceExtra.indexOf("S1") === -1
          ? replaceExtra.indexOf("s1")
          : replaceExtra.indexOf("S1");

      // Index Season 20-29
      let sliceTvTitleSeason2 =
        replaceExtra.indexOf("S2") === -1
          ? replaceExtra.indexOf("s2")
          : replaceExtra.indexOf("S2");

      // Show Season Number
      let season = replaceExtra.slice(sliceTvTitle, sliceTvTitle + 6);
      mediaArr[i].season = season;

      // Remove Season 0-9
      removeSeason = replaceExtra.slice(0, sliceTvTitle).trim();

      // Remove Season 10-19
      if (replaceExtra.indexOf("S1") !== -1) {
        removeSeason = replaceExtra.slice(0, sliceTvTitleSeason1).trim();
      }

      // Remove Season 20-29
      if (replaceExtra.indexOf("S2") !== -1) {
        removeSeason = replaceExtra.slice(0, sliceTvTitleSeason2).trim();
      }

      // Title Was Blank (Season Was At Start of Title) Remove Season at Start
      if (removeSeason === "") {
        // Try To Remove if Title has Dash.
        if (titleWasBlank.toLowerCase().indexOf("-") !== -1) {
          removeSeason = titleWasBlank
            .slice((await titleWasBlank.toLowerCase().indexOf("-")) + 1)
            .trim();

          // Title has 2nd Dash Check
          if (removeSeason.toLowerCase().indexOf("-") !== -1) {
            removeSeason = removeSeason
              .slice((await removeSeason.toLowerCase().indexOf("-")) + 1)
              .trim();
          }
        }
        // Title Doesn't have Dash Try to Remove at e0 e1 e2 e3
        else if (titleWasBlank.toLowerCase().indexOf("e0") !== -1) {
          removeSeason = titleWasBlank
            .slice((await titleWasBlank.toLowerCase().indexOf("e0")) + 1)
            .trim();
        } else if (titleWasBlank.toLowerCase().indexOf("e1") !== -1) {
          removeSeason = titleWasBlank
            .slice((await titleWasBlank.toLowerCase().indexOf("e1")) + 1)
            .trim();
        } else if (titleWasBlank.toLowerCase().indexOf("e2") !== -1) {
          removeSeason = titleWasBlank
            .slice((await titleWasBlank.toLowerCase().indexOf("e2")) + 1)
            .trim();
        } else if (titleWasBlank.toLowerCase().indexOf("e3") !== -1) {
          removeSeason = titleWasBlank
            .slice((await titleWasBlank.toLowerCase().indexOf("e3")) + 1)
            .trim();
        }
        // No Episode Found -- Ignore for now.
        else {
          logger.info(`Nothing Found ${notfound++} Title ${titleWasBlank}`);
        }
      }

      let bracketIndexStart = await removeSeason.indexOf("[");
      let bracketIndexEnd = await removeSeason.indexOf("]");
      if (bracketIndexStart !== -1 && bracketIndexEnd !== -1) {
        let afterBracketIndex = removeSeason.indexOf("]" + 1);
        // Text After Brackets
        if (afterBracketIndex !== -1) {
          removeBrackets = await removeSeason.slice(bracketIndexEnd).trim();
        }
        // Text Before Brackets
        else {
          removeBrackets = await removeSeason.slice(bracketIndexEnd + 1).trim();
        }
      }

      // Remove After Parentheses
      let parenthesesIndex = removeSeason.indexOf("(");
      if (parenthesesIndex !== -1) {
        try {
          if (removeBrackets !== undefined) {
            removeParentheses = removeBrackets
              .slice(0, parenthesesIndex)
              .trim();
            // Remove Dash If Found
            if (removeParentheses.indexOf("-") !== -1) {
              removeDash = removeParentheses.replace("-", " ").trim();
              mediaArr[i].name = removeDash;
            }
            // No Dash Found
            else {
              mediaArr[i].name = removeParentheses;
            }
          }
        } catch (err) {
        } finally {
          // Remove Brackets Was Not Used - Remove Dash
          if (removeSeason.indexOf("-") !== -1) {
            removeDash = removeSeason.replace("-", " ").trim();
            mediaArr[i].name = removeDash;
          }
          // No Dash Found
          else {
            mediaArr[i].name = removeSeason.slice(0, parenthesesIndex).trim();
          }
        }
      } else {
        try {
          if (removeBrackets !== undefined) {
            if (removeBrackets.indexOf("-") !== -1) {
              removeDash = removeBrackets.replace("-", " ").trim();
              mediaArr[i].name = removeDash;
            }
          }
        } catch (err) {
        } finally {
          if (removeSeason.indexOf("-") !== -1) {
            removeDash = removeSeason.replace("-", " ").trim();
            mediaArr[i].name = removeDash;
          } else {
            mediaArr[i].name = removeSeason;
          }
        }
      }

      res.write(
        `${counter++}. Sanitized TV Show title. Total sanitized titles: ${fixedTitles++}. 
        New title: ${mediaArr[i].name}. \n`
      );
    }
    //Create Final Media Name for Movies
    else if (mediaType === "Movies") {
      // Sanitize Movie Titles | Category 1: Has 1080p in name.
      if ((await replaceExtra.indexOf(removeHd)) !== -1) {
        let index1080p = replaceExtra.indexOf(removeHd);
        let remove1080p = await replaceExtra.slice(0, index1080p).trim();
        let finalName = remove1080p.slice(0, -4).trim();
        mediaArr[i].name = finalName;
        res.write(
          `${counter++}. Sanitized movie title. Total sanitized titles: ${fixedTitles++}. Category 1. Total category 1 title fixes: ${fixedTitles1++} 
          New title: ${finalName}. \n`
        );
      }
      // Sanitize Movie Titles | Category 2: Has 2160p in name.
      else if ((await replaceExtra.indexOf(remove4k)) !== -1) {
        let index2160p = await replaceExtra.indexOf(remove4k);
        let finalName = await replaceExtra.slice(0, index2160p).trim();
        mediaArr[i].name = finalName;
        res.write(
          `${counter++}. Sanitized movie title. Total sanitized titles: ${fixedTitles++}. Category 2. Total category 2 title fixes: ${fixedTitles2++} 
          New title: ${finalName}. \n`
        );
      }
      // Sanitize Movie Titles | Category 3: Has 720p in name.
      else if ((await replaceExtra.indexOf(remove720)) !== -1) {
        let index720p = await replaceExtra.indexOf(remove720);
        let finalName = await replaceExtra.slice(0, index720p).trim();
        mediaArr[i].name = finalName;
        res.write(
          `${counter++}. Sanitized movie title. Total sanitized titles: ${fixedTitles++}. Category 3. Total category 3 title fixes: ${fixedTitles3++} 
          New title: ${finalName}. \n`
        );
      }
      // Sanitize Movie Titles | Category 4: The rest...
      else {
        mediaArr[i].name = replaceExtra;
        res.write(
          `${counter++}. Sanitized movie title. Total sanitized titles: ${fixedTitles++}. Category 4. Total category 4 title fixes: ${fixedTitles4++} 
          New title: ${replaceExtra}. \n`
        );
      }
    }
  }
}

// Sanitize | TV Shows | Dedupe TV Shows.
async function deDupeTitles() {
  logger.info(`Deduping Titles`);
  let round = 0;
  for (let i = 0; i < mediaArr.length; i++) {
    let title = mediaArr[i].name.toLowerCase();
    let titleLength = title.length;
    round++;

    for (let x = 0; x < mediaArr.length; x++) {
      if (title.includes(mediaArr[x].name.toLowerCase())) {
        let titleLengthTwo = mediaArr[x].name.length;

        // Use Shortest Title Found
        if (titleLength < titleLengthTwo) {
          mediaArr[i].name = title;
        } else {
          mediaArr[i].name = mediaArr[x].name;
        }
      }
    }
  }
}

// Sanitize | TV Shows | Check Folder Path against Title. If no match use folder title to prevent episode as Title
async function preventEpisodeAsTitle() {
  logger.info(
    `Prevent Episode as Title: Checking Folder Name Against Show Name.`
  );
  for (let i = 0; i < mediaArr.length; i++) {
    // Remove Last Folder of Path
    let pathIndexChecker = mediaArr[i].path.lastIndexOf("/");
    let checkPath = mediaArr[i].path.slice(0, pathIndexChecker).toLowerCase();
    // Remove Path up to TV Show Folder
    let tvFolderIndex = checkPath.lastIndexOf("/tv shows");
    let removeTvFolder = checkPath.slice(tvFolderIndex + 10);
    // Use Folder Name of TV Show Assuming it was After TV Shows Folder
    let setTitleIndex = removeTvFolder.indexOf("/");
    let showFolderTitle = removeTvFolder
      .slice(0, setTitleIndex)
      .toLowerCase()
      .replace("(", "")
      .replace(")", "")
      .replace(".", " ")
      .replace("720p", "")
      .replace("1080p", "")
      .replace("2160p", "")
      .replace("2160", "")
      .replace("1080", "")
      .trim();

    // If Folder Name Includes Season Get Index of Season
    let seasonIndex = showFolderTitle.lastIndexOf("s0");
    // TODO: Cleanup Assumptions Later. Check Show Title I+1 Against Path.
    if (seasonIndex !== -1) {
      let showTitle = showFolderTitle.slice(0, seasonIndex - 1);
      // If TV Show Folder does NOT include Title of Show Use TV Folder Name.
      if (!mediaArr[i].name.toLowerCase().includes(showTitle)) {
        mediaArr[i].name = showTitle;
      }
    } else if (!mediaArr[i].name.toLowerCase().includes(showFolderTitle)) {
      mediaArr[i].name = showFolderTitle;
    }
  }
}

// Sanitize | TV Shows | Order TV Shows by Name > Season > Episode.
async function orderBySeason() {
  logger.info(`Ordering TV Show by Season.`);
  let numberOfShows = 0;
  // Split TV Shows by Name and Episodes
  for (let i = 0; i < mediaArr.length; i++) {
    // Push Next TV Show Name if not equal to previous.
    try {
      if (
        mediaArr[i + 1].name.toLowerCase() !== mediaArr[i].name.toLowerCase()
      ) {
        // Media Name has Year use Year for Search else Year = null
        let firstDigit = mediaArr[i].name.search(/\d/);
        let year = mediaArr[i].name.slice(firstDigit, firstDigit + 4);
        year.length === 4
          ? ((year = year),
            (mediaArr[i].name = mediaArr[i].name.slice(0, firstDigit).trim()))
          : (year = null);
        year === "" ? (year = null) : (year = year);

        // Set Root Path to be Correct Directory
        let pathIndexChecker = mediaArr[i].path.lastIndexOf("/");
        let path = mediaArr[i].path.slice(0, pathIndexChecker).toLowerCase();

        path.toLowerCase().includes("season") === true
          ? (path = path.slice(0, path.toLowerCase().lastIndexOf("/")))
          : path;

        tvShow.push({
          result: numberOfShows++,
          name: mediaArr[i].name,
          year: year === null ? null : year,
          path: path,
          content: null,
        });
      }
    } catch (err) {
      logger.error(`Error Pushing TV Show Name ${err}`);
    }

    let season;
    let episode;
    let seasonPathIndex;
    // Check if Season is undefined. If it is try to use season from path.
    if (mediaArr[i].season === "" || mediaArr[i].season === undefined) {
      // Get Index of s0, s1, s2, etc.. in Path and Slice Out Season / Episode
      for (let z = 0; z < 10; z++) {
        seasonPathIndex = mediaArr[i].path.toLowerCase().indexOf(`s${z}`);
        if (seasonPathIndex !== -1) {
          break;
        } else if (z === 9 && seasonPathIndex === -1) {
          season = "N/A";
          episode = "N/A";
        }
      }
      // Season Was Not In Path
      if (seasonPathIndex === -1) {
        season = "N/A";
        episode = "N/A";
      }
      // Season Found In Path
      else {
        season = mediaArr[i].path.slice(
          seasonPathIndex + 1,
          seasonPathIndex + 3
        );
        episode = mediaArr[i].path.slice(
          seasonPathIndex + 4,
          seasonPathIndex + 6
        );
        episode = parseInt(episode);
        Number.isInteger(episode) === true
          ? (episode = episode)
          : (episode = "N/A");
      }
    }
    // Season was defined use season
    else {
      season = mediaArr[i].season.slice(1, 3);
      episode = mediaArr[i].season.slice(4);
    }

    // Push All TV Episodes
    tvSeason.push({
      name: mediaArr[i].name,
      season: season,
      episode: episode,
      path: mediaArr[i].path,
      ext: mediaArr[i].ext,
    });
  }

  // Map TV Show Name with Seasons > Episodes
  for (let x = 0; x < tvShow.length; x++) {
    for (let i = 0; i < tvSeason.length; i++) {
      if (tvShow[x].name === tvSeason[i].name) {
        try {
          // New Season In Loop: Map Season > Episodes
          if (tvSeason[i].season !== tvSeason[i + 1].season) {
            episodeObj.push({
              Season: tvSeason[i].season,
              Episode: tvSeason[i].episode,
              Path: tvSeason[i].path,
              Ext: tvSeason[i].ext,
            });

            // We have multiple seasons: Push episode object into seasons object.
            seasonObj.push({
              Key: seasonsKey++,
              Season: parseInt(tvSeason[i].season),
              Episodes: episodeObj,
            });

            episodeObj = [];
          }
          // One Season in Loop: Map Episodes
          else if (tvShow[x].name === tvSeason[i].name) {
            episodeObj.push({
              Season: tvSeason[i].season,
              Episode: tvSeason[i].episode,
              Path: tvSeason[i].path,
              Ext: tvSeason[i].ext,
            });
          }
        } catch (err) {
          logger.error(err);
        }

        // Map TV Show Result #, Title, > Season Obj > Episodes
        try {
          if (tvShow[x].name !== tvSeason[i + 1].name) {
            // We only have 1 Season Push Episode Object
            if (seasonObj.length === 0) {
              showObj.push({
                Data: {
                  Key: seasonsKey++,
                  Season: parseInt(tvSeason[i].season),
                  Episodes: episodeObj,
                },
              });
            }
            // We have multiple seasons. Push Season Object
            else {
              showObj.push({ Data: { seasonObj } });
            }

            // Assign Episodes to TV Show.
            try {
              tvShow[x].content = showObj;
            } catch (err) {
              logger.error(`Error Mapping TV Show: ${err}`);
            }
            // Reset Variables for Next Show
            seasonObj = [];
            episodeObj = [];
            showObj = [];
            seasons = 1;
            seasonsKey = 1;
          }
        } catch (err) {
          logger.error(err);
        }
      }
    }
  }
  mediaArr = tvShow;
}
/////////// END SANITIZE DATA

// Set Media Categories | All Media Types | Sets Media Category to be used in response to client.
function setCategory(mediaCategory) {
  if (mediaCategory === "updatemovies") {
    mediaType = "Movies";
  } else if (mediaCategory === "updatetv") {
    mediaType = "TV Shows";
  } else if (mediaCategory === "updatemusic") {
    mediaType = "Music";
  } else if (mediaCategory === "updatebooks") {
    mediaType = "Books";
  } else if (mediaCategory === "updatephotos") {
    mediaType = "Photos";
  }
}

// Global Variable Reset | All Media | Resets global variables for each new scan.
function resetGlobalVariables() {
  // Reset Global Variables
  initialFolderPaths = [];
  finalFolderPaths = [];
  mediaArr = [];
  counter = 1;
  resultNumber = 1;
  scanCompleted = false;
  fixedTitles = 1;
  fixedTitles1 = 1;
  fixedTitles2 = 1;
  fixedTitles3 = 1;
  fixedTitles4 = 1;
  fixedTitles5 = 1;
  fixedTitles6 = 1;
  fixedTitles7 = 1;
  loop = true;
  tvShow = [];
  tvSeason = [];
  logger.silent(`Scan Media Global Variables Reset.`);
}

// Performance Metric | All Media | Saves time to complete each scan and time each function took to complete
function saveScanTime(fn) {
  if (fn === "end") {
    let endScanTimeData = ` \n`;
    writeScanTime(endScanTimeData);
  } else if (fn === "start") {
    let startScanTimeData = `New ${mediaType} Scan. ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    writeScanTime(startScanTimeData);
  } else {
    const version = "v3";
    let scanTimeData = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Media Type ${mediaType}. Function: ${fn}. Time eplasted: ${scanTime} seconds. ${version}\n`;
    writeScanTime(scanTimeData);
  }
}

// Performance Metric | All Media | Appends Scan Data to Scan Log.
function writeScanTime(scanTimeData) {
  fs.appendFile("./scanmedia/scantime.txt", scanTimeData, (err) => {
    if (err) {
      if (err.errno === -2) {
        logger.info(`No Scan Time File To Write To. Creating File.`);
        fs.writeFile(`./scanmedia/scantime.txt `, scanTimeData, (err) => {
          if (err) {
            logger.error(`ERROR: Scan Time File Could Not Be Created.`);
          }
        });
      } else {
        logger.error("Error saving scan time Error: ", err);
      }
    } else {
      // We saved scan time.
    }
  });
}

// Title Fix Response | All Media | Sends Title Categories Fixed.
async function sendCategoryFixes(res) {
  if (mediaType === "Movies") {
    res.write(`\nINFO: Titles Updated ${fixedTitles}, 
    Category 1 Titles Fixed: ${fixedTitles1}.
    Category 2 Titles Fixed: ${fixedTitles2}.
    Category 3 Titles Fixed: ${fixedTitles3}.
    Category 4 Titles Fixed: ${fixedTitles4}.
    \n`);
  } else if (mediaType === "Books") {
    res.write(`\nINFO: Titles Updated ${fixedTitles}, 
    Category 1 Titles Fixed: ${fixedTitles1}.
    Category 2 Titles Fixed: ${fixedTitles2}.
    Category 3 Titles Fixed: ${fixedTitles3}.
    Category 4 Titles Fixed: ${fixedTitles4}.
    Category 5 Titles Fixed: ${fixedTitles5}.
    Category 6 Titles Fixed: ${fixedTitles6}.
    Category 7 Titles Fixed: ${fixedTitles7}.
    \n`);
  } else if (mediaType === "TV Shows") {
    res.write(`\nINFO: Titles Updated ${fixedTitles}\n`);
  } else if (mediaType === "Music") {
  }
}

module.exports = { startScan };
