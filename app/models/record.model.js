const { SchemaType } = require("mongoose");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      userId: String,
      foodId: String,
      type: String,
      
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
