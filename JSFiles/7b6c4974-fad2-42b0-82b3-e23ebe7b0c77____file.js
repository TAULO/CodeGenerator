const chai = require("chai");
const { expect } = chai; 
chai.should();

const Url = require("../src/url");
const File = require("../src/file");

const Test = require('./util');
const testFile = Test.File;


describe("File", () => {

	describe("Factory", () => {

		describe("Url as String", () => {

			it("Internal", () => {
				const TEST = "/folder/page";

				const TEST_FILE_RESULT = {
					rootDirectory: "",
					filePath: ["folder"],
					fileName: "page",
					fileExtension: "html",
					location: "./folder/page.html"
				};

				testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);

			});

			it("With query", () => {

				const TEST = "/folder/page?v=123";

				const TEST_FILE_RESULT = {
					rootDirectory: "",
					filePath: ["folder"],
					fileName: "page$v=123",
					fileExtension: "html",
					location: "./folder/page$v=123.html"
				};

				testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);

			});

			it("Internal Index page", () => {
				const TEST = "/";

				const TEST_FILE_RESULT = {
					rootDirectory: "",
					filePath: [],
					fileName: "index",
					fileExtension: "html",
					location: "./index.html"
				};

				testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);

			});

			it("Internal Index page with query", () => {
				const TEST = "/?v=123";

				const TEST_FILE_RESULT = {
					rootDirectory: "",
					filePath: [],
					fileName: "index$v=123",
					fileExtension: "html",
					location: "./index$v=123.html"
				};

				testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);
			});


			it("External", () => {

				const TEST = "https://test.com/folder/page";

				const TEST_FILE_RESULT = {
					rootDirectory: "",
					filePath: ["com", "test", "folder"],
					fileName: "page",
					fileExtension: "html",
					location: "./com/test/folder/page.html"
				};

				testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);

			});

			it("External Index Page", () => {
				
				const TEST = "https://test.com/";

				const TEST_FILE_RESULT = {
					rootDirectory: "",
					filePath: ["com", "test"],
					fileName: "index",
					fileExtension: "html",
					location: "./com/test/index.html"
				};

				const file = File.getUrlFileFactory()(TEST);

				testFile(file, TEST_FILE_RESULT);
			});

			it("External Index Page with Query", () => {
				const TEST = "https://test.com?v=123";

				const TEST_FILE_RESULT = {
					rootDirectory: "",
					filePath: [ "com", "test" ],
					fileName: "index$v=123",
					fileExtension: "html",
					location: "./com/test/index$v=123.html"
				};

				testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);
			});

		});

		describe("Url instance - default", () => {

		});

		describe("Url instance - custom", () => {

		});

	});

	describe("getFullFilePath", () => {

		const getFullFilePath = File.getFullFilePath;

		it("Expect", () => {
			getFullFilePath("footer", ["folder", "subfolder"], "page", "html").should.equal("./footer/folder/subfolder/page.html");
			getFullFilePath(undefined,["folder", "subfolder"], "page", "html").should.equal("./folder/subfolder/page.html");
		});

		it("Expect to throw", () => {
			expect(getFullFilePath.bind({}, {}, "asdf", "asdf")).to.throw();
			expect(getFullFilePath.bind({}, "", "asdf", "asdf")).to.throw();
			expect(getFullFilePath.bind({}, [], 2, "asdf")).to.throw();
			expect(getFullFilePath.bind({}, [], "asdf", 2)).to.throw();
		})

	});

	describe("getFilePath", () => {

		const getFilePath = File.getFilePathFromRoute;

		it("Index page", () => {
			const arr = getFilePath("");
			arr.should.have.lengthOf(0);
		});

		/*
		it("External Index page", () => {
			const arr = getFilePath("com/test");
			arr.should.have.lengthOf(2);
			checkArray(arr, ["com", "test"])
		});
		*/


		it("Expect no-extension to return empty string", () => {
			const func1 = getFilePath("page/page/site.html");
			const res1 = [ "page", "page" ];
			checkArray(func1,res1);
		});


		function checkArray(check, result) {
			check.forEach((e, i) => e.should.equal(result[i]));
		}


		describe("Test", () => {

			const url = {
				isExternal: true,
				host: "localhost",
				route: "page/page"
			};

			const filePathString = url.isExternal 
				? File.getHostRoute(url.host) + "/" + url.route
				: url.route;
			const filePath = File.getFilePathFromRoute(filePathString);

			it("filePathString", () => {
				filePathString.should.equal("localhost/page/page")
			});

			it("filePath", () => {
				filePath.should.have.lengthOf(2);
				console.log(filePath);
			});

		});

	});

	describe("getFileExtension", () => {

		const getFileExtension = File.getFileExtensionFromRoute;

		it("Expect no-extension to return empty string", () => {
			getFileExtension("page/page").should.equal("");
		});

		it("Expect extension to be returned in lower case", () => {
			getFileExtension("page/page.html").should.equal("html");
			getFileExtension("page/page.Html").should.equal("html");
		});

		it("Page, no file extension", () => {
			getFileExtension("page/page/html", "php").should.equal("php");
		})

		it("Expect non-string to throw", () => {
			expect(getFileExtension.bind({}, 1)).to.throw();
			expect(getFileExtension.bind({}, [":"])).to.throw();
			expect(getFileExtension.bind({}, ["/"])).to.throw();
			expect(getFileExtension.bind({}, ["."])).to.throw();
		});

	});

	describe("getFileName", () => {

		const getFileName = File.getFileNameFromRoute;

		it("No path should equal self", () => {
			getFileName("page").should.equal("page");
		});

		it("Should include last leg", () => {
			getFileName("/page/page").should.equal("page");
		});

		it("Should include last leg", () => {
			getFileName("/page/page.html").should.equal("page");
		});

		it("Should allow for multiple periods", () => {
			getFileName("/page/page.test.html").should.equal("page.test");
		});

		it("Should not ignore query", () => {
			getFileName("/page/page.test.html", "v=234").should.equal("page.test$v=234");
		});

		it("Index -> blank", () => {
			getFileName("/").should.equal("");
		});

		it("Expect non-string to throw", () => {
			expect(getFileName.bind({}, 1)).to.throw();
			expect(getFileName.bind({}, [":"])).to.throw();
			expect(getFileName.bind({}, ["/"])).to.throw();
		});

	});

	describe("getHostRoute", () => {

		it("localhost", () => {
			File.getHostRoute("localhost").should.equal("localhost");
		});

		it("test.com", () => {
			File.getHostRoute("test.com").should.equal("com/test");
		});

		it("api.test.com", () => {
			File.getHostRoute("api.test.com").should.equal("com/test/api");
		});

	})

});