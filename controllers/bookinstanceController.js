const BookInstance = require("../models/bookinstance");
var Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// 显示书本实例列表
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  BookInstance.find()
    .populate("book")
    .exec().then(list_bookinstances => {
		res.render("bookinstance_list", { title: "书本状态", bookinstance_list: list_bookinstances });
	}).catch (err => {
		return next(err);
	});
});


// 显示书本状况
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
	const bookInstance = await BookInstance.findById(req.params.id)
	.populate("book")
    .exec();

	if (bookInstance === null) {
		// No results.
		const err = new Error("未找到书籍拷贝");
		err.status = 404;
		return next(err);
	}

	res.render("bookinstance_detail", {
		title: "Book:",
		bookinstance: bookInstance,
	});
});

// 显示书本状态创建表单GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

  res.render("bookinstance_form", {
    title: "书本状态创建",
    book_list: allBooks,
  });
});


// 处理书本状态创建 POST.
exports.bookinstance_create_post = [
	// 验证和清理字段。
	body("book", "必须指定书籍").trim().isLength({ min: 1 }).escape(),
	body("imprint", "必须指定版本说明")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("status").escape(),
	body("due_back", "非法的日期")
		.optional({ values: "falsy" })
		.isISO8601()
		.toDate(),

	//验证和清理后的处理请求。
	asyncHandler(async (req, res, next) => {
		// 从请求中提取验证错误。
		const errors = validationResult(req);

		// 使用转义和修整的数据创建 BookInstance 对象。
		const bookInstance = new BookInstance({
			book: req.body.book,
			imprint: req.body.imprint,
			status: req.body.status,
			due_back: req.body.due_back,
		});

		if (!errors.isEmpty()) {
		  // 有错误。
		  // 使用经过清理的值和错误消息再次呈现表单。
		  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

			res.render("bookinstance_form", {
				title: "创建状态",
				book_list: allBooks,
				selected_book: bookInstance.book._id,
				errors: errors.array(),
				bookinstance: bookInstance,
			});
			return;
		} else {
			// 表单中的数据有效
			await bookInstance.save();
			res.redirect(bookInstance.url);
		}
	}),
];


// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});
