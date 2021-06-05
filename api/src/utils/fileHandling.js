const getFileContent = (path) => {
  const contents = fs.readFileSync(path, "utf8");

  return contents;
};

const appendFileContent = (path, content) => {
  const contents = fs.appendFileSync(path, content);

  return contents;
};

const deleteFile = async (path) => {
  fs.unlinkSync(path);
}

const renameFile = async (path, newPath) => {
  fs.renameSync(path, newPath);
}