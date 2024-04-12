const Genre = require("../models/genre");
var Book = require("../models/book");
var async = require("async");
var mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// 显示所有类别
exports.genre_list = asyncHandler(async (req, res, next) => {
	Genre.find()
    .sort("name")
    .exec().then(list_genre => {
		//Successful, so render
		res.render("genre_list", {
			title: "种类列表",
			genre_list: list_genre,
		});
	}).catch(err => {
		return next(err);
	});
});

// 显示书本详细信息
exports.genre_detail = asyncHandler(async (req, res, next) => {
	// Get details of genre and all associated books (in parallel)
	const [genre, booksInGenre] = await Promise.all([
		Genre.findById(req.params.id).exec(),
		Book.find({ genre: req.params.id }, "title summary").exec(),
	]);
	if (genre === null) {
		// 未找到404页面
		const err = new Error("类别未找到");
		err.status = 404;
		return next(err);
	}

	res.render("genre_detail", {
		title: "书本类别",
		genre: genre,
		genre_books: booksInGenre,
	});
});

// 显示流派创建在 GET.
exports.genre_create_get = function (req, res, next) {
	res.render("genre_form", { title: "创建流派" });
};

// 处理流派创建在 POST.
exports.genre_create_post = [
	//	验证并清理名称字段。
	body("name", "至少三个字符")
		.trim()
		.isLength({ min: 3 })
		.escape(),

	// 验证和清理后的处理请求。
	asyncHandler(async (req, res, next) => {
		// 从请求中提取验证错误。
		const errors = validationResult(req);

		//使用转义和修整的数据创建流派对象。
		const genre = new Genre({ name: req.body.name });

		if (!errors.isEmpty()) {
			// 有错误。使用经过清理的值/错误消息再次呈现表单。
			res.render("genre_form", {
				title: "创建流派",
				genre: genre,
				errors: errors.array(),
			});
			return;
		} else {
		  //表单中的数据有效。
		  //检查同名流派是否已存在。
		  const genreExists = await Genre.findOne({ name: req.body.name }).exec();
		  if (genreExists) {
			// 流派存在，请重定向到其详细信息页面。
			res.redirect(genreExists.url);
		  } else {
			await genre.save();
			// 保存了新流派。重定向至流派详情页面。
			res.redirect(genre.url);
		  }
		}
	}),
];



// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
