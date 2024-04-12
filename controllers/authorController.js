var async = require("async");
var Book = require("../models/book");
const Author = require("../models/author");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// 显示所有作者
exports.author_list = asyncHandler(async (req, res, next) => {
    Author.find()
    .sort([["family_name", "ascending"]])
    .exec().then(list_authors => {
		//Successful, so render
		res.render("author_list", {
			title: "作者列表",
			author_list: list_authors,
		});
	}).catch(err => {
		return next(err);
	});
});

// 显示作者和书本
exports.author_detail = asyncHandler(async (req, res, next) => {
  	// 获取作者的详细信息以及相应书本
	const [author, allBooksByAuthor] = await Promise.all([
		Author.findById(req.params.id).exec(),
		Book.find({ author: req.params.id }, "title summary").exec(),
	]);

	if (author === null) {
		// 没有结果。
		const err = new Error("作者未找到");
		err.status = 404;
		return next(err);
	}

    res.render("author_detail", {
        title: "所有作者",
        author: author,
        author_books: allBooksByAuthor,
	});
});


// 显示作者创建在 GET.
exports.author_create_get = function (req, res, next) {
  res.render("author_form", { title: "创建作者" });
};


// 处理流派创建 POST.
exports.author_create_post = [
	//	验证和清理字段。
	body("first_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("必须指定名字.")
		.isAlphanumeric()
		.withMessage("名字包含非字母数字字符."),
	body("family_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("必须指定姓氏。")
		.isAlphanumeric()
		.withMessage("姓氏包含非字母数字字符."),
	body("date_of_birth", "非法的生日")
		.optional({ values: "falsy" })
		.isISO8601()
		.toDate(),
	body("date_of_death", "非法的逝日")
		.optional({ values: "falsy" })
		.isISO8601()
		.toDate(),

	// 验证和清理后的处理请求。
	asyncHandler(async (req, res, next) => {
		// 从请求中提取验证错误。
		const errors = validationResult(req);

		// 使用转义和修剪的数据创建 Author 对象
		const author = new Author({
			first_name: req.body.first_name,
			family_name: req.body.family_name,
			date_of_birth: req.body.date_of_birth,
			date_of_death: req.body.date_of_death,
		});

		if (!errors.isEmpty()) {
			// 有错误。使用经过清理的值/错误消息再次呈现表单。
			res.render("author_form", {
				title: "创建作者",
				author: author,
				errors: errors.array(),
			});
			return;
		} else {
			//表单中的数据有效。
			//保存作者。
			await author.save();
			// 重定向至新作者记录。
			res.redirect(author.url);
		}
	}),
];

// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
});

// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
});

// Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});
