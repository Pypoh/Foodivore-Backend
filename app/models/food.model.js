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
      schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
      },
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
