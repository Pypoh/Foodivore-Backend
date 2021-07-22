const { SchemaType } = require("mongoose");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      userId: String,
      consumedAt: String,
      ingredient: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ingredient",
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

  const Plan = mongoose.model("plan", schema);
  return Plan;
};
