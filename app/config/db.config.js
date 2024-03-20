module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "20109732002",
    DB: "testdb",
    dialect: "postgres",
    pool: {
      max: 30,
      min: 0,
      acquire: 270000, //30000
      idle: 90000 //10000
    }
};