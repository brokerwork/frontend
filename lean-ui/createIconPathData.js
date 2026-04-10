const fs = require("fs");
const iconDataJson = require("./LeanWork-Icons/selection.json");
const targetPath = "./components/Icon";
const iconData = {};
iconDataJson.icons.forEach(item => {
  const { codes, name } = item.properties;
  if (Array.isArray(item.properties.codes)) {
    const sortName = name.replace("lw-", "");
    iconData[sortName] = codes.map((item, index) => {
      return `path${index + 1}`;
    });
  }
});

// 'src/utils/iconMap.js'文件生成
const iconMapJsContent = `const fontPath: { [s: string]: string[] } = ${JSON.stringify(
  iconData
)};
export default fontPath;`;
fs.writeFile(`${targetPath}/iconFontPath.ts`, iconMapJsContent, function(err) {
  if (err) {
    return console.log(err);
  }
  console.log('"src/utils/iconMap.js" was saved!');
});
