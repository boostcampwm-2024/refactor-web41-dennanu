import * as mysql from "mysql2/promise";
import { CONNECTION_LIMIT } from "./constant";
import { PoolConnection } from "mysql2/promise";
import logger from "./logger";
import * as dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? "feed-crawler/.env" : ".env",
});

class MySQLConnection {
  private pool: mysql.Pool;
  private nameTag: string;
  constructor() {
    this.pool = this.createPool();
    this.nameTag = "[MySQL]";
  }

  private createPool() {
    return mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectionLimit: CONNECTION_LIMIT,
    });
  }

  async executeQuery<T>(query: string, params: any[] = []) {
    let connection: PoolConnection;
    try {
      connection = await this.pool.getConnection();
      const [rows] = await connection.query(query, params);
      return rows as T[];
    } catch (error) {
      logger.error(
        `${this.nameTag} 쿼리 ${query} 실행 중 오류 발생
          오류 메시지: ${error.message}
          스택 트레이스: ${error.stack}`
      );
    } finally {
      if (connection) {
        try {
          if (connection) connection.release();
        } catch (error) {
          logger.error(
            `${this.nameTag} connection release 중 오류 발생
            오류 메시지: ${error.message}
            스택 트레이스: ${error.stack}`
          );
        }
      }
    }
  }

  public async end() {
    await this.pool.end();
  }
}

export const mysqlConnection = new MySQLConnection();