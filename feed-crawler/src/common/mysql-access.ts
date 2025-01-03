import * as mysql from "mysql2/promise";
import { CONNECTION_LIMIT } from "./constant";
import { PoolConnection } from "mysql2/promise";
import logger from "./logger";
import { FeedDetail, RssObj } from "./types";

class MySQLRepository {
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

  private async executeQuery<T>(query: string, params: any[] = []) {
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

  public async selectAllRss(): Promise<RssObj[]> {
    const query = `SELECT id, rss_url as rssUrl, name as blogName, blog_platform as blogPlatform
    FROM rss_accept`;
    return this.executeQuery(query);
  }

  public async insertFeeds(resultData: FeedDetail[]) {
    const query = `
        INSERT INTO feed (blog_id, created_at, title, path, thumbnail)
        VALUES (?, ?, ?, ?, ?)
    `;

    const insertPromises = resultData.map(async (feed) => {
      return this.executeQuery(query, [
        feed.blogId,
        feed.pubDate,
        feed.title,
        feed.link,
        feed.imageUrl,
      ]);
    });

    const promiseResults = await Promise.all(insertPromises);

    const insertedFeeds = promiseResults
      .map((result: any, index) => {
        if (result) {
          const insertId = result.insertId;
          return {
            ...resultData[index],
            id: insertId,
          };
        }
      })
      .filter((result) => result);

    logger.info(
      `${this.nameTag} ${insertedFeeds.length}개의 피드 데이터가 성공적으로 데이터베이스에 삽입되었습니다.`
    );
    return insertedFeeds;
  }

  public async end() {
    await this.pool.end();
  }
}

export const mysqlRepository = new MySQLRepository();
