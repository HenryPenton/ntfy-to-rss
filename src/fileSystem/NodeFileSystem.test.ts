import { NodeFileSystem } from "./NodeFileSystem";
describe("Node file system", () => {
  const dummyObject = { someProperty: "someValue" };
  test("reading a json file", () => {
    const dummyReader = jest.fn().mockReturnValue(JSON.stringify(dummyObject));

    const fileSystem = new NodeFileSystem(
      dummyReader,
      jest.fn(),
      jest.fn(),
      jest.fn()
    );

    const jsonBlob = fileSystem.readJSONFile("test/file/path/file.json");

    expect(dummyReader).toHaveBeenCalledTimes(1);
    expect(dummyReader).toHaveBeenCalledWith(
      "test/file/path/file.json",
      "utf-8"
    );
    expect(jsonBlob).toEqual(dummyObject);
  });

  test("writing a json file", () => {
    const dummyWriter = jest.fn();

    const fileSystem = new NodeFileSystem(
      jest.fn(),
      dummyWriter,
      jest.fn(),
      jest.fn()
    );

    fileSystem.writeJSONFile("test/file/path/file.json", dummyObject);

    expect(dummyWriter).toHaveBeenCalledTimes(1);
    expect(dummyWriter).toHaveBeenCalledWith(
      "test/file/path/file.json",
      '{"someProperty":"someValue"}',
      "utf-8"
    );
  });

  test("making a directory", () => {
    const dummyDirectoryMaker = jest.fn();

    const fileSystem = new NodeFileSystem(
      jest.fn(),
      jest.fn(),
      dummyDirectoryMaker,
      jest.fn()
    );

    fileSystem.makeDirectoryForFile("test/file/path/file.json");

    expect(dummyDirectoryMaker).toHaveBeenCalledTimes(1);
    expect(dummyDirectoryMaker).toHaveBeenCalledWith("test/file/path", {
      recursive: true,
    });
  });

  test("check a directory exists", () => {
    const dummyFileExistsChecker = jest.fn();

    const fileSystem = new NodeFileSystem(
      jest.fn(),
      jest.fn(),
      jest.fn(),
      dummyFileExistsChecker
    );

    fileSystem.checkFileExists("test/file/path/file.json");

    expect(dummyFileExistsChecker).toHaveBeenCalledTimes(1);
    expect(dummyFileExistsChecker).toHaveBeenCalledWith("test/file/path/file.json");
  });
});
