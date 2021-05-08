const { SchemaType } = require("mongoose");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      imageUrl: String,
      title: String,
      author: String,
      content: String,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Article = mongoose.model("Article", schema);
  return Article;
};
