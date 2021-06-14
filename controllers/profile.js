const handleProfile = (req, res, db) => {
  //req.PARAMS ye postman ka hai feature
  const { id } = req.params;
  let found = false;
  // commented bc now using database postgres
  // database.user.forEach(user => {
  //   if(user.id === id){
  //     found = true;
  //     return res.json(user);
  //   }
  // })
  db.select('*').from('users').where({ id: id }).then(user => {
    // console.log(user[0])
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json("Not found");
    }
  })
    .catch(err => {
      res.status(400).json("Error getting user");
    })
  // if(!found) {
  //   res.status(404).json('Not found');
  // }
}
module.exports = {
  handleProfile: handleProfile
}