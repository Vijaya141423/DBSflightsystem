const Category = require("../model/admin/categoryofgame");
module.exports.numberGenerator = async () => {
  const category = await Category.find({}).lean();
  category.forEach(async (e) => {
    const update = await Category.updateMany(
      { _id: e._id },
      {
        numberofPlayers: Math.floor(Math.random() * 100),
      }
    );
  });
  return 1;
};
