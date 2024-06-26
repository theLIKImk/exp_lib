const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: { type: String, required: true, max: 100 },
});

// 虚拟属性'url'：藏书 类型 URL
GenreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});

// 导出 Genre 模块
module.exports = mongoose.model("Genre", GenreSchema);
