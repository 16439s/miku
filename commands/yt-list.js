const { SlashCommandBuilder } = require('@discordjs/builders');
const sqlite3 = require('sqlite3').verbose();

const dbPath = './db/musicyt.db';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ytlist')
    .setDescription('データベースに保存されている動画リンクの件数を表示します。'),

  async execute(interaction) {
    try {
      const adminId = '1073212954809487491'; // 特定のユーザーID
      if (interaction.user.id !== adminId) {
        interaction.reply('このコマンドは管理者のみが実行できます。');
        return;
      }

      // データベースを開く
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
        } else {
          console.log('Database opened successfully.');
        }
      });

      // データベースから動画リンクの件数を取得
      db.get('SELECT COUNT(*) AS count FROM videos', (err, row) => {
        if (err) {
          console.error('Error querying database:', err);
          interaction.reply('データベースの検索中にエラーが発生しました。');
        } else {
          const totalCount = row.count;
          interaction.reply(`データベースに保存されている動画リンクの件数: ${totalCount}件`);
        }
      });

      // データベースを閉じる
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database closed.');
        }
      });
    } catch (error) {
      console.error(error);
      await interaction.reply('データベースの検索中にエラーが発生しました。');
    }
  },
};
