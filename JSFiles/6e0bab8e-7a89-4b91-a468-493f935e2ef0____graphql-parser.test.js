import 'babel-polyfill'

import { GraphQLID, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql'
import { GraphQLNonNull, GraphQLList } from 'graphql'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { graphql } from 'graphql'

import { parseField, parseObject, parseTypes, parseInputTypes, parseEndpoints, parseExtension } from './graphql-parser'

describe('graphql-parser', () => {
    describe('parseField()', () => {
        test('it should parse scalars', () => {
            expect(parseField('ID')).toBe(GraphQLID)
            expect(parseField('Int')).toBe(GraphQLInt)
            expect(parseField('Float')).toBe(GraphQLFloat)
            expect(parseField('String')).toBe(GraphQLString)
            expect(parseField('Boolean')).toBe(GraphQLBoolean)
        })

        test('it should parse required fields', () => {
            const res = parseField('ID!')
            expect(res).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType).toBe(GraphQLID)
        })

        test('it should parse a list definition', () => {
            const res = parseField('[ID]')
            expect(res).toBeInstanceOf(GraphQLList)
            expect(res.ofType).toBe(GraphQLID)
        })

        test('it should parse nested NonNull definitions', () => {
            const res = parseField('[ID!]!')
            expect(res).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType).toBeInstanceOf(GraphQLList)
            expect(res.ofType.ofType).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType.ofType.ofType).toBe(GraphQLID)
        })

        test('it should parse a definition that contains spaces', () => {
            const res = parseField('[  ID !    ] !     ')
            expect(res).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType).toBeInstanceOf(GraphQLList)
            expect(res.ofType.ofType).toBeInstanceOf(GraphQLNonNull)
            expect(res.ofType.ofType.ofType).toBe(GraphQLID)
        })
    })

    describe('parseObject()', () => {
        test('it should parse an object definition made of scalars', async () => {
            const UserType = parseObject({
                name: 'User',
                description: 'user type',
                fields: {
                    id: 'Int!',
                    name: 'String!',
                    hobbies: '[String]',
                },
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        user: { type: UserType },
                    },
                }),
            })

            const root = {
                user: () => ({
                    id: 22,
                    name: 'Marco',
                    hobbies: [ 'foo1', 'foo2' ],
                }),
            }

            const query = '{ user { id, name, hobbies } }'

            const res = await graphql(schema, query, root)
            expect(res.data.user).toEqual({
                id: 22,
                name: 'Marco',
                hobbies: [ 'foo1', 'foo2' ],
            })
        })

        test('it should parse an object that was built, previously', async () => {
            const types = {}
            types.User = parseObject({
                name: 'User',
                description: 'user type',
                fields: {
                    id: 'Int!',
                    name: 'String!',
                },
            })

            types.UsersList = parseObject({
                name: 'UserList',
                description: 'a list of users',
                fields: {
                    items: '[User]!',
                },
            }, types)

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        users: { type: types.UsersList },
                    },
                }),
            })

            const root = {
                users: () => ({
                    items: [{
                        id: 22,
                        name: 'Marco',
                    }],
                }),
            }

            const query = '{ users { items { id name } } }'

            const res = await graphql(schema, query, root)
            expect(res.data.users).toEqual({
                items: [{
                    id: 22,
                    name: 'Marco',
                }],
            })
        })
    })

    describe('parseTypes()', () => {
        test('it should parse multiple interconnected and aliased types', async () => {
            const types = parseTypes({
                User: {
                    id: 'Int!',
                    name: 'String',
                },
                UsersList: '[User!]!',
            }, { alias: 'MyAlias' })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        users: { type: types.MyAlias__UsersList },
                    },
                }),
            })

            const root = {
                users: () => [{
                    id: 22,
                    name: 'Marco',
                }],
            }

            const query = '{ users { id name } }'

            const res = await graphql(schema, query, root)
            expect(res.data.users).toEqual([{
                id: 22,
                name: 'Marco',
            }])
        })

        test('it should handle aliased input types', async () => {
            const inputTypes = parseInputTypes({
                UserInput: {
                    id: 'Int!',
                    name: 'String!',
                },
            }, { alias: 'MyAlias' })

            const types = parseTypes({
                User: {
                    id: 'Int!',
                    name: 'String',
                },
                UsersList: '[User!]!',
            }, { alias: 'MyAlias' })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        users: {
                            args: {
                                user: { type: inputTypes.MyAlias__UserInput },
                            },
                            type: types.MyAlias__UsersList,
                        },
                    },
                }),
            })

            const root = {
                users: (args) => [args.user],
            }

            const query = '{ users ( user: { id: 22, name: "Marco" } ) { id name } }'

            const res = await graphql(schema, query, root)
            // console.log(JSON.stringify(res))
            expect(res.data.users).toEqual([{
                id: 22,
                name: 'Marco',
            }])
        })
    })

    describe('parseEndpoints()', () => {
        test('it should build a group of endpoints', async () => {
            const types = {
                ...parseInputTypes({
                    UserInput: {
                        id: 'Int!',
                    },
                }, { alias: 'MyAlias' }),
                ...parseTypes({
                    User: {
                        id: 'Int!',
                        name: 'String',
                    },
                    UsersList: '[User!]',
                }, { alias: 'MyAlias' }),
            }

            const fields = parseEndpoints({
                listUsers: {
                    args: {
                        name: 'String!',
                        user: 'UserInput!',
                    },
                    type: 'UsersList!',
                },
            }, types, { alias: 'MyAlias' })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields,
                }),
            })

            const root = {
                listUsers: (args) => [{ id: args.user.id, name: args.name }],
            }

            const query = '{ listUsers (name: "Marco", user: {id:22}) { id name } }'

            const res = await graphql(schema, query, root)
            // console.log(JSON.stringify(res))
            expect(res.data.listUsers).toEqual([{
                id: 22,
                name: 'Marco',
            }])
        })

        test('it should wrap queries from a given extension', async () => {
            const fields = parseEndpoints({
                foo: 'String!',
            }, {}, { alias: 'MyAlias' })

            const root = {
                MyExtension: () => ({
                    foo: () => 'foo',
                }),
            }

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        MyExtension: {
                            type: new GraphQLObjectType({
                                name: 'MyExtension',
                                fields,
                            }),
                        },
                    },
                }),
            })

            const query = '{ MyExtension { foo } }'

            const res = await graphql(schema, query, root)
            // console.log(JSON.stringify(res))
            expect(res.data.MyExtension.foo).toBe('foo')
        })
    })

    describe('parseExtension()', () => {
        test('it should run a basic extension', async () => {
            const { queries, mutations } = parseExtension({
                name: 'MyExtension',
                inputTypes: {
                    UserInput: {
                        id: 'Int!',
                        name: 'String!',
                    },
                },
                types: {
                    User: {
                        id: 'Int!',
                        name: 'String!',
                    },
                },
                queries: {
                    getUser: 'User!',
                },
                mutations: {
                    setUser: {
                        args: { user: 'UserInput!' },
                        type: '[User!]!',
                    },
                },
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: { ...queries },
                }),
                mutation: new GraphQLObjectType({
                    name: 'RootMutation',
                    fields: { ...mutations },
                }),
            })

            const root = {
                MyExtension: () => ({
                    getUser: () => ({ id: 1, name: 'Marco' }),
                    setUser: ({ user }) => [user],
                }),
            }

            const r1 = await graphql(schema, 'query q1 { MyExtension { getUser { id name } } }', root)
            expect(r1.data.MyExtension.getUser).toEqual({
                id: 1,
                name: 'Marco',
            })

            const r2 = await graphql(schema, 'mutation q1 { MyExtension { setUser ( user: { id: 1, name: "Marco" }) { id name } } }', root)
            expect(r2.data.MyExtension.setUser).toEqual([{
                id: 1,
                name: 'Marco',
            }])
        })

        test('it should run an extension with embed resolvers', async () => {
            const { queries } = parseExtension({
                name: 'MyExtension',
                queries: {
                    foo: {
                        type: 'String',
                        resolve: () => 'foo',
                    },
                },
                shouldRunQueries: true,
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: { ...queries },
                }),
            })

            const r1 = await graphql(schema, 'query q1 { MyExtension { foo }}')
            expect(r1.data.MyExtension.foo).toBe('foo')
        })
    })

    describe('parseQueryResolver()', () => {
        test('it should be able to integrate different extensions', async () => {
            const typicode = parseExtension({
                name: 'Typicode',
                types: {
                    User: {
                        id: 'ID!',
                        name: 'String',
                    },
                },
                queries: {
                    users: {
                        type: '[User]',
                        resolve: {
                            type: 'rest',
                            url: 'https://jsonplaceholder.typicode.com/users',
                        },
                    },
                    user: {
                        type: 'User',
                        args: {
                            id: 'ID!',
                        },
                        resolve: {
                            type: 'rest',
                            url: 'https://jsonplaceholder.typicode.com/users/{{args.id}}',
                        },
                    },
                },
                shouldRunQueries: true,
            })

            const trevorblades = parseExtension({
                name: 'Trevorblades',
                types: {
                    Continent: {
                        code: 'ID!',
                        name: 'String',
                    },
                },
                queries: {
                    continents: {
                        type: '[Continent]',
                        resolve: {
                            type: 'graphql',
                            url: 'https://countries.trevorblades.com/',
                            query: '{ continents { code name }}',
                            grab: 'data.continents',
                        },
                    },
                    continent: {
                        type: 'Continent',
                        args: {
                            code: 'String!',
                        },
                        resolve: {
                            type: 'graphql',
                            url: 'https://countries.trevorblades.com/',
                            query: 'query foo ($code: String!) { continent (code: $code) { code name }}',
                            grab: 'data.continent',
                        },
                    },
                },
                shouldRunQueries: true,
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        ...typicode.queries,
                        ...trevorblades.queries,
                    },
                }),
            })

            const query = `{
                Typicode {
                    user (id: 8) { id name }
                    users { id name }
                }
                Trevorblades {
                    continent (code: "EU") { name }
                    continents { code name }
                }
            }`

            jest.spyOn(global, 'fetch').mockImplementation((url, config) => Promise.resolve({ json: () => {
                if (url === 'https://jsonplaceholder.typicode.com/users/8') {
                    return Promise.resolve({"id":8,"name":"Nicholas Runolfsdottir V","username":"Maxime_Nienow","email":"Sherwood@rosamond.me","address":{"street":"Ellsworth Summit","suite":"Suite 729","city":"Aliyaview","zipcode":"45169","geo":{"lat":"-14.3990","lng":"-120.7677"}},"phone":"586.493.6943 x140","website":"jacynthe.com","company":{"name":"Abernathy Group","catchPhrase":"Implemented secondary concept","bs":"e-enable extensible e-tailers"}})
                } else if (url === 'https://jsonplaceholder.typicode.com/users') {
                    return Promise.resolve([{"id":1,"name":"Leanne Graham","username":"Bret","email":"Sincere@april.biz","address":{"street":"Kulas Light","suite":"Apt. 556","city":"Gwenborough","zipcode":"92998-3874","geo":{"lat":"-37.3159","lng":"81.1496"}},"phone":"1-770-736-8031 x56442","website":"hildegard.org","company":{"name":"Romaguera-Crona","catchPhrase":"Multi-layered client-server neural-net","bs":"harness real-time e-markets"}},{"id":2,"name":"Ervin Howell","username":"Antonette","email":"Shanna@melissa.tv","address":{"street":"Victor Plains","suite":"Suite 879","city":"Wisokyburgh","zipcode":"90566-7771","geo":{"lat":"-43.9509","lng":"-34.4618"}},"phone":"010-692-6593 x09125","website":"anastasia.net","company":{"name":"Deckow-Crist","catchPhrase":"Proactive didactic contingency","bs":"synergize scalable supply-chains"}},{"id":3,"name":"Clementine Bauch","username":"Samantha","email":"Nathan@yesenia.net","address":{"street":"Douglas Extension","suite":"Suite 847","city":"McKenziehaven","zipcode":"59590-4157","geo":{"lat":"-68.6102","lng":"-47.0653"}},"phone":"1-463-123-4447","website":"ramiro.info","company":{"name":"Romaguera-Jacobson","catchPhrase":"Face to face bifurcated interface","bs":"e-enable strategic applications"}},{"id":4,"name":"Patricia Lebsack","username":"Karianne","email":"Julianne.OConner@kory.org","address":{"street":"Hoeger Mall","suite":"Apt. 692","city":"South Elvis","zipcode":"53919-4257","geo":{"lat":"29.4572","lng":"-164.2990"}},"phone":"493-170-9623 x156","website":"kale.biz","company":{"name":"Robel-Corkery","catchPhrase":"Multi-tiered zero tolerance productivity","bs":"transition cutting-edge web services"}},{"id":5,"name":"Chelsey Dietrich","username":"Kamren","email":"Lucio_Hettinger@annie.ca","address":{"street":"Skiles Walks","suite":"Suite 351","city":"Roscoeview","zipcode":"33263","geo":{"lat":"-31.8129","lng":"62.5342"}},"phone":"(254)954-1289","website":"demarco.info","company":{"name":"Keebler LLC","catchPhrase":"User-centric fault-tolerant solution","bs":"revolutionize end-to-end systems"}},{"id":6,"name":"Mrs. Dennis Schulist","username":"Leopoldo_Corkery","email":"Karley_Dach@jasper.info","address":{"street":"Norberto Crossing","suite":"Apt. 950","city":"South Christy","zipcode":"23505-1337","geo":{"lat":"-71.4197","lng":"71.7478"}},"phone":"1-477-935-8478 x6430","website":"ola.org","company":{"name":"Considine-Lockman","catchPhrase":"Synchronised bottom-line interface","bs":"e-enable innovative applications"}},{"id":7,"name":"Kurtis Weissnat","username":"Elwyn.Skiles","email":"Telly.Hoeger@billy.biz","address":{"street":"Rex Trail","suite":"Suite 280","city":"Howemouth","zipcode":"58804-1099","geo":{"lat":"24.8918","lng":"21.8984"}},"phone":"210.067.6132","website":"elvis.io","company":{"name":"Johns Group","catchPhrase":"Configurable multimedia task-force","bs":"generate enterprise e-tailers"}},{"id":8,"name":"Nicholas Runolfsdottir V","username":"Maxime_Nienow","email":"Sherwood@rosamond.me","address":{"street":"Ellsworth Summit","suite":"Suite 729","city":"Aliyaview","zipcode":"45169","geo":{"lat":"-14.3990","lng":"-120.7677"}},"phone":"586.493.6943 x140","website":"jacynthe.com","company":{"name":"Abernathy Group","catchPhrase":"Implemented secondary concept","bs":"e-enable extensible e-tailers"}},{"id":9,"name":"Glenna Reichert","username":"Delphine","email":"Chaim_McDermott@dana.io","address":{"street":"Dayna Park","suite":"Suite 449","city":"Bartholomebury","zipcode":"76495-3109","geo":{"lat":"24.6463","lng":"-168.8889"}},"phone":"(775)976-6794 x41206","website":"conrad.com","company":{"name":"Yost and Sons","catchPhrase":"Switchable contextually-based project","bs":"aggregate real-time technologies"}},{"id":10,"name":"Clementina DuBuque","username":"Moriah.Stanton","email":"Rey.Padberg@karina.biz","address":{"street":"Kattie Turnpike","suite":"Suite 198","city":"Lebsackbury","zipcode":"31428-2261","geo":{"lat":"-38.2386","lng":"57.2232"}},"phone":"024-648-3804","website":"ambrose.net","company":{"name":"Hoeger LLC","catchPhrase":"Centralized empowering task-force","bs":"target end-to-end models"}}])
                } else if (config.body.indexOf('{ continents {') !== -1) {
                    return Promise.resolve({"data":{"continents":[{"code":"AF","name":"Africa"},{"code":"AN","name":"Antarctica"},{"code":"AS","name":"Asia"},{"code":"EU","name":"Europe"},{"code":"NA","name":"North America"},{"code":"OC","name":"Oceania"},{"code":"SA","name":"South America"}]}})
                } else {
                    return Promise.resolve({"data":{"continent":{"code":"EU","name":"Europe"}}})
                }
            }}))

            const r1 = await graphql(schema, query)
            // console.log(JSON.stringify(r1.data))
            expect(r1.data.Typicode.user.id).toBe('8')
            expect(r1.data.Typicode.users).toBeInstanceOf(Array)
            expect(r1.data.Trevorblades.continent.name).toBe('Europe')
            expect(r1.data.Trevorblades.continents.length).toBe(7)

            global.fetch.mockClear()
        })

        test('it should be able to take arguments in the extension wrapper level', async () => {
            const ext = parseExtension({
                name: 'ExtensionName',
                shouldRunQueries: true,
                types: {
                    User: {
                        id: 'ID!',
                        name: 'String',
                    },
                },
                queries: {
                    __wrapper__: {
                        args: { foo: 'String' },
                    },
                    users: {
                        type: '[User]',
                        args: { foo: 'String' },
                        resolve: {
                            type: 'rest',
                            url: 'https://jsonplaceholder.typicode.com/users',
                            headers: { 'test': '{{ root.foo }}{{ args.foo }}' }
                        },
                    },
                },
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: ext.queries,
                }),
            })

            const query = `{
                ExtensionName (foo: "a") {
                    users (foo: "b") { id name }
                }
            }`

            jest.spyOn(global, 'fetch').mockImplementation((url, config) => Promise.resolve({ json: () => {
                if (url === 'https://jsonplaceholder.typicode.com/users') {
                    expect(config.headers.test).toBe('ab')

                    return Promise.resolve([
                        { id: 1, name: 'u1' },
                        { id: 2, name: 'u2' },
                    ])
                }
            }}))

            const r1 = await graphql(schema, query)
            // console.log(JSON.stringify(r1))
            expect(r1.data.ExtensionName.users).toBeInstanceOf(Array)

            global.fetch.mockClear()
        })

        test('it should be able to handle complex variables scenarios in both REST and GraphQL', async () => {
            const typicode = parseExtension({
                name: 'Typicode',
                shouldRunQueries: true,
                variables: {
                    baseUrl: 'https://jsonplaceholder.typicode.com/users',
                },
                types: {
                    User: {
                        id: 'ID!',
                        name: 'String',
                    },
                },
                queries: {
                    __wrapper__: {
                        args: { token: 'ID!' },
                    },
                    users: {
                        type: '[User]',
                        resolve: {
                            type: 'rest',
                            url: '{{ baseUrl }}',
                            headers: { 'x-token': '{{ root.token }}' }
                        },
                    },
                    user: {
                        type: 'User',
                        args: {
                            id: 'ID!',
                        },
                        resolve: {
                            type: 'rest',
                            url: '{{ baseUrl }}/{{args.id}}',
                            headers: { 'x-token': '{{ root.token }}' }
                        },
                    },
                },
            })

            const trevorblades = parseExtension({
                name: 'Trevorblades',
                shouldRunQueries: true,
                variables: {
                    baseUrl: 'https://countries.trevorblades.com/',
                },
                types: {
                    Continent: {
                        code: 'ID!',
                        name: 'String',
                    },
                },
                queries: {
                    __wrapper__: {
                        args: { token: 'ID!' },
                    },
                    continents: {
                        type: '[Continent]',
                        resolve: {
                            type: 'graphql',
                            url: 'baseUrl',
                            headers: { 'x-token': '{{ root.token }}' },
                            query: '{ continents { code name }}',
                            grab: 'data.continents',
                        },
                    },
                    continent: {
                        type: 'Continent',
                        args: {
                            code: 'String!',
                        },
                        resolve: {
                            type: 'graphql',
                            url: 'baseUrl',
                            headers: { 'x-token': '{{ root.token }}' },
                            query: 'query foo ($code: String!) { continent (code: $code) { code name }}',
                            variables: { code: '{{ args.code }}' },
                            grab: 'data.continent',
                        },
                    },
                },
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        ...typicode.queries,
                        ...trevorblades.queries,
                    },
                }),
            })

            const query = `
                query q (
                    $token: ID!
                    $countryCode: String!
                ) {
                    Typicode (token: $token) {
                        user (id: 8) { id name }
                        users { id name }
                    }
                    Trevorblades (token: $token) {
                        continent (code: $countryCode) { code }
                        continents { code name }
                    }
                }`

            jest.spyOn(global, 'fetch').mockImplementation((url, config) => Promise.resolve({ json: () => {
                expect(config.headers['x-token']).toBe('tk1')
                // console.log(url, config.headers)
                if (url === 'https://jsonplaceholder.typicode.com/users/8') {
                    return Promise.resolve({"id":8,"name":"Nicholas Runolfsdottir V","username":"Maxime_Nienow","email":"Sherwood@rosamond.me","address":{"street":"Ellsworth Summit","suite":"Suite 729","city":"Aliyaview","zipcode":"45169","geo":{"lat":"-14.3990","lng":"-120.7677"}},"phone":"586.493.6943 x140","website":"jacynthe.com","company":{"name":"Abernathy Group","catchPhrase":"Implemented secondary concept","bs":"e-enable extensible e-tailers"}})
                } else if (url === 'https://jsonplaceholder.typicode.com/users') {
                    return Promise.resolve([{"id":1,"name":"Leanne Graham","username":"Bret","email":"Sincere@april.biz","address":{"street":"Kulas Light","suite":"Apt. 556","city":"Gwenborough","zipcode":"92998-3874","geo":{"lat":"-37.3159","lng":"81.1496"}},"phone":"1-770-736-8031 x56442","website":"hildegard.org","company":{"name":"Romaguera-Crona","catchPhrase":"Multi-layered client-server neural-net","bs":"harness real-time e-markets"}},{"id":2,"name":"Ervin Howell","username":"Antonette","email":"Shanna@melissa.tv","address":{"street":"Victor Plains","suite":"Suite 879","city":"Wisokyburgh","zipcode":"90566-7771","geo":{"lat":"-43.9509","lng":"-34.4618"}},"phone":"010-692-6593 x09125","website":"anastasia.net","company":{"name":"Deckow-Crist","catchPhrase":"Proactive didactic contingency","bs":"synergize scalable supply-chains"}},{"id":3,"name":"Clementine Bauch","username":"Samantha","email":"Nathan@yesenia.net","address":{"street":"Douglas Extension","suite":"Suite 847","city":"McKenziehaven","zipcode":"59590-4157","geo":{"lat":"-68.6102","lng":"-47.0653"}},"phone":"1-463-123-4447","website":"ramiro.info","company":{"name":"Romaguera-Jacobson","catchPhrase":"Face to face bifurcated interface","bs":"e-enable strategic applications"}},{"id":4,"name":"Patricia Lebsack","username":"Karianne","email":"Julianne.OConner@kory.org","address":{"street":"Hoeger Mall","suite":"Apt. 692","city":"South Elvis","zipcode":"53919-4257","geo":{"lat":"29.4572","lng":"-164.2990"}},"phone":"493-170-9623 x156","website":"kale.biz","company":{"name":"Robel-Corkery","catchPhrase":"Multi-tiered zero tolerance productivity","bs":"transition cutting-edge web services"}},{"id":5,"name":"Chelsey Dietrich","username":"Kamren","email":"Lucio_Hettinger@annie.ca","address":{"street":"Skiles Walks","suite":"Suite 351","city":"Roscoeview","zipcode":"33263","geo":{"lat":"-31.8129","lng":"62.5342"}},"phone":"(254)954-1289","website":"demarco.info","company":{"name":"Keebler LLC","catchPhrase":"User-centric fault-tolerant solution","bs":"revolutionize end-to-end systems"}},{"id":6,"name":"Mrs. Dennis Schulist","username":"Leopoldo_Corkery","email":"Karley_Dach@jasper.info","address":{"street":"Norberto Crossing","suite":"Apt. 950","city":"South Christy","zipcode":"23505-1337","geo":{"lat":"-71.4197","lng":"71.7478"}},"phone":"1-477-935-8478 x6430","website":"ola.org","company":{"name":"Considine-Lockman","catchPhrase":"Synchronised bottom-line interface","bs":"e-enable innovative applications"}},{"id":7,"name":"Kurtis Weissnat","username":"Elwyn.Skiles","email":"Telly.Hoeger@billy.biz","address":{"street":"Rex Trail","suite":"Suite 280","city":"Howemouth","zipcode":"58804-1099","geo":{"lat":"24.8918","lng":"21.8984"}},"phone":"210.067.6132","website":"elvis.io","company":{"name":"Johns Group","catchPhrase":"Configurable multimedia task-force","bs":"generate enterprise e-tailers"}},{"id":8,"name":"Nicholas Runolfsdottir V","username":"Maxime_Nienow","email":"Sherwood@rosamond.me","address":{"street":"Ellsworth Summit","suite":"Suite 729","city":"Aliyaview","zipcode":"45169","geo":{"lat":"-14.3990","lng":"-120.7677"}},"phone":"586.493.6943 x140","website":"jacynthe.com","company":{"name":"Abernathy Group","catchPhrase":"Implemented secondary concept","bs":"e-enable extensible e-tailers"}},{"id":9,"name":"Glenna Reichert","username":"Delphine","email":"Chaim_McDermott@dana.io","address":{"street":"Dayna Park","suite":"Suite 449","city":"Bartholomebury","zipcode":"76495-3109","geo":{"lat":"24.6463","lng":"-168.8889"}},"phone":"(775)976-6794 x41206","website":"conrad.com","company":{"name":"Yost and Sons","catchPhrase":"Switchable contextually-based project","bs":"aggregate real-time technologies"}},{"id":10,"name":"Clementina DuBuque","username":"Moriah.Stanton","email":"Rey.Padberg@karina.biz","address":{"street":"Kattie Turnpike","suite":"Suite 198","city":"Lebsackbury","zipcode":"31428-2261","geo":{"lat":"-38.2386","lng":"57.2232"}},"phone":"024-648-3804","website":"ambrose.net","company":{"name":"Hoeger LLC","catchPhrase":"Centralized empowering task-force","bs":"target end-to-end models"}}])
                } else if (config.body.indexOf('{ continents {') !== -1) {
                    return Promise.resolve({"data":{"continents":[{"code":"AF","name":"Africa"},{"code":"AN","name":"Antarctica"},{"code":"AS","name":"Asia"},{"code":"EU","name":"Europe"},{"code":"NA","name":"North America"},{"code":"OC","name":"Oceania"},{"code":"SA","name":"South America"}]}})

                // Query single continent
                } else {
                    const body = JSON.parse(config.body)
                    return Promise.resolve({"data":{"continent":{"code": body.variables.code, "name":"Europe"}}})
                }
            }}))

            const r1 = await graphql(schema, query, null, null, {
                token: 'tk1',
                countryCode: 'EU',
            })
            // console.log(JSON.stringify(r1.data))
            expect(r1.data.Typicode.user.id).toBe('8')
            expect(r1.data.Typicode.users).toBeInstanceOf(Array)
            expect(r1.data.Trevorblades.continent.code).toBe('EU')
            expect(r1.data.Trevorblades.continents.length).toBe(7)

            global.fetch.mockClear()
        })

        test('it should be able to show meaningful errors from the applied rules', async () => {
            const typicode = parseExtension({
                name: 'Typicode',
                shouldRunQueries: true,
                variables: {
                    baseUrl: 'https://jsonplaceholder.typicode.com/users',
                },
                types: {
                    User: {
                        id: 'ID!',
                        name: 'String',
                    },
                },
                queries: {
                    __wrapper__: {
                        args: { token: 'ID!' },
                    },
                    users: {
                        type: '[User]',
                        resolve: {
                            type: 'rest',
                            url: '{{ baseUrl }}',
                            headers: { 'x-token': '{{ root.token }}' },
                            rules: [{
                                match: ['statusError'],
                                apply: ['statusError'],
                            }],
                        },
                    },
                    user: {
                        type: 'User',
                        args: {
                            id: 'ID!',
                        },
                        resolve: {
                            type: 'rest',
                            url: '{{ baseUrl }}/{{args.id}}',
                            headers: { 'x-token': '{{ root.token }}' },
                            rules: [{
                                match: ['statusError'],
                                apply: ['statusError'],
                            }],
                        },
                    },
                },
            })

            const trevorblades = parseExtension({
                name: 'Trevorblades',
                shouldRunQueries: true,
                variables: {
                    baseUrl: 'https://countries.trevorblades.com/',
                },
                types: {
                    Continent: {
                        code: 'ID!',
                        name: 'String',
                    },
                },
                queries: {
                    __wrapper__: {
                        args: { token: 'ID!' },
                    },
                    continents: {
                        type: '[Continent]',
                        resolve: {
                            type: 'graphql',
                            url: 'baseUrl',
                            headers: { 'x-token': '{{ root.token }}' },
                            rules: [{
                                match: ['statusError'],
                                apply: ['statusError'],
                            }],
                            query: '{ continents { code name }}',
                            grab: 'data.continents',
                        },
                    },
                    continent: {
                        type: 'Continent',
                        args: {
                            code: 'String!',
                        },
                        resolve: {
                            type: 'graphql',
                            url: 'baseUrl',
                            headers: { 'x-token': '{{ root.token }}' },
                            rules: [{
                                match: ['statusError'],
                                apply: ['statusError'],
                            }],
                            query: 'query foo ($code: String!) { continent (code: $code) { code name }}',
                            variables: { code: '{{ args.code }}' },
                            grab: 'data.continent',
                        },
                    },
                },
            })

            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQuery',
                    fields: {
                        ...typicode.queries,
                        ...trevorblades.queries,
                    },
                }),
            })

            const query = `
                query q (
                    $token: ID!
                    $countryCode: String!
                ) {
                    Typicode (token: $token) {
                        user (id: 8) { id name }
                        users { id name }
                    }
                    Trevorblades (token: $token) {
                        continent (code: $countryCode) { code }
                        continents { code name }
                    }
                }`

                jest.spyOn(global, 'fetch').mockImplementation((url, config) => Promise.resolve({
                    status: 400,
                    statusText: 'not available'
                }))

            const r1 = await graphql(schema, query, null, null, {
                token: 'tk1',
                countryCode: 'EU',
            })
            console.log(r1)

            r1.errors.forEach(err => {
                expect(err.message).toBe('400 not available')
            })

            global.fetch.mockClear()
        })
    })
})
