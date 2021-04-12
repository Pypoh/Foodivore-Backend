const { SchemaType } = require("mongoose");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      imageUrl: String,
      name: String,
      calorie: Number,
      fat: Number,
      carb: Number,
      prot: Number,
      type: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Food = mongoose.model("food", schema);
  return Food;
};
