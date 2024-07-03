import dotenv from "dotenv";

dotenv.config();

const { DBURI } = process.env;

const config = {
  db: {
    uri: DBURI,
  },
};

export default config;
