const gulp = require("gulp");
const ts = require("gulp-typescript");
const path = require("path");
const less = require("gulp-less");
const tsconfigJson = require("./tsconfig.json");

const tsConfig = Object.assign({}, tsconfigJson.compilerOptions, {
  declaration: true
});
const distDir = "./lib";

gulp.task("default", ["tsc", "less"]);

gulp.task("tsc", function() {
  const tsResult = gulp
    .src([
      "./components/**/*.tsx",
      "./components/**/*.ts",
      "./typings/**/*.d.ts"
    ])
    .pipe(ts(tsConfig));
  return tsResult.pipe(gulp.dest(distDir));
});

gulp.task("less", ["lessFont"], function() {
  return (
    gulp
      .src(["./less/index.less"])
      // .src(["./less/index.less", "./components/**/less/index.less"])
      .pipe(less())
      .pipe(gulp.dest(distDir))
  );
});

gulp.task("lessFont", function() {
  return gulp
    .src(["./LeanWork-Icons/fonts/**"])
    .pipe(gulp.dest(distDir + "/fonts"));
});
