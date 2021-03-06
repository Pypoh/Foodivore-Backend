const { SchemaType } = require("mongoose");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      userId: String,
      // foodId: String,
      consumedAt: String,
      ingredients: [
        {
          ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ingredient",
          },
          count: {
            type: Number
          }
        },
      ],
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Record = mongoose.model("record", schema);
  return Record;
};
