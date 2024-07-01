import { createPool } from "mysql2/promise";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "./copnfig.js";

const pool = createPool({
    port : DB_PORT,
    user : DB_USER,
    database : DB_DATABASE,
    password : DB_PASSWORD,
    host : DB_HOST
});

export default pool;