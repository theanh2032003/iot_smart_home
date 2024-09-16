const db = require('../config/db');

const ActionLog = {
    createTable: () => {
      const sql = `
        CREATE TABLE IF NOT EXISTS user_actions_log (
          id INT AUTO_INCREMENT PRIMARY KEY,
          device_name VARCHAR(255) NOT NULL,
          action VARCHAR(10) NOT NULL,
          action_time DATETIME NOT NULL
        )
      `;
      return new Promise((resolve, reject) => {
        db.query(sql, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
    insertAction: (deviceName, action) => {
      const sql = "INSERT INTO user_actions_log (device_name, action, action_time) VALUES (?, ?, NOW())";
      return new Promise((resolve, reject) => {
        db.query(sql, [deviceName, action], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
    getActionLog: ({ page, page_size, from, to }) => {
      return new Promise((resolve, reject) => {
        page = (page == null) ? 0 : page;
        page_size = (page_size == null) ? 20 : page_size;
    
        let conditions = [];
        if (from) {
          conditions.push(`action_time >= '${from}'`);
        }
        if (to) {
          conditions.push(`action_time <= '${to}'`);
        }
    
        let sql = "SELECT * FROM user_actions_log";
        if (conditions.length > 0) {
          sql += " WHERE " + conditions.join(" AND ");
        }
    
        sql += ` ORDER BY ID LIMIT ${page_size} OFFSET ${page * page_size}`;
    
        db.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              result: result,
              pagination: {
                page: page,
                page_size: page_size,
              },
              filters: {
                from: from,
                to: to,
              }
            });
          }
        });
      });
  }
}
  module.exports = ActionLog;