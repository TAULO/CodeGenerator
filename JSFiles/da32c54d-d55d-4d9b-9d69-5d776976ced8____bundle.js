#!/usr/bin/env node
(() => {
  "use strict";
  var e = {
      8373: function (e, n, t) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.writeMultipleFiles = void 0);
        var o = r(t(5747));
        n.writeMultipleFiles = function (e, n, t, r, s) {
          for (var i in (void 0 === r && (r = function () {}),
          void 0 === s && (s = !1),
          e)) {
            var a = n + "/" + t,
              l = s
                ? "webpack." + i + "." + e[i].extension
                : i + "." + e[i].extension;
            o.default.writeFileSync(a + "/" + l, e[i].data);
          }
          r();
        };
      },
      5455: function (e, n, t) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o,
          s,
          i,
          a = r(t(5747)),
          l = r(t(5622)),
          d = t(1899),
          c = l.default.resolve(),
          u = process.argv.slice(2)[0];
        u && "" !== u
          ? ((o = c),
            (s = u),
            (i = function () {
              return d.webpack(c, u, function () {
                return d.react(c, u, function () {
                  return d.apollo(c, u, function () {
                    return d.npm(u, function () {
                      return console.log("All set happy coding!");
                    });
                  });
                });
              });
            }),
            console.log("Setup folder @ " + o + "/" + s),
            a.default.mkdirSync(o + "/" + s, { recursive: !0 }),
            i())
          : console.log("Please specify a folder name");
      },
      8689: function (e, n, t) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.apollo = void 0);
        var o = r(t(5747)),
          s = t(8373),
          i = t(6789),
          a = t(2456),
          l = t(3001),
          d = t(7839),
          c = t(7867),
          u = t(9942),
          p = t(794),
          m = t(3504),
          f = t(1604),
          h = t(6302),
          v = t(746);
        n.apollo = function (e, n, t) {
          console.log("Setting up apollo server"),
            o.default.mkdirSync(e + "/" + n + "/apollo/", { recursive: !0 }),
            o.default.writeFileSync(e + "/" + n + "/apollo/index.ts", d.index),
            o.default.mkdirSync(e + "/" + n + "/apollo/server/", {
              recursive: !0,
            }),
            s.writeMultipleFiles(i.apolloServer, e, n + "/apollo/server"),
            o.default.mkdirSync(e + "/" + n + "/apollo/server/helpers", {
              recursive: !0,
            }),
            s.writeMultipleFiles(
              a.apolloHelpers,
              e,
              n + "/apollo/server/helpers"
            ),
            o.default.mkdirSync(e + "/" + n + "/apollo/server/services", {
              recursive: !0,
            }),
            s.writeMultipleFiles(l.services, e, n + "/apollo/server/services"),
            o.default.mkdirSync(e + "/" + n + "/apollo/schema", {
              recursive: !0,
            }),
            o.default.writeFileSync(
              e + "/" + n + "/apollo/schema/index.ts",
              c.index
            ),
            o.default.mkdirSync(e + "/" + n + "/apollo/schema/types", {
              recursive: !0,
            }),
            s.writeMultipleFiles(u.schema, e, n + "/apollo/schema/types"),
            o.default.mkdirSync(e + "/" + n + "/apollo/resolvers", {
              recursive: !0,
            }),
            o.default.writeFileSync(
              e + "/" + n + "/apollo/resolvers/index.ts",
              p.index
            ),
            o.default.mkdirSync(e + "/" + n + "/apollo/resolvers/mutation", {
              recursive: !0,
            }),
            s.writeMultipleFiles(
              m.mutation,
              e,
              n + "/apollo/resolvers/mutation"
            ),
            o.default.mkdirSync(e + "/" + n + "/apollo/resolvers/query", {
              recursive: !0,
            }),
            s.writeMultipleFiles(f.query, e, n + "/apollo/resolvers/query"),
            o.default.mkdirSync(e + "/" + n + "/apollo/data-source", {
              recursive: !0,
            }),
            o.default.writeFileSync(
              e + "/" + n + "/apollo/data-source/index.ts",
              v.index
            ),
            o.default.writeFileSync(
              e + "/" + n + "/apollo/data-source/User.ts",
              v.User
            ),
            o.default.mkdirSync(e + "/" + n + "/apollo/models", {
              recursive: !0,
            }),
            o.default.writeFileSync(
              e + "/" + n + "/apollo/models/index.ts",
              h.index
            ),
            o.default.writeFileSync(
              e + "/" + n + "/apollo/models/user.ts",
              h.user
            ),
            t();
        };
      },
      862: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.User = void 0),
          (n.User =
            "\nimport { MongoDataSource } from 'apollo-datasource-mongodb';\nimport { UserInterFace } from '../models';\nimport { Types } from 'mongoose';\nimport { signup, login } from '../server/services';\nimport { Request } from 'express';\n\nexport class User extends MongoDataSource<UserInterFace> {\n  users() {\n    return this.model.find();\n  }\n  getUser(userId: Types.ObjectId | string) {\n    return this.findOneById(userId);\n  }\n\n  signup(email: String, username: String, password: String, req: Request) {\n    return signup({ email, username, password, req });\n  }\n\n  login(email: String, password: String, req: Request) {\n    return login({ email, password, req });\n  }\n\n  delete(id: Types.ObjectId) {\n    this.model.findByIdAndDelete(id).exec();\n  }\n\n  update(id: Types.ObjectId, username: String) {\n    this.model.findByIdAndUpdate(id, { username: username }).exec();\n  }\n}\n");
      },
      746: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index = "\nexport * from './User';\n"),
          o(t(862), n);
      },
      7839: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nimport { Apollo, params, app } from './server';\n\nconst apollo = new Apollo(4000, params, app);\napollo.init();\n"),
          o(t(8689), n);
      },
      6302: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index = "\nexport * from './user';\n"),
          o(t(3838), n);
      },
      3838: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.user = void 0),
          (n.user =
            "\nimport mongoose, { Schema, Document } from 'mongoose';\nimport bcrypt from 'bcryptjs';\n\nexport interface UserInterFace extends Document {\n  _id: String;\n  email: String;\n  username: String;\n  password: String;\n}\n\nexport const UserSchema = new Schema({\n  email: { type: String, required: true },\n  username: { type: String, required: true },\n  password: { type: String, required: true },\n});\n\n// The user's password is never saved in plain text.  Prior to saving the\n// user model, we 'salt' and 'hash' the users password.  This is a one way\n// procedure that modifies the password - the plain text password cannot be\n// derived from the salted + hashed version. See 'comparePassword' to understand\n// how this is used.\nUserSchema.pre('save', function save(next) {\n  const user: any = this;\n  if (!user.isModified('password')) {\n    return next();\n  }\n  bcrypt.genSalt(10, (err, salt) => {\n    if (err) {\n      return next(err);\n    }\n\n    bcrypt.hash(user.password, salt, (err, hash) => {\n      if (err) {\n        return next(err);\n      }\n      user.password = hash;\n\n      next();\n    });\n  });\n});\n\n// We need to compare the plain text password (submitted whenever logging in)\n// with the salted + hashed version that is sitting in the database.\n// 'bcrypt.compare' takes the plain text password and hashes it, then compares\n// that hashed password to the one stored in the DB.  Remember that hashing is\n// a one way process - the passwords are never compared in plain text form.\nUserSchema.methods.comparePassword = function comparePassword(\n  candidatePassword: any,\n  cb: Function\n) {\n  const user: any = this;\n  bcrypt.compare(\n    candidatePassword,\n    user.password,\n    (err: Error, isMatch: Boolean) => {\n      cb(err, isMatch);\n    }\n  );\n};\n\nexport const user = mongoose.model<UserInterFace>('users', UserSchema);\n");
      },
      794: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nimport { Query } from './query';\nimport { Mutation } from './mutation';\n\n// Resolvers define the technique for fetching the types defined in the\n// schema. This resolver retrieves books from the \"books\" array above.\nexport const resolvers = {\n  Query,\n  Mutation,\n};\n");
      },
      3504: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.mutation = void 0);
        var r = t(6023),
          o = t(3178);
        n.mutation = {
          user: { data: r.user, extension: "ts" },
          index: { data: o.index, extension: "ts" },
        };
      },
      3178: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nimport { userMutations } from './user';\n\nexport const Mutation = { ...userMutations };\n");
      },
      6023: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.user = void 0),
          (n.user =
            "\nimport { UserInterFace } from '../../models';\n\nexport const userMutations = {\n  signup: (\n    _: any,\n    { email, username, password }: UserInterFace,\n    { dataSources }: any\n  ): void => {\n    const req = dataSources.users.context.request();\n    return dataSources.users.signup(email, username, password, req);\n  },\n  login: (\n    _: any,\n    { email, password }: UserInterFace,\n    { dataSources }: any\n  ): void => {\n    const req = dataSources.users.context.request();\n    return dataSources.users.login(email, password, req);\n  },\n  logout: (parent: any, args: any, context: any) => context.logout(),\n  deleteUser: (_: any, { _id }: UserInterFace, { dataSources }: any): void => {\n    dataSources.users.delete(_id);\n  },\n  updateUser: (\n    _: any,\n    { _id, username }: UserInterFace,\n    { dataSources }: any\n  ): void => {\n    dataSources.users.update(_id, username);\n  },\n};\n");
      },
      1604: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.query = void 0);
        var r = t(447),
          o = t(485);
        n.query = {
          user: { data: r.user, extension: "ts" },
          index: { data: o.index, extension: "ts" },
        };
      },
      485: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nimport { usersQuery } from './user';\n\nexport const Query = {\n  ...usersQuery,\n};\n");
      },
      447: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.user = void 0),
          (n.user =
            "\nexport const usersQuery = {\n  users: (_: any, {}: any, { dataSources }: any) => dataSources.users.users(),\n  getUser: (_: any, { userId }: any, { dataSources }: any) =>\n    dataSources.users.getUser(userId),\n  currentUser: (parent: any, args: any, context: any) => context.getUser(),\n};\n");
      },
      7867: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nimport { root } from './types/root';\nimport { user } from './types/user';\n\nexport const typeDefs = [root, user];\n");
      },
      9942: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.schema = void 0);
        var r = t(2357),
          o = t(6509);
        n.schema = {
          root: { data: r.root, extension: "ts" },
          user: { data: o.user, extension: "ts" },
        };
      },
      2357: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.root = void 0),
          (n.root =
            "import { gql } from 'apollo-server-express';export const root = gql`  type Query {    root: String  }  type Mutation {    root: String  }`;");
      },
      6509: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.user = void 0),
          (n.user =
            "import { gql } from 'apollo-server-express';export const user = gql`  type User {    _id: ID    email: String    username: String    password: String    auth: Boolean  }  extend type Query {    users: [User]    getUser(userId: String): User    currentUser: User  }  extend type Mutation {    signup(email: String!, username: String!, password: String!): User    login(email: String!, password: String!): User    logout: Boolean    deleteUser(_id: ID!): User    updateUser(_id: ID!, username: String!): User  }`;");
      },
      8490: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.Server = void 0),
          (n.Server =
            "\nimport { DocumentNode } from 'graphql';\nimport { ApolloServer } from 'apollo-server-express';\n\nexport interface ApolloParams {\n  typeDefs: string | DocumentNode | DocumentNode[] | string[] | undefined;\n  resolvers: any | any[] | undefined;\n  dataSources?: () => {};\n  context?: ({ req }: { req: Request }) => {};\n}\n\nexport class Apollo {\n  constructor(\n    public port: number,\n    public apolloParams: ApolloParams,\n    public app: any\n  ) {}\n\n  init = () => {\n    const { app, port, apolloParams } = this;\n    const apollo = new ApolloServer(apolloParams);\n\n    apollo.applyMiddleware({ app, cors: false });\n    app.listen({ port }, () =>\n      console.log(\n        '🚀 Server ready at http://localhost:'+port+apollo.graphqlPath, {useNewUrlParser: true}\n      )\n    );\n  };\n}\n\n");
      },
      3171: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.app = void 0),
          (n.app =
            "\nimport express from 'express';\nimport session from 'express-session';\nimport cors from 'cors';\nimport passport from 'passport';\nimport passportConfig from './services/passportConfig';\nimport { MongoStore, instance as mongoose } from './helpers';\n\nexport const app = express();\n\n// Configures express to use sessions.  This places an encrypted identifier\n// on the users cookie.  When a user makes a request, this middleware examines\n// the cookie and modifies the request object to indicate which user made the request\n// The cookie itself only contains the id of a session; more data about the session\n// is stored inside of MongoDB.\napp.use(express.json());\napp.use(express.urlencoded({ extended: true }));\napp.use(\n  session({\n    resave: true,\n    saveUninitialized: false,\n    name: 'auth',\n    secret: 'qwertyasdfg',\n    store: new MongoStore({\n      mongooseConnection: mongoose.connection,\n      autoReconnect: true,\n      collection: 'sessions',\n    }),\n    cookie: {\n      secure: false,\n      maxAge: 1000 * 30,\n    },\n  })\n);\n\n// Set headers to notify server that will allow our graphql api\n// to handle incoming request from different origins\napp.use(cors({ credentials: true, origin: 'http://localhost:3000' }));\n\n// Passport is wired into express as a middleware. When a request comes in,\n// Passport will examine the request's session (as set by the above config) and\n// assign the current user to the 'req.user' object.  See also servces/auth.js\npassportConfig(passport);\napp.use(passport.initialize());\napp.use(passport.session());\n\n");
      },
      6789: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.apolloServer = void 0);
        var r = t(5022),
          o = t(3171),
          s = t(8490),
          i = t(663);
        n.apolloServer = {
          params: { data: r.params, extension: "ts" },
          app: { data: o.app, extension: "ts" },
          Server: { data: s.Server, extension: "ts" },
          index: { data: i.index, extension: "ts" },
        };
      },
      763: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.MONGO_URI = void 0),
          (n.MONGO_URI =
            "\nexport const MONGO_URI =\n  'mongodb://posts-admin:mn8ZcPI20M3OfOfv@cluster0-shard-00-00.khci8.mongodb.net:27017,cluster0-shard-00-01.khci8.mongodb.net:27017,cluster0-shard-00-02.khci8.mongodb.net:27017/posts-db?ssl=true&replicaSet=atlas-j7ey9f-shard-0&authSource=admin&retryWrites=true&w=majority';\n");
      },
      2456: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.apolloHelpers = void 0);
        var r = t(763),
          o = t(3604),
          s = t(4493);
        n.apolloHelpers = {
          db: { data: r.MONGO_URI, extension: "ts" },
          index: { data: o.index, extension: "ts" },
          mongo: { data: s.mongo, extension: "ts" },
        };
      },
      3604: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index = "\nexport * from './db';\nexport * from './mongo';\n");
      },
      4493: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.mongo = void 0),
          (n.mongo =
            "\nimport mongoose from 'mongoose';\nimport connectMongo from 'connect-mongo';\nimport session from 'express-session';\nimport { MONGO_URI } from './';\n\n// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise\n// possibly deprecated\n// mongoose.Promise = global.Promise;\n\n// mongoose instance\nexport const instance = mongoose;\n\n// Connect to the mongoDB instance and log a message\n// on success or failure\ninstance.connect(MONGO_URI, {\n  useNewUrlParser: true,\n  useUnifiedTopology: true,\n});\ninstance.connection\n  .once('open', () => console.log('Connected to MongoLab instance.'))\n  .on('error', (error) => console.log('Error connecting to MongoLab:', error));\n\nexport const MongoStore = connectMongo(session);\n");
      },
      663: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nexport * from './params';\nexport * from './app';\nexport * from './Server';\n");
      },
      5022: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.params = void 0),
          (n.params =
            "\nimport { typeDefs } from '../schema';\nimport { resolvers } from '../resolvers';\nimport { User } from '../data-source';\nimport { user } from '../models';\n\nexport const params = {\n  typeDefs,\n  resolvers,\n  dataSources: () => ({\n    users: new User(user),\n  }),\n  context: ({ req }: { req: any }) => ({\n    request: () => req,\n    getUser: () => req.user,\n    logout: () => req.logout(),\n  }),\n};");
      },
      1602: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.auth = void 0),
          (n.auth =
            "\nimport passport from 'passport';\nimport { user as User } from '../../models';\n\n// Creates a new user account.  We first check to see if a user already exists\n// with this email address to avoid making multiple accounts with identical addresses\n// If it does not, we save the existing user.  After the user is created, it is\n// provided to the 'req.logIn' function.  This is apart of Passport JS.\n// Notice the Promise created in the second 'then' statement.  This is done\n// because Passport only supports callbacks, while GraphQL only supports promises\n// for async code!  Awkward!\nexport function signup({ email, username, password, req }: any) {\n  const user = new User({ email, username, password });\n  if (!email || !password) {\n    throw new Error('You must provide an email and password.');\n  }\n\n  return User.findOne({ email })\n    .then((existingUser: any) => {\n      if (existingUser) {\n        throw new Error('Email in use');\n      }\n      return user.save();\n    })\n    .then((user: any) => {\n      return new Promise((resolve, reject) => {\n        req.login(user, (err: Error) => {\n          if (err) {\n            reject(err);\n          }\n          resolve(user);\n        });\n      });\n    });\n}\n\n// Logs in a user.  This will invoke the 'local-strategy' defined above in this\n// file. Notice the strange method signature here: the 'passport.authenticate'\n// function returns a function, as its indended to be used as a middleware with\n// Express.  We have another compatibility layer here to make it work nicely with\n// GraphQL, as GraphQL always expects to see a promise for handling async code.\nexport function login({ email, password, req }: any) {\n  return new Promise((resolve, reject) => {\n    passport.authenticate('local', (err, user) => {\n      if (!user) {\n        const err = new Error('Invalid credentials.');\n        reject(err);\n      }\n      req.logIn(user, () => {\n        resolve(user);\n      });\n    })({ body: { email, password } });\n  });\n}\n");
      },
      3001: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.services = void 0);
        var r = t(1602),
          o = t(2028),
          s = t(4960);
        n.services = {
          auth: { data: r.auth, extension: "ts" },
          index: { data: o.index, extension: "ts" },
          passportConfig: { data: s.passportConfig, extension: "ts" },
        };
      },
      2028: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nexport * from './auth';\nexport * from './passportConfig';\n");
      },
      4960: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.passportConfig = void 0),
          (n.passportConfig =
            "\nimport PassportLocal from 'passport-local';\nimport { UserInterFace } from '../../models';\nimport { user as User } from '../../models';\n\nexport default (passport: any) => {\n  const LocalStrategy = PassportLocal.Strategy;\n  // SerializeUser is used to provide some identifying token that can be saved\n  // in the users session.  We traditionally use the 'ID' for this.\n  passport.serializeUser((user: UserInterFace, done: Function) => {\n    done(null, user._id);\n  });\n\n  // The counterpart of 'serializeUser'.  Given only a user's ID, we must return\n  // the user object.  This object is placed on 'req.user'.\n  passport.deserializeUser((_id: String, done: Function) => {\n    User.findById(_id, (err: Error, user: UserInterFace) => {\n      if (err) {\n        done(null, false, { error: err });\n      } else {\n        done(null, user);\n      }\n    });\n  });\n\n  // Instructs Passport how to authenticate a user using a locally saved email\n  // and password combination.  This strategy is called whenever a user attempts to\n  // log in.  We first find the user model in MongoDB that matches the submitted email,\n  // then check to see if the provided password matches the saved password. There\n  // are two obvious failure points here: the email might not exist in our DB or\n  // the password might not match the saved one.  In either case, we call the 'done'\n  // callback, including a string that messages why the authentication process failed.\n  // This string is provided back to the GraphQL client.\n  passport.use(\n    new LocalStrategy(\n      { usernameField: 'email' },\n      (email: String, password: String, done: Function) => {\n        User.findOne({ email: email.toLowerCase() }, (err: any, user: any) => {\n          if (err) {\n            return done(err);\n          }\n          if (!user) {\n            return done(null, false, 'Invalid Credentials');\n          }\n          user.comparePassword(password, (err: Error, isMatch: Boolean) => {\n            if (err) {\n              return done(err);\n            }\n            if (isMatch) {\n              return done(null, user);\n            }\n            return done(null, false, 'Invalid credentials.');\n          });\n        });\n      }\n    )\n  );\n};\n");
      },
      1899: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          o(t(344), n),
          o(t(9934), n),
          o(t(1888), n),
          o(t(7839), n);
      },
      344: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          o(t(4716), n),
          o(t(2920), n);
      },
      4716: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.dependencies = n.devDependencies = void 0),
          (n.devDependencies =
            "npm i --save-dev webpack webpack-cli typescript ts-loader webpack-node-externals webpack-merge @types/react @types/react-dom @types/react-router-config @types/react-router-dom @types/express css-loader file-loader mini-css-extract-plugin @types/mini-css-extract-plugin npm-run-all rimraf style-loader @types/mongoose @types/passport @types/passport-local source-map-loader @types/express-session @types/bcryptjs typescript-plugin-css-modules"),
          (n.dependencies =
            "npm i react react-dom react-router-dom react-router-config express bcryptjs @apollo/client apollo-datasource-mongodb apollo-server-express express-session graphql mongoose passport passport-local session connect-mongo cross-fetch");
      },
      2920: function (e, n, t) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(n, "__esModule", { value: !0 }), (n.npm = void 0);
        var o = r(t(5747)),
          s = t(3129),
          i = t(344),
          a = t(5868);
        n.npm = function (e, n) {
          console.log("Installing npm modules may take a few mins"),
            s.exec("cd " + e + "; ls; npm init -y", function (t, r, o) {
              l(e, n),
                console.log(o),
                null !== t && console.log("exec error: " + t);
            });
        };
        var l = function (e, n) {
            s.exec(
              "cd " + e + "; ls; " + i.devDependencies,
              function (t, r, o) {
                d(e, n), null !== t && console.log("exec error: " + t);
              }
            );
          },
          d = function (e, n) {
            s.exec("cd " + e + "; ls; " + i.dependencies, function (t, r, o) {
              c(e, n),
                console.log(o),
                null !== t && console.log("exec error: " + t);
            });
          },
          c = function (e, n) {
            s.exec("cd " + e + "; tsc --init", function (t, r, o) {
              u(e, n),
                console.log(o),
                null !== t && console.log("exec error: " + t);
            });
          },
          u = function (e, n) {
            o.default.readFile(e + "/package.json", "utf8", function (n, t) {
              if (n) throw n;
              var r = Object.assign(JSON.parse(t), a.scripts);
              o.default.writeFileSync(e + "/package.json", JSON.stringify(r));
            }),
              o.default.writeFileSync(
                e + "/tsconfig.json",
                JSON.stringify(a.tsConfig)
              ),
              p(e, n);
          },
          p = function (e, n) {
            s.exec("npx prettier --write " + e + "/", function (e, t, r) {
              n(),
                console.log(r),
                null !== e && console.log("exec error: " + e);
            });
          };
      },
      5868: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.tsConfig = n.scripts = void 0),
          (n.scripts = {
            scripts: {
              "apollo-init": "cd ./dist/; touch apollo.js",
              "clean:apollo": "rimraf dist/apollo.js",
              "apollo:start-server":
                'nodemon --watch dist/apollo.js --exec "node dist/apollo.js"',
              "apollo:build-server":
                "webpack --config webpack.apollo.js --watch --progress",
              "apollo-setup": "npm run clean:apollo && npm run apollo-init",
              apollo: "npm run apollo-setup && npm-run-all --parallel apollo:*",
              "dev-init":
                "mkdir dist; cd ./dist; touch ssr.js; touch bundle.js",
              "clean:dev": "rimraf dist/ssr.js && rimraf dist/bundle.js",
              "dev:server":
                'nodemon --watch dist/ssr.js --exec "node dist/ssr.js"',
              "dev:build-client":
                "webpack --config webpack.client.js --watch --progress",
              "dev:build-server":
                "webpack --config webpack.ssr.js --watch --progress",
              dev: "NODE_ENV=development && npm run build",
              prebuild: "npm run clean:dev && npm run dev-init",
              build: "npm-run-all --parallel dev:*",
            },
          }),
          (n.tsConfig = {
            compilerOptions: {
              allowJs: !0,
              allowSyntheticDefaultImports: !0,
              esModuleInterop: !0,
              experimentalDecorators: !0,
              forceConsistentCasingInFileNames: !0,
              jsx: "react",
              lib: ["dom", "dom.iterable", "esnext"],
              module: "esnext",
              moduleResolution: "node",
              noImplicitAny: !0,
              outDir: "./dist/",
              plugins: [{ name: "typescript-plugin-css-modules" }],
              skipLibCheck: !0,
              strict: !0,
              target: "es6",
              typeRoots: ["node_modules/@types", "node_modules/@types/node"],
              types: ["node"],
            },
          });
      },
      6752: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.App = void 0),
          (n.App =
            "\nimport React from 'react';\nimport { renderRoutes } from 'react-router-config';\n\nimport styles from './App.module.css';\n\nconst App = ({ route }: any) => {\n  return <div>{renderRoutes(route.routes)}</div>;\n};\n\nexport default {\n  component: App,\n};\n");
      },
      9224: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.Routes = void 0),
          (n.Routes =
            "\nimport App from './App';\nimport Home from './pages/Home';\nimport NotFound from './pages/NotFound';\n\nexport const Routes = [\n  {\n    ...App,\n    routes: [\n      {\n        ...Home,\n        path: '/',\n        exact: true,\n      },\n      {\n        ...NotFound,\n      },\n    ],\n  },\n];\n");
      },
      902: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.pages = n.client = void 0);
        var r = t(9224),
          o = t(8486),
          s = t(6752),
          i = t(7549);
        (n.client = {
          index: { data: o.index, extension: "tsx" },
          App: { data: s.App, extension: "tsx" },
          Routes: { data: r.Routes, extension: "tsx" },
        }),
          (n.pages = {
            Home: { data: i.Home, extension: "tsx" },
            NotFound: { data: i.NotFound, extension: "tsx" },
          });
      },
      8486: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nimport React from 'react';\nimport ReactDOM from 'react-dom';\nimport { renderRoutes } from 'react-router-config';\nimport { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';\nimport { BrowserRouter as Router } from 'react-router-dom';\n\nimport { Routes } from './Routes';\n\nimport './styles/index.css';\n\nconst cache = new InMemoryCache({\n  typePolicies: {\n    Query: {\n      fields: {\n        userPosts: {\n          merge(existing, incoming) {\n            return incoming;\n          },\n        },\n      },\n    },\n  },\n});\n\nconst client = new ApolloClient({\n  cache,\n  connectToDevTools: true,\n  uri: 'http://localhost:4000/graphql',\n  credentials: 'include',\n  queryDeduplication: false,\n  defaultOptions: {\n    watchQuery: {\n      fetchPolicy: 'cache-and-network',\n    },\n  },\n});\n\nReactDOM.hydrate(\n  <ApolloProvider client={client}>\n    <Router>{renderRoutes(Routes)}</Router>\n  </ApolloProvider>,\n  document.getElementById('root')\n);\n"),
          o(t(902), n);
      },
      2253: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.Home = void 0),
          (n.Home =
            "\nimport React, { useContext } from 'react';\n\nconst HomePage = (props: any) => {\n  return <div>HomePage SSR Client</div>;\n};\n\nconst loadData = () => {\n  console.log('load data');\n};\n\nexport default {\n  component: HomePage,\n  loadData: loadData,\n};\n");
      },
      3325: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.NotFound = void 0),
          (n.NotFound =
            "\nimport React from 'react';\n\nconst NotFound = ({ staticContext }: any) => {\n  if (staticContext) {\n    staticContext.notFound = true;\n  }\n  return <h1>Oops route not found!</h1>;\n};\n\nexport default {\n  component: NotFound,\n};\n");
      },
      7549: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          o(t(3325), n),
          o(t(2253), n);
      },
      9690: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.appCss = n.indexCss = n.custom = void 0),
          (n.custom = "\ndeclare module '*.module.css';\n"),
          (n.indexCss = "\nbody {\n  background: lightblue;\n}\n"),
          (n.appCss = "\n.app {\n  width: 100%;\n}\n");
      },
      1888: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          o(t(4132), n),
          o(t(851), n),
          o(t(9690), n);
      },
      4132: function (e, n, t) {
        var r =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.react = void 0);
        var o = r(t(5747)),
          s = t(851),
          i = t(8486),
          a = t(9690),
          l = t(8373);
        n.react = function (e, n, t) {
          console.log("Setting up client"),
            o.default.mkdirSync(e + "/" + n + "/src/", { recursive: !0 }),
            o.default.writeFileSync(e + "/" + n + "/src/index.ts", s.ssr),
            o.default.writeFileSync(e + "/" + n + "/src/custom.d.ts", a.custom),
            o.default.mkdirSync(e + "/" + n + "/src/helpers/", {
              recursive: !0,
            }),
            l.writeMultipleFiles(s.helpers, e, n + "/src/helpers"),
            o.default.mkdirSync(e + "/" + n + "/src/client/", {
              recursive: !0,
            }),
            l.writeMultipleFiles(i.client, e, n + "/src/client"),
            o.default.writeFileSync(
              e + "/" + n + "/src/client/App.module.css",
              a.appCss
            ),
            o.default.mkdirSync(e + "/" + n + "/src/client/pages", {
              recursive: !0,
            }),
            l.writeMultipleFiles(i.pages, e, n + "/src/client/pages", t),
            o.default.mkdirSync(e + "/" + n + "/src/client/styles", {
              recursive: !0,
            }),
            o.default.writeFileSync(
              e + "/" + n + "/src/client/styles/index.css",
              a.indexCss
            );
        };
      },
      4840: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.Html = void 0),
          (n.Html =
            "import React from 'react';export const Html = ({ content, state }: any) => {return (<html lang='en-us'><head><link rel='stylesheet' href='/main.css' /></head><body><div id='root' dangerouslySetInnerHTML={{ __html: content }} /><script dangerouslySetInnerHTML={{__html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g,'\\u003c')};`,}}/><script src='/bundle.js'></script></body></html>);};");
      },
      223: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.apollo = void 0),
          (n.apollo =
            "\nimport fetch from 'cross-fetch';\nimport { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';\nimport { Request } from 'express';\n\n// Apollo Setup\nexport const client = (req: Request) =>\n  new ApolloClient({\n    ssrMode: true,\n    // Remember that this is the interface the SSR server will use to connect to the\n    // API server, so we need to ensure it isn't firewalled, etc\n    link: createHttpLink({\n      uri: 'http://localhost:4000/graphql',\n      fetch,\n      credentials: 'include',\n      headers: {\n        cookie: req.header('Cookie'),\n      },\n    }),\n    cache: new InMemoryCache(),\n  });\n\nexport const context: any = {};\n\n");
      },
      4477: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.helpers = void 0);
        var r = t(4840),
          o = t(9989),
          s = t(223),
          i = t(4409);
        n.helpers = {
          index: { data: i.index, extension: "ts" },
          apollo: { data: s.apollo, extension: "ts" },
          Html: { data: r.Html, extension: "tsx" },
          renderer: { data: o.renderer, extension: "tsx" },
        };
      },
      4409: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.index = void 0),
          (n.index =
            "\nexport * from './Html';\nexport * from './renderer';\nexport * from './apollo';\n");
      },
      9989: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.renderer = void 0),
          (n.renderer =
            "\nimport React from 'react';\nimport { ApolloProvider } from '@apollo/client';\nimport { Request, Response } from 'express';\nimport { renderToString, renderToStaticMarkup } from 'react-dom/server';\nimport { StaticRouter } from 'react-router-dom';\nimport { renderRoutes, matchRoutes } from 'react-router-config';\nimport { getDataFromTree } from '@apollo/client/react/ssr';\n\nimport { Routes } from '../client/Routes';\nimport { client, context } from './apollo';\nimport { Html } from './Html';\n\nexport const renderer = (req: Request, res: Response) => {\n  const clientInstance = client(req);\n  const initialState = clientInstance.extract();\n\n  const App = (\n    <ApolloProvider client={clientInstance}>\n      <StaticRouter location={req.url} context={context}>\n        {renderRoutes(Routes)}\n      </StaticRouter>\n    </ApolloProvider>\n  );\n\n  const promises = matchRoutes(Routes, req.path)\n    .map(({ route }: { route: any }) => {\n      return route.loadData ? route.loadData(initialState) : null;\n    })\n    .map((promise: any) => {\n      if (promise) {\n        return new Promise((resolve, reject) => {\n          promise.then(resolve).catch(resolve);\n        });\n      }\n    });\n\n  getDataFromTree(App).then(() => {\n    Promise.all(promises).then(() => {\n      if (context.url || context.notFound) {\n        if (context.url) return res.redirect(301, context.url);\n        if (context.notFound) res.status(404);\n      }\n\n      // We are ready to render for real\n      const content = renderToString(App);\n      const html = <Html content={content} state={initialState} />;\n\n      res.status(200);res.send(`<!doctype html>\n${renderToStaticMarkup(html)}`);res.end();\n    });\n  });\n};\n");
      },
      851: function (e, n, t) {
        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, n, t, r) {
                  void 0 === r && (r = t),
                    Object.defineProperty(e, r, {
                      enumerable: !0,
                      get: function () {
                        return n[t];
                      },
                    });
                }
              : function (e, n, t, r) {
                  void 0 === r && (r = t), (e[r] = n[t]);
                }),
          o =
            (this && this.__exportStar) ||
            function (e, n) {
              for (var t in e)
                "default" === t ||
                  Object.prototype.hasOwnProperty.call(n, t) ||
                  r(n, e, t);
            };
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.ssr = void 0),
          (n.ssr =
            "\nimport express, { Response, Request } from 'express';\nimport { renderer } from './helpers/index';\n\nconst app = express();\n\napp.use(express.static('dist'));\n\n// Page Renderer\napp.use((req: Request, res: Response) => {\n  renderer(req, res);\n});\n\napp.listen(3000, () => {\n  console.log('React SSR! is ready on PORT: 3000');\n});\n\n"),
          o(t(4477), n);
      },
      8304: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.apollo = void 0),
          (n.apollo =
            "\nconst path = require('path');\n\nmodule.exports = {\n  mode: 'development',\n  entry: './apollo/index.ts',\n  module: {\n    rules: [\n      {\n        test: /.ts?$/,\n        use: 'ts-loader',\n        exclude: /node_modules/,\n      },\n      {\n        test: /.m?js/,\n        resolve: {\n          fullySpecified: false,\n        },\n      },\n    ],\n  },\n  resolve: {\n    modules: ['node_modules'],\n    extensions: ['.ts', '.mjs', '.js', '.gql', '.graphql', 'json'],\n  },\n  output: {\n    filename: 'apollo.js',\n    path: path.resolve(__dirname, 'dist/'),\n  },\n  target: 'node',\n};\n");
      },
      7469: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.base = void 0),
          (n.base =
            "\nconst MiniCssExtractPlugin = require('mini-css-extract-plugin');\n\nmodule.exports = {\n  mode: 'development',\n  watchOptions: {\n    aggregateTimeout: 300,\n    ignored: /node_modules/,\n  },\n  module: {\n    rules: [\n      {\n        test: /.(ts|tsx)?$/,\n        use: 'ts-loader',\n        exclude: /node_modules/,\n      },\n      {\n        test: /.mjs$/,\n        include: /node_modules/,\n        type: 'javascript/auto',\n      },\n      {\n        test: /.js$/,\n        enforce: 'pre',\n        use: ['source-map-loader'],\n      },\n      {\n        test: /.module.css$/i,\n        use: [MiniCssExtractPlugin.loader, 'css-loader'],\n      },\n      {\n        test: /.css$/i,\n        exclude: /.module.css$/i,\n        use: ['style-loader', 'css-loader'],\n      },\n      {\n        test: /.(png|jpe?g|gif)$/i,\n        use: [\n          {\n            loader: 'file-loader',\n            options: {\n              name: '[name].[contenthash].[ext]',\n              outputPath: 'static/assets/',\n              publicPath: 'static/assets/',\n            },\n          },\n        ],\n      },\n    ],\n  },\n  plugins: [\n    new MiniCssExtractPlugin({\n      filename: '[name].css',\n      chunkFilename: '[id].css',\n    }),\n  ],\n};\n");
      },
      4159: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.client = void 0),
          (n.client =
            "\nconst path = require('path');\nconst { merge } = require('webpack-merge');\nconst baseConfig = require('./webpack.base.js');\n\nconst config = {\n  mode: 'development',\n  entry: './src/client/index.tsx',\n  stats: {\n    warningsFilter: [/Failed to parse source map/],\n  },\n  resolve: {\n    modules: ['node_modules'],\n    extensions: ['.tsx', '.ts', '.js', '.mjs', '.css', '.scss'],\n  },\n  output: {\n    filename: 'bundle.js',\n    path: path.resolve(__dirname, 'dist/'),\n  },\n  target: 'web',\n};\n\nmodule.exports = merge(baseConfig, config);\n");
      },
      9934: (e, n, t) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.webpack = void 0);
        var r = t(5636),
          o = t(7469),
          s = t(4159),
          i = t(8304),
          a = t(8373),
          l = {
            base: { data: o.base, extension: "js" },
            ssr: { data: r.ssr, extension: "js" },
            client: { data: s.client, extension: "js" },
            apollo: { data: i.apollo, extension: "js" },
          };
        n.webpack = function (e, n, t) {
          console.log("Setting up webpack"),
            a.writeMultipleFiles(l, e, n, t, !0);
        };
      },
      5636: (e, n) => {
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.ssr = void 0),
          (n.ssr =
            "const path = require('path');\nconst webpackNodeExternals = require('webpack-node-externals');\nconst { merge } = require('webpack-merge');\nconst baseConfig = require('./webpack.base.js');\n\nconst config = {\n  mode: 'development',\n  entry: './src/index.ts',\n  resolve: {\n    modules: ['node_modules'],\n    extensions: ['.tsx', '.ts', '.js', '.mjs', '.css', '.scss'],\n  },\n  output: {\n    filename: 'ssr.js',\n    path: path.resolve(__dirname, 'dist/'),\n  },\n  target: 'node',\n  externals: [webpackNodeExternals()],\n};\n\nmodule.exports = merge(baseConfig, config);\n");
      },
      3129: (e) => {
        e.exports = require("child_process");
      },
      5747: (e) => {
        e.exports = require("fs");
      },
      5622: (e) => {
        e.exports = require("path");
      },
    },
    n = {};
  !(function t(r) {
    if (n[r]) return n[r].exports;
    var o = (n[r] = { exports: {} });
    return e[r].call(o.exports, o, o.exports, t), o.exports;
  })(5455);
})();
