const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// ��������'name'����ʾ����ȫ��
AuthorSchema.virtual("name").get(function () {
  return this.family_name + ", " + this.first_name;
});

// ��������'lifespan'����������
AuthorSchema.virtual("lifespan").get(function () {
  return (
    this.date_of_death.getYear() - this.date_of_birth.getYear()
  ).toString();
});

// ��������'url'������ URL
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// ���� Author ģ��
module.exports = mongoose.model("Author", AuthorSchema);