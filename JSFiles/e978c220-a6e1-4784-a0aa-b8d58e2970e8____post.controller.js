/**
 * Created by andh on 1/29/17.
 */
import Post from '../models/post.model';
// const User = require('mongoose').model('User');
const npp = 13;
const formidable = require('formidable');
// const dir = 'sources/img';
import graphicMagick from 'gm';
const gm = graphicMagick.subClass({ imageMagick: true });
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import serverConfig from '../configs/server.config';
import mkdirp from 'mkdirp';
const exec = require('child_process').exec;
// size
const WIDTH_MEDIACONTENT = 600;
const WIDTH_THUMB = 460;
const HEIGHT_THUMB = 300;
const WIDTH_SMALLTHUMB = 300;
const HEIGHT_SMALLTHUMB = 157;
const getErrorMessage = (err) => {
  // console.log(err);
  let messages = [];
  if (err) {
    if (err.code) {
      switch (err.code) {
        case 11000:
        case 11001:
          messages = ['URL is exist'];
          break;
        default:
          break;
      }
    } else {
      for (const errName of err.errors) {
        err.errors[errName].message && messages.push(err.errors[errName].message);
      }
    }
  }
  return messages;
};
const configAggregation = (sortType, aggregation) => {
  if (sortType === 'created') {
    aggregation.sort = {
      created: -1,
    };
  } else if (sortType === 'top') {
    aggregation.project.top = {
      // $add: [
      // {
      $abs: '$viewLength',
      // },
      //   {
      //     $multiply: [
      //       {
      //         $size: '$shares',
      //       }, 2,
      //     ],
      //   },
      // ],
    };
    aggregation.sort = {
      viewsLength: -1,
    };
  } else {
    aggregation.project.hot = {
      $add: [
        {
          $multiply: [
            {
              $cond: [
                {
                  $gt: ['$votesLength', 0],
                }, {
                  $cond: [
                    {
                      $lt: ['$votesLength', 0],
                    }, 0, 1,
                  ],
                }, -1,
              ],
            }, {
              $log: [
                {
                  $max: [
                    {
                      $abs: '$votesLength',
                    }, 1,
                  ],
                }, 10,
              ],
            },
          ],
        }, {
          $divide: [
            {
              $divide: [
                {
                  $subtract: ['$created', new Date('2005-12-8')],
                }, 1000,
              ],
            }, 46000,
          ],
        },
      ],
    };
    aggregation.sort = {
      hot: -1,
    };
  }
};
exports.hasAuthorization = (req, res, next) => {
  if (req.post.creator._id !== parseInt(req.user._id, 10) && req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res
      .status(403)
      .send({ messages: ["You aren't Creator"] });
  }
  next();
  return null;
};
exports.listPosts = (req, res) => {
  if (req.query.order === 'top') {
    const paging = parseInt(req.query.paging, 10) || npp;
  // console.log('paging', paging);
    const page = parseInt(req.query.page, 10) || 1;
    const skip = page > 0 ? ((page - 1) * paging) : 0;
    const conds = [];
    if (!req.query.user || parseInt(req.query.user, 10) !== req.user._id) {
      if (req.query.review) {
        conds.push({ review: true });
      } else {
        conds.push({ publish: true });
      }
    }
    req.query.category && conds.push({ categories: req.query.category });
    if (req.query.recommendations && req.user._id) {
      if (req.user.recommendations) {
        const cateList = [];
        req.user.recommendations.forEach((recommendation) => {
          cateList.push({ categories: recommendation });
        });
        if (cateList.length) {
          conds.push({ $or: cateList });
        }
      }
    }
    req.query.user && conds.push({ creator: parseInt(req.query.user, 10) });
    req.query.text && conds.push({
      $or: [
        {
          title: {
            $regex: req.query.text, $options: 'i',
          },
        }, {
          description: {
            $regex: req.query.text, $options: 'i',
          },
        },
      ],
    });
    conds.push({ processed: true });
    let match = null;
    if (!conds.length) {
      match = {};
    } else if (conds.length === 1) {
      match = conds.pop();
    } else {
      match = {
        $and: conds,
      };
    }
    // https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111
    // e33d0d9#.hkka5wx3i
    const aggregation = {};
    aggregation.project = {
      title: 1, type: 1, categories: 1,
    };
    const propertiesMediaContent = {
      mediaContent: 1, mediaContentLQ: 1, mediaContentHeight: 1, mediaContentWidth: 1, votes: 1, votesLength: 1,
    };
    const propertiesThumb = {
      thumb: 1, thumbLQ: 1, thumbHeight: 1, thumbWidth: 1,
    };
    // const propertiesSmallThumb = {
    //   smallThumb: 1, smallThumbLQ: 1, smallThumbHeight: 1, smallThumbWidth: 1,
    // };
    const propertiesDetailInfo = {
      created: 1,
      description: 1,
      shares: 1,
      follows: 1,
      votesLength: 1,
      viewsLength: 1,
      // numComment: 1,
      creator: 1,
    };
    // if (req.query.type === 'mediaContent') {
    aggregation.project = {
      ...aggregation.project, ...propertiesMediaContent, ...propertiesDetailInfo, ...aggregation.project, ...propertiesThumb,
    };
    // } else if (req.query.type === 'thumb') {
    //   aggregation.project = {
    //     ...aggregation.project, ...propertiesThumb, ...propertiesDetailInfo, ...propertiesMediaContent, ...propertiesDetailInfo,
    //   };
    // } else if (req.query.type === 'smallThumb') {
    //   aggregation.project = {
    //     ...aggregation.project, ...propertiesSmallThumb, ...propertiesMediaContent, ...propertiesDetailInfo,
    //   };
    // }
    // console.log((new Date).getTime());
    configAggregation(req.query.order, aggregation);
    Post.aggregate([
      {
        $match: match,
        // }, {
        //   $lookup: {
        //     from: 'users', localField: 'creator', foreignField: '_id', as: 'creator',
        //   },
      }, {
        $project: aggregation.project,
      }, // Sorting pipeline
      {
        $sort: aggregation.sort,
      },
      {
        $skip: skip,
      }, // Optionally limit results
      {
        $limit: (paging),
      },
    ], (err, results) => {
      // console.log(results);
      if (err) {
        // console.log(err);
        return res
          .status(400)
          .send();
      }
      if (results.length === 0) {
        return res
          .status(404)
          .send();
      }
      // return res.json(results);
      return res.json({
        postsChunk: results,
        hasNext: results.length === 13,
      });
    });
    return null;
  }
  // const paging = parseInt(req.query.paging, 10) || npp;
  // console.log('paging', paging);
  const page = parseInt(req.query.page, 10) || 1;
  // const skip = page > 0 ? ((page - 1) * paging) : 0;
  const conds = [];
  if (!req.query.user || parseInt(req.query.user, 10) !== req.user._id) {
    if (req.query.review) {
      conds.push({ review: true });
    } else {
      conds.push({ publish: true });
    }
  }
  req.query.category && conds.push({ categories: req.query.category });
  if (req.query.recommendations && req.user._id) {
    if (req.user.recommendations) {
      const cateList = [];
      req.user.recommendations.forEach((recommendation) => {
        cateList.push({ categories: recommendation });
      });
      if (cateList.length) {
        conds.push({ $or: cateList });
      }
    }
  }
  req.query.user && conds.push({ creator: parseInt(req.query.user, 10) });
  req.query.text && conds.push({
    $or: [
      {
        title: {
          $regex: req.query.text, $options: 'i',
        },
      }, {
        description: {
          $regex: req.query.text, $options: 'i',
        },
      },
    ],
  });
  conds.push({ processed: true });
  let match = null;
  if (!conds.length) {
    match = {};
  } else if (conds.length === 1) {
    match = conds.pop();
  } else {
    match = {
      $and: conds,
    };
  }
  // https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111
  // e33d0d9#.hkka5wx3i
  const aggregation = {};
  aggregation.project = {
    title: 1, type: 1, categories: 1,
  };
  const propertiesMediaContent = {
    mediaContent: 1, mediaContentLQ: 1, mediaContentHeight: 1, mediaContentWidth: 1, votes: 1, votesLength: 1,
  };
  const propertiesThumb = {
    thumb: 1, thumbLQ: 1, thumbHeight: 1, thumbWidth: 1,
  };
  // const propertiesSmallThumb = {
  //   smallThumb: 1, smallThumbLQ: 1, smallThumbHeight: 1, smallThumbWidth: 1,
  // };
  const propertiesDetailInfo = {
    created: 1,
    description: 1,
    shares: 1,
    follows: 1,
    votesLength: 1,
    viewsLength: 1,
    // numComment: 1,
    creator: 1,
  };
  // if (req.query.type === 'mediaContent') {
  aggregation.project = {
    ...aggregation.project, ...propertiesMediaContent, ...propertiesDetailInfo, ...aggregation.project, ...propertiesThumb,
  };
  // } else if (req.query.type === 'thumb') {
  //   aggregation.project = {
  //     ...aggregation.project, ...propertiesThumb, ...propertiesDetailInfo, ...propertiesMediaContent, ...propertiesDetailInfo,
  //   };
  // } else if (req.query.type === 'smallThumb') {
  //   aggregation.project = {
  //     ...aggregation.project, ...propertiesSmallThumb, ...propertiesMediaContent, ...propertiesDetailInfo,
  //   };
  // }
  // console.log((new Date).getTime());
  configAggregation(req.query.order, aggregation);
  Post.aggregate([
    {
      $match: match,
      // }, {
      //   $lookup: {
      //     from: 'users', localField: 'creator', foreignField: '_id', as: 'creator',
      //   },
    }, {
      $project: aggregation.project,
    }, // Sorting pipeline
    {
      $sort: aggregation.sort,
    }, // {
    //   $skip: skip,
    // }, // Optionally limit results
    // {
    //   $limit: (paging),
    // },
  ], (err, results) => {
    // console.log(results);
    if (err) {
      // console.log(err);
      return res
        .status(400)
        .send();
    }
    if (results.length === 0) {
      return res
        .status(404)
        .send();
    }
    // res.json(results);
    const numPhotos = 9;
    const numLists = 1;
    const numGifs = 3;
    let photosCount = numPhotos * page;
    let listsCount = numLists * page;
    let gifsCount = numGifs * page;
    let lists = [];
    let photos = [];
    let gifs = [];
    let isEnough = false;
    for (let i = 0; i < results.length; i++) {
      if (photosCount > 0 || listsCount > 0 || gifsCount > 0) {
        if (results[i].type === 'photo' && photosCount > 0) {
          if (photosCount <= numPhotos) {
            photos.push(results[i]);
          }
          photosCount--;
        } else if (results[i].type === 'list' && listsCount > 0) {
          if (listsCount <= numLists) {
            lists.push(results[i]);
          }
          listsCount--;
        } else if (results[i].type === 'gif' && gifsCount > 0) {
          if (gifsCount <= numGifs) {
            gifs.push(results[i]);
          }
          gifsCount--;
        }
      }
      if (photosCount === 0 && listsCount === 0 && gifsCount === 0) {
        // const mediaContent = [...photos, ...lists, ...gifs];
        // return res.json(posts);
        isEnough = true;
        break;
      }
    }
    // let posts = [...photos, ...lists, ...gifs];

    // const mediaContent = [];
    // for (let j = 0; j < 9; j++) {
    //   mediaContent.push(photos[j]);
    //   if (j % 3 === 2) {
    //     mediaContent.push(gifs[Math.floor(j / 3)]);
    //   }
    // }
    // mediaContents.push(lists[0]);

    // return res.json(posts);
    // posts = posts.map((post) => { return new Post(post); });
    // Post.populate(posts, {
    //   path: 'creator',
    //   select: 'displayName  username avatar',
    // }, (err1, data) => {
    //   if (err1) return res.status(403).send({ message: err1 });
    //   return res.json(data);
    // });
    // return null;
    if (isEnough) {
      photos = photos.map((photo) => { return new Post(photo); });
      Post.populate(photos, {
        path: 'creator',
        select: 'displayName username avatar',
      }, (err1, photosExt) => {
        if (err1) return res.status(403).send({ message: err1 });
        lists = lists.map((list) => { return new Post(list); });
        Post.populate(lists, {
          path: 'creator',
          select: 'displayName  username avatar',
        }, (err2, listsExt) => {
          if (err2) return res.status(403).send({ message: err2 });
          gifs = gifs.map((gif) => { return new Post(gif); });
          Post.populate(gifs, {
            path: 'creator',
            select: 'displayName  username avatar',
          }, (err3, gifsExt) => {
            if (err3) return res.status(403).send({ message: err3 });

            const postsExt = [];
            for (let j = 0; j < 9; j++) {
              postsExt.push(photosExt[j]);
              if (j % 3 === 2) {
                postsExt.push(gifsExt[Math.floor(j / 3)]);
              }
            }
            postsExt.push(listsExt[0]);
            return res.json({
              postsChunk: postsExt,
              hasNext: true,
            });
          });
          return null;
        });
        return null;
      });
    } else {
      const posts = [...photos, ...lists, ...gifs];
      Post.populate(posts, {
        path: 'creator',
        select: 'displayName username avatar',
      }, (err1, postsExt) => {
        if (err1) return res.status(403).send({ message: err1 });
        return res.json({
          postsChunk: postsExt,
          hasNext: photos.length === 9,
        });
      });
    }
    return null;
  });

  return null;
};


exports.listRecommendPosts = (req, res) => {
  const paging = parseInt(req.query.paging, 10) || npp;
  // console.log('paging', paging);
  const page = parseInt(req.query.page, 10) || 1;
  const skip = page > 0 ? ((page - 1) * paging) : 0;
  const conds = [];
  if (!req.query.user || parseInt(req.query.user, 10) !== req.user._id) {
    if (req.query.review) {
      conds.push({ review: true });
    } else {
      conds.push({ publish: true });
    }
  }
  req.query.category && conds.push({ categories: req.query.category });
  if (req.query.recommendations && req.user._id) {
    if (req.user.recommendations) {
      const cateList = [];
      req.user.recommendations.forEach((recommendation) => {
        cateList.push({ categories: recommendation });
      });
      if (cateList.length) {
        conds.push({ $or: cateList });
      }
    }
  }
  req.query.user && conds.push({ creator: parseInt(req.query.user, 10) });
  req.query.text && conds.push({
    $or: [
      {
        title: {
          $regex: req.query.text, $options: 'i',
        },
      }, {
        description: {
          $regex: req.query.text, $options: 'i',
        },
      },
    ],
  });
  conds.push({ processed: true });
  let match = null;
  if (!conds.length) {
    match = {};
  } else if (conds.length === 1) {
    match = conds.pop();
  } else {
    match = {
      $and: conds,
    };
  }
  // https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111
  // e33d0d9#.hkka5wx3i
  const aggregation = {};
  aggregation.project = {
    title: 1, type: 1, categories: 1,
  };
  const propertiesMediaContent = {
    mediaContent: 1, mediaContentLQ: 1, mediaContentHeight: 1, mediaContentWidth: 1, votes: 1, votesLength: 1,
  };
  // const propertiesThumb = {
  //   thumb: 1, thumbLQ: 1, thumbHeight: 1, thumbWidth: 1,
  // };
  const propertiesSmallThumb = {
    smallThumb: 1, smallThumbLQ: 1, smallThumbHeight: 1, smallThumbWidth: 1,
  };
  const propertiesDetailInfo = {
    created: 1,
    description: 1,
    shares: 1,
    follows: 1,
    votesLength: 1,
    viewsLength: 1,
    // numComment: 1,
    creator: 1,
  };
  // if (req.query.type === 'mediaContent') {
  //   aggregation.project = {
  //     ...aggregation.project, ...propertiesMediaContent, ...propertiesDetailInfo, ...aggregation.project, ...propertiesThumb, ...propertiesDetailInfo, ...propertiesMediaContent, ...propertiesDetailInfo,
  //   };
  // } else if (req.query.type === 'thumb') {
  //   aggregation.project = {
  //     ...aggregation.project, ...propertiesThumb, ...propertiesDetailInfo, ...propertiesMediaContent, ...propertiesDetailInfo,
  //   };
  // } else if (req.query.type === 'smallThumb') {
  aggregation.project = {
    ...aggregation.project, ...propertiesSmallThumb, ...propertiesMediaContent, ...propertiesDetailInfo,
  };
  // }
  // console.log((new Date).getTime());
  configAggregation(req.query.order, aggregation);
  Post.aggregate([
    {
      $match: match,
    }, {
      $project: aggregation.project,
    }, // Sorting pipeline
    {
      $sort: aggregation.sort,
    }, {
      $skip: skip,
    }, // Optionally limit results
    {
      $limit: (paging),
    },
  ], (err, result) => {
    const posts = result;
    if (err) {
      // console.log(err);
      return res
        .status(400)
        .send();
    }
    if (posts.length === 0) {
      return res
        .status(404)
        .send();
    }
    // posts = posts.map((doc) => { return new Post(doc); });
    // Post.populate(posts, {
    //   path: 'creator',
    //   select: 'displayName username avatar',
    // }, (err1, data) => {
    //   if (err1) return res.status(403).send({ message: err1 });
    return res.json(posts);
    // });
    // return null;
  });
};
const jpgOptim = (input) => {
  return new Promise((resolve, reject) => {
    let sizeCompressed;
    if (input.size.width / input.originalWidth > 1) {
      sizeCompressed = Math.round(input.size.width / input.originalWidth * input.originalFileSize / 1000);
      !input.LQ && (sizeCompressed *= 10);
    } else {
      sizeCompressed = Math.round(0.8 * input.originalFileSize / 1000);
    }
    const cmd = `jpegoptim --size=${sizeCompressed}k ${input.fileOutput}`;
    exec(cmd, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const pngOptim = (input) => {
  return new Promise((resolve, reject) => {
    const cmd = `optipng -o7 -strip all ${input.fileOutput}`;
    exec(cmd, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const createCompressedImage = (input) => {
  return new Promise((resolve, reject) => {
    if (input.LQ) {
      input.size.width && (input.size.width = Math.round(input.size.width / 10));
      input.size.height && (input.size.height = Math.round(input.size.height / 10));
    }
    const cmd = `convert ${input.fileInput} -level 0%,100%,0.85  -filter Triangle -define filter:support=2 -thumbnail ${input.size.width} -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip ${input.fileOutput}`;
    exec(cmd, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const createCroppedCompressedImage = (input) => {
  return new Promise((resolve, reject) => {
    if (input.LQ) {
      input.size.width && (input.size.width = Math.round(input.size.width / 10));
      input.size.height && (input.size.height = Math.round(input.size.height / 10));
    }
    const height = Math.round(input.size.height * input.originalWidth / input.size.width);
    const cmd = `convert ${input.fileInput} -level 0%,100%,0.85  -gravity center -crop ${input.originalWidth}x${height}+0+0 +repage -filter Triangle -define filter:support=2 -thumbnail ${input.size.width} -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip ${input.fileOutput}`;
    exec(cmd, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const reduceGifSize = (input) => {
  return new Promise((resolve, reject) => {
    gm(input.fileInput).resize(input.size.width).quality(input.size.width / input.originalWidth)
      .write(input.fileInput, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
};
const formatGifToMp4 = (input) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(input.fileInput).format('mp4').on('end', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    command.save(input.fileOutput);
  });
};
const takeMp4Screenshot = (input) => {
  // console.log('input.size.width: ' + input.size.width);
  // console.log('input.size.height: ' + input.size.height);
  return new Promise((resolve, reject) => {
    ffmpeg(input.fileInput).on('end', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }).screenshots({
      timestamps: input.screenShot.timestamps,
      folder: input.screenShot.folderPath,
      filename: input.screenShot.filename,
      size: `${input.size.width}x${input.size.height}`,
    });
  });
};
const removeFile = (input) => {
  return new Promise((resolve, reject) => {
    fs.unlink(input.fileInput, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const removeFileByUrl = (url) => {
  return new Promise((resolve, reject) => {
    fs.unlink(url, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
// const changefileName = (input, callback) => {
//   const cmd = `mv ${input.oldName} ${input.newName}`;
//   exec(cmd, function (error, stdout, stderr) {
//     if (error) {
//       console.log(error);
//     } else {
//       if (callback)
//         callback();
//     }
//   });
// }
exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  const dir = `uploaded/${req.user._id}`;
  form.uploadDir = `${__dirname}/../../public/${dir}/`;
  mkdirp(form.uploadDir, () => {
    // if (err) {
    //   return res.status(400).send({ messages: err });
    // }
  });
  form.keepExtensions = true;
  form.maxFields = 1;
  form.maxFieldsSize = 4096;
  let count = 0;
  let _post;
  form.on('progress', bytesReceived => {
    if (bytesReceived > 6000000) {
      form._error();
      return res.status(400).send();
    }
    return null;
  });
  form.on('field', (name, field) => {
    if (name === 'content') {
      _post = field;
    }
  });
  form.on('file', (name1, file) => {
    count++;
    const fileNameSplit = file.path.split('/');
    const fileNameWithExtension = fileNameSplit[fileNameSplit.length - 1];
    const fileNameWithoutExtension = fileNameWithExtension.split('.')[0];
    const fileNameExtension = fileNameWithExtension.split('.')[1];
    const pathFolder = file.path.split(fileNameWithExtension)[0];
    const pathFullFileNameWithoutExtension = `${pathFolder}${fileNameWithoutExtension}`;
    const URLFolder = `${serverConfig.host}/${dir}/`;
    const URLFullFileNameWithoutExtension = `${URLFolder}${fileNameWithoutExtension}`;
    gm(file.path).size((err, size) => {
      if (!err && (fileNameExtension === 'jpg' || fileNameExtension === 'png' || fileNameExtension === 'gif')) {
        const originalWidth = size.width;
        const originalHeight = size.height;
        const originalFileSize = file.size;
        const data = JSON.parse(_post);
        data.creator = req.user._id;
        if (file.type.indexOf('gif') !== -1) {
          data.type = 'gif';
        } else {
          data.type = originalHeight / originalWidth > 5 ? 'list' : 'photo';
        }
        const ratioAcceptable = originalHeight / originalWidth < 5;
        data.thumbHeight = ratioAcceptable ? Math.round(originalHeight * WIDTH_THUMB / originalWidth) : HEIGHT_THUMB;
        data.thumbWidth = WIDTH_THUMB;
        data.mediaContentHeight = Math.round(originalHeight * WIDTH_MEDIACONTENT / originalWidth);
        data.mediaContentWidth = WIDTH_MEDIACONTENT;
        data.smallThumbWidth = WIDTH_SMALLTHUMB;
        data.smallThumbHeight = HEIGHT_SMALLTHUMB;
        const fileInputObj = { fileInput: file.path };
        const origin = {
          originalWidth, originalFileSize,
        };
        const sizeMediaPost = { size: { width: WIDTH_MEDIACONTENT, height: data.mediaContentHeight } };
        const sizeThumb = {
          size: {
            width: WIDTH_THUMB, height: ratioAcceptable ? data.thumbHeight : HEIGHT_THUMB,
          },
        };
        const sizeSmallThumb = { size: { width: WIDTH_SMALLTHUMB, height: HEIGHT_SMALLTHUMB } };
        const lowQuality = { LQ: true };
        if ((fileNameExtension === 'jpg' || fileNameExtension === 'png') && count === 1) {
          data.mediaContent = `${URLFullFileNameWithoutExtension}.${fileNameExtension}`;
          data.mediaContentLQ = `${URLFullFileNameWithoutExtension}_LQ.${fileNameExtension}`;
          data.thumb = `${URLFullFileNameWithoutExtension}_thumb.${fileNameExtension}`;
          data.thumbLQ = `${URLFullFileNameWithoutExtension}_thumb_LQ.${fileNameExtension}`;
          data.smallThumb = `${URLFullFileNameWithoutExtension}_smallThumb.${fileNameExtension}`;
          data.smallThumbLQ = `${URLFullFileNameWithoutExtension}_smallThumb_LQ.${fileNameExtension}`;
          const post = new Post(data);
          post.save((err1, post1) => {
            if (err1) {
              return res.status(400).send({ messages: getErrorMessage(err1) });
            }
            return res.json({ data: post1 });
          });
          const fileOutputMediaPost = { fileOutput: `${pathFullFileNameWithoutExtension}.${fileNameExtension}` };
          const fileOutputMediaPostLQ = { fileOutput: `${pathFullFileNameWithoutExtension}_LQ.${fileNameExtension}` };
          const fileOutputThumb = { fileOutput: `${pathFullFileNameWithoutExtension}_thumb.${fileNameExtension}` };
          const fileOutputThumbLQ = { fileOutput: `${pathFullFileNameWithoutExtension}_thumb_LQ.${fileNameExtension}` };
          const fileOutputSmallThumb = { fileOutput: `${pathFullFileNameWithoutExtension}_smallThumb.${fileNameExtension}` };
          const fileOutputSmallThumbLQ = { fileOutput: `${pathFullFileNameWithoutExtension}_smallThumb_LQ.${fileNameExtension}` };
          const mediaContent = Object.assign({}, fileInputObj, origin, fileOutputMediaPost, sizeMediaPost);
          const mediaContentLQ = Object.assign({}, fileInputObj, origin, fileOutputMediaPostLQ, sizeMediaPost, lowQuality);
          const thumb = Object.assign({}, fileInputObj, origin, fileOutputThumb, sizeThumb);
          const thumbLQ = Object.assign({}, fileInputObj, origin, fileOutputThumbLQ, sizeThumb, lowQuality);
          const smallThumb = Object.assign({}, fileInputObj, origin, fileOutputSmallThumb, sizeSmallThumb, { isSmallThumb: true });
          const smallThumbLQ = Object.assign({}, fileInputObj, origin, fileOutputSmallThumbLQ, sizeSmallThumb, lowQuality, { isSmallThumb: true });
          createCompressedImage(mediaContent)
            .then(() => createCompressedImage(mediaContentLQ))
            .then(() => {
              if (ratioAcceptable) {
                createCompressedImage(thumb)
                  .then(() => createCompressedImage(thumbLQ));
              } else {
                createCroppedCompressedImage(thumb)
                  .then(() => createCroppedCompressedImage(thumbLQ));
              }
            })
            .then(() => createCroppedCompressedImage(smallThumb))
            .then(() => createCroppedCompressedImage(smallThumbLQ))
            .then(() => {
              if (fileNameExtension === 'jpg') {
                jpgOptim(mediaContent)
                  .then(() => jpgOptim(mediaContentLQ))
                  .then(() => jpgOptim(thumb))
                  .then(() => jpgOptim(thumbLQ))
                  .then(() => jpgOptim(smallThumb))
                  .then(() => jpgOptim(smallThumbLQ));
              } else {
                pngOptim(mediaContent)
                  .then(() => pngOptim(mediaContentLQ))
                  .then(() => pngOptim(thumb))
                  .then(() => pngOptim(thumbLQ))
                  .then(() => pngOptim(smallThumb))
                  .then(() => pngOptim(smallThumbLQ));
              }
            })
            .then(() => {
              post.processed = true;
              post.save();
            });
        } else if (file.type === 'image/gif' && count === 1) {
          data.mediaContent = data.thumb = `${URLFullFileNameWithoutExtension}.mp4`;
          data.smallThumb = `${URLFullFileNameWithoutExtension}_smallThumb.png`;
          data.smallThumbLQ = `${URLFullFileNameWithoutExtension}_smallThumb_LQ.png`;
          const post = new Post(data);
          post.save((err1, post1) => {
            if (err1) {
              return res.status(400).send({ messages: getErrorMessage(err1) });
            }
            return res.json({ data: post1 });
          });
          const fileOutputMp4 = { fileOutput: `${pathFullFileNameWithoutExtension}.mp4` };
          const fileInputMp4 = { fileInput: `${pathFullFileNameWithoutExtension}.mp4` };
          const fileOutputSmallThumb = { fileOutput: `${pathFullFileNameWithoutExtension}_smallThumb.png` };
          const fileOutputSmallThumbLQ = { fileOutput: `${pathFullFileNameWithoutExtension}_smallThumb_LQ.png` };
          const tempSmallThumbInput = { fileInput: `${pathFullFileNameWithoutExtension}.png` };
          const screenShotObj = {
            screenShot: {
              timestamps: ['00:00:0.00'], folderPath: pathFolder, filename: `${fileNameWithoutExtension}.png`,
            },
          };
          const gif = Object.assign({}, fileInputObj, origin, sizeMediaPost);
          const mp4 = Object.assign({}, fileInputObj, fileOutputMp4);
          const screenShot = Object.assign({}, fileInputMp4, screenShotObj, sizeMediaPost);
          const smallThumb = Object.assign({}, tempSmallThumbInput, origin, fileOutputSmallThumb, sizeSmallThumb);
          const smallThumbLQ = Object.assign({}, tempSmallThumbInput, origin, fileOutputSmallThumbLQ, sizeSmallThumb, lowQuality);
          reduceGifSize(gif)
            .then(() => formatGifToMp4(mp4))
            .then(() => takeMp4Screenshot(screenShot))
            .then(() => createCroppedCompressedImage(smallThumb))
            .then(() => createCroppedCompressedImage(smallThumbLQ))
            .then(() => removeFile(fileInputObj))
            .then(() => removeFile(tempSmallThumbInput))
            .then(() => pngOptim(smallThumb))
            .then(() => pngOptim(smallThumbLQ))
            .then(() => {
              post.processed = true;
              post.save();
            });
        } else {
          fs.unlink(file.path);
          return res.status(400).send();
        }
        return null;
      }
      return null;
    });
  });
  form.parse(req);
};
function checkExists(dir, callback) {
  fs.exists(dir, (exists) => {
    if (!exists) {
      mkdirp(dir, (err) => {
        // if (err)
        //   console.error(err);
        // else {
        //   console.log('The uploads folder was not present, we have created it for you [' + dir + ']');
        !err && callback();
        // }
      });
      // throw new Error(dir + ' does not exists. Please create the folder');
    } else {
      callback();
    }
  });
}
exports.uploadFile = (req, res) => {
  const form = new formidable.IncomingForm();
  const cDir = `posts/${req.post._id}`;
  const uploadDir = `${__dirname}/../../public/uploaded/${cDir}`;
  form.uploadDir = uploadDir;
  // console.log(form.uploadDir);
  form.keepExtensions = true;
  form.maxFields = 1;
  form.maxFieldsSize = 4096;
  let count = 0;
  checkExists(uploadDir, () => {
    form
      .parse(req, () => {
      });
  });
  form.on('progress', (bytesReceived) => {
    if (bytesReceived > 3000000) {
      form._error();
      // console.log('Loi nhan');
      return res.status(400).send();
    }
    return null;
  });
  form.on('file', (name1, file) => {
    // console.log(file);
    // console.log("F");
    count++;
    if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/msword' || file.type === 'application/pdf') && file.size < 3000000 && count === 1) {
      const arrSplit = file.path.split('/');
      const name = arrSplit[arrSplit.length - 1];
      return res.json({
        link: `${serverConfig.host}/${cDir}/${name}`,
      });
    }
    // console.log("F2");
    fs.unlink(file.path);
    // console.log('file qua lon');
    return res.status(400).send();
  });
};
exports.get = (req, res) => {
  return res.json({ data: req.post });
};
exports.update = (req, res) => {
  // if(req.body.url){     Challenge.findOne({url:
  // req.body.url}).exec(function(err,challenge){         if(err) return
  // res.status(400).send({messages: ['An error occur. Please try again later']});
  //         if(challenge) res.status(400).send({messages: ['URL has exist']})
  // req.body.public = req.challenge.public;         req.body._id =
  // req.challenge._id;         req.body.creator = req.user._id;
  // Challenge.findByIdAndUpdate(req.challenge._id,req.body).exec(function(err,cha
  // l lenge){             if(err) return res.status(400).send({messages:
  // getErrorMessage(err)});             return res.json({message: "Challenge's
  // information has changed"});         });     }) } else {     req.body.public =
  // req.challenge.public;     req.body._id = req.challenge._id; req.body.creator
  // = req.user._id;
  // Challenge.findByIdAndUpdate(req.challenge._id,req.body).exec(function(err,cha
  // l lenge){         if(err) return res.status(400).send({messages:
  // getErrorMessage(err)});         return res.json({message: "Challenge's
  // information has changed"});     }); }
  req.body.publish = false;
  req.body._id = req.post._id;
  req.body.creator = req.user._id;
  Post.findByIdAndUpdate(req.post._id, req.body).exec((err, post) => {
    return err ? res.status(400).send({ messages: getErrorMessage(err) }) : res.json({
      message: "Post's information has changed", data: post,
    });
  });
};
exports.review = (req, res) => {
  req.post.review = true;
  req.post.save();
  res.status(200).send({ data: true });
};
exports.publish = (req, res) => {
  req.post.publish = !req.post.publish;
  req.post.save();
  res.status(200).send({ data: req.post.publish });
};
// function removeFile(input) {
//   fs.unlink(input, () => {
//       // if (err)
//       //   console.log(err);
//   }
//   );
// }
exports.remove = (req, res) => {
  if (req.post.creator._id === req.user._id || req.user.role === 'admin' || req.user.role === 'manager') {
    if (req.post.processed) {
      req.post.remove((err, post) => {
        return err ? res.status(400).send({ messages: getErrorMessage(err) }) : res.json({ data: post });
      });
      // console.log(req.post);
      const mediaContentfileName = req.post.mediaContent.split('/uploaded/')[1];
      const mediaContentFilePath = `${__dirname}/../../public/uploaded/${mediaContentfileName}`;
      const thumbfileName = req.post.thumb.split('/uploaded/')[1];
      const thumbFilePath = `${__dirname}/../../public/uploaded/${thumbfileName}`;
      const smallThumbfileName = req.post.smallThumb.split('/uploaded/')[1];
      const smallThumbFilePath = `${__dirname}/../../public/uploaded/${smallThumbfileName}`;
      removeFileByUrl(mediaContentFilePath)
        .catch((e) => console.log(e));
      removeFileByUrl(thumbFilePath)
        .catch((e) => console.log(e));
      removeFileByUrl(smallThumbFilePath)
        .catch((e) => console.log(e));
      if (req.post.mediaContent.indexOf('.mp4') === -1) {
        let extension;
        mediaContentfileName.indexOf('png') !== -1 && (extension = '.png');
        mediaContentfileName.indexOf('jpg') !== -1 && (extension = '.jpg');
        const mediaContentfileName20 = `${mediaContentfileName.split('.')[0]}_LQ${extension}`;
        const mediaContentFilePath20 = `${__dirname}/../../public/uploaded/${mediaContentfileName20}`;
        const thumbfileName20 = `${thumbfileName.split('.')[0]}_LQ${extension}`;
        const thumbFilePath20 = `${__dirname}/../../public/uploaded/${thumbfileName20}`;
        const smallThumbfileName20 = `${smallThumbfileName.split('.')[0]}_LQ${extension}`;
        const smallThumbFilePath20 = `${__dirname}/../../public/uploaded/${smallThumbfileName20}`;
        removeFileByUrl(mediaContentFilePath20)
          .catch((e) => console.log(e));
        removeFileByUrl(thumbFilePath20)
          .catch((e) => console.log(e));
        removeFileByUrl(smallThumbFilePath20)
          .catch((e) => console.log(e));
      } else {
        const extension = '.png';
        const smallThumbfileName20 = `${smallThumbfileName.split('.')[0]}_LQ${extension}`;
        const smallThumbFilePath20 = `${__dirname}/../../public/uploaded/${smallThumbfileName20}`;
        removeFileByUrl(smallThumbFilePath20)
          .catch((e) => console.log(e));
      }
    } else {
      res.status(403).send('File is not processed');
    }
  } else {
    return res.status(401).send('You are not creator or manager or admin');
  }
  return null;
};
exports.postByID = (req, res, next, id) => {
  Post
    .findById(id)
    .populate('creator', 'displayName username avatar')
    .populate('categories', 'title')
    // .populate('type', 'title')
    .exec((err, post) => {
      if (err) {
        // console.log(1);
        return res.status(400).send();
      }
      if (!post) {
        return res.status(400).send({
          messages: [`Failed to load post ${id}`],
        });
      }
      req.post = post;
      // console.log(post);
      next();
      return null;
    });
  return null;
};
exports.follow = (req, res) => {
  let isFollowed = false;
  req.post.follows.forEach((follow) => {
    follow === req.user._id && (isFollowed = true);
    return null;
  });
  if (!isFollowed) {
    Post.findByIdAndUpdate(req.post._id, {
      $addToSet: {
        follows: req.user._id,
      },
    }).exec((err) => {
      return err ? res.status(400).send() : res.status(200).send({
        data: {
          follow: true,
        },
      });
    });
  } else {
    Post.findByIdAndUpdate(req.post._id, {
      $pull: {
        follows: req.user._id,
      },
    }).exec((err) => {
      return err ? res.status(400).send() : res.status(200).send({
        data: {
          follow: false,
        },
      });
    });
  }
};
exports.share = (req, res) => {
  Post.findByIdAndUpdate(req.post._id, {
    $addToSet: {
      shares: req.user._id,
    },
  }).exec((err) => {
    return err ? res.status(400).send() : res.status(200).send();
  });
};

// exports.view = (req, res) => {
//   // Post.findByIdAndUpdate(req.post._id, { $addToSet: { "views":
//   // req.user._id } }).exec(function (err, success) {     if (err) return
//   // res.status(400).send();     return res.status(200).send(); });
//   Post.findByIdAndUpdate(req.post._id, {
//     $inc: {
//       view: 1,
//     },
//   }).exec((err, success) => {
//     return err ? res.status(400).send() : res.json({ view: success.view });
//   });
// };


exports.report = (req, res) => {
  let hasReported = false;
  req.post.reports.forEach((reporter) => {
    reporter === req.user._id && (hasReported = true);
    return null;
  });
  if (!hasReported) {
    Post
      .findByIdAndUpdate(req.post._id, {
        $addToSet: {
          reports: req.user._id,
        },
      })
      .exec((err, success) => {
        return err ? res.status(400).send() : res.json(success);
      });
  } else {
    Post
      .findByIdAndUpdate(req.post._id, {
        $pull: {
          reports: req.user._id,
        },
      })
      .exec((err, success) => {
        return err ? res.status(400).send() : res.json(success);
      });
  }
};
exports.vote = (req, res) => {
  let isVoted = false;
  req.post.votes.forEach((vote) => {
    if (vote === req.user._id) isVoted = true;
    return;
  });
  if (!isVoted) {
    Post.findByIdAndUpdate(req.post._id, {
      $addToSet: { votes: req.user._id }, $inc: { votesLength: 1 },
    }, { new: true }).exec((err, post) => {
      if (err) return res.status(400).send();
      return res.status(200).send({ data: { voted: true, votes: post.votes, votesLength: post.votesLength } });
    });
  } else {
    Post.findByIdAndUpdate(req.post._id, {
      $pull: { votes: req.user._id }, $inc: { votesLength: -1 },
    }, { new: true }).exec((err, post) => {
      if (err) return res.status(400).send();
      return res.status(200).send({ data: { voted: false, votes: post.votes, votesLength: post.votesLength } });
    });
  }
};


exports.view = (req, res) => {
  let isViewed = false;
  req.post.views.forEach((view) => {
    if (view === req.user._id) isViewed = true;
    return;
  });
  if (!isViewed) {
    Post.findByIdAndUpdate(req.post._id, {
      $addToSet: { views: req.user._id }, $inc: { viewsLength: 1 },
    }, { new: true }).exec((err, post) => {
      if (err) return res.status(400).send();
      return res.status(200).send({ data: { viewed: true, views: post.views, viewsLength: post.viewsLength } });
    });
  } else {
    // Post.findByIdAndUpdate(req.post._id, {
    //   $pull: { votes: req.user._id }, $inc: { votesLength: -1 },
    // }, { new: true }).exec((err, post) => {
    //   if (err) return res.status(400).send();
    return res.status(200).send({ data: { updated: false } });
    // });
  }
  return null;
};

exports.voteUp = (req, res) => {
  let isVotedUp = false;
  req
    .post
    .voteUps
    .forEach((vote) => {
      vote === req.user._id && (isVotedUp = true);
      return null;
    });
  if (!isVotedUp) {
    let isVotedDown = false;
    req
      .post
      .voteDowns
      .forEach((vote) => {
        vote === req.user._id && (isVotedDown = true);
        return null;
      });
    if (isVotedDown) {
      Post.findByIdAndUpdate(req.post._id, {
        $pull: {
          voteDowns: req.user._id,
        }, $inc: {
          votesLength: 1,
        },
      })
        .exec((err) => {
          if (err) {
            return res.status(400).send();
          }
          Post.findByIdAndUpdate(req.post._id, {
            $addToSet: {
              voteUps: req.user._id,
            }, $inc: {
              votesLength: 1,
            },
          })
            .exec((err1) => {
              return err1 ? res.status(400).send() : res.status(200).send({
                data: {
                  voteUp: true,
                },
              });
            });
          return null;
        });
    } else {
      Post.findByIdAndUpdate(req.post._id, {
        $addToSet: {
          voteUps: req.user._id,
        }, $inc: {
          votesLength: 1,
        },
      })
        .exec((err) => {
          return err ? res.status(400).send() : res.status(200).send({
            data: {
              voteUp: true,
            },
          });
        });
    }
  } else {
    return res
      .status(200)
      .send({
        data: {
          voteUp: false,
        },
      });
  }
  return null;
};
exports.voteDown = (req, res) => {
  let isVotedDown = false;
  req
    .post
    .voteDowns
    .forEach((vote) => {
      vote === req.user._id && (isVotedDown = true);
      return null;
    });
  if (!isVotedDown) {
    let isVotedUp = false;
    req.post.voteUps.forEach((vote) => {
      vote === req.user._id && (isVotedUp = true);
      return null;
    });
    if (isVotedUp) {
      Post.findByIdAndUpdate(req.post._id, {
        $pull: {
          voteUps: req.user._id,
        }, $inc: {
          votesLength: -1,
        },
      })
        .exec((err) => {
          if (err) {
            return res.status(400).send();
          }
          Post.findByIdAndUpdate(req.post._id, {
            $addToSet: {
              voteDowns: req.user._id,
            }, $inc: {
              votesLength: -1,
            },
          }).exec((err1) => {
            return err1 ? res.status(400).send() : res.status(200).send({
              data: {
                voteDown: true,
              },
            });
          });
          return null;
        });
    } else {
      Post.findByIdAndUpdate(req.post._id, {
        $addToSet: {
          voteDowns: req.user._id,
        }, $inc: {
          votesLength: -1,
        },
      }).exec((err) => {
        return err ? res.status(400).send() : res.status(200).send({
          data: {
            voteDown: true,
          },
        });
      });
    }
  } else {
    return res
      .status(200)
      .send({
        data: {
          voteDown: false,
        },
      });
  }
  return null;
};
exports.unVote = (req, res) => {
  // remove vote up
  let isVotedUp = false;
  req.post.voteUps.forEach((vote) => {
    vote === req.user._id && (isVotedUp = true);
    return null;
  });
  // remove vote down
  let isVotedDown = false;
  req.post.voteDowns.forEach((vote) => {
    vote === req.user._id && (isVotedDown = true);
    return null;
  });
  if (isVotedDown) {
    Post.findByIdAndUpdate(req.post._id, {
      $pull: {
        voteDowns: req.user._id,
      }, $inc: {
        votesLength: 1,
      },
    }).exec((err) => {
      if (err) {
        return res.status(400).send();
      }
      if (isVotedUp) {
        Post.findByIdAndUpdate(req.post._id, {
          $pull: {
            voteUps: req.user._id,
          }, $inc: {
            votesLength: -1,
          },
        }).exec((err1) => {
          return err1 ? res.status(400).send() : res.status(200).send({
            data: {
              unVote: true,
            },
          });
        });
      }
      return null;
    });
  } else {
    if (isVotedUp) {
      Post.findByIdAndUpdate(req.post._id, {
        $pull: {
          voteUps: req.user._id,
        }, $inc: {
          votesLength: -1,
        },
      })
        .exec((err) => {
          return err ? res.status(400).send() : res.status(200).send({
            data: {
              unVote: true,
            },
          });
        });
    } else {
      return res
        .status(200)
        .send({
          data: {
            unVote: false,
          },
        });
    }
  }
  return null;
};
exports.renderAngular = (req, res, next) => {
  if ((req.url.indexOf('sources') < 0 && req.url.indexOf('api') < 0 && req.url.indexOf('assets') < 0)) {
    res.render('index', {
      message: null, app: serverConfig.app, channel: serverConfig.channel,
    });
  } else {
    next();
  }
};
exports.renderPost = (req, res) => {
  Post
    .findById(req.params.id)
    .exec((err, post) => {
      if (post) {
        const app = {};
        app.id = serverConfig.app.id;
        app.title = post.title;
        app.image = post.mediaContent;
        app.description = post.description;
        app.url = `${serverConfig.host}/posts/${post._id}`;
        res.render('index', {
          message: null, app, channel: serverConfig.channel,
        });
      } else {
        res.render('index', {
          message: null, app: serverConfig.app, channel: serverConfig.channel,
        });
      }
    });
};
